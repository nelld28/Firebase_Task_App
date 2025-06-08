'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ElementIcon from '@/components/icons/element-icon';
import type { Profile } from '@/lib/mock-data';
import { Edit3, TrendingUp, Zap } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  onEdit: (profileId: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit }) => {
  return (
    <Card className="shadow-lg flex flex-col">
      <CardHeader className="items-center text-center">
        <Image
          src={profile.avatarUrl || `https://placehold.co/120x120.png`}
          alt={`${profile.name}'s avatar`}
          width={100}
          height={100}
          className="rounded-full border-4 border-primary mb-3"
          data-ai-hint="person avatar"
        />
        <CardTitle className="font-headline text-2xl">{profile.name}</CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ElementIcon element={profile.element} className="h-5 w-5" />
          <CardDescription className="capitalize">{profile.element} Bender</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-earth-yellow" />
            <span className="font-medium">Chi Energy</span>
          </div>
          <span className="font-bold text-lg text-primary">{profile.chi} XP</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="font-medium">Steps Today</span>
          </div>
          <span className="font-bold text-lg text-primary">{profile.stepsToday.toLocaleString()}</span>
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
