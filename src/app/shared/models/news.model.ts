export interface NewsItem {
  id: string;
  title: string;
  image_url: string | null;
  published_at: string | null;
  source_url: string;
  scraped_at?: string;
}
