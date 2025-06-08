
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ElementIcon from '@/components/icons/element-icon';
import type { Chore, ElementType } from '@/lib/types'; // Updated import
import { CalendarDays, Edit2, Trash2, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

interface ChoreCardProps {
  chore: Chore;
  // assignee is now part of the chore object if denormalized, or fetched separately
  onToggleComplete: (choreId: string, isCompleted: boolean) => void;
  onEdit: (choreId: string) => void;
  onDelete: (choreId: string) => void;
}

const ChoreCard: React.FC<ChoreCardProps> = ({ chore, onToggleComplete, onEdit, onDelete }) => {
  const dueDate = chore.dueDate instanceof Date ? chore.dueDate : new Date(chore.dueDate);
  const isOverdue = !chore.isCompleted && dueDate < new Date(new Date().setHours(0,0,0,0)); // Compare date part only

  const getElementTextColorClass = (el: ElementType, isCompleted: boolean) => {
    if (isCompleted) return 'text-muted-foreground';
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
    <Card className={`shadow-md transition-all duration-300 ease-in-out ${chore.isCompleted ? 'bg-muted/30 opacity-70' : 'bg-card'} ${isOverdue ? 'border-destructive' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={`font-headline text-xl ${chore.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
              {chore.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm">{chore.description}</CardDescription>
          </div>
          <ElementIcon element={chore.elementType} className={`h-7 w-7 ${getElementTextColorClass(chore.elementType, chore.isCompleted)}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> Due Date:
          </span>
          <span className={isOverdue ? 'font-semibold text-destructive' : ''}>
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
            <span>{assigneeName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id={`complete-${chore.id}`}
            checked={chore.isCompleted}
            onCheckedChange={(checked) => onToggleComplete(chore.id, !!checked)}
            aria-label={`Mark ${chore.name} as ${chore.isCompleted ? 'incomplete' : 'complete'}`}
          />
          <label
            htmlFor={`complete-${chore.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
