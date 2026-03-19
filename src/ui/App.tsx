import React, { useMemo, useState } from 'react';
import { Box, Text } from 'ink';
import { useDiaries } from '../hooks/useDiaries.js';
import type { Diary } from '../types/diary.js';
import { ListScreen } from './screens/ListScreen.js';
import { ViewScreen } from './screens/ViewScreen.js';
import { PostScreen } from './screens/PostScreen.js';
import { postDiary } from '../api/post.js';

type Screen =
  | { name: 'list' }
  | { name: 'view'; diaryId: number }
  | { name: 'post' };

export const App = () => {
  const [screen, setScreen] = useState<Screen>({ name: 'list' });
  const { diaries, getById, loading, error, page, totalPages, nextPage, prevPage } =
    useDiaries();
  const [postError, setPostError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const activeDiary = useMemo<Diary | undefined>(() => {
    if (screen.name !== 'view') return undefined;
    return getById(screen.diaryId);
  }, [screen, getById]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold>EasyDiary CLI Ver 0.1</Text>
      </Box>

      {screen.name === 'list' && (
        <ListScreen
          diaries={diaries}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onOpenDiary={(id) => setScreen({ name: 'view', diaryId: id })}
          onNewPost={() => setScreen({ name: 'post' })}
        />
      )}

      {screen.name === 'view' && (
        <ViewScreen diary={activeDiary} onBack={() => setScreen({ name: 'list' })} />
      )}

      {screen.name === 'post' && (
        <PostScreen
          onSubmit={async (payload) => {
            try {
              setPosting(true);
              setPostError(null);
              await postDiary(payload);
              setScreen({ name: 'list' });
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Unknown error';
              setPostError(message);
            } finally {
              setPosting(false);
            }
          }}
          onCancel={() => setScreen({ name: 'list' })}
        />
      )}

      {screen.name === 'post' && posting && (
        <Box marginTop={1}>
          <Text>投稿中...</Text>
        </Box>
      )}

      {screen.name === 'post' && postError && (
        <Box marginTop={1}>
          <Text color="red">投稿エラー: {postError}</Text>
        </Box>
      )}
    </Box>
  );
};
