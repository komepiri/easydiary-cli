export type Diary = {
  diary_id: number;
  userid: string;
  username: string;
  user_diary_id: number;
  title: string;
  content: string;
  category_id: number | null;
  category_name: string | null;
  created_at: number;
  updated_at: number;
  bookmarks: number;
  bookmarked: number;
  has_file: number;
};
