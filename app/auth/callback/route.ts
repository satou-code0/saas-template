import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("認証コード交換エラー:", error);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=auth_failed`
        );
      }

      // 認証成功 - ダッシュボードにリダイレクト
      return NextResponse.redirect(
        `${requestUrl.origin}/dashboard?verified=true`
      );
    } catch (error) {
      console.error("認証処理エラー:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth_failed`
      );
    }
  }

  // codeパラメータがない場合はログインページにリダイレクト
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
