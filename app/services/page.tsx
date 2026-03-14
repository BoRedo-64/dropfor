import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Truck, 
  BarChart3, 
  Store, 
  RefreshCcw, 
  Headphones, 
  ArrowRight,
  Check
} from "lucide-react"

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our comprehensive dropshipping services including product sourcing, fulfillment, and more.",
}

const services = [
  {
    icon: Package,
    title: "Product Sourcing",
    description: "Access millions of products from verified suppliers worldwide. We help you find trending and profitable products for your store.",
    features: ["Verified suppliers", "Quality inspection", "Competitive pricing", "Product samples"],
  },
  {
    icon: Truck,
    title: "Order Fulfillment",
    description: "Automated order processing and shipping. We handle everything from picking to packing to delivery.",
    features: ["Same-day processing", "Global shipping", "Tracking updates", "Branded packaging"],
  },
  {
    icon: Store,
    title: "Store Integration",
    description: "Seamlessly connect your online store with our platform. We support all major e-commerce platforms.",
    features: ["Shopify integration", "WooCommerce support", "API access", "Inventory sync"],
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Get detailed insights into your business performance with our comprehensive analytics dashboard.",
    features: ["Sales reports", "Profit tracking", "Trend analysis", "Custom exports"],
  },
  {
    icon: RefreshCcw,
    title: "Returns Management",
    description: "Hassle-free returns handling. We manage the entire returns process on your behalf.",
    features: ["Easy returns portal", "Quality checks", "Fast refunds", "Exchange options"],
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Our expert team is available around the clock to help you succeed in your dropshipping journey.",
    features: ["24/7 availability", "Account manager", "Priority support", "Training resources"],
  },
]

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for new sellers just getting started",
    features: [
      "Up to 100 orders/month",
      "Basic product catalog",
      "Standard shipping",
      "Email support",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing businesses scaling up",
    features: [
      "Up to 1,000 orders/month",
      "Full product catalog",
      "Express shipping options",
      "Priority support",
      "Advanced analytics",
      "Branded packaging",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For high-volume sellers",
    features: [
      "Unlimited orders",
      "Custom product sourcing",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "White-label solutions",
    ],
    popular: false,
  },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Our Services
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 text-balance">
              Comprehensive Dropshipping Solutions
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From product sourcing to order fulfillment, we provide everything you need 
              to run a successful e-commerce business without the hassle of inventory management.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that best fits your business needs. All plans include 
              access to our core features and dedicated support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? "border-primary shadow-lg" : "border-border/50"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/auth/sign-up">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our enterprise team can create a tailored solution for your specific 
              business requirements. Get in touch to discuss your needs.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Contact Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
