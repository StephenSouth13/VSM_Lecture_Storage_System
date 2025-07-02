import type { User, Lecture, CalendarEvent, EditRequest } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Phan Huỳnh Anh",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "teacher@example.com",
    name: "Quách Thành Long",
    role: "giảng viên",
    avatar: "/placeholder.svg?height=40&width=40",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    email: "viewer@example.com",
    name: "Trần Thị Học",
    role: "người xem",
    avatar: "/placeholder.svg?height=40&width=40",
    updated_at: "2024-01-15T10:00:00Z",
  },
]

export const mockLectures: Lecture[] = [
  {
    id: "1",
    title: "Giới thiệu về Marathon",
    url: "/lectures/intro-marathon.pdf",
    preview_url: "/placeholder.svg?height=200&width=300",
    owner_email: "teacher@example.com",
    allow_download: true,
    month: 1,
    year: 2024,
    favorite_by: ["3"],
    views_count: 125,
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "2",
    title: "Kỹ thuật chạy bền",
    url: "/lectures/running-technique.pdf",
    preview_url: "/placeholder.svg?height=200&width=300",
    owner_email: "teacher@example.com",
    allow_download: true,
    month: 1,
    year: 2024,
    favorite_by: ["2", "3"],
    views_count: 89,
    created_at: "2024-01-12T14:30:00Z",
  },
  {
    id: "3",
    title: "Dinh dưỡng cho vận động viên",
    url: "/lectures/nutrition.pdf",
    preview_url: "/placeholder.svg?height=200&width=300",
    owner_email: "admin@example.com",
    allow_download: false,
    month: 2,
    year: 2024,
    favorite_by: ["1", "3"],
    views_count: 156,
    created_at: "2024-02-01T11:15:00Z",
  },
  {
    id: "4",
    title: "Phòng chống chấn thương",
    url: "/lectures/injury-prevention.pdf",
    preview_url: "/placeholder.svg?height=200&width=300",
    owner_email: "teacher@example.com",
    allow_download: true,
    month: 2,
    year: 2024,
    favorite_by: [],
    views_count: 67,
    created_at: "2024-02-05T16:45:00Z",
  },
  {
    id: "5",
    title: "Tâm lý thi đấu",
    url: "/lectures/sports-psychology.pdf",
    preview_url: "/placeholder.svg?height=200&width=300",
    owner_email: "admin@example.com",
    allow_download: true,
    month: 3,
    year: 2024,
    favorite_by: ["2"],
    views_count: 98,
    created_at: "2024-03-01T08:20:00Z",
  },
  {
    id: "6",
    title: "Lập kế hoạch tập luyện",
    url: "/lectures/training-plan.pdf",
    preview_url: "/placeholder.svg?height=200&width=300",
    owner_email: "teacher@example.com",
    allow_download: true,
    month: 3,
    year: 2024,
    favorite_by: ["1", "2", "3"],
    views_count: 203,
    created_at: "2024-03-10T13:00:00Z",
  },
  {
    id: "7",
    title: "Kỹ thuật chạy Marathon hiệu quả",
    url: "/lectures/marathon-techniques.pdf",
    preview_url: "/placeholder.svg?height=200&width=300",
    owner_email: "teacher@example.com",
    allow_download: true,
    month: 3,
    year: 2024,
    favorite_by: ["1", "3"],
    views_count: 187,
    created_at: "2024-03-15T10:30:00Z",
  },
]

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "1",
    user_id: "1",
    title: "Họp ban tổ chức",
    description: "Họp định kỳ hàng tuần về kế hoạch tổ chức marathon",
    color: "#22c55e",
    start_time: "2024-01-20T09:00:00Z",
    end_time: "2024-01-20T10:30:00Z",
    remind_at: "2024-01-20T08:45:00Z",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    user_id: "2",
    title: "Buổi giảng Marathon cơ bản",
    description: "Giảng dạy kỹ thuật chạy bền cho nhóm mới bắt đầu",
    color: "#3b82f6",
    start_time: "2024-01-22T14:00:00Z",
    end_time: "2024-01-22T16:00:00Z",
    created_at: "2024-01-18T09:00:00Z",
  },
  {
    id: "3",
    user_id: "3",
    title: "Tập luyện cá nhân",
    description: "Chạy bộ 10km tại công viên Thống Nhất",
    color: "#f59e0b",
    start_time: "2024-01-21T06:00:00Z",
    end_time: "2024-01-21T07:00:00Z",
    created_at: "2024-01-19T20:00:00Z",
  },
  {
    id: "4",
    user_id: "1",
    title: "Kiểm tra thiết bị",
    description: "Kiểm tra và bảo trì thiết bị tập luyện",
    color: "#ef4444",
    start_time: "2024-01-25T15:00:00Z",
    end_time: "2024-01-25T17:00:00Z",
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "5",
    user_id: "2",
    title: "Workshop dinh dưỡng",
    description: "Hướng dẫn chế độ dinh dưỡng cho vận động viên",
    color: "#8b5cf6",
    start_time: "2024-01-28T10:00:00Z",
    end_time: "2024-01-28T12:00:00Z",
    created_at: "2024-01-22T14:00:00Z",
  },
  {
    id: "6",
    user_id: "3",
    title: "Chạy thử 21km",
    description: "Chạy thử nửa marathon chuẩn bị cho cuộc thi",
    color: "#06b6d4",
    start_time: "2024-02-03T06:30:00Z",
    end_time: "2024-02-03T09:00:00Z",
    created_at: "2024-01-25T18:00:00Z",
  },
  {
    id: "7",
    user_id: "1",
    title: "Họp với nhà tài trợ",
    description: "Thảo luận về gói tài trợ cho sự kiện marathon",
    color: "#22c55e",
    start_time: "2024-02-05T14:00:00Z",
    end_time: "2024-02-05T16:00:00Z",
    created_at: "2024-01-28T11:00:00Z",
  },
]

