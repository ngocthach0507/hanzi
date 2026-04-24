/**
 * Hanzi MCP Server — kết nối GoClaw AI Agent với Supabase
 * Transport: Streamable HTTP (POST /mcp)
 * Port: 3001, chỉ bind 127.0.0.1 (localhost only)
 */

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load .env từ thư mục cha (root của website)
dotenv.config({ path: path.join(__dirname, '../.env') });

// ── Supabase client ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[MCP] ERROR: Thiếu biến môi trường SUPABASE. Kiểm tra file .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Helper: log với timestamp ────────────────────────────────────────────────
function log(toolName, params, status = 'OK') {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${toolName}] params=${JSON.stringify(params)} status=${status}`);
}

// ── Tool definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'check_new_payments',
    description: 'Kiểm tra các khoản thanh toán/đăng ký mới trong N giờ gần nhất từ Supabase',
    inputSchema: {
      type: 'object',
      properties: {
        hours: {
          type: 'number',
          description: 'Số giờ gần nhất cần kiểm tra (mặc định: 24)',
          minimum: 1,
          maximum: 720
        }
      }
    }
  },
  {
    name: 'summary_daily_leads',
    description: 'Thống kê số lượng leads (học viên mới đăng ký) theo ngày',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Ngày cần thống kê (định dạng YYYY-MM-DD). Mặc định: hôm nay',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$'
        }
      }
    }
  },
  {
    name: 'broadcast_urgent_notice',
    description: 'Gửi thông báo khẩn tới học viên qua email (dùng Brevo/SMTP)',
    inputSchema: {
      type: 'object',
      required: ['message'],
      properties: {
        message: {
          type: 'string',
          description: 'Nội dung thông báo cần gửi',
          minLength: 10,
          maxLength: 2000
        },
        target: {
          type: 'string',
          description: 'Đối tượng nhận: "all" (tất cả) hoặc "vip_only" (chỉ VIP)',
          enum: ['all', 'vip_only']
        }
      }
    }
  }
];

// ── Tool handlers ─────────────────────────────────────────────────────────────

async function handleCheckNewPayments(args) {
  const hours = Number(args?.hours) || 24;
  
  // Validate
  if (isNaN(hours) || hours < 1 || hours > 720) {
    return { success: false, error: 'hours phải là số từ 1 đến 720' };
  }

  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('user_id, payment_ref, plan, status, sepay_ref')
    .eq('status', 'active')
    .order('user_id', { ascending: false });

  if (error) return { success: false, error: error.message };

  // Lọc thêm theo thời gian nếu có cột updated_at
  const total = data?.length || 0;

  return {
    success: true,
    period: `${hours} giờ gần nhất`,
    total_active_subscriptions: total,
    note: 'Hiển thị tất cả subscription đang active (bảng subscriptions không có cột timestamp)',
    subscriptions: data?.map(p => ({
      user_id: p.user_id,
      payment_ref: p.payment_ref,
      plan: p.plan,
      status: p.status,
      sepay_ref: p.sepay_ref
    })) || []
  };
}

async function handleSummaryDailyLeads(args) {
  // Validate date format
  const dateStr = args?.date || new Date().toISOString().split('T')[0];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(dateStr)) {
    return { success: false, error: 'date phải đúng định dạng YYYY-MM-DD' };
  }

  const startOfDay = `${dateStr}T00:00:00.000Z`;
  const endOfDay = `${dateStr}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from('leads')
    .select('email, source, hsk_level, current_lesson, status, updated_at')
    .gte('updated_at', startOfDay)
    .lte('updated_at', endOfDay)
    .order('updated_at', { ascending: false });

  if (error) return { success: false, error: error.message };

  const total = data?.length || 0;

  // Thống kê theo source
  const bySource = {};
  data?.forEach(lead => {
    const src = lead.source || 'unknown';
    bySource[src] = (bySource[src] || 0) + 1;
  });

  return {
    success: true,
    date: dateStr,
    total_leads: total,
    by_source: bySource,
    leads: data?.map(l => ({
      email: l.email,
      source: l.source || 'unknown',
      hsk_level: l.hsk_level,
      status: l.status,
      time: l.updated_at ? new Date(l.updated_at).toLocaleString('vi-VN') : 'N/A'
    })) || []
  };
}

