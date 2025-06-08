'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ProfileCard from '@/components/profiles/profile-card';
import ProfileForm from '@/components/profiles/profile-form';
import type { Profile as ProfileType, ElementType } from '@/lib/mock-data'; // Renamed to avoid conflict
import { mockProfiles as initialProfiles } from '@/lib/mock-data';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<ProfileType[]>(initialProfiles);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfileType | null>(null);
  const { toast } = useToast();

  const handleAddProfile = () => {
    setEditingProfile(null);
    setIsFormOpen(true);
  };

  const handleEditProfile = (profileId: string) => {
    const profileToEdit = profiles.find(p => p.id === profileId);
    if (profileToEdit) {
      setEditingProfile(profileToEdit);
      setIsFormOpen(true);
    }
  };

  const handleSubmitProfileForm = (
    values: { name: string; element: ElementType }, // Simplified values from form
    profileId?: string
  ) => {
    if (profileId) {
      // Edit existing profile
      setProfiles(prevProfiles =>
        prevProfiles.map(p =>
          p.id === profileId
            ? { ...p, name: values.name, element: values.element }
            : p
        )
      );
      toast({ title: "Profile Updated", description: `${values.name}'s profile has been saved.` });
    } else {
      // Add new profile
      const newProfile: ProfileType = {
        id: String(Date.now()), // Simple ID generation
        name: values.name,
        element: values.element,
        chi: 0, // Default Chi for new profile
        stepsToday: 0, // Default steps
        avatarUrl: `https://placehold.co/120x120.png?text=${values.name.substring(0,1)}`, // Placeholder avatar
      };
      setProfiles(prevProfiles => [...prevProfiles, newProfile]);
      toast({ title: "Profile Created", description: `${values.name} has been added to GetChiDa.` });
    }
    setIsFormOpen(false);
    setEditingProfile(null);
  };


  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold font-headline">Housemate Profiles</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddProfile}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Profile
            </Button>
          </DialogTrigger>
          {isFormOpen && ( // Conditionally render form to reset state when closed/reopened
            <ProfileForm
              profile={editingProfile}
              onSubmit={handleSubmitProfileForm}
              onClose={() => {
                setIsFormOpen(false);
                setEditingProfile(null);
              }}
            />
          )}
        </Dialog>
      </div>

      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles.map(profile => (
            <ProfileCard key={profile.id} profile={profile} onEdit={handleEditProfile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">No profiles yet.</p>
          <Button onClick={handleAddProfile} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Profile
          </Button>
        </div>
      )}
    </div>
  );
}
