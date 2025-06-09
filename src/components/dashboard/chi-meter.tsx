
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ElementIcon, { type ElementType } from "@/components/icons/element-icon";
import { cn } from "@/lib/utils";

interface ChiMeterProps {
  currentChi: number;
  maxChi?: number; // e.g., weekly goal or level cap
  element: ElementType;
  userName: string;
}

const ChiMeter: React.FC<ChiMeterProps> = ({ currentChi, maxChi = 2000, element, userName }) => {
  const progressPercentage = maxChi > 0 ? (currentChi / maxChi) * 100 : 0;

  const getElementColorClass = (el: ElementType) => {
    switch (el) {
      case 'air': return 'bg-air-secondary-orange'; 
      case 'water': return 'bg-water-primary'; 
      case 'earth': return 'bg-earth-primary'; 
      case 'fire': return 'bg-fire-primary'; 
      default: return 'bg-primary'; // Fallback to new primary (brown)
    }
  };
  
  const getElementTextColorClass = (el: ElementType) => {
    switch (el) {
      case 'air': return 'text-air-secondary-orange';
      case 'water': return 'text-water-primary';
      case 'earth': return 'text-earth-primary';
      case 'fire': return 'text-fire-primary';
      default: return 'text-primary'; // Fallback to new primary (brown)
    }
  };

  return (
    <Card className={cn(
      "w-full",
      "bg-card-item text-card-item-foreground" 
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base sm:text-lg font-medium font-headline text-foreground">
          {userName}'s Chi
        </CardTitle>
        <ElementIcon element={element} className={`h-5 w-5 sm:h-6 sm:w-6 ${getElementTextColorClass(element)}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl sm:text-4xl font-bold font-headline ${getElementTextColorClass(element)}`}>{currentChi} <span className="text-xs sm:text-sm font-body text-muted-foreground">XP</span></div>
        <p className="text-xs sm:text-sm text-muted-foreground pt-1">
          {progressPercentage.toFixed(0)}% towards weekly goal ({maxChi} XP)
        </p>
        <Progress value={progressPercentage} className="w-full mt-4" indicatorClassName={getElementColorClass(element)} />
        <CardDescription className="mt-2 text-xs sm:text-sm text-muted-foreground">
          Keep up the great work, {userName}! Your elemental energy is flowing.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ChiMeter;
