export interface User {
  id: string
  email: string
  name: string
  dob?: string
  avatar?: string
  role: "admin" | "giảng viên" | "người xem"
  updated_at: string
}

export interface Lecture {
  id: string
  title: string
  url: string
  preview_url?: string
  owner_email: string
  allow_download: boolean
  month: number
  year: number
  favorite_by: string[]
  views_count: number
  created_at: string
}

export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  description?: string
  color: string
  start_time: string
  end_time: string
  remind_at?: string
  created_at: string
}

export interface EditRequest {
  id: string
  user_id: string
  content: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
