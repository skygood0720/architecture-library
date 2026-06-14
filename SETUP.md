# Architecture Library — セットアップガイド

## 仕組み

```
Google Drive のフォルダへ写真をアップロード
         ↓ (自動・1時間ごと)
GitHub Actions が写真リストを取得
         ↓
サイトを再ビルド & Vercel へ自動デプロイ
         ↓
architecturelibraries.com が更新される
```

## Google Drive フォルダ構成

以下のフォルダを Google Drive に作成してください：

```
Architecture Libraries/
└── Photo/                ← このフォルダのIDをメモする
    ├── Japan/            → /photo/japan に表示
    ├── UK/               → /photo/uk に表示
    └── Project/          → /photo/project に表示
```

**写真のアップロード方法：**
- 該当フォルダに画像ファイルをドラッグ＆ドロップするだけ
- ファイル名がそのままタイトルになります（例: `隈研吾_スタバ太宰府.jpg` → 「隈研吾 スタバ太宰府」）

---

## セットアップ手順

### ステップ1：Google Cloud の設定（OAuthクライアントID）

> サービスアカウントキーの代わりに、OAuth 2.0 を使います

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（例: `architecture-library`）
3. **APIs & Services** → **Enable APIs** → **Google Drive API** を有効化
4. **APIs & Services** → **OAuth consent screen**
   - User Type: **外部** を選択 → 作成
   - アプリ名・メールを入力 → 保存
   - **スコープ** → `.../auth/drive.readonly` を追加
   - **テストユーザー** → 自分のGoogleアカウントのメールを追加
5. **Credentials** → **Create Credentials** → **OAuth client ID**
   - アプリケーションの種類: **デスクトップアプリ**
   - 名前: 任意 → 作成
6. 表示された **クライアントID** と **クライアントシークレット** をメモ

### ステップ2：リフレッシュトークンの取得（一回だけ）

1. `.env.local` ファイルを作成して以下を記入：
   ```
   GOOGLE_CLIENT_ID=あなたのクライアントID
   GOOGLE_CLIENT_SECRET=あなたのクライアントシークレット
   ```

2. 以下を実行：
   ```bash
   node scripts/get-refresh-token.mjs
   ```

3. 表示されたURLをブラウザで開く → Googleアカウントでログイン

4. ブラウザに表示される `GOOGLE_REFRESH_TOKEN` をコピー

### ステップ3：Google Drive フォルダIDの確認

1. Google Drive で `Photo/` フォルダを開く
2. URL をコピー：
   ```
   https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXXXX
   ```
3. `XXXXXXXXXXXXXXXXXX` の部分が **フォルダID**

### ステップ4：GitHub リポジトリの設定

1. このフォルダを GitHub にプッシュ：
   ```bash
   git remote add origin https://github.com/あなたのユーザー名/architecturelibraries.git
   git push -u origin main
   ```

2. GitHub リポジトリの **Settings** → **Secrets and variables** → **Actions** に以下を追加：

   | Secret 名 | 値 |
   |-----------|-----|
   | `GOOGLE_CLIENT_ID` | ステップ1のクライアントID |
   | `GOOGLE_CLIENT_SECRET` | ステップ1のクライアントシークレット |
   | `GOOGLE_REFRESH_TOKEN` | ステップ2で取得したトークン |
   | `DRIVE_ROOT_FOLDER_ID` | ステップ3のフォルダID |
   | `VERCEL_TOKEN` | VercelのAPIトークン（次のステップで取得） |
   | `VERCEL_ORG_ID` | Vercelのチームまたはユーザースコープ |
   | `VERCEL_PROJECT_ID` | VercelのプロジェクトID |

### ステップ5：Vercel へデプロイ

1. [Vercel](https://vercel.com/) にサインアップ（GitHubアカウントで可）
2. **New Project** → GitHubリポジトリをインポート → **Deploy**
3. デプロイ後、**Settings** → **Tokens** で APIトークンを生成
4. `VERCEL_ORG_ID` と `VERCEL_PROJECT_ID` はプロジェクトの **Settings → General** で確認

### ステップ6：ドメインの接続

1. Vercel の **Settings** → **Domains** → `architecturelibraries.com` を追加
2. ドメインレジストラの DNS 設定を Vercel の指示通りに変更

---

## 手動で同期したい場合

GitHub リポジトリの **Actions** タブ → **Sync Google Drive & Deploy** → **Run workflow** をクリック

---

## ローカル開発

```bash
# 開発サーバー起動
npm run dev
# → http://localhost:3000 で確認

# Google Driveから手動同期（.env.local を設定後）
DRIVE_ROOT_FOLDER_ID=あなたのフォルダID node scripts/sync-drive.mjs
```
