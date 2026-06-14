/**
 * Google Drive → photos.json 同期スクリプト (OAuth2 方式)
 *
 * Google Drive のフォルダ構成:
 *   Photo/
 *   ├── Japan/      ← category: "japan"
 *   ├── UK/         ← category: "uk"
 *   └── Project/    ← category: "project"
 *
 * 環境変数 (GitHub Secrets に登録):
 *   GOOGLE_CLIENT_ID       ← OAuthクライアントID
 *   GOOGLE_CLIENT_SECRET   ← OAuthクライアントシークレット
 *   GOOGLE_REFRESH_TOKEN   ← 一回だけローカルで取得したリフレッシュトークン
 *   DRIVE_ROOT_FOLDER_ID   ← "Photo" フォルダのID
 */

import { google } from "googleapis";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../data/photos.json");

const CATEGORY_FOLDERS = {
  Japan: "japan",
  UK: "uk",
  Project: "project",
};

async function main() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const rootFolderId = process.env.DRIVE_ROOT_FOLDER_ID;

  if (!clientId || !clientSecret || !refreshToken || !rootFolderId) {
    throw new Error(
      "環境変数が不足しています。GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, DRIVE_ROOT_FOLDER_ID を設定してください。"
    );
  }

  // OAuth2 認証
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  console.log("Google Drive と同期中...");

  // Photo フォルダ直下のサブフォルダ一覧を取得
  const foldersRes = await drive.files.list({
    q: `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
  });

  const folders = foldersRes.data.files || [];
  const photos = [];

  for (const folder of folders) {
    const category = CATEGORY_FOLDERS[folder.name];
    if (!category) {
      console.log(`未知のフォルダをスキップ: ${folder.name}`);
      continue;
    }

    console.log(`  フォルダ "${folder.name}" を処理中...`);

    let pageToken = null;
    do {
      const filesRes = await drive.files.list({
        q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed = false`,
        fields:
          "nextPageToken, files(id, name, createdTime, thumbnailLink, webViewLink, imageMediaMetadata)",
        orderBy: "createdTime desc",
        pageSize: 1000,
        pageToken: pageToken || undefined,
      });

      const files = filesRes.data.files || [];

      for (const file of files) {
        const title = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        const thumbnailUrl = file.thumbnailLink
          ? file.thumbnailLink.replace(/=s\d+/, "=s1200")
          : "";

        photos.push({
          id: file.id,
          name: file.name,
          title,
          category,
          driveId: file.id,
          webViewLink: file.webViewLink || "",
          thumbnailUrl,
          width: file.imageMediaMetadata?.width,
          height: file.imageMediaMetadata?.height,
          createdAt: file.createdTime || new Date().toISOString(),
        });
      }

      pageToken = filesRes.data.nextPageToken;
    } while (pageToken);

    console.log(
      `    ${category}: ${photos.filter((p) => p.category === category).length} 枚`
    );
  }

  const output = {
    updatedAt: new Date().toISOString(),
    photos,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  console.log(
    `\n完了: 合計 ${photos.length} 枚を data/photos.json に保存しました`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
