
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ElementIcon from '@/components/icons/element-icon';
import type { Profile, ElementType } from '@/lib/types';
import { Edit3, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: Profile;
  onEdit: (profileId: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit }) => {

  // Element-specific icon colors are preserved
  const getElementIconColorClass = (element: ElementType) => {
    switch (element) {
      case 'air': return 'text-air-secondary-orange';
      case 'water': return 'text-water-primary';
      case 'earth': return 'text-earth-primary';
      case 'fire': return 'text-fire-primary';
      default: return 'text-primary'; // Fallback to new primary (brown)
    }
  };
  
  const elementIconColor = getElementIconColorClass(profile.element);
  const avatar = profile.avatarUrl || `https://placehold.co/100x100.png?text=${profile.name.substring(0,1)}`;


  return (
    <Card className={cn(
      "shadow-lg flex flex-col",
      "bg-card-item text-card-item-foreground border-border" // Use new very light cream and brown border
    )}>
      <CardHeader className="items-center text-center">
        <Image
          src={avatar}
          alt={`${profile.name}'s avatar`}
          width={100}
          height={100}
          className={`rounded-full border-4 border-primary mb-3`} // Avatar border uses new primary (brown)
          data-ai-hint="person avatar"
        />
        <CardTitle className="font-headline text-2xl text-foreground">{profile.name}</CardTitle>
        <div className={`flex items-center gap-2 ${elementIconColor}`}>
          <ElementIcon element={profile.element} className="h-5 w-5" />
          <CardDescription className={`capitalize text-muted-foreground`}>
             {profile.element} Bender
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center justify-between p-3 bg-card/50 rounded-md"> {/* bg-card/50 is cream/50 */}
          <div className="flex items-center gap-2">
            <Zap className={`h-5 w-5 ${elementIconColor}`} />
            <span className="font-medium text-foreground">Chi Energy</span>
          </div>
          <span className={`font-bold text-lg ${elementIconColor}`}>{profile.chi || 0} XP</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-card/50 rounded-md">
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-5 w-5 text-accent`} /> {/* text-accent is new brown */}
            <span className="font-medium text-foreground">Steps Today</span>
          </div>
          <span className={`font-bold text-lg ${elementIconColor}`}>{(profile.stepsToday || 0).toLocaleString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onEdit(profile.id)}>
          <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
