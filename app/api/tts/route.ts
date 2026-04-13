import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, lang = 'zh-CN' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const ttsKey = process.env.GOOGLE_TTS_KEY;

    if (ttsKey) {
      // Logic for Google Cloud TTS would go here
      // For now, return the fallback info
      return NextResponse.json({ 
        provider: 'google', 
        audioContent: null, // Placeholder for base64 audio
        message: 'Google TTS Key found, but implementation is pending API setup.'
      });
    }

    // Default fallback to browser speech synthesis
    return NextResponse.json({ 
      provider: 'browser', 
      text 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
