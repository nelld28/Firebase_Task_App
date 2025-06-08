
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ProfileCard from '@/components/profiles/profile-card';
import ProfileForm from '@/components/profiles/profile-form';
import type { Profile as ProfileType, ElementType, ProfileInput } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { addProfile, updateProfile } from '@/app/actions/profileActions';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfileType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const profilesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure timestamps are converted if needed, though Profile type expects them as is for now
      })) as ProfileType[];
      setProfiles(profilesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching profiles: ", error);
      toast({ title: "Error", description: "Could not load profiles.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

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

  const handleSubmitProfileForm = async (
    values: { name: string; element: ElementType; avatarUrl?: string }, // Form values
    profileId?: string
  ) => {
    const profileInput: ProfileInput = { // Map form values to ProfileInput
        name: values.name,
        element: values.element,
        avatarUrl: values.avatarUrl,
        // chi and stepsToday will be defaulted in the server action if not provided
    };

    let result;
    if (profileId) {
      result = await updateProfile(profileId, profileInput);
      if (result.success) {
        toast({ title: "Profile Updated", description: `${values.name}'s profile has been saved.` });
      }
    } else {
      result = await addProfile(profileInput);
      if (result.success) {
        toast({ title: "Profile Created", description: `${values.name} has been added.` });
      }
    }

    if (result.success) {
      setIsFormOpen(false);
      setEditingProfile(null);
    } else {
      toast({ title: "Error", description: result.error || "Could not save profile.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl">Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold font-headline">Housemate Profiles</h2>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) setEditingProfile(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleAddProfile}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Profile
            </Button>
          </DialogTrigger>
          {isFormOpen && (
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
