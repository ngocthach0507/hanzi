import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, source, level, lesson, metadata } = await request.json();

    // 1. Kiểm tra tính hợp lệ của email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'yopmail.com'];
    
    if (!email || !emailRegex.test(email) || disposableDomains.some(d => email.toLowerCase().endsWith(d))) {
      return NextResponse.json({ error: 'Email không hợp lệ hoặc thuộc danh sách hạn chế' }, { status: 400 });
    }

    // 2. Save lead to Supabase
    const { data, error } = await supabaseAdmin
      .from('leads')
      .upsert({ 
        email, 
        source: source || 'lesson_gate',
        hsk_level: level || 1,
        current_lesson: lesson || 1,
        status: 'welcome_series',
        metadata: metadata || {},
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .select();

    if (error) {
      console.error('Supabase Lead Error:', error);
      // Even if DB fails, we might want to continue to Brevo
    }

    // 2. Integration with Brevo (Sendinblue)
    // You will need to add BREVO_API_KEY to your .env.local
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID; // Optional: specific list for Trial Users

    if (BREVO_API_KEY) {
      try {
        await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': BREVO_API_KEY
          },
          body: JSON.stringify({
            email: email,
            listIds: BREVO_LIST_ID ? [parseInt(BREVO_LIST_ID)] : [2], // Thay [2] bằng List ID thực tế
            updateEnabled: true,
            attributes: {
              SOURCE: source || 'lesson_gate',
              HSK_LEVEL: level || 1,
              LESSON: lesson || 1
            }
          })
        });
      } catch (brevoError) {
        console.error('Brevo Integration Error:', brevoError);
      }
    }

    return NextResponse.json({ success: true, message: 'Lead captured successfully' });
  } catch (error) {
    console.error('Lead API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
