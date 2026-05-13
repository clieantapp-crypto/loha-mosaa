"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Smartphone,
  BarChart3,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  { name: "المستخدمين", href: "/dashboard/users", icon: Users },
  { name: "الإشعارات", href: "/dashboard/notifications", icon: Bell },
  { name: "الأجهزة", href: "/dashboard/devices", icon: Smartphone },
  { name: "الإحصائيات", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 h-screen bg-sidebar-background border-l border-sidebar-border transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            {!collapsed && (
              <span className="text-xl font-bold text-sidebar-foreground">
                لوحة التحكم
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronRight
                className={cn(
                  "h-5 w-5 transition-transform",
                  collapsed && "rotate-180"
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors",
                "text-destructive hover:bg-destructive/10"
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>تسجيل الخروج</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
