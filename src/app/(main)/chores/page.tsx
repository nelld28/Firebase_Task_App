
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChoreCard from '@/components/chores/chore-card';
import ChoreForm from '@/components/chores/chore-form';
import type { Chore as ChoreType, ElementType, ChoreInput, Profile as ProfileType } from '@/lib/types';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ElementIcon from '@/components/icons/element-icon';
import { db, convertTimestampsToDates } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { addChore, updateChore, deleteChore as deleteChoreAction, toggleChoreComplete } from '@/app/actions/choreActions';

type ViewMode = 'grid' | 'list';

export default function ChoresPage() {
  const [chores, setChores] = useState<ChoreType[]>([]);
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChore, setEditingChore] = useState<ChoreType | null>(null);
  const [activeTab, setActiveTab] = useState<ElementType | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { toast } = useToast();

  useEffect(() => {
    // Fetch profiles for assignee dropdown
    const profilesQuery = query(collection(db, 'profiles'), orderBy('name', 'asc'));
    const unsubscribeProfiles = onSnapshot(profilesQuery, (querySnapshot) => {
      const profilesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ProfileType[];
      setProfiles(profilesData);
    }, (error) => {
      console.error("Error fetching profiles: ", error);
      toast({ title: "Error", description: "Could not load profiles for assignment.", variant: "destructive" });
    });

    // Fetch chores
    const choresQuery = query(collection(db, 'chores')/*, orderBy('dueDate', 'asc')*/); // Order by dueDate needs an index
    const unsubscribeChores = onSnapshot(choresQuery, (querySnapshot) => {
      const choresData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : new Date(data.dueDate), // Ensure dueDate is a Date object
        } as ChoreType;
      });
      setChores(choresData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching chores: ", error);
      toast({ title: "Error", description: "Could not load chores.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => {
      unsubscribeProfiles();
      unsubscribeChores();
    };
  }, [toast]);

  const handleAddChore = () => {
    setEditingChore(null);
    setIsFormOpen(true);
  };

  const handleEditChore = (choreId: string) => {
    const choreToEdit = chores.find(c => c.id === choreId);
    if (choreToEdit) {
      setEditingChore(choreToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDeleteChore = async (choreId: string) => {
    const result = await deleteChoreAction(choreId);
    if (result.success) {
      toast({ title: "Chore Deleted", description: "The chore has been removed." });
    } else {
      toast({ title: "Error", description: result.error || "Could not delete chore.", variant: "destructive" });
    }
  };

  const handleToggleComplete = async (choreId: string, isCompleted: boolean) => {
    const choreName = chores.find(c => c.id === choreId)?.name || "Chore";
    const result = await toggleChoreComplete(choreId, isCompleted);
    if (result.success) {
      toast({ title: "Chore Updated", description: `${choreName} marked as ${isCompleted ? 'complete' : 'incomplete'}.` });
    } else {
      toast({ title: "Error", description: result.error || "Could not update chore completion.", variant: "destructive" });
    }
  };

  const handleSubmitChoreForm = async (values: ChoreInput, choreId?: string) => {
    let result;
    if (choreId) {
      // For updates, ChoreInput might not include all fields. We only pass what's changed.
      const choreToUpdate = chores.find(c => c.id === choreId);
      if (!choreToUpdate) {
        toast({ title: "Error", description: "Chore not found for update.", variant: "destructive" });
        return;
      }
      // Create a partial input based on what the form provides
      const updatePayload: Partial<ChoreInput & { isCompleted?: boolean }> = {
        name: values.name,
        description: values.description,
        assignedTo: values.assignedTo,
        dueDate: values.dueDate, // ChoreInput has dueDate as string
        elementType: values.elementType,
        // isCompleted is handled by toggleChoreComplete
      };
      result = await updateChore(choreId, updatePayload);
      if (result.success) {
        toast({ title: "Chore Updated", description: `"${values.name}" has been saved.` });
      }
    } else {
      result = await addChore(values); // values is ChoreInput
      if (result.success) {
        toast({ title: "Chore Created", description: `"${values.name}" has been added.` });
      }
    }

    if (result.success) {
      setIsFormOpen(false);
      setEditingChore(null);
    } else {
      toast({ title: "Error", description: result.error || "Could not save chore.", variant: "destructive" });
    }
  };

  const filteredChores = useMemo(() => {
    if (activeTab === 'all') return chores;
    return chores.filter(chore => chore.elementType === activeTab);
  }, [chores, activeTab]);

  const sortedChores = useMemo(() => {
    return [...filteredChores].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      // Ensure dueDate is a Date object for comparison
      const dateA = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
      const dateB = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredChores]);

  const tabsList: { value: ElementType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Chores' },
    { value: 'air', label: 'Air' },
    { value: 'water', label: 'Water' },
    { value: 'earth', label: 'Earth' },
    { value: 'fire', label: 'Fire' },
  ];

  if (isLoading && profiles.length === 0) { // Wait for profiles too for the form
    return <div className="container mx-auto py-8 text-center"><p className="text-xl">Loading chores and profiles...</p></div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold font-headline">Weekly Chore Scheduler</h2>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-accent text-accent-foreground' : ''} aria-label="Grid view">
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-accent text-accent-foreground' : ''} aria-label="List view">
            <List className="h-5 w-5" />
          </Button>
          <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
            setIsFormOpen(isOpen);
            if (!isOpen) setEditingChore(null);
          }}>
            <DialogTrigger asChild>
              <Button onClick={handleAddChore} disabled={profiles.length === 0}>
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Chore
              </Button>
            </DialogTrigger>
            {isFormOpen && profiles.length > 0 && (
              <ChoreForm
                chore={editingChore}
                profiles={profiles} // Pass fetched profiles
                onSubmit={handleSubmitChoreForm}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingChore(null);
                }}
              />
            )}
             {isFormOpen && profiles.length === 0 && (
                <div className="text-center p-4">Cannot add chore: No profiles available for assignment. Please add profiles first.</div>
            )}
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ElementType | 'all')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
          {tabsList.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              {tab.value !== 'all' && <ElementIcon element={tab.value as ElementType} className="h-4 w-4" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsList.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {isLoading ? (
                 <div className="text-center py-12"><p className="text-xl">Loading chores...</p></div>
            ) : sortedChores.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {sortedChores.map(chore => (
                  <ChoreCard
                    key={chore.id}
                    chore={chore}
                    // Assignee info is now part of the chore object from Firestore due to denormalization
                    // If not denormalized, you'd find profile here: profiles.find(p => p.id === chore.assignedTo)
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditChore}
                    onDelete={handleDeleteChore}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">
                  No {activeTab !== 'all' ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ` : ''}
                  chores found.
                </p>
                <Button onClick={handleAddChore} size="lg" disabled={profiles.length === 0}>
                  <PlusCircle className="mr-2 h-5 w-5" /> Add a Chore
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
