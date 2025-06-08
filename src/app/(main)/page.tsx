
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ListTodo } from "lucide-react";
import ChiMeter from "@/components/dashboard/chi-meter";
import BotForm from "@/components/motivational-bot/bot-form";
import type { Profile as ProfileType, Chore as ChoreType } from "@/lib/types";
import ElementIcon from "@/components/icons/element-icon";
import { useEffect, useState } from "react";
import { db, convertTimestampsToDates } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// For demo, let's assume current user is Aang (or the first profile)
// This will be replaced by actual user auth later
const DEMO_USER_ID_FALLBACK = '1'; // Fallback if no profiles or if needed

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<ProfileType | null>(null);
  const [allProfiles, setAllProfiles] = useState<ProfileType[]>([]);
  const [assignedChores, setAssignedChores] = useState<ChoreType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch all profiles for the "House Overview"
    const profilesQuery = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'));
    const unsubscribeProfiles = onSnapshot(profilesQuery, (snapshot) => {
      const profilesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data()),
      })) as ProfileType[];
      setAllProfiles(profilesData);

      // Set the first profile as current user for demo purposes
      // In a real app, you'd get the logged-in user's ID
      if (profilesData.length > 0 && !currentUser) {
         setCurrentUser(profilesData[0]); // Or use a fixed ID if preferred for demo consistency
      } else if (profilesData.length === 0) {
        setCurrentUser(null); // No profiles available
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching profiles: ", error);
      toast({ title: "Error", description: "Could not load profiles.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribeProfiles();
  }, [toast, currentUser]); // Added currentUser to deps to avoid re-setting if already set

  useEffect(() => {
    if (currentUser?.id) {
      const choresQuery = query(
        collection(db, 'chores'),
        where('assignedTo', '==', currentUser.id),
        where('isCompleted', '==', false),
        orderBy('dueDate', 'asc') // Ensure you have an index for this in Firestore
      );
      const unsubscribeChores = onSnapshot(choresQuery, (snapshot) => {
        const choresData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : new Date(data.dueDate),
          } as ChoreType;
        });
        setAssignedChores(choresData);
      }, (error) => {
        console.error(`Error fetching chores for ${currentUser.name}: `, error);
        toast({ title: "Error", description: "Could not load assigned chores.", variant: "destructive" });
      });
      return () => unsubscribeChores();
    } else {
      setAssignedChores([]); // Clear chores if no current user
    }
  }, [currentUser, toast]);

  if (isLoading) {
    return <div className="container mx-auto py-8 text-center"><p className="text-xl">Loading dashboard...</p></div>;
  }

  if (!currentUser && !isLoading && allProfiles.length === 0) {
     return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl text-muted-foreground mb-4">Welcome to GetChiDa!</p>
        <p className="mb-6">It looks like there are no profiles yet. Please add a profile to get started.</p>
        <Button asChild size="lg">
          <Link href="/profiles">Go to Profiles <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }
  
  if (!currentUser && !isLoading) {
     return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl text-muted-foreground mb-4">Please select or create a profile to view the dashboard.</p>
         <Button asChild size="lg">
          <Link href="/profiles">Go to Profiles <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        
        <div className="lg:col-span-2">
          {currentUser && (
            <ChiMeter 
              currentChi={currentUser.chi} 
              element={currentUser.element} 
              userName={currentUser.name} 
            />
          )}
        </div>

        <div className="row-span-1 md:row-span-2 lg:row-span-1">
         <BotForm />
        </div>
        
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-primary" />
              My Upcoming Chores
            </CardTitle>
            <CardDescription>Tasks assigned to {currentUser?.name || 'you'} that need attention.</CardDescription>
          </CardHeader>
          <CardContent>
            {assignedChores.length > 0 ? (
              <ul className="space-y-3">
                {assignedChores.slice(0,3).map(chore => (
                  <li key={chore.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg">
                    <div>
                      <p className="font-medium">{chore.name}</p>
                      <p className="text-xs text-muted-foreground">Due: {format(chore.dueDate, "PPP")}</p>
                    </div>
                    <ElementIcon element={chore.elementType} className="h-5 w-5 text-muted-foreground" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming chores for {currentUser?.name || 'you'}. Great job or enjoy the peace!</p>
            )}
             {assignedChores.length > 3 && (
                <p className="text-sm text-muted-foreground mt-2">...and {assignedChores.length - 3} more.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/chores">View All Chores <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">House Overview</CardTitle>
             <CardDescription>Quick links and team stats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {allProfiles.slice(0,4).map(profile => ( // Show max 4 profiles here
              <div key={profile.id} className="flex items-center justify-between p-2 bg-card-foreground/5 rounded-md">
                <div className="flex items-center gap-2">
                  <Image 
                    src={profile.avatarUrl || `https://placehold.co/40x40.png`} 
                    alt={profile.name} 
                    width={32} 
                    height={32} 
                    className="rounded-full"
                    data-ai-hint="person avatar"
                  />
                  <span className="font-medium">{profile.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-primary">{profile.chi}</span>
                  <span className="text-xs text-muted-foreground">XP</span>
                  <ElementIcon element={profile.element} className="h-4 w-4 text-muted-foreground ml-1" />
                </div>
              </div>
            ))}
             <Button asChild className="w-full mt-4">
                <Link href="/profiles">Manage Profiles <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-xl">The Four Nations</CardTitle>
            <CardDescription>Inspired by the world of Avatar.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <Image 
                src="https://placehold.co/800x300.png" 
                alt="Four Nations Landscape" 
                width={800} 
                height={300} 
                className="w-full h-auto object-cover"
                data-ai-hint="fantasy landscape"
              />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
