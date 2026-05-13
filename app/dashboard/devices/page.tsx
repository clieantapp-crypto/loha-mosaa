import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Monitor, Tablet } from "lucide-react"

async function getDevices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("devices")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching devices:", error)
    return []
  }
  
  return data || []
}

export default async function DevicesPage() {
  const devices = await getDevices()

  const getDeviceIcon = (platform: string | null) => {
    switch (platform?.toLowerCase()) {
      case "ios":
      case "android":
        return Smartphone
      case "tablet":
        return Tablet
      default:
        return Monitor
    }
  }

  const getPlatformLabel = (platform: string | null) => {
    switch (platform?.toLowerCase()) {
      case "ios":
        return "iOS"
      case "android":
        return "Android"
      case "web":
        return "ويب"
      default:
        return platform || "غير معروف"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">الأجهزة</h1>
        <p className="text-muted-foreground mt-1">
          عرض جميع الأجهزة المسجلة للإشعارات
        </p>
      </div>

      {/* Devices grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.length > 0 ? (
          devices.map((device: {
            id: string
            device_name: string | null
            platform: string | null
            fcm_token: string
            created_at: string
            updated_at: string
            profiles: { full_name: string | null } | null
          }) => {
            const Icon = getDeviceIcon(device.platform)
            return (
              <Card key={device.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline">
                      {getPlatformLabel(device.platform)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1">
                    {device.device_name || "جهاز غير مسمى"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    المستخدم: {device.profiles?.full_name || "غير معروف"}
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      تاريخ التسجيل:{" "}
                      {new Date(device.created_at).toLocaleDateString("ar-SA")}
                    </p>
                    <p>
                      آخر تحديث:{" "}
                      {new Date(device.updated_at).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="col-span-full">
            <CardContent className="text-center py-12 text-muted-foreground">
              <Smartphone className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">لا توجد أجهزة مسجلة</p>
              <p className="text-sm">
                ستظهر الأجهزة هنا بعد تسجيل المستخدمين لأجهزتهم
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
