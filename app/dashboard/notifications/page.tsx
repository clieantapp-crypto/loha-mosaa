"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, Plus, Send, Search, Check, X } from "lucide-react"
import { Label } from "@/components/ui/label"

interface Notification {
  id: string
  title: string
  body: string | null
  type: string
  is_read: boolean
  created_at: string
  user_id: string | null
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    type: "general",
  })

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setNotifications(data)
    }
    setLoading(false)
  }

  const sendNotification = async () => {
    if (!formData.title.trim()) return

    setSending(true)
    const supabase = createClient()
    
    const { error } = await supabase.from("notifications").insert({
      title: formData.title,
      body: formData.body || null,
      type: formData.type,
    })

    if (!error) {
      setFormData({ title: "", body: "", type: "general" })
      setDialogOpen(false)
      fetchNotifications()
    }
    setSending(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 text-green-500"
      case "warning":
        return "bg-yellow-500/10 text-yellow-500"
      case "error":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "success":
        return "نجاح"
      case "warning":
        return "تحذير"
      case "error":
        return "خطأ"
      default:
        return "عام"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">الإشعارات</h1>
          <p className="text-muted-foreground mt-1">
            إدارة وإرسال الإشعارات للمستخدمين
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إرسال إشعار
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إرسال إشعار جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>عنوان الإشعار</Label>
                <Input
                  placeholder="أدخل عنوان الإشعار"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>محتوى الإشعار</Label>
                <Textarea
                  placeholder="أدخل محتوى الإشعار"
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>نوع الإشعار</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">عام</SelectItem>
                    <SelectItem value="success">نجاح</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                    <SelectItem value="error">خطأ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={sendNotification}
                disabled={!formData.title.trim() || sending}
                className="w-full gap-2"
              >
                <Send className="h-4 w-4" />
                {sending ? "جاري الإرسال..." : "إرسال الإشعار"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="بحث في الإشعارات..." className="pr-10" />
      </div>

      {/* Notifications list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            سجل الإشعارات ({notifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground mt-4">جاري التحميل...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(
                      notification.type
                    )}`}
                  >
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{notification.title}</h3>
                      <Badge variant="outline" className={getTypeColor(notification.type)}>
                        {getTypeLabel(notification.type)}
                      </Badge>
                    </div>
                    {notification.body && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.body}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {new Date(notification.created_at).toLocaleDateString("ar-SA")}
                      </span>
                      <span className="flex items-center gap-1">
                        {notification.is_read ? (
                          <>
                            <Check className="h-3 w-3 text-green-500" />
                            تم القراءة
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 text-muted-foreground" />
                            غير مقروء
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">لا توجد إشعارات</p>
              <p className="text-sm">اضغط على &quot;إرسال إشعار&quot; لإنشاء إشعار جديد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
