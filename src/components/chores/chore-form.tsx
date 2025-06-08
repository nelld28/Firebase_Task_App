
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Chore, Profile, ElementType, ChoreInput } from '@/lib/types'; // Updated import
import ElementIcon from '@/components/icons/element-icon';
import { cn } from '@/lib/utils';
import { CalendarIcon, ListChecksIcon, Save } from 'lucide-react';
import { format, parseISO } from 'date-fns'; // parseISO for converting string back to Date if needed

const choreFormSchema = z.object({
  name: z.string().min(3, { message: "Chore name must be at least 3 characters." }),
  description: z.string().optional(),
  assignedTo: z.string({ required_error: "Please assign this chore to someone." }),
  // DueDate will be a string in YYYY-MM-DD format from the calendar, convert to Date/Timestamp in action
  dueDate: z.string({ required_error: "Please select a due date." }).refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  elementType: z.enum(['air', 'water', 'earth', 'fire'], { required_error: "Please select an element type for this chore." }),
});

// This type is for the form's internal values
type ChoreFormInternalValues = z.infer<typeof choreFormSchema>;

interface ChoreFormProps {
  chore?: Chore | null;
  profiles: Profile[];
  onSubmit: (values: ChoreInput, choreId?: string) => void; // onSubmit now takes ChoreInput
  onClose: () => void;
}

const ChoreForm: React.FC<ChoreFormProps> = ({ chore, profiles, onSubmit, onClose }) => {
  const form = useForm<ChoreFormInternalValues>({
    resolver: zodResolver(choreFormSchema),
    defaultValues: {
      name: chore?.name || '',
      description: chore?.description || '',
      assignedTo: chore?.assignedTo || undefined,
      // Format existing Date to YYYY-MM-DD string for the calendar state
      dueDate: chore?.dueDate ? format(new Date(chore.dueDate), "yyyy-MM-dd") : undefined,
      elementType: chore?.elementType || undefined,
    },
  });

  const handleSubmit = (values: ChoreFormInternalValues) => {
    // Convert form values to ChoreInput type for the server action
    const choreInputValues: ChoreInput = {
      name: values.name,
      description: values.description,
      assignedTo: values.assignedTo,
      dueDate: values.dueDate, // Pass as string, server action handles conversion
      elementType: values.elementType,
    };
    onSubmit(choreInputValues, chore?.id);
  };
  
  // State for calendar component because it expects a Date object
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(
    chore?.dueDate ? new Date(chore.dueDate) : undefined
  );

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-headline flex items-center gap-2">
          <ListChecksIcon className="h-6 w-6 text-primary" />
          {chore ? 'Edit Chore' : 'Create New Chore'}
        </DialogTitle>
        <DialogDescription>
          {chore ? `Update details for "${chore.name}".` : 'Add a new task to the household chore list.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chore Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Clean Kitchen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Wipe counters, clean sink, sweep floor." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a housemate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {profiles.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
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
            name="dueDate"
            render={({ field }) => ( // field.value here is the string yyyy-MM-dd
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(parseISO(field.value), "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={calendarDate} // Calendar uses Date object
                      onSelect={(date) => {
                        setCalendarDate(date); // Update local Date state for calendar
                        field.onChange(date ? format(date, "yyyy-MM-dd") : ""); // Update form with string
                      }}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="elementType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elemental Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select element type" />
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
                <FormDescription>Helps categorize and theme the chore.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {chore ? 'Save Changes' : 'Create Chore'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ChoreForm;
