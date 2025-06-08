import BotForm from '@/components/motivational-bot/bot-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function MotivationalBotPage() {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-12">
        <Card className="text-center shadow-lg overflow-hidden">
          <div className="relative h-48 sm:h-64 w-full">
            <Image 
              src="https://placehold.co/800x400.png" // Placeholder for a fitting image
              alt="Meditating bender" 
              layout="fill"
              objectFit="cover"
              data-ai-hint="zen meditation"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>
          <CardHeader className="relative -mt-16 sm:-mt-20 z-10">
            <CardTitle className="font-headline text-3xl sm:text-4xl text-primary">
              Your Personal Bending Coach
            </CardTitle>
            <CardDescription className="text-md sm:text-lg text-foreground/90 mt-2">
              Feeling stuck? Let the ancient wisdom of the elements guide and motivate you.
              Share your progress, and your elemental affinity, and receive a spark of inspiration.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <BotForm />

      <Card className="w-full max-w-3xl mt-12 shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline">How it Works</CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/80 space-y-2">
            <p>Our Motivational Bending Bot harnesses the power of ancient elemental philosophies (and a little bit of modern AI magic!) to provide you with tailored encouragement.</p>
            <ol className="list-decimal list-inside space-y-1 pl-2">
                <li><strong>Select Your Element:</strong> Choose the element that resonates most with you - Air, Water, Earth, or Fire.</li>
                <li><strong>Share Your Progress:</strong> Let us know how far you've come on your current task or goal (0-100%).</li>
                <li><strong>Receive Wisdom:</strong> Get a unique motivational message inspired by your element and progress, designed to help you overcome obstacles and stay on your path.</li>
            </ol>
            <p className="pt-2">Remember, like a true bender, your strength comes from within. This tool is here to help you channel it!</p>
        </CardContent>
      </Card>
    </div>
  );
}
