import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { MultilineInput } from 'ink-multiline-input';
import TextInput from 'ink-text-input';

type Props = {
  onSubmit: (payload: {
    title: string;
    content: string;
    files: string[];
    permission: 'public' | 'private';
  }) => void;
  onCancel: () => void;
};

export const PostScreen = ({ onSubmit, onCancel }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [filesText, setFilesText] = useState('');
  const [permission, setPermission] = useState<'public' | 'private'>('public');
  const [focusIndex, setFocusIndex] = useState(0);

  const nextFocus = () => setFocusIndex((i) => (i + 1) % 4);
  const prevFocus = () => setFocusIndex((i) => (i + 3) % 4);
  const togglePermission = () =>
    setPermission((p) => (p === 'public' ? 'private' : 'public'));

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    if (input.toLowerCase() === 'c' && key.ctrl) {
      onCancel();
    }
    if (key.tab && key.shift) {
      prevFocus();
      return;
    }
    if (key.tab) {
      nextFocus();
      return;
    }
    if (focusIndex === 3 && (input === ' ' || input.toLowerCase() === 'p')) {
      togglePermission();
    }
    if (focusIndex === 1 && key.ctrl && (input.toLowerCase() === 's' || key.return)) {
      onSubmit({
        title,
        content,
        files,
        permission
      });
    }
  });

  const files = filesText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        日記作成
      </Text>
      <Text dimColor>Tabで移動 / Ctrl+Sで投稿 / Escでキャンセル</Text>

      <Box
        marginTop={1}
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
        paddingY={1}
      >
        <Box flexDirection="column">
          <Text bold>タイトル</Text>
          <Box>
            <TextInput
              value={title}
              onChange={setTitle}
              focus={focusIndex === 0}
              placeholder="タイトルを入力"
              onSubmit={nextFocus}
            />
          </Box>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold>本文</Text>
          <MultilineInput
            value={content}
            onChange={setContent}
            placeholder="本文を入力..."
            rows={6}
            maxRows={12}
            highlightStyle={{ backgroundColor: 'blue' }}
            textStyle={{ color: 'white' }}
            focus={focusIndex === 1}
            keyBindings={{
              submit: (key) => key.ctrl && key.return
            }}
          />
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold>画像</Text>
          <TextInput
            value={filesText}
            onChange={setFilesText}
            focus={focusIndex === 2}
            placeholder="画像パスをカンマ区切りで入力（任意）"
            onSubmit={nextFocus}
          />
          <Text dimColor>例: /path/a.png, /path/b.jpg</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold>公開設定</Text>
          <Text>
            {focusIndex === 3 ? '>' : ' '} [{permission === 'public' ? 'x' : ' '}] すぐに公開 / [
            {permission === 'private' ? 'x' : ' '}] 非公開
          </Text>
          <Text dimColor>Space または P で切り替え</Text>
        </Box>
      </Box>
    </Box>
  );
};
