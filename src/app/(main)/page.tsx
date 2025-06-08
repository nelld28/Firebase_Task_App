import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, ListTodo } from "lucide-react";
import ChiMeter from "@/components/dashboard/chi-meter";
import BotForm from "@/components/motivational-bot/bot-form";
import { mockProfiles, mockChores, getProfileById } from "@/lib/mock-data";
import ElementIcon from "@/components/icons/element-icon";

// For demo, let's assume current user is Aang
const currentUser = mockProfiles[0]; 
const assignedChores = mockChores.filter(chore => chore.assignedTo === currentUser.id && !chore.isCompleted);

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Chi Meter Section - Spans 2 columns on larger screens */}
        <div className="lg:col-span-2">
          <ChiMeter 
            currentChi={currentUser.chi} 
            element={currentUser.element} 
            userName={currentUser.name} 
          />
        </div>

        {/* Motivational Bot Section */}
        <div className="row-span-1 md:row-span-2 lg:row-span-1">
         <BotForm />
        </div>
        
        {/* My Chores Section */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-primary" />
              My Upcoming Chores
            </CardTitle>
            <CardDescription>Tasks assigned to you that need your attention.</CardDescription>
          </CardHeader>
          <CardContent>
            {assignedChores.length > 0 ? (
              <ul className="space-y-3">
                {assignedChores.slice(0,3).map(chore => (
                  <li key={chore.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg">
                    <div>
                      <p className="font-medium">{chore.name}</p>
                      <p className="text-xs text-muted-foreground">Due: {chore.dueDate.toLocaleDateString()}</p>
                    </div>
                    <ElementIcon element={chore.elementType} className="h-5 w-5 text-muted-foreground" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming chores for you. Great job or enjoy the peace!</p>
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

        {/* House Activity / Quick Links Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">House Overview</CardTitle>
             <CardDescription>Quick links and team stats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProfiles.map(profile => (
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

        {/* Placeholder card with image */}
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
