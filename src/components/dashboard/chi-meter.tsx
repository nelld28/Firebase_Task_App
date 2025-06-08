'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ElementIcon, { type ElementType } from "@/components/icons/element-icon";

interface ChiMeterProps {
  currentChi: number;
  maxChi?: number; // e.g., weekly goal or level cap
  element: ElementType;
  userName: string;
}

const ChiMeter: React.FC<ChiMeterProps> = ({ currentChi, maxChi = 2000, element, userName }) => {
  const progressPercentage = maxChi > 0 ? (currentChi / maxChi) * 100 : 0;

  // Define colors based on element for the progress bar
  const getElementColorClass = (el: ElementType) => {
    switch (el) {
      case 'air': return 'bg-sky-400'; // Using Tailwind direct color for variety
      case 'water': return 'bg-blue-500';
      case 'earth': return 'bg-emerald-500'; // Earth Kingdom Green related
      case 'fire': return 'bg-red-500'; // Fire Nation Red related
      default: return 'bg-primary';
    }
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium font-headline">
          {userName}'s Chi
        </CardTitle>
        <ElementIcon element={element} className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-headline text-primary">{currentChi} <span className="text-sm font-body text-muted-foreground">XP</span></div>
        <p className="text-xs text-muted-foreground pt-1">
          {progressPercentage.toFixed(0)}% towards weekly goal ({maxChi} XP)
        </p>
        <Progress value={progressPercentage} className="w-full mt-4 h-3" indicatorClassName={getElementColorClass(element)} />
        <CardDescription className="mt-2 text-sm">
          Keep up the great work, {userName}! Your elemental energy is flowing.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ChiMeter;
