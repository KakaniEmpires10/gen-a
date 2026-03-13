import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7 [&>svg]:text-current",
  {
    variants: {
      variant: {
        // Solid variants (default style with filled background)
        default:
          "bg-primary text-primary-foreground border-primary/20 [&>svg]:text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary/20 [&>svg]:text-secondary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive/20 [&>svg]:text-destructive-foreground",
        success:
          "bg-success text-success-foreground border-success/20 [&>svg]:text-success-foreground",
        warning:
          "bg-warning text-warning-foreground border-warning/20 [&>svg]:text-warning-foreground",
        info:
          "bg-info text-info-foreground border-info/20 [&>svg]:text-info-foreground",
        indigo:
          "bg-indigo text-indigo-foreground border-indigo/20 [&>svg]:text-indigo-foreground",
        muted:
          "bg-muted text-muted-foreground border-muted/20 [&>svg]:text-muted-foreground",

        // Outline variants (border with transparent background)
        outline:
          "border border-input bg-background text-foreground [&>svg]:text-foreground",
        "outline-primary":
          "border border-primary bg-background text-primary [&>svg]:text-primary",
        "outline-secondary":
          "border border-secondary bg-background text-secondary [&>svg]:text-secondary",
        "outline-destructive":
          "border border-destructive bg-background text-destructive [&>svg]:text-destructive",
        "outline-success":
          "border border-success bg-background text-success [&>svg]:text-success",
        "outline-warning":
          "border border-warning bg-background text-warning [&>svg]:text-warning",
        "outline-info":
          "border border-info bg-background text-info [&>svg]:text-info",
        "outline-indigo":
          "border border-indigo bg-background text-indigo [&>svg]:text-indigo",

        // Soft variants (subtle background with light border)
        "soft-primary":
          "border border-primary/20 bg-primary/10 text-primary [&>svg]:text-primary",
        "soft-secondary":
          "border border-secondary/20 bg-secondary/10 text-secondary [&>svg]:text-secondary",
        "soft-destructive":
          "border border-destructive/20 bg-destructive/10 text-destructive [&>svg]:text-destructive",
        "soft-success":
          "border border-success/20 bg-success/10 text-success [&>svg]:text-success",
        "soft-warning":
          "border border-warning/20 bg-warning/10 text-warning [&>svg]:text-warning",
        "soft-info":
          "border border-info/20 bg-info/10 text-info [&>svg]:text-info",
        "soft-indigo":
          "border border-indigo/20 bg-indigo/10 text-indigo [&>svg]:text-indigo",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }