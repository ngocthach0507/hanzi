import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const full = searchParams.get('full') === 'true';

    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
      return NextResponse.json({ isPro: false });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ isPro: false, error: "Admin not initialized" });
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Sub API Error:", error);
      return NextResponse.json({ isPro: false, error: error.message });
    }

    const isPro = data && data.plan !== 'free' && data.status === 'active' && 
                 (data.expires_at ? new Date(data.expires_at) > new Date() : false);

    if (isPro) {
      return NextResponse.json({ isPro: true, plan: data.plan });
    }

    return NextResponse.json({ isPro: false });
  } catch (err: any) {
    console.error("Sub API Catch:", err);
    return NextResponse.json({ isPro: false });
  }
}
