# Hanzi MCP Server

MCP Server kết nối **GoClaw AI Agent** với hệ thống **Supabase** của Hanzi.io.vn.

## Thông số kỹ thuật

| Hạng mục | Giá trị |
|---|---|
| Transport | Streamable HTTP |
| Port | 3001 (chỉ localhost) |
| Endpoint | `POST http://127.0.0.1:3001/mcp` |
| Health check | `GET http://127.0.0.1:3001/mcp/health` |

## 3 Công cụ (Tools)

| Tool | Mô tả |
|---|---|
| `check_new_payments` | Kiểm tra thanh toán mới trong N giờ gần nhất |
| `summary_daily_leads` | Thống kê leads đăng ký theo ngày |
| `broadcast_urgent_notice` | Gửi thông báo khẩn tới học viên |

## Deploy trên VPS

### Bước 1: Upload code lên VPS
```bash
scp -P 2018 -r ./mcp root@103.97.126.145:/opt/my-website/mcp
```

### Bước 2: Cài dependencies
```bash
cd /opt/my-website/mcp
npm install
```

### Bước 3: Cài systemd service
```bash
cp /opt/my-website/mcp/hanzi-mcp.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable hanzi-mcp
systemctl start hanzi-mcp
```

### Bước 4: Kiểm tra trạng thái
```bash
systemctl status hanzi-mcp
journalctl -u hanzi-mcp -f
```

## Cấu hình GoClaw

- **Giao thức:** Streamable HTTP  
- **URL:** `http://103.97.126.145/mcp-server-api` (qua Nginx proxy)

**Nginx đã được cấu hình** để forward `/mcp-server-api` → `localhost:3001/mcp`.

## Test thủ công bằng curl

### Khởi tạo kết nối
```bash
curl -X POST http://127.0.0.1:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}'
```

### Liệt kê công cụ
```bash
curl -X POST http://127.0.0.1:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":2}'
```

### Test check_new_payments
```bash
curl -X POST http://127.0.0.1:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"check_new_payments","arguments":{"hours":24}},"id":3}'
```

### Test summary_daily_leads
```bash
curl -X POST http://127.0.0.1:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"summary_daily_leads","arguments":{"date":"2026-04-25"}},"id":4}'
```

### Test broadcast_urgent_notice
```bash
curl -X POST http://127.0.0.1:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"broadcast_urgent_notice","arguments":{"message":"Hệ thống sẽ bảo trì lúc 12h đêm nay, vui lòng lưu bài trước khi offline.","target":"all"}},"id":5}'
```

## Biến môi trường

File `.env` tại `/opt/my-website/.env` phải có:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```