export const mockEditRequests: EditRequest[] = [
  {
    id: "1",
    user_id: "3",
    content: "Xin chào, tôi muốn cập nhật ngày sinh và số điện thoại trong hồ sơ.",
    status: "pending",
    created_at: "2024-01-18T15:30:00Z",
  },
  {
    id: "2",
    user_id: "2",
    content: "Tôi cần thay đổi email liên hệ từ cũ sang email mới.",
    status: "approved",
    created_at: "2024-01-16T11:20:00Z",
  },
]

export const vietnameseHolidays = [
  // 2024 holidays
  { date: "2024-01-01", name: "Tết Dương lịch", type: "public" },
  { date: "2024-02-10", name: "Tết Nguyên đán (30 Tết)", type: "public" },
  { date: "2024-02-11", name: "Tết Nguyên đán (Mùng 1)", type: "public" },
  { date: "2024-02-12", name: "Tết Nguyên đán (Mùng 2)", type: "public" },
  { date: "2024-02-13", name: "Tết Nguyên đán (Mùng 3)", type: "public" },
  { date: "2024-02-14", name: "Tết Nguyên đán (Mùng 4)", type: "public" },
  { date: "2024-04-18", name: "Giỗ Tổ Hùng Vương", type: "public" },
  { date: "2024-04-30", name: "Ngày Giải phóng miền Nam", type: "public" },
  { date: "2024-05-01", name: "Ngày Quốc tế Lao động", type: "public" },
  { date: "2024-09-02", name: "Quốc khánh", type: "public" },
  // 2025 holidays
  { date: "2025-01-01", name: "Tết Dương lịch", type: "public" },
  { date: "2025-01-29", name: "Tết Nguyên đán (30 Tết)", type: "public" },
  { date: "2025-01-30", name: "Tết Nguyên đán (Mùng 1)", type: "public" },
  { date: "2025-01-31", name: "Tết Nguyên đán (Mùng 2)", type: "public" },
  { date: "2025-02-01", name: "Tết Nguyên đán (Mùng 3)", type: "public" },
  { date: "2025-02-02", name: "Tết Nguyên đán (Mùng 4)", type: "public" },
  { date: "2025-04-07", name: "Giỗ Tổ Hùng Vương", type: "public" },
  { date: "2025-04-30", name: "Ngày Giải phóng miền Nam", type: "public" },
  { date: "2025-05-01", name: "Ngày Quốc tế Lao động", type: "public" },
  { date: "2025-09-02", name: "Quốc khánh", type: "public" },
]

// Auth helper functions
export const authenticateUser = (email: string, password: string): User | null => {
  const demoCredentials = [
    { email: "admin@example.com", password: "admin123" },
    { email: "teacher@example.com", password: "teacher123" },
    { email: "viewer@example.com", password: "viewer123" },
  ]

  const credential = demoCredentials.find((cred) => cred.email === email && cred.password === password)
  if (credential) {
    return mockUsers.find((user) => user.email === email) || null
  }
  return null
}

export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("vsm_user")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("vsm_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("vsm_user")
    }
  }
}
