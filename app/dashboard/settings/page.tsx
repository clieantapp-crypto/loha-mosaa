"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Bell, Shield, Save, Loader2 } from "lucide-react"

interface Profile {
  id: string
  full_name: string | null
}

interface SettingsData {
  notifications_enabled: boolean
  sound_enabled: boolean
  vibration_enabled: boolean
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [settings, setSettings] = useState<SettingsData>({
    notifications_enabled: true,
    sound_enabled: true,
    vibration_enabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [profileResult, settingsResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("settings").select("*").eq("user_id", user.id).single(),
      ])

      if (profileResult.data) {
        setProfile(profileResult.data)
      }
      if (settingsResult.data) {
        setSettings({
          notifications_enabled: settingsResult.data.notifications_enabled,
          sound_enabled: settingsResult.data.sound_enabled,
          vibration_enabled: settingsResult.data.vibration_enabled,
        })
      }
    }
    setLoading(false)
  }

  const saveProfile = async () => {
    if (!profile) return

    setSaving(true)
    const supabase = createClient()
    
    await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    setSaving(false)
  }

  const updateSettings = async (key: keyof SettingsData, value: boolean) => {
    if (!profile) return

    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    const supabase = createClient()
    await supabase
      .from("settings")
      .update({
        [key]: value,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", profile.id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground mt-1">
          إدارة حسابك وتفضيلاتك
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              الملف الشخصي
            </CardTitle>
            <CardDescription>
              قم بتحديث معلومات حسابك الشخصية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                placeholder="أدخل اسمك"
                value={profile?.full_name || ""}
                onChange={(e) =>
                  setProfile(profile ? { ...profile, full_name: e.target.value } : null)
                }
              />
            </div>
            <Button onClick={saveProfile} disabled={saving} className="gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* Notification settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              إعدادات الإشعارات
            </CardTitle>
            <CardDescription>
              تحكم في كيفية استلام الإشعارات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>تفعيل الإشعارات</Label>
                <p className="text-sm text-muted-foreground">
                  استلام الإشعارات على جهازك
                </p>
              </div>
              <Switch
                checked={settings.notifications_enabled}
                onCheckedChange={(checked) =>
                  updateSettings("notifications_enabled", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>صوت الإشعارات</Label>
                <p className="text-sm text-muted-foreground">
                  تشغيل صوت عند استلام إشعار
                </p>
              </div>
              <Switch
                checked={settings.sound_enabled}
                onCheckedChange={(checked) =>
                  updateSettings("sound_enabled", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>الاهتزاز</Label>
                <p className="text-sm text-muted-foreground">
                  اهتزاز الجهاز عند استلام إشعار
                </p>
              </div>
              <Switch
                checked={settings.vibration_enabled}
                onCheckedChange={(checked) =>
                  updateSettings("vibration_enabled", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              الأمان
            </CardTitle>
            <CardDescription>
              إعدادات الأمان وكلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">تغيير كلمة المرور</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
