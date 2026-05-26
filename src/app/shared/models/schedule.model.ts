export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5;

export interface Schedule {
  id?: string;
  user_id: string;
  subject: string;
  teacher?: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  room_id?: string;
  room_label?: string;
  semester?: string;
  created_at?: string;
}
