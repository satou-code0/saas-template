import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook署名検証失敗:", error);
    return NextResponse.json(
      { error: "Webhook署名が無効です" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
          // ユーザーのProステータスを更新
          const { error } = await supabase
            .from("profiles")
            .update({ isPro: true, updated_at: new Date().toISOString() })
            .eq("id", userId);

          if (error) {
            console.error("プロフィール更新エラー:", error);
          } else {
            console.log(`ユーザー ${userId} をProに更新しました`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // サブスクリプションがキャンセルされた場合の処理
        // メタデータからユーザーIDを取得して、Proステータスをfalseに更新
        break;
      }

      default:
        console.log(`未処理のイベントタイプ: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook処理エラー:", error);
    return NextResponse.json(
      { error: "Webhook処理に失敗しました" },
      { status: 500 }
    );
  }
}
