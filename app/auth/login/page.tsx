"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Sparkles, Users, BookOpen, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authenticateUser, setCurrentUser } from "@/lib/mock-data"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = authenticateUser(email, password)
      if (user) {
        setCurrentUser(user)
        router.push("/dashboard")
      } else {
        setError("Email hoặc mật khẩu không chính xác")
      }
    } catch (err) {
      setError("Đã xảy ra lỗi, vui lòng thử lại")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    const user = authenticateUser(demoEmail, demoPassword)
    if (user) {
      setCurrentUser(user)
      router.push("/dashboard")
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative z-10">
        <div className="max-w-md text-center space-y-8">
          {/* Logo */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl rotate-6 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-400 rounded-3xl -rotate-6 animate-pulse delay-500"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
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
              Vietnam Student
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Marathon
              </span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Hệ thống quản lý bài giảng hiện đại cho cộng đồng marathon sinh viên Việt Nam
            </p>
            <div className="text-sm text-blue-200 font-medium">vsm.org.vn</div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mt-12">
            <div className="flex items-center gap-4 text-blue-100 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="font-semibold">Bài giảng chất lượng</div>
                <div className="text-sm opacity-80">Kho tài liệu phong phú</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-blue-100 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold">Quản lý lịch trình</div>
                <div className="text-sm opacity-80">Tổ chức thời gian hiệu quả</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-blue-100 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="font-semibold">Cộng đồng kết nối</div>
                <div className="text-sm opacity-80">Chia sẻ kiến thức cùng nhau</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl rotate-6 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-white font-bold text-2xl">VSM</div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Vietnam Student Marathon</h1>
            <p className="text-blue-200">vsm.org.vn</p>
          </div>

          {/* Login Card */}
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Chào mừng trở lại
              </CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Đăng nhập để tiếp tục hành trình học tập
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors"
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
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors pr-12"
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

                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang đăng nhập...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Đăng nhập
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-4 text-center font-medium">Tài khoản demo:</p>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 border-2 hover:border-red-300 hover:bg-red-50 transition-all group bg-transparent"
                    onClick={() => handleDemoLogin("admin@example.com", "admin123")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-800 group-hover:text-red-700">Quản trị viên</div>
                        <div className="text-sm text-slate-500">admin@example.com</div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all group bg-transparent"
                    onClick={() => handleDemoLogin("teacher@example.com", "teacher123")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-800 group-hover:text-blue-700">Giảng viên</div>
                        <div className="text-sm text-slate-500">teacher@example.com</div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 border-2 hover:border-green-300 hover:bg-green-50 transition-all group bg-transparent"
                    onClick={() => handleDemoLogin("viewer@example.com", "viewer123")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-800 group-hover:text-green-700">Người xem</div>
                        <div className="text-sm text-slate-500">viewer@example.com</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-slate-600">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
