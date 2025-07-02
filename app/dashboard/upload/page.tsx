"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentUser } from "@/lib/mock-data"
import type { User } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  preview?: string
}

export default function UploadPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    allowDownload: true,
  })
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role === "người xem") {
      window.location.href = "/dashboard"
      return
    }
    setUser(currentUser)
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const pdfFiles = files.filter((file) => file.type === "application/pdf")

    pdfFiles.forEach((file) => {
      const uploadFile: UploadFile = {
        id: generateId(),
        file,
        progress: 0,
        status: "uploading",
      }

      setUploadFiles((prev) => [...prev, uploadFile])

      // Simulate file upload with progress
      simulateUpload(uploadFile.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15

      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            if (progress >= 100) {
              clearInterval(interval)
              return {
                ...file,
                progress: 100,
                status: "completed",
                preview: "/placeholder.svg?height=200&width=300",
              }
            }
            return { ...file, progress: Math.min(progress, 95) }
          }
          return file
        }),
      )
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadFiles.length === 0 || !formData.title.trim()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitStatus("success")

      // Reset form
      setFormData({
        title: "",
        description: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        allowDownload: true,
      })
      setUploadFiles([])
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
  const months = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ]

  if (!user || user.role === "người xem") {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bạn không có quyền truy cập trang này. Chỉ giảng viên và quản trị viên mới có thể tải lên bài giảng.
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
          <h1 className="text-3xl font-bold">Tải lên bài giảng</h1>
          <p className="text-muted-foreground">Chia sẻ kiến thức của bạn với cộng đồng VSM</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Tệp bài giảng</CardTitle>
              <CardDescription>Tải lên tệp PDF chứa nội dung bài giảng của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Kéo thả tệp PDF vào đây</h3>
                <p className="text-muted-foreground mb-4">hoặc nhấp để chọn tệp từ máy tính</p>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button type="button" variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Chọn tệp PDF
                  </label>
                </Button>
              </div>

              {/* Uploaded Files */}
              {uploadFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium">Tệp đã tải lên</h4>
                  {uploadFiles.map((uploadFile) => (
                    <div key={uploadFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{uploadFile.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="mt-2" />}
                      </div>
                      <div className="flex items-center gap-2">
                        {uploadFile.status === "completed" && <Check className="w-5 h-5 text-green-500" />}
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(uploadFile.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lecture Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bài giảng</CardTitle>
              <CardDescription>Điền thông tin chi tiết về bài giảng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài giảng *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề bài giảng..."
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả ngắn về nội dung bài giảng..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tháng</Label>
                  <Select
                    value={formData.month.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, month: Number.parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Năm</Label>
                  <Select
                    value={formData.year.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, year: Number.parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allow-download"
                  checked={formData.allowDownload}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allowDownload: checked }))}
                />
                <Label htmlFor="allow-download">Cho phép tải xuống</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Status */}
          {submitStatus === "success" && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                Bài giảng đã được tải lên thành công! Nó sẽ xuất hiện trong danh sách bài giảng.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Đã xảy ra lỗi khi tải lên bài giảng. Vui lòng thử lại.</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || uploadFiles.length === 0 || !formData.title.trim()}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Đang tải lên..." : "Tải lên bài giảng"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
