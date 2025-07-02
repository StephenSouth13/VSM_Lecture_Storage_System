"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize,
  Minimize,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  BookOpen,
  Share2,
  Bookmark,
  Grid3X3,
  List,
  Search,
  X,
  Monitor,
  RotateCcw,
  Calendar,
  Clock,
  Target,
  Activity,
  Award,
  TrendingUp,
  Heart,
  Zap,
  CheckCircle,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface PDFViewerProps {
  lectureId: string
  title: string
  onClose: () => void
}

export function PDFViewer({ lectureId, title, onClose }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(lectureId === "7" ? 8 : 12)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(1)
  const [viewMode, setViewMode] = useState<"single" | "double" | "grid">("single")
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [notes, setNotes] = useState<{ page: number; note: string }[]>([])
  const [showNotes, setShowNotes] = useState(false)
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [laserPointer, setLaserPointer] = useState({ x: 0, y: 0, visible: false })
  const [presentationTimer, setPresentationTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Marathon lecture content
  const marathonPages = [
    {
      id: 1,
      title: "Giới thiệu về Marathon",
      subtitle: "Vietnam Student Marathon",
      content: "cover",
      thumbnail: "/placeholder.svg?height=150&width=100&text=Cover",
    },
    {
      id: 2,
      title: "Mục tiêu bài học",
      content: "objectives",
      points: [
        "Hiểu rõ lịch sử và ý nghĩa của Marathon",
        "Nắm vững các kỹ thuật chạy bền cơ bản",
        "Xây dựng kế hoạch tập luyện phù hợp",
        "Phòng tránh chấn thương khi tập luyện",
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Objectives",
    },
    {
      id: 3,
      title: "Lịch sử Marathon",
      content: "history",
      points: [
        "Nguồn gốc từ trận Marathon cổ đại (490 TCN)",
        "Pheidippides chạy từ Marathon đến Athens",
        "Khoảng cách chính thức: 42.195km",
        "Trở thành môn thi đấu Olympic từ 1896",
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=History",
    },
    {
      id: 4,
      title: "Lợi ích của Marathon",
      content: "benefits",
      categories: [
        {
          title: "Sức khỏe thể chất",
          items: ["Tăng cường tim mạch", "Giảm cân hiệu quả", "Tăng sức bền"],
        },
        {
          title: "Sức khỏe tinh thần",
          items: ["Giảm stress", "Tăng sự tự tin", "Cải thiện tâm trạng"],
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Benefits",
    },
    {
      id: 5,
      title: "Kỹ thuật chạy cơ bản",
      content: "technique",
      techniques: [
        {
          name: "Tư thế chạy",
          description: "Thẳng lưng, vai thư giãn, nhìn về phía trước",
        },
        {
          name: "Bước chạy",
          description: "Bước ngắn, tần số cao, tiếp đất bằng giữa bàn chân",
        },
        {
          name: "Hô hấp",
          description: "Thở đều, nhịp nhàng theo bước chạy",
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Technique",
    },
    {
      id: 6,
      title: "Kế hoạch tập luyện",
      content: "training",
      phases: [
        { phase: "Giai đoạn 1", duration: "4 tuần", focus: "Xây dựng nền tảng" },
        { phase: "Giai đoạn 2", duration: "8 tuần", focus: "Tăng cường sức bền" },
        { phase: "Giai đoạn 3", duration: "4 tuần", focus: "Luyện tập chuyên sâu" },
        { phase: "Giai đoạn 4", duration: "2 tuần", focus: "Tapering & Recovery" },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Training",
    },
    {
      id: 7,
      title: "Dinh dưỡng cho Runner",
      content: "nutrition",
      categories: [
        {
          title: "Trước khi chạy",
          items: ["Carbohydrate phức hợp", "Protein nhẹ", "Hydration đầy đủ"],
        },
        {
          title: "Trong khi chạy",
          items: ["Nước điện giải", "Energy gel", "Trái cây khô"],
        },
        {
          title: "Sau khi chạy",
          items: ["Protein recovery", "Carbs bổ sung", "Chống viêm"],
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Nutrition",
    },
    {
      id: 8,
      title: "Phòng tránh chấn thương",
      content: "injury",
      tips: [
        {
          title: "Khởi động kỹ lưỡng",
          description: "5-10 phút khởi động động học",
        },
        {
          title: "Tăng cường độ từ từ",
          description: "Quy tắc 10% mỗi tuần",
        },
        {
          title: "Nghỉ ngơi đầy đủ",
          description: "1-2 ngày nghỉ mỗi tuần",
        },
        {
          title: "Lắng nghe cơ thể",
          description: "Dừng khi có dấu hiệu đau",
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Injury",
    },
    {
      id: 9,
      title: "Trang bị cần thiết",
      content: "equipment",
      items: [
        {
          category: "Giày chạy",
          description: "Phù hợp với dáng chân và cách chạy",
          importance: "Rất quan trọng",
        },
        {
          category: "Quần áo",
          description: "Vải thấm hút mồ hôi, thoáng khí",
          importance: "Quan trọng",
        },
        {
          category: "Phụ kiện",
          description: "Đồng hồ GPS, tai nghe, túi nước",
          importance: "Tùy chọn",
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Equipment",
    },
    {
      id: 10,
      title: "Tâm lý thi đấu",
      content: "psychology",
      strategies: [
        "Đặt mục tiêu thực tế và có thể đạt được",
        "Chia nhỏ quãng đường thành các mốc",
        "Sử dụng self-talk tích cực",
        "Tập trung vào quá trình, không chỉ kết quả",
        "Chuẩn bị tinh thần cho khó khăn",
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Psychology",
    },
    {
      id: 11,
      title: "Cộng đồng VSM",
      content: "community",
      features: [
        "Nhóm tập luyện hàng tuần",
        "Chia sẻ kinh nghiệm và tips",
        "Tham gia các giải chạy",
        "Hỗ trợ lẫn nhau trong hành trình",
        "Kết nối với runner khắp Việt Nam",
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Community",
    },
    {
      id: 12,
      title: "Kết luận & Hành động",
      content: "conclusion",
      actions: [
        "Bắt đầu với kế hoạch tập luyện cơ bản",
        "Tham gia cộng đồng VSM",
        "Đăng ký giải chạy đầu tiên",
        "Theo dõi tiến độ và điều chỉnh",
        "Chia sẻ hành trình của bạn",
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Conclusion",
    },
  ]

  // Add content for the new "Kỹ thuật chạy Marathon hiệu quả" lecture
  const advancedTechniquePages = [
    {
      id: 1,
      title: "Kỹ thuật chạy Marathon hiệu quả",
      subtitle: "Nâng cao hiệu suất và giảm thiểu chấn thương",
      content: "advanced_cover",
      thumbnail: "/placeholder.svg?height=150&width=100&text=Advanced",
    },
    {
      id: 2,
      title: "Phân tích bước chạy",
      content: "gait_analysis",
      sections: [
        {
          title: "Chu kỳ bước chạy",
          points: [
            "Pha tiếp đất (Landing): 30% chu kỳ",
            "Pha hỗ trợ (Support): 40% chu kỳ",
            "Pha đẩy (Push-off): 30% chu kỳ",
          ],
        },
        {
          title: "Điểm tiếp đất tối ưu",
          points: [
            "Tiếp đất bằng giữa bàn chân",
            "Chân tiếp đất dưới trọng tâm cơ thể",
            "Tránh tiếp đất bằng gót chân",
          ],
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Gait",
    },
    {
      id: 3,
      title: "Tần số bước chạy (Cadence)",
      content: "cadence",
      data: {
        optimal: "180-190 bước/phút",
        beginner: "160-170 bước/phút",
        elite: "190-200 bước/phút",
      },
      tips: [
        "Sử dụng metronome để luyện tập",
        "Tăng dần 5 bước/phút mỗi tuần",
        "Tập trung vào bước ngắn, nhanh",
        "Đếm bước trong 15 giây x 4",
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Cadence",
    },
    {
      id: 4,
      title: "Tư thế cơ thể",
      content: "posture",
      elements: [
        {
          part: "Đầu & Cổ",
          description: "Nhìn thẳng phía trước, cổ thẳng, không cúi đầu",
          common_mistakes: "Nhìn xuống đất, cổ cong",
        },
        {
          part: "Vai & Cánh tay",
          description: "Vai thư giãn, cánh tay vung tự nhiên 90°",
          common_mistakes: "Vai căng thẳng, cánh tay quá cao",
        },
        {
          part: "Thân người",
          description: "Thẳng lưng, hơi nghiêng về phía trước",
          common_mistakes: "Cong lưng, nghiêng quá nhiều",
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Posture",
    },
    {
      id: 5,
      title: "Kỹ thuật hô hấp",
      content: "breathing",
      patterns: [
        {
          type: "Hô hấp 3:2",
          description: "Hít vào 3 bước, thở ra 2 bước",
          use: "Tốc độ vừa phải, đường dài",
        },
        {
          type: "Hô hấp 2:2",
          description: "Hít vào 2 bước, thở ra 2 bước",
          use: "Tốc độ nhanh, tempo run",
        },
        {
          type: "Hô hấp bụng",
          description: "Thở sâu bằng cơ hoành, không ngực",
          use: "Tất cả các tốc độ",
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Breathing",
    },
    {
      id: 6,
      title: "Chiến lược phân chia tốc độ",
      content: "pacing",
      strategies: [
        {
          name: "Negative Split",
          description: "Nửa sau nhanh hơn nửa đầu",
          benefit: "Tiết kiệm năng lượng, finish mạnh",
        },
        {
          name: "Even Split",
          description: "Tốc độ đều từ đầu đến cuối",
          benefit: "Dễ kiểm soát, ít rủi ro",
        },
        {
          name: "Progressive",
          description: "Tăng tốc dần theo từng đoạn",
          benefit: "Phù hợp với runner có kinh nghiệm",
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Pacing",
    },
    {
      id: 7,
      title: "Dinh dưỡng trong cuộc đua",
      content: "race_nutrition",
      timeline: [
        {
          time: "Trước 3-4 giờ",
          action: "Bữa ăn chính với carbs phức hợp",
          examples: "Cơm, mì ý, yến mạch",
        },
        {
          time: "Trước 1 giờ",
          action: "Snack nhẹ, dễ tiêu hóa",
          examples: "Chuối, bánh mì trắng, nước",
        },
        {
          time: "Trong cuộc đua",
          action: "Carbs đơn giản mỗi 45-60 phút",
          examples: "Gel năng lượng, nước ngọt",
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Nutrition",
    },
    {
      id: 8,
      title: "Phục hồi sau Marathon",
      content: "recovery",
      phases: [
        {
          phase: "Ngay sau đua (0-2 giờ)",
          activities: ["Đi bộ nhẹ 10-15 phút", "Uống nước, ăn nhẹ", "Massage nhẹ"],
        },
        {
          phase: "24-48 giờ đầu",
          activities: ["Nghỉ ngơi hoàn toàn", "Tắm nước lạnh", "Ăn protein + carbs"],
        },
        {
          phase: "Tuần 1-2",
          activities: ["Chạy nhẹ 20-30 phút", "Cross-training", "Massage chuyên sâu"],
        },
        {
          phase: "Tuần 3-4",
          activities: ["Tăng dần cường độ", "Quay lại lịch tập bình thường"],
        },
      ],
      thumbnail: "/placeholder.svg?height=150&width=100&text=Recovery",
    },
  ]

  // Determine which content to show based on lectureId
  const getContentForLecture = (lectureId: string) => {
    if (lectureId === "7") {
      return advancedTechniquePages
    }
    return marathonPages
  }

  const currentContent = getContentForLecture(lectureId)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentPage((prev) => {
          if (prev >= totalPages) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 3000 / playSpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playSpeed, totalPages])

  useEffect(() => {
    let timerInterval: NodeJS.Timeout
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setPresentationTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timerInterval)
  }, [isTimerRunning])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPresentationMode) {
        switch (e.key) {
          case "ArrowLeft":
            handlePrevPage()
            break
          case "ArrowRight":
          case " ":
            if (e.key === " ") {
              e.preventDefault()
              if (e.shiftKey) {
                togglePlayback()
              } else {
                handleNextPage()
              }
            } else {
              handleNextPage()
            }
            break
          case "Escape":
            setIsPresentationMode(false)
            break
          case "f":
          case "F":
            if (document.fullscreenElement) {
              document.exitFullscreen()
            } else {
              document.documentElement.requestFullscreen()
            }
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPresentationMode, currentPage, totalPages, isPlaying])

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const handleGoToPage = (page: number) => setCurrentPage(page)

  const togglePlayback = () => setIsPlaying(!isPlaying)
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)
  const toggleBookmark = () => setIsBookmarked(!isBookmarked)

  const getCurrentPageContent = () => {
    const content = getContentForLecture(lectureId)
    return content.find((page) => page.id === currentPage) || content[0]
  }

  const renderPageContent = (pageData: any) => {
    switch (pageData.content) {
      case "cover":
        return (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <Activity className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {pageData.title}
              </h1>
              <h2 className="text-2xl text-gray-600 font-medium">{pageData.subtitle}</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
            </div>
            <div className="text-gray-500 text-lg">Khám phá thế giới chạy bộ cùng VSM</div>
          </div>
        )

      case "objectives":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {pageData.points.map((point: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "history":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
            </div>
            <div className="space-y-6">
              {pageData.points.map((point: string, index: number) => (
                <div key={index} className="flex items-center gap-4 p-6 bg-amber-50 rounded-xl">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xl text-gray-700 font-medium">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border border-amber-200">
              <p className="text-lg text-amber-800 text-center font-medium">
                "Từ một câu chuyện cổ đại đến môn thể thao được yêu thích nhất thế giới"
              </p>
            </div>
          </div>
        )

      case "benefits":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-green-500 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {pageData.categories.map((category: any, index: number) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">{category.title}</h3>
                  <div className="space-y-3">
                    {category.items.map((item: string, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "technique":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-purple-500 mx-auto"></div>
            </div>
            <div className="space-y-6">
              {pageData.techniques.map((technique: any, index: number) => (
                <div key={index} className="p-6 bg-purple-50 rounded-xl border-l-4 border-purple-400">
                  <h3 className="text-xl font-bold text-purple-800 mb-3">{technique.name}</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">{technique.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
              <p className="text-lg text-purple-800 text-center font-medium">
                💡 "Kỹ thuật đúng giúp bạn chạy hiệu quả và tránh chấn thương"
              </p>
            </div>
          </div>
        )

      case "training":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-red-500 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {pageData.phases.map((phase: any, index: number) => (
                <div key={index} className="p-6 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-red-800">{phase.phase}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <strong>Thời gian:</strong> {phase.duration}
                    </p>
                    <p className="text-gray-600">
                      <strong>Trọng tâm:</strong> {phase.focus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "conclusion":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto"></div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-700 mb-6">Bước tiếp theo của bạn:</h3>
              {pageData.actions.map((action: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-lg text-gray-700 font-medium">{action}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl text-center">
              <p className="text-xl font-bold text-gray-800 mb-2">
                🏃‍♂️ Hành trình Marathon bắt đầu từ bước chân đầu tiên!
              </p>
              <p className="text-lg text-gray-600">Tham gia cộng đồng VSM ngay hôm nay</p>
            </div>
          </div>
        )

      case "advanced_cover":
        return (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {pageData.title}
              </h1>
              <h2 className="text-2xl text-gray-600 font-medium">{pageData.subtitle}</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <div className="text-gray-500 text-lg">Nâng cao kỹ năng chạy Marathon của bạn</div>
          </div>
        )

      case "gait_analysis":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-indigo-500 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {pageData.sections.map((section: any, index: number) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-2xl font-bold text-indigo-700 mb-4">{section.title}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {section.points.map((point: string, pointIndex: number) => (
                      <div key={pointIndex} className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{pointIndex + 1}</span>
                        </div>
                        <span className="text-lg text-gray-700 font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "cadence":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <h3 className="text-lg font-bold text-orange-800 mb-2">Người mới</h3>
                <div className="text-3xl font-bold text-orange-600">{pageData.data.beginner}</div>
              </div>
              <div className="text-center p-6 bg-orange-100 rounded-xl border-2 border-orange-300">
                <h3 className="text-lg font-bold text-orange-800 mb-2">Tối ưu</h3>
                <div className="text-3xl font-bold text-orange-600">{pageData.data.optimal}</div>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <h3 className="text-lg font-bold text-orange-800 mb-2">Elite</h3>
                <div className="text-3xl font-bold text-orange-600">{pageData.data.elite}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-orange-700 mb-4">Cách luyện tập:</h3>
              {pageData.tips.map((tip: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-orange-500" />
                  <span className="text-lg text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "posture":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-teal-500 mx-auto"></div>
            </div>

            <div className="space-y-6">
              {pageData.elements.map((element: any, index: number) => (
                <div key={index} className="p-6 bg-teal-50 rounded-xl border-l-4 border-teal-400">
                  <h3 className="text-xl font-bold text-teal-800 mb-3">{element.part}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✅ Đúng:</h4>
                      <p className="text-gray-700">{element.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">❌ Sai:</h4>
                      <p className="text-gray-700">{element.common_mistakes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "breathing":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-cyan-500 mx-auto"></div>
            </div>

            <div className="space-y-6">
              {pageData.patterns.map((pattern: any, index: number) => (
                <div key={index} className="p-6 bg-cyan-50 rounded-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-cyan-800">{pattern.type}</h3>
                  </div>
                  <div className="ml-16 space-y-2">
                    <p className="text-lg text-gray-700">
                      <strong>Cách thực hiện:</strong> {pattern.description}
                    </p>
                    <p className="text-gray-600">
                      <strong>Khi nào dùng:</strong> {pattern.use}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "pacing":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
            </div>

            <div className="space-y-6">
              {pageData.strategies.map((strategy: any, index: number) => (
                <div key={index} className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h3 className="text-2xl font-bold text-emerald-800 mb-3">{strategy.name}</h3>
                  <div className="space-y-2">
                    <p className="text-lg text-gray-700">
                      <strong>Mô tả:</strong> {strategy.description}
                    </p>
                    <p className="text-emerald-700">
                      <strong>Lợi ích:</strong> {strategy.benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
              <p className="text-lg text-emerald-800 text-center font-medium">
                💡 "Chiến lược phân chia tốc độ quyết định 70% thành công của cuộc đua"
              </p>
            </div>
          </div>
        )

      case "race_nutrition":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-rose-500 mx-auto"></div>
            </div>

            <div className="space-y-6">
              {pageData.timeline.map((item: any, index: number) => (
                <div key={index} className="flex gap-6 p-6 bg-rose-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-rose-800 mb-2">{item.time}</h3>
                    <p className="text-lg text-gray-700 mb-2">{item.action}</p>
                    <div className="text-sm text-rose-600 bg-rose-100 px-3 py-1 rounded-full inline-block">
                      {item.examples}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "recovery":
        return (
          <div className="h-full p-8 space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{pageData.title}</h1>
              <div className="w-24 h-1 bg-violet-500 mx-auto"></div>
            </div>

            <div className="space-y-6">
              {pageData.phases.map((phase: any, index: number) => (
                <div key={index} className="p-6 bg-violet-50 rounded-xl border-l-4 border-violet-400">
                  <h3 className="text-xl font-bold text-violet-800 mb-4">{phase.phase}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {phase.activities.map((activity: string, actIndex: number) => (
                      <div key={actIndex} className="flex items-center gap-2 p-3 bg-white rounded-lg">
                        <CheckCircle className="w-5 h-5 text-violet-500" />
                        <span className="text-gray-700">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl text-center">
              <p className="text-xl font-bold text-gray-800 mb-2">
                🏃‍♂️ Phục hồi đúng cách = Nền tảng cho cuộc đua tiếp theo!
              </p>
              <p className="text-lg text-gray-600">Đừng bỏ qua giai đoạn quan trọng này</p>
            </div>
          </div>
        )

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">{pageData.title}</h2>
              <p className="text-gray-600">Nội dung đang được cập nhật...</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-7xl h-[90vh] p-0 gap-0", isFullscreen && "max-w-full h-screen")}>
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {/* Header Toolbar */}
          <div className="flex items-center justify-between p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg truncate max-w-md">{title}</h2>
              </div>
              <Badge variant="outline" className="ml-2">
                PDF
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleBookmark}
                className={isBookmarked ? "text-yellow-500" : ""}
              >
                <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col">
              {/* Sidebar Tabs */}
              <div className="flex border-b">
                <Button
                  variant={showThumbnails ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowThumbnails(true)}
                  className="flex-1 rounded-none"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Trang
                </Button>
                <Button
                  variant={!showThumbnails ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowThumbnails(false)}
                  className="flex-1 rounded-none"
                >
                  <List className="w-4 h-4 mr-2" />
                  Ghi chú
                </Button>
              </div>

              {showThumbnails ? (
                <div className="flex-1 p-4">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm trong tài liệu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <ScrollArea className="h-full">
                    <div className="space-y-3">
                      {currentContent.map((page) => (
                        <div
                          key={page.id}
                          className={cn(
                            "relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md p-3",
                            currentPage === page.id ? "border-primary shadow-lg bg-primary/5" : "border-border",
                          )}
                          onClick={() => handleGoToPage(page.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-primary font-bold text-sm">{page.id}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-2">{page.title}</h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex-1 p-4">
                  <div className="space-y-4">
                    <Button onClick={() => setShowNotes(!showNotes)} className="w-full" variant="outline">
                      Thêm ghi chú trang {currentPage}
                    </Button>

                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {notes.map((note, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary">Trang {note.page}</Badge>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{note.note}</p>
                          </Card>
                        ))}
                        {notes.length === 0 && (
                          <div className="text-center text-muted-foreground py-8">
                            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Chưa có ghi chú nào</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Control Bar */}
              <div className="flex items-center justify-between p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                    <span className="text-sm font-medium">{currentPage}</span>
                    <span className="text-sm text-muted-foreground">/ {totalPages}</span>
                  </div>

                  <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Separator orientation="vertical" className="h-6 mx-2" />

                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)}>
                    <SkipBack className="w-4 h-4" />
                  </Button>

                  <Button variant="outline" size="icon" onClick={togglePlayback}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>

                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)}>
                    <SkipForward className="w-4 h-4" />
                  </Button>

                  {isPlaying && (
                    <Select value={playSpeed.toString()} onValueChange={(value) => setPlaySpeed(Number(value))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5x</SelectItem>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="1.5">1.5x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>

                  <div className="w-24 px-2">
                    <Slider
                      value={[zoom]}
                      onValueChange={(value) => setZoom(value[0])}
                      min={50}
                      max={300}
                      step={25}
                      className="w-full"
                    />
                  </div>

                  <span className="text-sm font-medium w-12 text-center">{zoom}%</span>

                  <Button variant="outline" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>

                  <Separator orientation="vertical" className="h-6 mx-2" />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsPresentationMode(true)}
                    title="Chế độ trình chiếu"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>

                  <Separator orientation="vertical" className="h-6 mx-2" />

                  <Button variant="outline" size="icon" onClick={handleRotate}>
                    <RotateCw className="w-4 h-4" />
                  </Button>

                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Đơn trang</SelectItem>
                      <SelectItem value="double">Đôi trang</SelectItem>
                      <SelectItem value="grid">Lưới</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PDF Content */}
              <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8">
                <div className="flex justify-center">
                  <div
                    className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: "center",
                    }}
                  >
                    <div className="aspect-[4/3] w-[800px] bg-gradient-to-br from-white to-gray-50 relative">
                      {renderPageContent(getCurrentPageContent())}

                      {/* Page indicator */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">
                          {currentPage}/{totalPages}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Presentation Mode */}
              {isPresentationMode && (
                <div className="fixed inset-0 z-[100] bg-black">
                  {/* Presentation Header */}
                  <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <div className="text-white font-bold text-sm">VSM</div>
                        </div>
                        <span className="font-semibold">{title}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>
                          {Math.floor(presentationTimer / 60)}:{(presentationTimer % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="text-white hover:bg-white/20"
                      >
                        {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPresentationTimer(0)
                          setIsTimerRunning(false)
                        }}
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 bg-white/20" />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPresentationMode(false)}
                        className="text-white hover:bg-white/20"
                      >
                        <X className="w-4 h-4" />
                        Thoát
                      </Button>
                    </div>
                  </div>

                  {/* Presentation Content */}
                  <div
                    className="h-full flex items-center justify-center p-16 pt-20"
                    onMouseMove={(e) => {
                      setLaserPointer({
                        x: e.clientX,
                        y: e.clientY,
                        visible: true,
                      })
                    }}
                    onMouseLeave={() => setLaserPointer((prev) => ({ ...prev, visible: false }))}
                  >
                    <div
                      className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-7xl max-h-full"
                      style={{
                        transform: `scale(${Math.min(1, (window.innerWidth - 200) / 1000, (window.innerHeight - 200) / 750)})`,
                        transformOrigin: "center",
                      }}
                    >
                      <div className="aspect-[4/3] w-[1000px] bg-gradient-to-br from-white to-gray-50 relative">
                        {renderPageContent(getCurrentPageContent())}
                      </div>
                    </div>
                  </div>

                  {/* Laser Pointer */}
                  {laserPointer.visible && (
                    <div
                      className="fixed pointer-events-none z-20"
                      style={{
                        left: laserPointer.x - 8,
                        top: laserPointer.y - 8,
                      }}
                    >
                      <div className="w-4 h-4 bg-red-500 rounded-full opacity-80 animate-pulse shadow-lg shadow-red-500/50"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
                    </div>
                  )}

                  {/* Presentation Controls */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="text-white hover:bg-white/20 rounded-full"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>

                      <div className="text-white text-sm font-medium px-4">
                        {currentPage} / {totalPages}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="text-white hover:bg-white/20 rounded-full"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 bg-white/20 mx-2" />

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayback}
                        className="text-white hover:bg-white/20 rounded-full"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Keyboard Shortcuts Help */}
                  <div className="absolute bottom-6 right-6 z-10">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-1">
                      <div>
                        <kbd className="bg-white/20 px-1 rounded">←→</kbd> Chuyển trang
                      </div>
                      <div>
                        <kbd className="bg-white/20 px-1 rounded">Space</kbd> Phát/Dừng
                      </div>
                      <div>
                        <kbd className="bg-white/20 px-1 rounded">Esc</kbd> Thoát
                      </div>
                      <div>
                        <kbd className="bg-white/20 px-1 rounded">F</kbd> Toàn màn hình
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="p-4 border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Tiến độ:</span>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentPage / totalPages) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{Math.round((currentPage / totalPages) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
