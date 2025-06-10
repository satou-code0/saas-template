/*
  # サブスクリプション管理テーブル

  1. 新しいテーブル
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `stripe_customer_id` (text)
      - `stripe_subscription_id` (text)
      - `status` (text)
      - `current_period_start` (timestamp)
      - `current_period_end` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. セキュリティ
    - RLS有効化
    - 適切なポリシー設定
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  status text NOT NULL DEFAULT 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS有効化
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のサブスクリプション情報のみ閲覧可能
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

-- サービスロールはすべてのサブスクリプションを管理可能
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true);

-- updated_at自動更新トリガー
CREATE TRIGGER handle_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- インデックス
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);