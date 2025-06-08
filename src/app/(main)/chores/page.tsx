'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChoreCard from '@/components/chores/chore-card';
import ChoreForm, { type ChoreFormValues } from '@/components/chores/chore-form';
import type { Chore as ChoreType, ElementType } from '@/lib/mock-data'; // Renamed to avoid conflict
import { mockChores as initialChores, mockProfiles, getProfileById } from '@/lib/mock-data';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ElementIcon from '@/components/icons/element-icon';

type ViewMode = 'grid' | 'list';

export default function ChoresPage() {
  const [chores, setChores] = useState<ChoreType[]>(initialChores);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChore, setEditingChore] = useState<ChoreType | null>(null);
  const [activeTab, setActiveTab] = useState<ElementType | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { toast } = useToast();

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

  const handleDeleteChore = (choreId: string) => {
    setChores(prevChores => prevChores.filter(c => c.id !== choreId));
    toast({ title: "Chore Deleted", description: "The chore has been removed." });
  };

  const handleToggleComplete = (choreId: string, isCompleted: boolean) => {
    setChores(prevChores =>
      prevChores.map(c =>
        c.id === choreId ? { ...c, isCompleted } : c
      )
    );
    const choreName = chores.find(c => c.id === choreId)?.name || "Chore";
    toast({ title: "Chore Updated", description: `${choreName} marked as ${isCompleted ? 'complete' : 'incomplete'}.` });
  };

  const handleSubmitChoreForm = (values: ChoreFormValues, choreId?: string) => {
    const choreData = {
      ...values,
      description: values.description || '', // Ensure description is string
      isCompleted: choreId ? chores.find(c => c.id === choreId)?.isCompleted || false : false,
    };

    if (choreId) {
      setChores(prevChores =>
        prevChores.map(c => (c.id === choreId ? { ...c, ...choreData } : c))
      );
      toast({ title: "Chore Updated", description: `"${values.name}" has been saved.` });
    } else {
      const newChore: ChoreType = {
        id: String(Date.now()), // Simple ID generation
        ...choreData,
      };
      setChores(prevChores => [newChore, ...prevChores]);
      toast({ title: "Chore Created", description: `"${values.name}" has been added.` });
    }
    setIsFormOpen(false);
    setEditingChore(null);
  };

  const filteredChores = useMemo(() => {
    if (activeTab === 'all') return chores;
    return chores.filter(chore => chore.elementType === activeTab);
  }, [chores, activeTab]);
  
  const sortedChores = useMemo(() => {
    return [...filteredChores].sort((a, b) => {
      // Sort by completion status (incomplete first), then by due date (earliest first)
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [filteredChores]);


  const tabs: { value: ElementType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Chores' },
    { value: 'air', label: 'Air' },
    { value: 'water', label: 'Water' },
    { value: 'earth', label: 'Earth' },
    { value: 'fire', label: 'Fire' },
  ];

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
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddChore}>
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Chore
              </Button>
            </DialogTrigger>
            {isFormOpen && (
              <ChoreForm
                chore={editingChore}
                profiles={mockProfiles}
                onSubmit={handleSubmitChoreForm}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingChore(null);
                }}
              />
            )}
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ElementType | 'all')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              {tab.value !== 'all' && <ElementIcon element={tab.value as ElementType} className="h-4 w-4" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {sortedChores.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {sortedChores.map(chore => (
                  <ChoreCard
                    key={chore.id}
                    chore={chore}
                    assignee={getProfileById(chore.assignedTo)}
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
                <Button onClick={handleAddChore} size="lg">
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
