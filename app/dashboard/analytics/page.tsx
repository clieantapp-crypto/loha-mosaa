import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { BarChart3, Users, Bell, Smartphone, TrendingUp, Eye } from "lucide-react"

async function getAnalytics() {
  const supabase = await createClient()

  const [usersResult, notificationsResult, devicesResult, readNotifications] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("notifications").select("*", { count: "exact", head: true }),
      supabase.from("devices").select("*", { count: "exact", head: true }),
      supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", true),
    ])

  const totalNotifications = notificationsResult.count || 0
  const readCount = readNotifications.count || 0
  const readRate = totalNotifications > 0 ? Math.round((readCount / totalNotifications) * 100) : 0

  return {
    users: usersResult.count || 0,
    notifications: totalNotifications,
    devices: devicesResult.count || 0,
    readRate,
    readCount,
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">الإحصائيات</h1>
        <p className="text-muted-foreground mt-1">
          تحليلات ومقاييس الأداء
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي المستخدمين"
          value={analytics.users}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="الإشعارات المرسلة"
          value={analytics.notifications}
          icon={Bell}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="الأجهزة المسجلة"
          value={analytics.devices}
          icon={Smartphone}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="معدل القراءة"
          value={`${analytics.readRate}%`}
          icon={Eye}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              إحصائيات الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">إجمالي الإشعارات</p>
                    <p className="text-sm text-muted-foreground">
                      جميع الإشعارات المرسلة
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{analytics.notifications}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">الإشعارات المقروءة</p>
                    <p className="text-sm text-muted-foreground">
                      تم فتحها من قبل المستخدمين
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{analytics.readCount}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">معدل التفاعل</p>
                    <p className="text-sm text-muted-foreground">
                      نسبة الإشعارات المقروءة
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{analytics.readRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              إحصائيات المستخدمين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">إجمالي المستخدمين</p>
                    <p className="text-sm text-muted-foreground">
                      جميع المستخدمين المسجلين
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{analytics.users}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">الأجهزة النشطة</p>
                    <p className="text-sm text-muted-foreground">
                      أجهزة مسجلة للإشعارات
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{analytics.devices}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">متوسط الأجهزة</p>
                    <p className="text-sm text-muted-foreground">
                      عدد الأجهزة لكل مستخدم
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold">
                  {analytics.users > 0
                    ? (analytics.devices / analytics.users).toFixed(1)
                    : "0"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
