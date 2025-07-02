"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Heart,
  Eye,
  Download,
  Calendar,
  User,
  BookOpen,
  Star,
  TrendingUp,
  FileText,
  Monitor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PDFViewer } from "@/components/pdf-viewer"
import { getCurrentUser, mockLectures, mockUsers } from "@/lib/mock-data"
import type { Lecture, User as UserType } from "@/lib/types"
import { formatDate, getMonthName } from "@/lib/utils"
import { cn } from "@/lib/utils"

export default function LecturesPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLectures(mockLectures)
    setFilteredLectures(mockLectures)

    if (currentUser) {
      const userFavorites = mockLectures
        .filter((lecture) => lecture.favorite_by.includes(currentUser.id))
        .map((lecture) => lecture.id)
      setFavorites(userFavorites)
    }
  }, [])

  useEffect(() => {
    let filtered = lectures

    // Filter by tab
    if (activeTab === "favorites" && user) {
      filtered = filtered.filter((lecture) => lecture.favorite_by.includes(user.id))
    } else if (activeTab === "my-lectures" && user) {
      filtered = filtered.filter((lecture) => lecture.owner_email === user.email)
    } else if (activeTab === "popular") {
      filtered = filtered.filter((lecture) => lecture.views_count > 100)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((lecture) => lecture.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by month
    if (selectedMonth !== "all") {
      filtered = filtered.filter((lecture) => lecture.month === Number.parseInt(selectedMonth))
    }

    // Filter by year
    if (selectedYear !== "all") {
      filtered = filtered.filter((lecture) => lecture.year === Number.parseInt(selectedYear))
    }

    setFilteredLectures(filtered)
  }, [lectures, searchTerm, selectedMonth, selectedYear, activeTab, user])

  const handleToggleFavorite = (lectureId: string) => {
    if (!user) return

    setFavorites((prev) => {
      const newFavorites = prev.includes(lectureId) ? prev.filter((id) => id !== lectureId) : [...prev, lectureId]

      setLectures((prevLectures) =>
        prevLectures.map((lecture) => {
          if (lecture.id === lectureId) {
            return {
              ...lecture,
              favorite_by: newFavorites.includes(lectureId)
                ? [...lecture.favorite_by, user.id]
                : lecture.favorite_by.filter((id) => id !== user.id),
            }
          }
          return lecture
        }),
      )

      return newFavorites
    })
  }

  const handleViewLecture = (lecture: Lecture) => {
    setLectures((prevLectures) =>
      prevLectures.map((l) => (l.id === lecture.id ? { ...l, views_count: l.views_count + 1 } : l)),
    )
    setSelectedLecture(lecture)
  }

  const getOwnerName = (email: string) => {
    const owner = mockUsers.find((u) => u.email === email)
    return owner?.name || email
  }

  const getOwnerAvatar = (email: string) => {
    const owner = mockUsers.find((u) => u.email === email)
    return owner?.avatar || "/placeholder.svg"
  }

  const availableYears = [...new Set(lectures.map((l) => l.year))].sort((a, b) => b - a)
  const availableMonths = [...new Set(lectures.map((l) => l.month))].sort((a, b) => a - b)

  const getTabCount = (tab: string) => {
    if (!user) return 0
    switch (tab) {
      case "all":
        return lectures.length
      case "favorites":
        return lectures.filter((l) => l.favorite_by.includes(user.id)).length
      case "my-lectures":
        return lectures.filter((l) => l.owner_email === user.email).length
      case "popular":
        return lectures.filter((l) => l.views_count > 100).length
      default:
        return 0
    }
  }

  const LectureCard = ({ lecture }: { lecture: Lecture }) => (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
          <img
            src={lecture.preview_url || "/placeholder.svg"}
            alt={lecture.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-black"
                  onClick={() => handleViewLecture(lecture)}
                >
                  <FileText className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl h-[90vh] p-0">
                <PDFViewer lectureId={lecture.id} title={lecture.title} onClose={() => setSelectedLecture(null)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Floating badges */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-black/70 text-white border-0">
            {getMonthName(lecture.month)} {lecture.year}
          </Badge>
        </div>

        {lecture.views_count > 150 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <TrendingUp className="w-3 h-3 mr-1" />
              Hot
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {lecture.title}
          </h3>

          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 ring-2 ring-primary/20">
              <AvatarImage src={getOwnerAvatar(lecture.owner_email) || "/placeholder.svg"} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10">
                {getOwnerName(lecture.owner_email).charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{getOwnerName(lecture.owner_email)}</p>
              <p className="text-xs text-muted-foreground">{formatDate(lecture.created_at)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{lecture.views_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="font-medium">{lecture.favorite_by.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleFavorite(lecture.id)}
            className={cn(
              "hover:scale-105 transition-transform",
              favorites.includes(lecture.id) ? "text-red-500 hover:text-red-600" : "hover:text-red-500",
            )}
          >
            <Heart className={`w-4 h-4 mr-2 ${favorites.includes(lecture.id) ? "fill-current" : ""}`} />
            {favorites.includes(lecture.id) ? "Đã thích" : "Thích"}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:scale-105 transition-transform text-blue-600 hover:text-blue-700"
                onClick={() => handleViewLecture(lecture)}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Trình chiếu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl h-[90vh] p-0">
              <PDFViewer lectureId={lecture.id} title={lecture.title} onClose={() => setSelectedLecture(null)} />
            </DialogContent>
          </Dialog>

          {lecture.allow_download && (
            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const LectureListItem = ({ lecture }: { lecture: Lecture }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={lecture.preview_url || "/placeholder.svg"}
              alt={lecture.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                    {lecture.title}
                  </h3>
                </DialogTrigger>
                <DialogContent className="max-w-7xl h-[90vh] p-0">
                  <PDFViewer lectureId={lecture.id} title={lecture.title} onClose={() => setSelectedLecture(null)} />
                </DialogContent>
              </Dialog>
              <Badge variant="outline">
                {getMonthName(lecture.month)} {lecture.year}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{getOwnerName(lecture.owner_email)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(lecture.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{lecture.views_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{lecture.favorite_by.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleFavorite(lecture.id)}
                  className={favorites.includes(lecture.id) ? "text-red-500" : ""}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(lecture.id) ? "fill-current" : ""}`} />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => handleViewLecture(lecture)}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl h-[90vh] p-0">
                    <PDFViewer lectureId={lecture.id} title={lecture.title} onClose={() => setSelectedLecture(null)} />
                  </DialogContent>
                </Dialog>
                {lecture.allow_download && (
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Bài giảng
              </h1>
              <p className="text-muted-foreground text-lg">
                Khám phá và học hỏi từ các bài giảng chất lượng cao của VSM
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <BookOpen className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{lectures.length}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Tổng bài giảng</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {lectures.reduce((sum, l) => sum + l.views_count, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">Lượt xem</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">{favorites.length}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Yêu thích</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {lectures.filter((l) => l.views_count > 100).length}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Phổ biến</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-gradient-to-r from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm bài giảng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[140px] h-12">
                    <SelectValue placeholder="Tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả tháng</SelectItem>
                    {availableMonths.map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {getMonthName(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[120px] h-12">
                    <SelectValue placeholder="Năm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả năm</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              Tất cả
              <Badge variant="secondary" className="ml-1">
                {getTabCount("all")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              Yêu thích
              <Badge variant="secondary" className="ml-1">
                {getTabCount("favorites")}
              </Badge>
            </TabsTrigger>
            {user && user.role !== "người xem" && (
              <TabsTrigger value="my-lectures" className="flex items-center gap-2">
                Của tôi
                <Badge variant="secondary" className="ml-1">
                  {getTabCount("my-lectures")}
                </Badge>
              </TabsTrigger>
            )}
            <TabsTrigger value="popular" className="flex items-center gap-2">
              Phổ biến
              <Badge variant="secondary" className="ml-1">
                {getTabCount("popular")}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Hiển thị <span className="font-semibold text-foreground">{filteredLectures.length}</span> trong tổng số{" "}
                <span className="font-semibold text-foreground">{lectures.length}</span> bài giảng
              </p>
            </div>

            {/* Lectures Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredLectures.map((lecture) => (
                  <LectureCard key={lecture.id} lecture={lecture} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLectures.map((lecture) => (
                  <LectureListItem key={lecture.id} lecture={lecture} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredLectures.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Không tìm thấy bài giảng</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả, hoặc khám phá các bài giảng khác.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedMonth("all")
                      setSelectedYear("all")
                      setActiveTab("all")
                    }}
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
