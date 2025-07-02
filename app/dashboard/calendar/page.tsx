"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, CalendarIcon, Clock, Edit, Trash2, Bell, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentUser, mockCalendarEvents, vietnameseHolidays } from "@/lib/mock-data"
import type { CalendarEvent, User } from "@/lib/types"
import { generateId } from "@/lib/utils"
import { cn } from "@/lib/utils"

const eventColors = [
  { value: "#22c55e", label: "Xanh lá" },
  { value: "#3b82f6", label: "Xanh dương" },
  { value: "#f59e0b", label: "Vàng" },
  { value: "#ef4444", label: "Đỏ" },
  { value: "#8b5cf6", label: "Tím" },
  { value: "#06b6d4", label: "Xanh cyan" },
]

const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
]

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

export default function CalendarPage() {
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "#22c55e",
    start_time: "",
    end_time: "",
    remind_at: "",
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      const userEvents =
        currentUser.role === "admin"
          ? mockCalendarEvents
          : mockCalendarEvents.filter((event) => event.user_id === currentUser.id)
      setEvents(userEvents)
    }
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toDateString()
    return events.filter((event) => new Date(event.start_time).toDateString() === dateStr)
  }

  const getHolidayForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return vietnameseHolidays.find((holiday) => holiday.date === dateStr)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const dateEvents = getEventsForDate(date)
    setSelectedDateEvents(dateEvents)
    setIsEventDialogOpen(true)
  }

  const handleCreateEvent = (date?: Date) => {
    setEditingEvent(null)
    const eventDate = date || selectedDate || new Date()
    const startTime = new Date(eventDate)
    startTime.setHours(9, 0, 0, 0)
    const endTime = new Date(eventDate)
    endTime.setHours(10, 0, 0, 0)

    setFormData({
      title: "",
      description: "",
      color: "#22c55e",
      start_time: startTime.toISOString().slice(0, 16),
      end_time: endTime.toISOString().slice(0, 16),
      remind_at: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || "",
      color: event.color,
      start_time: new Date(event.start_time).toISOString().slice(0, 16),
      end_time: new Date(event.end_time).toISOString().slice(0, 16),
      remind_at: event.remind_at ? new Date(event.remind_at).toISOString().slice(0, 16) : "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const eventData = {
      id: editingEvent?.id || generateId(),
      user_id: user.id,
      title: formData.title,
      description: formData.description,
      color: formData.color,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      remind_at: formData.remind_at ? new Date(formData.remind_at).toISOString() : undefined,
      created_at: editingEvent?.created_at || new Date().toISOString(),
    }

    if (editingEvent) {
      setEvents((prev) => prev.map((event) => (event.id === editingEvent.id ? eventData : event)))
    } else {
      setEvents((prev) => [...prev, eventData])
    }

    setIsDialogOpen(false)

    // Update selected date events if viewing the same date
    if (selectedDate && new Date(eventData.start_time).toDateString() === selectedDate.toDateString()) {
      setSelectedDateEvents((prev) => {
        if (editingEvent) {
          return prev.map((event) => (event.id === editingEvent.id ? eventData : event))
        } else {
          return [...prev, eventData]
        }
      })
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    setSelectedDateEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const days = getDaysInMonth(currentDate)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Lịch của tôi</h1>
            <p className="text-muted-foreground">Quản lý lịch trình và sự kiện cá nhân</p>
          </div>
          <Button onClick={() => handleCreateEvent()}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo sự kiện
          </Button>
        </div>

        {/* Calendar Navigation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" onClick={goToToday}>
                Hôm nay
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((date, index) => {
                if (!date) {
                  return <div key={index} className="p-2 h-24" />
                }

                const dayEvents = getEventsForDate(date)
                const holiday = getHolidayForDate(date)
                const isCurrentDay = isToday(date)
                const isSelectedDay = isSelected(date)

                return (
                  <div
                    key={date.toISOString()}
                    className={cn(
                      "p-2 h-24 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors",
                      isCurrentDay && "bg-primary/10 border-primary",
                      isSelectedDay && "bg-accent border-accent-foreground",
                      holiday && "bg-red-50 dark:bg-red-950/20",
                    )}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isCurrentDay && "text-primary font-bold",
                          holiday && "text-red-600 dark:text-red-400",
                        )}
                      >
                        {date.getDate()}
                      </span>
                      {holiday && <Star className="w-3 h-3 text-red-500" />}
                    </div>

                    {holiday && (
                      <div className="text-xs text-red-600 dark:text-red-400 mb-1 truncate">{holiday.name}</div>
                    )}

                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded truncate text-white"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} khác</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Event Creation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Cập nhật thông tin sự kiện" : "Thêm sự kiện mới vào lịch của bạn"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Nhập tiêu đề sự kiện..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về sự kiện..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Màu sắc</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Thời gian bắt đầu *</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">Thời gian kết thúc *</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remind_at">Nhắc nhở trước (tùy chọn)</Label>
                <Input
                  id="remind_at"
                  type="datetime-local"
                  value={formData.remind_at}
                  onChange={(e) => setFormData((prev) => ({ ...prev, remind_at: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">{editingEvent ? "Cập nhật" : "Tạo sự kiện"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Selected Date Events Dialog */}
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Sự kiện ngày {selectedDate?.toLocaleDateString("vi-VN")}</DialogTitle>
              <DialogDescription>
                {selectedDateEvents.length > 0
                  ? `${selectedDateEvents.length} sự kiện trong ngày này`
                  : "Chưa có sự kiện nào trong ngày này"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Holiday info */}
              {selectedDate && getHolidayForDate(selectedDate) && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-red-700 dark:text-red-300">
                      {getHolidayForDate(selectedDate)?.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Events list */}
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-3">
                  {selectedDateEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: event.color }}
                          />
                          <h4 className="font-medium">{event.title}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(event.start_time).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(event.end_time).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {event.remind_at && (
                          <div className="flex items-center gap-1">
                            <Bell className="w-3 h-3" />
                            <span>Có nhắc nhở</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {selectedDateEvents.length > 5 && (
                    <div className="text-center text-sm text-muted-foreground">
                      Và {selectedDateEvents.length - 5} sự kiện khác...
                    </div>
                  )}
                </div>
              </ScrollArea>

              {selectedDateEvents.length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Chưa có sự kiện</h3>
                  <p className="text-sm text-muted-foreground mb-4">Tạo sự kiện mới cho ngày này</p>
                  <Button
                    onClick={() => {
                      setIsEventDialogOpen(false)
                      handleCreateEvent(selectedDate!)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo sự kiện
                  </Button>
                </div>
              )}

              {selectedDateEvents.length > 0 && (
                <div className="flex justify-center pt-4 border-t">
                  <Button
                    onClick={() => {
                      setIsEventDialogOpen(false)
                      handleCreateEvent(selectedDate!)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm sự kiện mới
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
