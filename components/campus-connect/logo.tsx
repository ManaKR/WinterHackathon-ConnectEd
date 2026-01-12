import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <GraduationCap className="h-8 w-8 text-primary" />
      <h1 className="text-3xl font-bold font-headline text-foreground">
        CampusConnect
      </h1>
    </div>
  );
}
