'use client';

import { useState, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import ElementIcon, { type ElementType } from '@/components/icons/element-icon';
import { generateMotivationalMessage, type MotivationalMessageInput } from '@/ai/flows/motivational-bending-bot';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  element: z.enum(['air', 'water', 'earth', 'fire'], {
    required_error: 'Please select an element.',
  }),
  progressPercentage: z.coerce
    .number({ required_error: 'Please enter your progress.' })
    .min(0, 'Progress must be at least 0%.')
    .max(100, 'Progress cannot exceed 100%.'),
});

type BotFormValues = z.infer<typeof formSchema>;

export default function BotForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<BotFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      progressPercentage: 0,
    },
  });

  async function onSubmit(values: BotFormValues) {
    setIsLoading(true);
    setMotivationalMessage(null);
    try {
      const input: MotivationalMessageInput = {
        element: values.element as ElementType,
        progressPercentage: values.progressPercentage,
      };
      const result = await generateMotivationalMessage(input);
      setMotivationalMessage(result.message);
    } catch (error) {
      console.error('Error generating motivational message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a motivational message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Motivational Bending Bot
        </CardTitle>
        <CardDescription>
          Select your element and current progress to get a personalized motivational boost!
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="element"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Element</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your element" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['air', 'water', 'earth', 'fire'] as const).map((el) => (
                        <SelectItem key={el} value={el}>
                          <div className="flex items-center gap-2">
                            <ElementIcon element={el} className="h-4 w-4" />
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
            <FormField
              control={form.control}
              name="progressPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress Percentage (0-100)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 75" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Get Motivation
            </Button>
            {motivationalMessage && !isLoading && (
              <Card className="bg-accent/30 border-accent">
                <CardContent className="p-4">
                  <p className="text-sm text-accent-foreground font-medium">{motivationalMessage}</p>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
