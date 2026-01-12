<<<<<<< HEAD
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
=======
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
>>>>>>> 78fcf8925a247c48bd9b6c1719ee02777b69fc44

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
