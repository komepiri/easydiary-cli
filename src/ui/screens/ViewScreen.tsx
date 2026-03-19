import React from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import type { Diary } from '../../types/diary.js';
import { formatDateTime } from '../../utils/format.js';

type Props = {
  diary?: Diary;
  onBack: () => void;
};

export const ViewScreen = ({ diary, onBack }: Props) => {
  const { stdout } = useStdout();

  useInput((input, key) => {
    if (key.escape || input.toLowerCase() === 'b') {
      onBack();
    }
  });

  if (!diary) {
    return (
      <Box flexDirection="column">
        <Text>日記が見つかりませんでした。ネットワーク切断とかじゃない限り見つからないなんてことはないんだよなあ... By Komepiri</Text>
        <Text dimColor>Bで戻る</Text>
      </Box>
    );
  }

  const lineWidth = Math.min(stdout?.columns ?? 60, 60);
  const divider = '─'.repeat(Math.max(lineWidth - 2, 10));
  const content = diary.content.replace(/\r\n/g, '\n');

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        {diary.title}
      </Text>
      <Text dimColor>
        {formatDateTime(diary.created_at)} / {diary.username}
      </Text>
      <Text dimColor>{divider}</Text>
      <Box marginTop={1} borderStyle="round" paddingX={1} paddingY={1}>
        <Text bold>{content}</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Bで戻る / Escで戻る</Text>
      </Box>
    </Box>
  );
};
