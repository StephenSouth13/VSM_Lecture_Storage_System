"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, Calendar, Settings, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentUser, mockUsers, mockLectures, mockCalendarEvents, mockEditRequests } from "@/lib/mock-data"
import type { User } from "@/lib/types"
import { formatDateTime } from "@/lib/utils"

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState(mockUsers)
  const [editRequests, setEditRequests] = useState(mockEditRequests)
  const [selectedTab, setSelectedTab] = useState<"overview" | "users" | "requests">("overview")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      window.location.href = "/dashboard"
      return
    }
    setUser(currentUser)
  }, [])

  const handleApproveRequest = (requestId: string) => {
    setEditRequests((prev) =>
      prev.map((request) => (request.id === requestId ? { ...request, status: "approved" as const } : request)),
    )
  }

  const handleRejectRequest = (requestId: string) => {
    setEditRequests((prev) =>
      prev.map((request) => (request.id === requestId ? { ...request, status: "rejected" as const } : request)),
    )
  }

  const handleChangeUserRole = (userId: string, newRole: User["role"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole, updated_at: new Date().toISOString() } : u)),
    )
  }

  const getStats = () => {
    const totalViews = mockLectures.reduce((sum, lecture) => sum + lecture.views_count, 0)
    const pendingRequests = editRequests.filter((r) => r.status === "pending").length

    return {
      totalUsers: users.length,
      totalLectures: mockLectures.length,
      totalEvents: mockCalendarEvents.length,
      totalViews,
      pendingRequests,
      adminCount: users.filter((u) => u.role === "admin").length,
      teacherCount: users.filter((u) => u.role === "giảng viên").length,
      viewerCount: users.filter((u) => u.role === "người xem").length,
    }
  }

  const stats = getStats()

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên"
      case "giảng viên":
        return "Giảng viên"
      case "người xem":
        return "Người xem"
      default:
        return role
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "giảng viên":
        return "default"
      case "người xem":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              Bạn không có quyền truy cập trang này. Chỉ quản trị viên mới có thể truy cập.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Quản trị hệ thống</h1>
          <p className="text-muted-foreground">Quản lý người dùng, duyệt yêu cầu và giám sát hoạt động hệ thống</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <Button
            variant={selectedTab === "overview" ? "default" : "outline"}
            onClick={() => setSelectedTab("overview")}
          >
            Tổng quan
          </Button>
          <Button variant={selectedTab === "users" ? "default" : "outline"} onClick={() => setSelectedTab("users")}>
            Quản lý người dùng
          </Button>
          <Button
            variant={selectedTab === "requests" ? "default" : "outline"}
            onClick={() => setSelectedTab("requests")}
          >
            Yêu cầu chỉnh sửa
            {stats.pendingRequests > 0 && (
              <Badge variant="destructive" className="ml-2">
                {stats.pendingRequests}
              </Badge>
            )}
          </Button>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.adminCount} admin, {stats.teacherCount} giảng viên
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng bài giảng</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalLectures}</div>
                  <p className="text-xs text-muted-foreground">{stats.totalViews.toLocaleString()} lượt xem</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng sự kiện</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground">Từ tất cả người dùng</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Yêu cầu chờ duyệt</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                  <p className="text-xs text-muted-foreground">Cần xem xét</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bài giảng mới được tải lên</p>
                      <p className="text-xs text-muted-foreground">Nguyễn Văn Giảng • 2 giờ trước</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Người dùng mới đăng ký</p>
                      <p className="text-xs text-muted-foreground">Trần Thị Học • 5 giờ trước</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Yêu cầu chỉnh sửa thông tin</p>
                      <p className="text-xs text-muted-foreground">Trần Thị Học • 1 ngày trước</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>Quản lý người dùng</CardTitle>
              <CardDescription>Xem và chỉnh sửa thông tin người dùng, phân quyền</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Cập nhật lần cuối</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={u.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(u.role)}>{getRoleDisplayName(u.role)}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDateTime(u.updated_at)}</TableCell>
                      <TableCell>
                        <Select
                          value={u.role}
                          onValueChange={(value: User["role"]) => handleChangeUserRole(u.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Quản trị viên</SelectItem>
                            <SelectItem value="giảng viên">Giảng viên</SelectItem>
                            <SelectItem value="người xem">Người xem</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Requests Tab */}
        {selectedTab === "requests" && (
          <Card>
            <CardHeader>
              <CardTitle>Yêu cầu chỉnh sửa thông tin</CardTitle>
              <CardDescription>Xem xét và phê duyệt các yêu cầu chỉnh sửa từ người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              {editRequests.length > 0 ? (
                <div className="space-y-4">
                  {editRequests.map((request) => {
                    const requestUser = users.find((u) => u.id === request.user_id)
                    return (
                      <div key={request.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={requestUser?.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{requestUser?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{requestUser?.name}</p>
                              <p className="text-sm text-muted-foreground">{requestUser?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{formatDateTime(request.created_at)}</span>
                            {request.status === "pending" && <Badge variant="secondary">Đang chờ</Badge>}
                            {request.status === "approved" && (
                              <Badge variant="default" className="bg-green-500">
                                Đã duyệt
                              </Badge>
                            )}
                            {request.status === "rejected" && <Badge variant="destructive">Từ chối</Badge>}
                          </div>
                        </div>

                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{request.content}</p>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Phê duyệt
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(request.id)}>
                              <X className="w-4 h-4 mr-1" />
                              Từ chối
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Không có yêu cầu nào</h3>
                  <p className="text-muted-foreground">
                    Các yêu cầu chỉnh sửa thông tin từ người dùng sẽ hiển thị ở đây
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
