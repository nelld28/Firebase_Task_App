
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ElementIcon from '@/components/icons/element-icon';
import type { Profile, ElementType } from '@/lib/types'; // Updated import
import { Edit3, TrendingUp, Zap } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  onEdit: (profileId: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit }) => {

  const getElementStyling = (element: ElementType) => {
    switch (element) {
      case 'air':
        return {
          textColor: 'text-air-secondary-orange',
          borderColor: 'border-air-secondary-orange',
          iconColor: 'text-air-secondary-orange',
        };
      case 'water':
        return {
          textColor: 'text-water-primary',
          borderColor: 'border-water-primary',
          iconColor: 'text-water-primary',
        };
      case 'earth':
        return {
          textColor: 'text-earth-primary',
          borderColor: 'border-earth-primary',
          iconColor: 'text-earth-primary',
        };
      case 'fire':
        return {
          textColor: 'text-fire-primary',
          borderColor: 'border-fire-primary',
          iconColor: 'text-fire-primary',
        };
      default:
        return {
          textColor: 'text-primary',
          borderColor: 'border-primary',
          iconColor: 'text-primary',
        };
    }
  };

  const { textColor, borderColor, iconColor } = getElementStyling(profile.element);
  const avatar = profile.avatarUrl || `https://placehold.co/100x100.png?text=${profile.name.substring(0,1)}`;


  return (
    <Card className="shadow-lg flex flex-col">
      <CardHeader className="items-center text-center">
        <Image
          src={avatar}
          alt={`${profile.name}'s avatar`}
          width={100}
          height={100}
          className={`rounded-full border-4 ${borderColor} mb-3`}
          data-ai-hint="person avatar"
        />
        <CardTitle className="font-headline text-2xl">{profile.name}</CardTitle>
        <div className={`flex items-center gap-2 ${iconColor}`}>
          <ElementIcon element={profile.element} className="h-5 w-5" />
          <CardDescription className={`capitalize ${textColor === 'text-primary' || textColor === 'text-water-primary' ? 'text-muted-foreground' : textColor }`}>
             {profile.element} Bender
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2">
            <Zap className={`h-5 w-5 ${profile.element === 'earth' ? 'text-earth-accent-yellow' : textColor}`} />
            <span className="font-medium">Chi Energy</span>
          </div>
          <span className={`font-bold text-lg ${textColor}`}>{profile.chi || 0} XP</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-5 w-5 ${profile.element === 'earth' ? 'text-earth-primary' : 'text-accent'}`} />
            <span className="font-medium">Steps Today</span>
          </div>
          <span className={`font-bold text-lg ${textColor}`}>{(profile.stepsToday || 0).toLocaleString()}</span>
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
