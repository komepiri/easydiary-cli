# EasyDiary CLI

qwert氏が作成したEasyDiaryの日記を閲覧・投稿するための CLI です。React Inkで構築しています。

## Features
- 日記一覧の閲覧（ページング対応）
- 日記本文の閲覧
- 新規投稿（タイトル・本文・画像・公開設定）
- セッション Cookie による認証(Version 1.0でCLIでログイン可能にする予定)

## Requirements
- Node.js 20+
- pnpm

## Setup

```bash
pnpm install
cp .env.example .env
```

`.env` に Cookieのsessionの値 を入れてください。<br>
F12でDevToolsを呼び出し、アプリケーションのタブからCookieを選択するとセッションIDが出てくるのでそれをコピペしてきてください。

```
EASYDIARY_SESSION=xxxxxxxxxxxxxxxx
```

## Run (Dev)

```bash
pnpm dev
```

## Usage

### List
- ↑/↓: 選択
- Enter: 閲覧
- N: 新規投稿
- ←/→: ページ移動

### View
- B / Esc: 戻る

### Post
- Tab / Shift+Tab: フォーカス移動
- Ctrl+S: 投稿
- Esc: キャンセル
- 公開設定: Space / P で切替
- 画像: パスをカンマ区切りで入力（例: `/path/a.png, /path/b.jpg`） 

## Note
- 画像投稿は動作確認していません。自分で確認してね。
- ListScreen.tsxなどUI関連のコードにエラーが出ていますが気にしないでください。**動いてるならそれでいいのです。** 気が向いたら直します。
