"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Sparkles, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      setLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Đăng ký thành công! Vui lòng liên hệ quản trị viên để kích hoạt tài khoản.")
      setFormData({ name: "", email: "", password: "", confirmPassword: "" })
    } catch (err) {
      setError("Đã xảy ra lỗi, vui lòng thử lại")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative z-10">
        <div className="max-w-md text-center space-y-8">
          {/* Logo */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl rotate-6 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-400 rounded-3xl -rotate-6 animate-pulse delay-500"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-white font-bold text-4xl">VSM</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
          </div>

          {/* Brand Info */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white mb-2">
              Tham gia
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Cộng đồng VSM
              </span>
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Khởi đầu hành trình học tập và phát triển cùng Vietnam Student Marathon
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 gap-4 mt-12">
            <div className="flex items-center gap-4 text-purple-100 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="font-semibold">Miễn phí hoàn toàn</div>
                <div className="text-sm opacity-80">Truy cập tất cả tài liệu</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-purple-100 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold">Bảo mật tuyệt đối</div>
                <div className="text-sm opacity-80">Thông tin được bảo vệ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl rotate-6 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-white font-bold text-2xl">VSM</div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Vietnam Student Marathon</h1>
            <p className="text-purple-200">vsm.org.vn</p>
          </div>

          {/* Register Card */}
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Tạo tài khoản mới
              </CardTitle>
              <CardDescription className="text-lg text-slate-600">Tham gia cộng đồng VSM ngay hôm nay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Họ và tên
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Quách Thành Long"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12 border-2 border-slate-200 focus:border-purple-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 border-2 border-slate-200 focus:border-purple-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 border-2 border-slate-200 focus:border-purple-500 transition-colors pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-12 border-2 border-slate-200 focus:border-purple-500 transition-colors pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-500" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang đăng ký...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Đăng ký tài khoản
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-slate-600">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/auth/login"
                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <p className="text-sm text-slate-700 text-center">
                  <strong className="text-purple-700">Lưu ý:</strong> Tài khoản mới cần được quản trị viên phê duyệt.
                  Vui lòng sử dụng tài khoản demo để trải nghiệm hệ thống.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
