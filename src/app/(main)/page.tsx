
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
import { motion } from "framer-motion";

// For demo, let's assume current user is Aang (or the first profile)
// This will be replaced by actual user auth later
const DEMO_USER_ID_FALLBACK = '1'; // Fallback if no profiles or if needed

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

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

      if (profilesData.length > 0 && !currentUser) {
         setCurrentUser(profilesData[0]);
      } else if (profilesData.length === 0) {
        setCurrentUser(null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching profiles: ", error);
      toast({ title: "Error", description: "Could not load profiles.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribeProfiles();
  }, [toast, currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      const choresQuery = query(
        collection(db, 'chores'),
        where('assignedTo', '==', currentUser.id),
        where('isCompleted', '==', false),
        orderBy('dueDate', 'asc')
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
      setAssignedChores([]);
    }
  }, [currentUser, toast]);

  if (isLoading) {
    return <div className="container mx-auto py-8 text-center"><p className="text-lg sm:text-xl">Loading dashboard...</p></div>;
  }

  if (!currentUser && !isLoading && allProfiles.length === 0) {
     return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg sm:text-xl text-muted-foreground mb-4">Welcome to GetChiDa!</p>
        <p className="mb-6 text-sm sm:text-base">It looks like there are no profiles yet. Please add a profile to get started.</p>
        <Button asChild size="lg">
          <Link href="/profiles">Go to Profiles <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }
  
  if (!currentUser && !isLoading) {
     return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg sm:text-xl text-muted-foreground mb-4">Please select or create a profile to view the dashboard.</p>
         <Button asChild size="lg">
          <Link href="/profiles">Go to Profiles <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <motion.div 
        className="grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          {currentUser && (
            <ChiMeter 
              currentChi={currentUser.chi} 
              element={currentUser.element} 
              userName={currentUser.name} 
            />
          )}
        </motion.div>

        <motion.div className="row-span-1 md:row-span-2 lg:row-span-1" variants={itemVariants}>
         <BotForm />
        </motion.div>
        
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg sm:text-xl md:text-2xl flex items-center gap-2">
                <ListTodo className="h-6 w-6 text-primary" />
                My Upcoming Chores
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">Tasks assigned to {currentUser?.name || 'you'} that need attention.</CardDescription>
            </CardHeader>
            <CardContent>
              {assignedChores.length > 0 ? (
                <ul className="space-y-3">
                  {assignedChores.slice(0,3).map(chore => (
                    <li key={chore.id} className="flex items-center justify-between p-2 sm:p-3 bg-card-foreground/5 rounded-md">
                      <div>
                        <p className="font-medium text-sm sm:text-base">{chore.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Due: {format(chore.dueDate, "PPP")}</p>
                      </div>
                      <ElementIcon element={chore.elementType} className="h-5 w-5 text-muted-foreground" />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm sm:text-base">No upcoming chores for {currentUser?.name || 'you'}. Great job or enjoy the peace!</p>
              )}
              {assignedChores.length > 3 && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">...and {assignedChores.length - 3} more.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full text-sm sm:text-base">
                <Link href="/chores">View All Chores <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg sm:text-xl md:text-2xl">House Overview</CardTitle>
              <CardDescription className="text-sm sm:text-base">Quick links and team stats.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6 pt-0">
              {allProfiles.slice(0,4).map(profile => (
                <div key={profile.id} className="flex items-center justify-between p-1.5 sm:p-2 bg-card-foreground/5 rounded-md">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Image 
                      src={profile.avatarUrl || `https://placehold.co/40x40.png`} 
                      alt={profile.name} 
                      width={32} 
                      height={32} 
                      className="rounded-full border-[3px] border-primary flex-shrink-0"
                      data-ai-hint="person avatar"
                    />
                    <span className="font-medium text-sm sm:text-base truncate">{profile.name}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-sm sm:text-base font-semibold text-primary">{profile.chi}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">XP</span>
                    <ElementIcon element={profile.element} className="h-4 w-4 text-muted-foreground ml-1" />
                  </div>
                </div>
              ))}
              <Button asChild className="w-full mt-4 text-sm sm:text-base">
                  <Link href="/profiles">Manage Profiles <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div className="col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden" variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg sm:text-xl md:text-2xl">The Four Nations</CardTitle>
              <CardDescription className="text-sm sm:text-base">Inspired by the world of Avatar.</CardDescription>
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
        </motion.div>

      </motion.div>
    </div>
  );
}
