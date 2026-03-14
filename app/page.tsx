import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, Shield, Zap, Globe, Clock, ArrowRight, CheckCircle } from "lucide-react"
import { ParticlesBackground } from "@/components/particles-background"

const features = [
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Global delivery network ensures your products reach customers quickly and reliably.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Every product goes through rigorous quality checks before shipping.",
  },
  {
    icon: Zap,
    title: "Easy Integration",
    description: "Seamlessly connect with your existing e-commerce platforms and tools.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access products from suppliers worldwide and sell to customers everywhere.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our dedicated team is always ready to help you succeed.",
  },
  {
    icon: Package,
    title: "No Inventory",
    description: "Sell products without worrying about storage or upfront costs.",
  },
]

const stats = [
  { value: "10K+", label: "Active Sellers" },
  { value: "50M+", label: "Products Shipped" },
  { value: "150+", label: "Countries Served" },
  { value: "99.9%", label: "Uptime" },
]

const benefits = [
  "No upfront inventory costs",
  "Automated order fulfillment",
  "Real-time inventory sync",
  "Branded packaging options",
  "Returns management",
  "Analytics dashboard",
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        <ParticlesBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Trusted by 10,000+ e-commerce businesses
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
              Scale Your E-Commerce Business with{" "}
              <span className="text-primary">Dropshipping</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
              DropShip Pro connects you with reliable suppliers worldwide. Start selling without 
              inventory hassles and focus on growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive dropshipping platform provides all the tools and support 
              you need to build a successful e-commerce business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose DropShip Pro?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We handle the logistics so you can focus on what matters most - 
                building your brand and connecting with customers.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background rounded-2xl p-8 border">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Order Received</div>
                    <div className="text-sm text-muted-foreground">Customer places order on your store</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Auto-Processed</div>
                    <div className="text-sm text-muted-foreground">Order sent to supplier instantly</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Shipped Direct</div>
                    <div className="text-sm text-muted-foreground">Product delivered to your customer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Dropshipping Journey?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of successful sellers who trust DropShip Pro for their 
              e-commerce fulfillment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/sign-up">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
