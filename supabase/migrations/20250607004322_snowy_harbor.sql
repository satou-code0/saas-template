/*
  # プロフィールテーブルの追加設定

  1. 新しいポリシー
    - プロフィール作成ポリシー（新規ユーザー登録時）
    - サービスロールによる更新ポリシー（Webhook用）

  2. トリガー関数
    - 新規ユーザー登録時の自動プロフィール作成
    - updated_at自動更新

  3. インデックス
    - パフォーマンス向上のためのインデックス追加
*/

-- プロフィール作成ポリシーを追加
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- サービスロール（Webhook用）がプロフィールを更新できるポリシー
CREATE POLICY "Service role can update profiles"
  ON profiles
  FOR UPDATE
  TO service_role
  USING (true);

-- 新規ユーザー登録時に自動でプロフィールを作成する関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, isPro)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 新規ユーザー登録時のトリガー
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- updated_at自動更新関数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at自動更新トリガー
DROP TRIGGER IF EXISTS handle_updated_at ON profiles;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- パフォーマンス向上のためのインデックス
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_ispro_idx ON profiles(isPro);