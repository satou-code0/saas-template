# Dev Container - 最小構成

NextJS開発用のシンプルなDev Container環境です。

## 🚀 使い方

1. **Cursorでプロジェクトを開く**
   ```bash
   code .
   ```

2. **Dev Containerで再開**
   - VS Codeで通知が表示されたら「Reopen in Container」をクリック
   - または：`Ctrl+Shift+P` → `Dev Containers: Reopen in Container`

3. **開発開始**
   ```bash
   npm run dev
   ```
   
4. **ブラウザでアクセス**
   - http://localhost:3000

## 📦 含まれているもの

- **Node.js 18** - JavaScript実行環境
- **Tailwind CSS IntelliSense** - Tailwindクラス補完
- **Prettier** - コードフォーマッター  
- **ESLint** - コード品質チェック
- **GitHub CLI** - Git操作ツール

## 🛠️ 基本コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# リント実行
npm run lint
```

それだけです！シンプルで分かりやすい環境です。 