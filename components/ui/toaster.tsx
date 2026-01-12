<<<<<<< HEAD
"use client"

import { useToast } from "@/hooks/use-toast"
=======
'use client'

import { useToast } from '@/hooks/use-toast'
>>>>>>> 78fcf8925a247c48bd9b6c1719ee02777b69fc44
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
<<<<<<< HEAD
} from "@/components/ui/toast"
=======
} from '@/components/ui/toast'
>>>>>>> 78fcf8925a247c48bd9b6c1719ee02777b69fc44

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
