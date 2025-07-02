"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, Home, Upload, Calendar, User, LogOut, Menu, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getCurrentUser, setCurrentUser } from "@/lib/mock-data"
import type { User as UserType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    // Smooth logout animation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setCurrentUser(null)
    router.push("/auth/login")
  }

  const navigation = [
    { name: "Trang chủ", href: "/dashboard", icon: Home },
    { name: "Bài giảng", href: "/dashboard/lectures", icon: BookOpen },
    ...(user?.role !== "người xem" ? [{ name: "Tải lên", href: "/dashboard/upload", icon: Upload }] : []),
    { name: "Lịch", href: "/dashboard/calendar", icon: Calendar },
    { name: "Hồ sơ", href: "/dashboard/profile", icon: User },
    ...(user?.role === "admin" ? [{ name: "Quản trị", href: "/dashboard/admin", icon: Users }] : []),
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl rotate-6 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="text-white font-bold text-xl">VSM</div>
            </div>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl rotate-6 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-400 rounded-3xl -rotate-6 animate-pulse delay-500"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <div className="text-white font-bold text-2xl">VSM</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-white text-lg">Đang đăng xuất...</p>
            <p className="text-blue-200">Cảm ơn bạn đã sử dụng VSM</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-card to-card/80 border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 backdrop-blur-xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl rotate-3 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="text-white font-bold text-sm">VSM</div>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                VSM Lectures
              </h1>
              <p className="text-xs text-muted-foreground">Vietnam Student Marathon</p>
            </div>
            <div className="ml-auto">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                      : "hover:bg-accent/50 hover:text-accent-foreground hover:shadow-md",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110",
                      isActive && "text-primary-foreground",
                    )}
                  />
                  {item.name}
                  {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </Link>
              )
            })}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-4 hover:bg-accent/50 rounded-xl">
                  <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="w-4 h-4 mr-2" />
                    Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-xl">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg rotate-3"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="text-white font-bold text-xs">VSM</div>
              </div>
            </div>
            <span className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              VSM Lectures
            </span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
