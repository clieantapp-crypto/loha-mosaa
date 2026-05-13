import { createClient } from "@/lib/supabase/server"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Bell, Smartphone, TrendingUp, Activity, Clock } from "lucide-react"

async function getStats() {
  const supabase = await createClient()
  
  const [usersResult, notificationsResult, devicesResult] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("notifications").select("*", { count: "exact", head: true }),
    supabase.from("devices").select("*", { count: "exact", head: true }),
  ])

  return {
    users: usersResult.count || 0,
    notifications: notificationsResult.count || 0,
    devices: devicesResult.count || 0,
  }
}

async function getRecentNotifications() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("notifications")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(5)
  
  return data || []
}

async function getRecentUsers() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)
  
  return data || []
}

export default async function DashboardPage() {
  const stats = await getStats()
  const recentNotifications = await getRecentNotifications()
  const recentUsers = await getRecentUsers()

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold">الرئيسية</h1>
        <p className="text-muted-foreground mt-1">
          مرحباً بك في لوحة التحكم
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي المستخدمين"
          value={stats.users}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          description="منذ الشهر الماضي"
        />
        <StatsCard
          title="الإشعارات المرسلة"
          value={stats.notifications}
          icon={Bell}
          trend={{ value: 8, isPositive: true }}
          description="هذا الأسبوع"
        />
        <StatsCard
          title="الأجهزة المسجلة"
          value={stats.devices}
          icon={Smartphone}
          trend={{ value: 5, isPositive: true }}
          description="أجهزة نشطة"
        />
        <StatsCard
          title="معدل التفاعل"
          value="94%"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          description="نسبة فتح الإشعارات"
        />
      </div>

      {/* Charts and recent data */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              آخر الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notification: {
                  id: string
                  title: string
                  body: string | null
                  created_at: string
                }) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {notification.body}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد إشعارات حتى الآن</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              آخر المستخدمين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length > 0 ? (
                recentUsers.map((user: {
                  id: string
                  full_name: string | null
                  phone: string | null
                  created_at: string
                }) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        {user.full_name || "مستخدم جديد"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.phone || "لا يوجد رقم"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لا يوجد مستخدمين حتى الآن</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
