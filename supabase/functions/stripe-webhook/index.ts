import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-12-18.acacia',
    });

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      throw new Error('Webhook署名またはシークレットが見つかりません');
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .update({ isPro: true, updated_at: new Date().toISOString() })
            .eq('id', userId);

          if (error) {
            console.error('プロフィール更新エラー:', error);
            throw error;
          }

          console.log(`ユーザー ${userId} をProに更新しました`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // サブスクリプション削除時の処理
        // 必要に応じてユーザーのProステータスを無効化
        break;
      }

      default:
        console.log(`未処理のイベント: ${event.type}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook処理エラー:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});