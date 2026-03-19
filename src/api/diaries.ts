import type { Diary } from '../types/diary.js';
import { getSessionCookie } from '../config/session.js';

export type DiariesResponse = {
  diaries: Diary[];
  page: number;
  total_pages: number;
};

const BASE_URL = 'https://qwertqwert.f5.si/easydiary';

export const fetchDiaries = async (page = 1): Promise<DiariesResponse> => {
  const session = getSessionCookie();
  if (!session) {
    throw new Error('Sessionが設定されていません。.envファイルにEASYDIARY_SESSIONを設定してください。');
  }

  const url = `${BASE_URL}/diaries?page=${page}&sort_by=created_at&order=desc`;
  const res = await fetch(url, {
    headers: {
      'user-agent': 'EasyDiary CLI/0.1.0',
      cookie: `session=${session}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`日記取得エラー: ${res.status} ${text}`);
  }

  return (await res.json()) as DiariesResponse;
};
