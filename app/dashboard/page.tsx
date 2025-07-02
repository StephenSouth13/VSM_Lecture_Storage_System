"use client"

import { useState, useEffect } from "react"
import { BookOpen, Users, Eye, Heart, Calendar, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentUser, mockLectures, mockUsers, mockCalendarEvents } from "@/lib/mock-data"
import type { User, Lecture } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    totalLectures: 0,
    totalViews: 0,
    totalUsers: 0,
    myLectures: 0,
    myEvents: 0,
    favoriteCount: 0,
  })
  const [recentLectures, setRecentLectures] = useState<Lecture[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Calculate stats
    const totalViews = mockLectures.reduce((sum, lecture) => sum + lecture.views_count, 0)
    const myLectures = currentUser ? mockLectures.filter((l) => l.owner_email === currentUser.email).length : 0
    const myEvents = currentUser ? mockCalendarEvents.filter((e) => e.user_id === currentUser.id).length : 0
    const favoriteCount = currentUser ? mockLectures.filter((l) => l.favorite_by.includes(currentUser.id)).length : 0

    setStats({
      totalLectures: mockLectures.length,
      totalViews,
      totalUsers: mockUsers.length,
      myLectures,
      myEvents,
      favoriteCount,
    })

    // Get recent lectures
    const recent = [...mockLectures]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4)
    setRecentLectures(recent)
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
  }

  const getQuickActions = () => {
    if (!user) return []

    const actions = [
      { name: "Xem bài giảng", href: "/dashboard/lectures", icon: BookOpen, color: "bg-blue-500" },
      { name: "Lịch của tôi", href: "/dashboard/calendar", icon: Calendar, color: "bg-green-500" },
    ]

    if (user.role !== "người xem") {
      actions.push({ name: "Tải lên bài giảng", href: "/dashboard/upload", icon: Upload, color: "bg-purple-500" })
    }

    if (user.role === "admin") {
      actions.push({ name: "Quản trị hệ thống", href: "/dashboard/admin", icon: Users, color: "bg-red-500" })
    }

    return actions
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">Chào mừng bạn đến với hệ thống quản lý bài giảng VSM</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng bài giảng</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLectures}</div>
              <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% từ tháng trước</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === "admin" ? "Tổng người dùng" : "Bài giảng của tôi"}
              </CardTitle>
              {user?.role === "admin" ? (
                <Users className="h-4 w-4 text-muted-foreground" />
              ) : (
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.role === "admin" ? stats.totalUsers : stats.myLectures}</div>
              <p className="text-xs text-muted-foreground">
                {user?.role === "admin" ? "Người dùng hoạt động" : "Bài giảng đã tải lên"}
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yêu thích</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteCount}</div>
              <p className="text-xs text-muted-foreground">Bài giảng đã thích</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Các tính năng thường dùng để bạn truy cập nhanh chóng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getQuickActions().map((action) => (
                <Link key={action.name} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col gap-2 hover:bg-accent bg-transparent"
                  >
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Lectures */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bài giảng mới nhất</CardTitle>
              <CardDescription>Các bài giảng được tải lên gần đây</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/lectures">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentLectures.map((lecture) => (
                <div key={lecture.id} className="group cursor-pointer">
                  <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                    <img
                      src={lecture.preview_url || "/placeholder.svg"}
                      alt={lecture.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {lecture.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatDate(lecture.created_at)}</span>
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        <span>{lecture.views_count}</span>
                        {lecture.favorite_by.length > 0 && (
                          <>
                            <Heart className="w-3 h-3" />
                            <span>{lecture.favorite_by.length}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Bài giảng mới được tải lên</p>
                  <p className="text-xs text-muted-foreground">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Bài giảng được xem nhiều</p>
                  <p className="text-xs text-muted-foreground">5 giờ trước</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sự kiện mới được tạo</p>
                  <p className="text-xs text-muted-foreground">1 ngày trước</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê tuần này</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Lượt xem bài giảng</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">+15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bài giảng mới</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">+8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Người dùng hoạt động</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">+22%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
