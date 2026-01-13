import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card } from "../ui/card";

export function CampusMap({ location }: { location: string }) {
  const mapImage = PlaceHolderImages.find(p => p.id === 'campus-map');

  // Simple hashing function to get a consistent position for a location string
  const getLocationPosition = (loc: string) => {
    let hash = 0;
    for (let i = 0; i < loc.length; i++) {
        const char = loc.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const x = (Math.abs(hash) % 80) + 10; // 10% to 90%
    const y = (Math.abs(hash * 31) % 60) + 20; // 20% to 80%
    return { top: `${y}%`, left: `${x}%` };
  };

  const position = getLocationPosition(location);

  return (
    <Card className="overflow-hidden">
      <div className="relative w-full aspect-[16/9]">
        {mapImage && (
          <Image
            src={mapImage.imageUrl}
            alt="Campus Map"
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint={mapImage.imageHint}
          />
        )}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{ top: position.top, left: position.left }}
          title={location}
        >
          <MapPin className="h-10 w-10 text-destructive drop-shadow-lg" fill="currentColor" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block h-2 w-2 rounded-full bg-destructive-foreground/70"></span>
        </div>
      </div>
    </Card>
  );
}
