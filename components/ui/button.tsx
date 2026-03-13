import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [aria-invalid]:ring-destructive/20 dark:[aria-invalid]:ring-destructive/40 [aria-invalid]:border-destructive",
  {
    variants: {
      variant: {
        // Solid variants (default style)
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/90 focus-visible:ring-secondary/20 dark:focus-visible:ring-secondary/40",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        success:
          "bg-success text-success-foreground shadow-xs hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        warning:
          "bg-warning text-warning-foreground shadow-xs hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        info:
          "bg-info text-info-foreground shadow-xs hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        indigo:
          "bg-indigo text-indigo-foreground shadow-xs hover:bg-indigo/90 focus-visible:ring-indigo/20 dark:focus-visible:ring-indigo/40",
        muted:
          "bg-muted text-muted-foreground shadow-xs hover:bg-muted/90 focus-visible:ring-muted/20 dark:focus-visible:ring-muted/40",

        // Outline variants
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-input/20",
        "outline-primary":
          "border border-primary bg-transparent text-primary hover:bg-primary/10 focus-visible:ring-primary/20",
        "outline-secondary":
          "border border-secondary bg-transparent text-secondary hover:bg-secondary/10 focus-visible:ring-secondary/20",
        "outline-destructive":
          "border border-destructive bg-transparent text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20",
        "outline-success":
          "border border-success bg-transparent text-success hover:bg-success/10 focus-visible:ring-success/20",
        "outline-warning":
          "border border-warning bg-transparent text-warning hover:bg-warning/10 focus-visible:ring-warning/20",
        "outline-info":
          "border border-info bg-transparent text-info hover:bg-info/10 focus-visible:ring-info/20",
        "outline-indigo":
          "border border-indigo bg-transparent text-indigo hover:bg-indigo/10 focus-visible:ring-indigo/20",

        // Soft variants (subtle background)
        "soft-primary":
          "border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20",
        "soft-secondary":
          "border border-secondary/20 bg-secondary/10 text-secondary hover:bg-secondary/20 focus-visible:ring-secondary/20",
        "soft-destructive":
          "border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",
        "soft-success":
          "border border-success/20 bg-success/10 text-success hover:bg-success/20 focus-visible:ring-success/20",
        "soft-warning":
          "border border-warning/20 bg-warning/10 text-warning hover:bg-warning/20 focus-visible:ring-warning/20",
        "soft-info":
          "border border-info/20 bg-info/10 text-info hover:bg-info/20 focus-visible:ring-info/20",
        "soft-indigo":
          "border border-indigo/20 bg-indigo/10 text-indigo hover:bg-indigo/20 focus-visible:ring-indigo/20",

        // Ghost variants (minimal, no border)
        ghost:
          "hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent/20",
        "ghost-primary":
          "text-primary hover:bg-primary/10 focus-visible:ring-primary/20",
        "ghost-secondary":
          "text-secondary hover:bg-secondary/10 focus-visible:ring-secondary/20",
        "ghost-destructive":
          "text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20",
        "ghost-success":
          "text-success hover:bg-success/10 focus-visible:ring-success/20",
        "ghost-warning":
          "text-warning hover:bg-warning/10 focus-visible:ring-warning/20",
        "ghost-info":
          "text-info hover:bg-info/10 focus-visible:ring-info/20",
        "ghost-indigo":
          "text-indigo hover:bg-indigo/10 focus-visible:ring-indigo/20",

        // Link variants
        link:
          "text-primary underline-offset-4 hover:underline focus-visible:ring-primary/20",
        "link-secondary":
          "text-secondary underline-offset-4 hover:underline focus-visible:ring-secondary/20",
        "link-destructive":
          "text-destructive underline-offset-4 hover:underline focus-visible:ring-destructive/20",
        "link-success":
          "text-success underline-offset-4 hover:underline focus-visible:ring-success/20",
        "link-warning":
          "text-warning underline-offset-4 hover:underline focus-visible:ring-warning/20",
        "link-info":
          "text-info underline-offset-4 hover:underline focus-visible:ring-info/20",
        "link-indigo":
          "text-indigo underline-offset-4 hover:underline focus-visible:ring-indigo/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 px-2.5 text-[10px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-lg",
        icon: "size-9",
        "icon-xs": "size-6",
        "icon-sm": "size-7",
        "icon-lg": "size-11",
      },
      rounded: {
        default: "rounded-md",
        circle: "rounded-full aspect-square",
        pill: "rounded-full",
        none: "rounded-none",
        sm: "rounded-sm",
        lg: "rounded-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }