/*
  # 追加のRLSポリシー設定

  1. セキュリティ強化
    - 匿名ユーザーのアクセス制限
    - 管理者権限の設定

  2. パフォーマンス最適化
    - 必要最小限のデータアクセス
*/

-- 匿名ユーザーはプロフィールを読み取れない
CREATE POLICY "Anonymous users cannot read profiles"
  ON profiles
  FOR SELECT
  TO anon
  USING (false);

-- 認証済みユーザーは他のユーザーのプロフィールを読み取れない（自分のみ）
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 認証済みユーザーは自分のプロフィールのみ更新可能
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);