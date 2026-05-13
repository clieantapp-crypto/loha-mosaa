import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="h-16 w-16 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl">تحقق من بريدك الإلكتروني</CardTitle>
          <CardDescription>
            تم إرسال رابط التأكيد إلى بريدك الإلكتروني
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            يرجى الضغط على الرابط المرسل إلى بريدك الإلكتروني لتأكيد حسابك.
            قد يستغرق وصول الرسالة بضع دقائق.
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
