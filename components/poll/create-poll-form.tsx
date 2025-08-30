'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { PlusCircledIcon, TrashIcon } from '@radix-ui/react-icons'

const formSchema = z.object({
  question: z.string().min(10, { message: 'Question must be at least 10 characters.' }).max(160, { message: 'Question must not be longer than 160 characters.' }),
  options: z.array(
    z.object({
      value: z.string().min(1, { message: 'Option cannot be empty.' }).max(60, { message: 'Option must not be longer than 60 characters.' }),
    })
  ).min(2, { message: 'Please add at least 2 options.' }).max(10, { message: 'You can add at most 10 options.' }),
})

type CreatePollFormValues = z.infer<typeof formSchema>

export default function CreatePollForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreatePollFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      options: [{ value: '' }, { value: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  async function onSubmit(values: CreatePollFormValues) {
    setIsLoading(true)
    try {
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({ question: values.question, created_by: 'user_id_placeholder' })
        .select()
        .single()

      if (pollError) throw pollError

      const optionsToInsert = values.options.map((option) => ({
        poll_id: poll.id,
        value: option.value,
      }))

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert)

      if (optionsError) throw optionsError

      toast({
        title: 'Poll Created',
        description: 'Your poll has been created successfully.',
      })
      router.push('/') // Redirect to home or poll details page
    } catch (error: any) {
      toast({
        title: 'Error creating poll',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Create New Poll</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poll Question</FormLabel>
                  <FormControl>
                    <Input placeholder="What is your favorite color?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Options</FormLabel>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`options.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 mt-2">
                      <FormControl>
                        <Input placeholder={`Option ${index + 1}`} {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 2}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ value: '' })}
                disabled={fields.length >= 10}
              >
                <PlusCircledIcon className="mr-2 h-4 w-4" /> Add Option
              </Button>
              {form.formState.errors.options && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.options.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Poll...' : 'Create Poll'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
