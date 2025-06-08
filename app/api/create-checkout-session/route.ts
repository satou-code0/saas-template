import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 環境変数のデバッグ情報
    console.log("環境変数チェック:");
    console.log("STRIPE_SECRET_KEY存在:", !!process.env.STRIPE_SECRET_KEY);
    console.log(
      "STRIPE_SECRET_KEY開始文字:",
      process.env.STRIPE_SECRET_KEY?.substring(0, 7)
    );

    // Stripe秘密鍵の存在確認
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY環境変数が設定されていません");
      return NextResponse.json(
        { error: "サーバー設定エラー: Stripe設定が不完全です" },
        { status: 500 }
      );
    }

    // Stripeクライアントの初期化をtry-catch内で行う
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const { userId, userEmail } = await request.json();

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "ユーザー情報が不足しています" },
        { status: 400 }
      );
    }

    console.log("Stripe checkout session作成開始...");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: "ProService Pro会員",
              description: "プレミアム機能と優先サポートを含む月額プラン",
            },
            unit_amount: 2980, // ¥2,980
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.nextUrl.origin}/dashboard?success=true`,
      cancel_url: `${request.nextUrl.origin}/pro?canceled=true`,
      metadata: {
        userId: userId,
        userEmail: userEmail,
      },
    });

    console.log("Stripe checkout session作成成功:", session.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session作成エラー:", error);

    // より詳細なエラー情報を提供
    if (error instanceof Stripe.errors.StripeError) {
      console.error("Stripeエラーの詳細:", {
        type: error.type,
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      });

      return NextResponse.json(
        { error: `Stripe エラー: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
