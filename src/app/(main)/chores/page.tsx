
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChoreCard from '@/components/chores/chore-card';
import ChoreForm from '@/components/chores/chore-form';
import type { Chore as ChoreType, ElementType, ChoreInput, Profile as ProfileType } from '@/lib/types';
import { PlusCircle, LayoutGrid, List, ListChecks, CalendarDays, Users } from 'lucide-react'; // Added new icons
import { useToast } from '@/hooks/use-toast';
import ElementIcon from '@/components/icons/element-icon';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { addChore, updateChore, deleteChore as deleteChoreAction, toggleChoreComplete } from '@/app/actions/choreActions';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

type ViewMode = 'grid' | 'list';
type MainTabValue = 'tasks' | 'schedule' | 'family';
type ElementalTabValue = ElementType | 'all';

export default function ChoresPage() {
  const [chores, setChores] = useState<ChoreType[]>([]);
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChore, setEditingChore] = useState<ChoreType | null>(null);
  
  const [activeMainTab, setActiveMainTab] = useState<MainTabValue>('tasks');
  const [activeElementalTab, setActiveElementalTab] = useState<ElementalTabValue>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { toast } = useToast();

  useEffect(() => {
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

    const choresQuery = query(collection(db, 'chores'));
    const unsubscribeChores = onSnapshot(choresQuery, (querySnapshot) => {
      const choresData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : new Date(data.dueDate),
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
      const choreToUpdate = chores.find(c => c.id === choreId);
      if (!choreToUpdate) {
        toast({ title: "Error", description: "Chore not found for update.", variant: "destructive" });
        return;
      }
      const updatePayload: Partial<ChoreInput & { isCompleted?: boolean }> = {
        name: values.name,
        description: values.description,
        assignedTo: values.assignedTo,
        dueDate: values.dueDate,
        elementType: values.elementType,
      };
      result = await updateChore(choreId, updatePayload);
      if (result.success) {
        toast({ title: "Chore Updated", description: `"${values.name}" has been saved.` });
      }
    } else {
      result = await addChore(values);
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
    if (activeElementalTab === 'all') return chores;
    return chores.filter(chore => chore.elementType === activeElementalTab);
  }, [chores, activeElementalTab]);

  const sortedChores = useMemo(() => {
    return [...filteredChores].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      const dateA = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
      const dateB = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredChores]);

  const mainTabsConfig: { value: MainTabValue; label: string; icon: React.ElementType }[] = [
    { value: 'tasks', label: 'Tasks', icon: ListChecks },
    { value: 'schedule', label: 'Schedule', icon: CalendarDays },
    { value: 'family', label: 'Family', icon: Users },
  ];

  const elementalTabsList: { value: ElementalTabValue; label: string }[] = [
    { value: 'all', label: 'All Chores' },
    { value: 'air', label: 'Air' },
    { value: 'water', label: 'Water' },
    { value: 'earth', label: 'Earth' },
    { value: 'fire', label: 'Fire' },
  ];

  if (isLoading && profiles.length === 0 && activeMainTab === 'tasks') {
    return <div className="container mx-auto py-8 text-center"><p className="text-xl text-foreground">Loading chores and profiles...</p></div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeMainTab} onValueChange={(value) => setActiveMainTab(value as MainTabValue)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary rounded-lg p-1">
          {mainTabsConfig.map(tab => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className={cn(
                "flex flex-col items-center justify-center gap-1 h-auto py-2 px-1 text-xs sm:text-sm",
                activeMainTab === tab.value ? 'active-tab-indicator' : 'text-muted-foreground hover:text-foreground' 
              )}
            >
              <tab.icon className="h-5 w-5 mb-0.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="tasks">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
            <h3 className="text-2xl font-semibold font-headline text-foreground">Today's Chores</h3>
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={cn(viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-primary')} aria-label="Grid view">
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={cn(viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-primary')} aria-label="List view">
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Tabs value={activeElementalTab} onValueChange={(value) => setActiveElementalTab(value as ElementalTabValue)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 bg-secondary/70">
              {elementalTabsList.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className={cn(
                    "flex items-center gap-2",
                    activeElementalTab === tab.value ? 'active-tab-indicator' : 'text-muted-foreground hover:text-foreground' 
                  )}
                >
                  {tab.value !== 'all' && <ElementIcon element={tab.value as ElementType} className="h-4 w-4" />}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {elementalTabsList.map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                {isLoading ? (
                    <div className="text-center py-12"><p className="text-xl text-foreground">Loading chores...</p></div>
                ) : sortedChores.length > 0 ? (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {sortedChores.map(chore => (
                      <ChoreCard
                        key={chore.id}
                        chore={chore}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditChore}
                        onDelete={handleDeleteChore}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xl text-muted-foreground mb-4">
                      No {activeElementalTab !== 'all' ? `${activeElementalTab.charAt(0).toUpperCase() + activeElementalTab.slice(1)} ` : ''}
                      chores found.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-8">
            <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
              setIsFormOpen(isOpen);
              if (!isOpen) setEditingChore(null);
            }}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base" 
                  onClick={handleAddChore} 
                  disabled={profiles.length === 0 && !isLoading}
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Add New Chore
                </Button>
              </DialogTrigger>
              {isFormOpen && profiles.length > 0 && (
                <ChoreForm
                  chore={editingChore}
                  profiles={profiles}
                  onSubmit={handleSubmitChoreForm}
                  onClose={() => {
                    setIsFormOpen(false);
                    setEditingChore(null);
                  }}
                />
              )}
              {isFormOpen && profiles.length === 0 && !isLoading && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cannot Add Chore</DialogTitle>
                      <DialogDescription>
                        No housemate profiles are available for assignment. Please add at least one profile before creating chores.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                          <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>OK</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
              )}
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">Schedule View Coming Soon!</p>
                <p className="text-sm text-muted-foreground">Check back later to see your chores on a calendar.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family">
           <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">Family Overview Coming Soon!</p>
                <p className="text-sm text-muted-foreground">Track chore completion and engagement across the household.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
טרקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקקק।