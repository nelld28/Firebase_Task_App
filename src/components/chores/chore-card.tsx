
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ElementIcon from '@/components/icons/element-icon';
import type { Chore, ElementType } from '@/lib/types';
import { CalendarDays, Edit2, Trash2, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChoreCardProps {
  chore: Chore;
  onToggleComplete: (choreId: string, isCompleted: boolean) => void;
  onEdit: (choreId: string) => void;
  onDelete: (choreId: string) => void;
}

const ChoreCard: React.FC<ChoreCardProps> = ({ chore, onToggleComplete, onEdit, onDelete }) => {
  const dueDate = chore.dueDate instanceof Date ? chore.dueDate : new Date(chore.dueDate);
  const isOverdue = !chore.isCompleted && dueDate < new Date(new Date().setHours(0,0,0,0));

  // Elemental icon colors are preserved as per mockup
  const getElementIconColorClass = (el: ElementType) => {
    switch (el) {
      case 'air': return 'text-air-secondary-orange'; 
      case 'water': return 'text-water-primary'; 
      case 'earth': return 'text-earth-primary'; 
      case 'fire': return 'text-fire-primary'; 
      default: return 'text-primary'; 
    }
  };
  
  const assigneeName = chore.assigneeName || "N/A";
  const assigneeAvatar = chore.assigneeAvatarUrl || 'https://placehold.co/24x24.png';

  return (
    <Card className={cn(
      `shadow-md transition-all duration-300 ease-in-out`,
      `bg-card-item text-card-item-foreground border-border`, // Uses new very light cream and brown border
      chore.isCompleted ? 'opacity-70' : '', // No specific background change for completed, just opacity
      isOverdue ? 'border-destructive ring-2 ring-destructive' : 'border-border' // Keeps destructive border for overdue
    )}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={cn(
              `font-headline text-xl text-foreground`, // Main text color
              chore.isCompleted ? 'line-through text-muted-foreground' : ''
            )}>
              {chore.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">{chore.description}</CardDescription>
          </div>
          <ElementIcon element={chore.elementType} className={`h-7 w-7 ${getElementIconColorClass(chore.elementType)}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> Due Date:
          </span>
          <span className={isOverdue ? 'font-semibold text-destructive' : 'text-foreground'}>
            {format(dueDate, "PPP")}
            {isOverdue && <Badge variant="destructive" className="ml-2">Overdue</Badge>}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground flex items-center gap-1.5">
            <UserCircle className="h-4 w-4" /> Assigned To:
          </span>
          <div className="flex items-center gap-2">
            <Image
              src={assigneeAvatar}
              alt={assigneeName}
              width={24}
              height={24}
              className="rounded-full"
              data-ai-hint="person avatar"
            />
            <span className="text-foreground">{assigneeName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id={`complete-${chore.id}`}
            checked={chore.isCompleted}
            onCheckedChange={(checked) => onToggleComplete(chore.id, !!checked)}
            aria-label={`Mark ${chore.name} as ${chore.isCompleted ? 'incomplete' : 'complete'}`}
            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label
            htmlFor={`complete-${chore.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
          >
            {chore.isCompleted ? 'Completed' : 'Mark as Complete'}
          </label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(chore.id)} aria-label={`Edit ${chore.name}`}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(chore.id)} aria-label={`Delete ${chore.name}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChoreCard;
