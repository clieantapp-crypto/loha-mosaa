import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="h-16 w-16 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">حدث خطأ</CardTitle>
          <CardDescription>
            لم نتمكن من إتمام عملية المصادقة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني إذا استمرت المشكلة.
          </p>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/auth/login">
              <ArrowLeft className="h-4 w-4" />
              العودة لتسجيل الدخول
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
