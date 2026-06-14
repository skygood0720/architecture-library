/**
 * リフレッシュトークン取得スクリプト（一回だけ実行）
 *
 * 使い方:
 *   1. .env.local に GOOGLE_CLIENT_ID と GOOGLE_CLIENT_SECRET を設定
 *   2. node scripts/get-refresh-token.mjs を実行
 *   3. ブラウザでURLを開いて認証
 *   4. 表示された refresh_token を GitHub Secrets に保存
 */

import { google } from "googleapis";
import { createServer } from "http";
import { readFileSync, existsSync } from "fs";

// .env.local から環境変数を読み込む
if (existsSync(".env.local")) {
  const env = readFileSync(".env.local", "utf-8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3001/callback";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "エラー: .env.local に GOOGLE_CLIENT_ID と GOOGLE_CLIENT_SECRET を設定してください"
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/drive.readonly"],
});

console.log("\n=== リフレッシュトークン取得 ===");
console.log("\n以下のURLをブラウザで開いてください:\n");
console.log(authUrl);
console.log("\n認証後、自動的にトークンが表示されます...\n");

// 認証コードを受け取るローカルサーバー
const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:3001");
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400);
    res.end("認証コードが見つかりません");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <html><body style="font-family:sans-serif;padding:40px">
        <h2>✅ 認証成功！</h2>
        <p>以下の値を GitHub Secrets に登録してください:</p>
        <table border="1" cellpadding="8" style="border-collapse:collapse">
          <tr><th>Secret 名</th><th>値</th></tr>
          <tr><td>GOOGLE_CLIENT_ID</td><td>${CLIENT_ID}</td></tr>
          <tr><td>GOOGLE_CLIENT_SECRET</td><td>${CLIENT_SECRET}</td></tr>
          <tr><td>GOOGLE_REFRESH_TOKEN</td><td style="word-break:break-all">${tokens.refresh_token}</td></tr>
        </table>
        <p style="margin-top:20px">このウィンドウは閉じて構いません。</p>
      </body></html>
    `);

    console.log("\n=== GitHub Secrets に登録する値 ===");
    console.log(`GOOGLE_CLIENT_ID:     ${CLIENT_ID}`);
    console.log(`GOOGLE_CLIENT_SECRET: ${CLIENT_SECRET}`);
    console.log(`GOOGLE_REFRESH_TOKEN: ${tokens.refresh_token}`);
    console.log("\n上記をコピーして GitHub Secrets に登録してください。\n");
  } catch (err) {
    res.writeHead(500);
    res.end("エラー: " + err.message);
    console.error(err);
  }

  server.close();
});

server.listen(3001);
