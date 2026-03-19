import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { Diary } from '../../types/diary.js';
import { formatDateTime } from '../../utils/format.js';

const NEW_POST_ID = '__new_post__';

type Item =
  | { kind: 'new'; id: string; title: string }
  | { kind: 'diary'; diary: Diary };

type Props = {
  diaries: Diary[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onOpenDiary: (id: number) => void;
  onNewPost: () => void;
};

export const ListScreen = ({
  diaries,
  loading,
  error,
  page,
  totalPages,
  onNextPage,
  onPrevPage,
  onOpenDiary,
  onNewPost
}: Props) => {
  const items = useMemo<Item[]>(
    () => [{ kind: 'new', id: NEW_POST_ID, title: '＋ 新規投稿' }, ...diaries.map((d) => ({ kind: 'diary', diary: d }))], // UIのベースはAIに書かせたせいでよくわからんコードができた このコード以外はほぼ全部自分だけど
    [diaries]
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [diaries, page]);

  useInput((input, key) => {
    if (key.leftArrow) {
      onPrevPage();
      return;
    }
    if (key.rightArrow) {
      onNextPage();
      return;
    }
    if (key.downArrow) {
      setIndex((i) => Math.min(i + 1, items.length - 1));
      return;
    }
    if (key.upArrow) {
      setIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (key.return) {
      const selected = items[index];
      if (selected.kind === 'new') {
        onNewPost();
      } else {
        onOpenDiary(selected.diary.diary_id);
      }
      return;
    }
    if (input.toLowerCase() === 'n') {
      onNewPost();
    }
  });

  const formatPreview = (content: string) => {
    const singleLine = content.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
    if (singleLine.length <= 50) return singleLine;
    return `${singleLine.slice(0, 50)}…`;
  };

  return (
    <Box flexDirection="column">
      <Text>日記リスト</Text>
      <Text dimColor>
        Page {page} / {totalPages}
      </Text>
      {loading && (
        <Box marginTop={1}>
          <Text>読み込み中...</Text>
        </Box>
      )}
      {error && (
        <Box marginTop={1}>
          <Text color="red">情報取得エラー: {error}</Text>
        </Box>
      )}
      {!loading && !error && (
        <Box flexDirection="column" marginTop={1}>
          {items.map((item, i) => {
            const key = item.kind === 'new' ? item.id : String(item.diary.diary_id);
            const selected = i === index;

            if (item.kind === 'new') {
              return (
              <Box
                key={key}
                flexDirection="column"
                borderStyle="round"
                borderColor={selected ? 'cyan' : 'gray'}
                paddingX={0}
                marginBottom={0}
              >
                <Text>{selected ? '>' : ' '} {item.title}</Text>
              </Box>
            );
            }

            return (
              <Box
                key={key}
                flexDirection="column"
                borderStyle="round"
                borderColor={selected ? 'cyan' : 'gray'}
                paddingX={0}
                marginBottom={0}
              >
                <Text>{selected ? '>' : ' '} {item.diary.title}</Text>
                <Text dimColor>
                  {item.diary.username} | {formatDateTime(item.diary.created_at)}
                </Text>
                <Text dimColor>{formatPreview(item.diary.content)}</Text>
              </Box>
            );
          })}
        </Box>
      )}
      <Box marginTop={1}>
        <Text dimColor>↑↓で選択 / Enterで決定 / Nで新規投稿 / ←→でページ</Text>
      </Box>
    </Box>
  );
};
