'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Profile } from '@/lib/mock-data';
import ElementIcon, { type ElementType } from '@/components/icons/element-icon';
import { UserPlus, Save } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  element: z.enum(['air', 'water', 'earth', 'fire'], { required_error: "Please select an element." }),
  // avatarUrl: z.string().url({ message: "Please enter a valid URL." }).optional(), // Optional for now
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  profile?: Profile | null; // For editing existing profile
  onSubmit: (values: ProfileFormValues, profileId?: string) => void;
  onClose: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit, onClose }) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || '',
      element: profile?.element || undefined,
      // avatarUrl: profile?.avatarUrl || '',
    },
  });

  const handleSubmit = (values: ProfileFormValues) => {
    onSubmit(values, profile?.id);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="font-headline flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-primary" />
          {profile ? 'Edit Profile' : 'Create New Profile'}
        </DialogTitle>
        <DialogDescription>
          {profile ? `Update details for ${profile.name}.` : 'Add a new housemate to GetChiDa.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sokka" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="element"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elemental Affinity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select element" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(['air', 'water', 'earth', 'fire'] as const).map((el) => (
                      <SelectItem key={el} value={el}>
                        <div className="flex items-center gap-2">
                          <ElementIcon element={el as ElementType} className="h-4 w-4" />
                          <span>{el.charAt(0).toUpperCase() + el.slice(1)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Avatar URL field can be added later if direct image upload isn't implemented
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/avatar.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {profile ? 'Save Changes' : 'Create Profile'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ProfileForm;
