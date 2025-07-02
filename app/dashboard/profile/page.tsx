"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Mail, Calendar, Edit, Send, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentUser, mockEditRequests } from "@/lib/mock-data"
import type { User as UserType, EditRequest } from "@/lib/types"
import { formatDateTime, generateId } from "@/lib/utils"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [editRequests, setEditRequests] = useState<EditRequest[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [requestContent, setRequestContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      const userRequests = mockEditRequests.filter((req) => req.user_id === currentUser.id)
      setEditRequests(userRequests)
    }
  }, [])

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !requestContent.trim()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newRequest: EditRequest = {
        id: generateId(),
        user_id: user.id,
        content: requestContent.trim(),
        status: "pending",
        created_at: new Date().toISOString(),
      }

      setEditRequests((prev) => [newRequest, ...prev])
      setRequestContent("")
      setIsDialogOpen(false)
      setSubmitSuccess(true)

      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error("Error submitting request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: EditRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Đang chờ
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Từ chối
          </Badge>
        )
      default:
        return null
    }
  }

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

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân và gửi yêu cầu chỉnh sửa</p>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Yêu cầu chỉnh sửa đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi sớm nhất.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Thông tin cơ bản về tài khoản của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <Badge variant="outline" className="capitalize">
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Vai trò</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{getRoleDisplayName(user.role)}</span>
                    </div>
                  </div>

                  {user.dob && (
                    <div className="space-y-2">
                      <Label>Ngày sinh</Label>
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(user.dob).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Cập nhật lần cuối</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDateTime(user.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Edit className="w-4 h-4 mr-2" />
                        Yêu cầu chỉnh sửa thông tin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Yêu cầu chỉnh sửa thông tin</DialogTitle>
                        <DialogDescription>
                          Mô tả những thông tin bạn muốn thay đổi. Quản trị viên sẽ xem xét và phản hồi.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitRequest} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="request-content">Nội dung yêu cầu *</Label>
                          <Textarea
                            id="request-content"
                            placeholder="Ví dụ: Tôi muốn cập nhật số điện thoại từ 0123456789 thành 0987654321..."
                            value={requestContent}
                            onChange={(e) => setRequestContent(e.target.value)}
                            rows={4}
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Hủy
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử yêu cầu</CardTitle>
                <CardDescription>Các yêu cầu chỉnh sửa thông tin đã gửi</CardDescription>
              </CardHeader>
              <CardContent>
                {editRequests.length > 0 ? (
                  <div className="space-y-4">
                    {editRequests.map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{formatDateTime(request.created_at)}</span>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm">{request.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Send className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Chưa có yêu cầu nào</h3>
                    <p className="text-sm text-muted-foreground">Các yêu cầu chỉnh sửa thông tin sẽ hiển thị ở đây</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Yêu cầu đang chờ</span>
                  <Badge variant="secondary">{editRequests.filter((r) => r.status === "pending").length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Yêu cầu đã duyệt</span>
                  <Badge variant="default" className="bg-green-500">
                    {editRequests.filter((r) => r.status === "approved").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Yêu cầu bị từ chối</span>
                  <Badge variant="destructive">{editRequests.filter((r) => r.status === "rejected").length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
