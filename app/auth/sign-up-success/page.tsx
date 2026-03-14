import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Mail, CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Dropfor</span>
          </Link>
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We sent you a confirmation link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click the link in your email to verify your account and get started.
            </p>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/login">Back to Sign In</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              {"Didn't receive the email? Check your spam folder or "}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                try again
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