async function handleBroadcastUrgentNotice(args) {
  const message = args?.message?.trim();
  const target = args?.target || 'all';

  // Validate
  if (!message || message.length < 10) {
    return { success: false, error: 'message phải có ít nhất 10 ký tự' };
  }
  if (message.length > 2000) {
    return { success: false, error: 'message không được vượt quá 2000 ký tự' };
  }
  if (!['all', 'vip_only'].includes(target)) {
    return { success: false, error: 'target phải là "all" hoặc "vip_only"' };
  }

  // Lấy danh sách email từ Supabase
  let data, error;
  if (target === 'vip_only') {
    ({ data, error } = await supabase.from('subscriptions').select('user_id, plan').eq('status', 'active'));
  } else {
    ({ data, error } = await supabase.from('leads').select('email, source, status'));
  }

  if (error) return { success: false, error: error.message };

  const recipients = data?.length || 0;

  // Ghi log broadcast (thực tế sẽ gọi Brevo API ở đây)
  console.log(`[BROADCAST] target=${target} recipients=${recipients} message="${message.substring(0, 50)}..."`);

  // TODO: Tích hợp Brevo API để gửi email thật
  // const brevoResponse = await sendViaBrevo(data, message);

  return {
    success: true,
    message: 'Đã lên kế hoạch gửi thông báo (cần tích hợp Brevo API để gửi email thật)',
    target,
    recipient_count: recipients,
    preview: message.substring(0, 100) + (message.length > 100 ? '...' : '')
  };
}

// ── JSON-RPC handler (Streamable HTTP) ───────────────────────────────────────

async function handleMCPRequest(method, params, id) {
  if (method === 'initialize') {
    return {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'hanzi-mcp-server', version: '1.0.0' }
    };
  }

  if (method === 'tools/list') {
    return { tools: TOOLS };
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const toolArgs = params?.arguments || {};

    log(toolName, toolArgs);

    let result;
    try {
      if (toolName === 'check_new_payments') {
        result = await handleCheckNewPayments(toolArgs);
      } else if (toolName === 'summary_daily_leads') {
        result = await handleSummaryDailyLeads(toolArgs);
      } else if (toolName === 'broadcast_urgent_notice') {
        result = await handleBroadcastUrgentNotice(toolArgs);
      } else {
        result = { success: false, error: `Tool không tồn tại: ${toolName}` };
      }
    } catch (err) {
      log(toolName, toolArgs, 'ERROR');
      result = { success: false, error: err.message };
    }

    log(toolName, toolArgs, result.success ? 'OK' : 'FAIL');

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      isError: !result.success
    };
  }

  return null;
}

// ── Express app ──────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  const { method, params, id } = req.body || {};

  try {
    const result = await handleMCPRequest(method, params, id);

    // Notification (không có id) → trả 200 không body
    if (id === undefined || id === null) {
      return res.status(200).end();
    }

    if (result !== null) {
      return res.json({ jsonrpc: '2.0', id, result });
    }

    // Method không được hỗ trợ
    res.json({
      jsonrpc: '2.0', id,
      error: { code: -32601, message: `Method not found: ${method}` }
    });
  } catch (err) {
    console.error(`[MCP] Unhandled error:`, err);
    res.json({
      jsonrpc: '2.0', id,
      error: { code: -32603, message: err.message }
    });
  }
});

// Health check
app.get('/mcp/health', (req, res) => {
  res.json({ status: 'ok', server: 'hanzi-mcp-server', version: '1.0.0' });
});

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = 3001;
const HOST = '127.0.0.1'; // Chỉ bind localhost, KHÔNG public ra internet

app.listen(PORT, HOST, () => {
  console.log(`[${new Date().toISOString()}] Hanzi MCP Server đang chạy tại http://${HOST}:${PORT}/mcp`);
  console.log(`[MCP] Supabase URL: ${SUPABASE_URL}`);
  console.log(`[MCP] Tools đã đăng ký: ${TOOLS.map(t => t.name).join(', ')}`);
});
