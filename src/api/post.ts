import fs from 'node:fs';
import path from 'node:path';
import { getSessionCookie } from '../config/session.js';

const BASE_URL = 'https://qwertqwert.f5.si/easydiary';

export type PostDiaryPayload = {
  title: string;
  content: string;
  files: string[];
  permission: 'public' | 'private';
};

const toBlob = (filePath: string) => {
  const data = fs.readFileSync(filePath);
  return new Blob([data]);
};

export const postDiary = async (payload: PostDiaryPayload) => {
  const session = getSessionCookie();
  if (!session) {
    throw new Error('Sessionが設定されていません。.envファイルにEASYDIARY_SESSIONを設定してください。');
  }

  const form = new FormData();
  form.append('title', payload.title);
  form.append('content', payload.content);
  form.append('permission', payload.permission);

  for (const filePath of payload.files) {
    const filename = path.basename(filePath);
    const blob = toBlob(filePath);
    form.append('files', blob, filename);
  }

  const res = await fetch(`${BASE_URL}/post_diary`, {
    method: 'POST',
    headers: {
      'user-agent': 'EasyDiary CLI/0.1.0',
      cookie: `session=${session}`
    },
    body: form
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`日記投稿エラー: ${res.status} ${text}`);
  }

  return res.text();
};
