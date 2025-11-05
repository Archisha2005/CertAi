import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "relative flex w-full items-center justify-between space-x-4 rounded-md border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-black",
        success: "bg-green-100 border-green-500 text-green-900",
        destructive: "bg-red-100 border-red-500 text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof toastVariants> {
  toastTitle?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, toastTitle, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex flex-col">
          {toastTitle && <div className="font-semibold">{toastTitle}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        {action}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="fixed bottom-4 right-4 z-50 space-y-2">{children}</div>
}

export const ToastViewport = () => null
export const ToastClose = () => null
export const ToastTitle = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const ToastDescription = ({ children }: { children: React.ReactNode }) => <>{children}</>

export { Toast }
