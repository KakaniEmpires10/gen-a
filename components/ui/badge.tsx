import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap",
  {
    variants: {
      variant: {
        // Solid variants (default style)
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info:
          "border-transparent bg-info text-info-foreground hover:bg-info/80",
        indigo:
          "border-transparent bg-indigo text-indigo-foreground hover:bg-indigo/80",
        muted:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",

        // Outline variants
        outline: "bg-transparent border-input text-foreground hover:bg-accent",
        "outline-primary": "bg-transparent border-primary text-primary hover:bg-primary/10",
        "outline-secondary": "bg-transparent border-secondary text-secondary hover:bg-secondary/10",
        "outline-destructive": "bg-transparent border-destructive text-destructive hover:bg-destructive/10",
        "outline-success": "bg-transparent border-success text-success hover:bg-success/10",
        "outline-warning": "bg-transparent border-warning text-warning hover:bg-warning/10",
        "outline-info": "bg-transparent border-info text-info hover:bg-info/10",
        "outline-indigo": "bg-transparent border-indigo text-indigo hover:bg-indigo/10",

        // Soft variants (subtle background)
        "soft-primary": "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        "soft-secondary": "border-transparent bg-secondary/10 text-secondary hover:bg-secondary/20",
        "soft-destructive": "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
        "soft-success": "border-transparent bg-success/10 text-success hover:bg-success/20",
        "soft-warning": "border-transparent bg-warning/10 text-warning hover:bg-warning/20",
        "soft-info": "border-transparent bg-info/10 text-info hover:bg-info/20",
        "soft-indigo": "border-transparent bg-indigo/10 text-indigo hover:bg-indigo/20",

        // Text variants (minimal, text color only)
        "text-primary": "bg-transparent border-transparent text-primary hover:bg-primary/5",
        "text-secondary": "bg-transparent border-transparent text-secondary hover:bg-secondary/5",
        "text-destructive": "bg-transparent border-transparent text-destructive hover:bg-destructive/5",
        "text-success": "bg-transparent border-transparent text-success hover:bg-success/5",
        "text-warning": "bg-transparent border-transparent text-warning hover:bg-warning/5",
        "text-info": "bg-transparent border-transparent text-info hover:bg-info/5",
        "text-indigo": "bg-transparent border-transparent text-indigo hover:bg-indigo/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }