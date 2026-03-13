import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { newsFormSchema } from '../news.constant'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const FormExternal = ({ form }: { form: UseFormReturn<z.infer<typeof newsFormSchema>> }) => {
    return (
        <>
            <FormField
                control={form.control}
                name="externalUrl"
                render={({ field }) => (
                    <FormItem className='col-span-6'>
                        <FormLabel>Link Berita Eksternal</FormLabel>
                        <FormControl>
                            <Input
                                type="url"
                                placeholder="https://example.com/berita"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="sourceName"
                render={({ field }) => (
                    <FormItem className='col-span-6'>
                        <FormLabel>Sumber / Publisher</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Contoh: Kompas, Detik, CNN Indonesia"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                    <FormItem className='col-span-12'>
                        <FormLabel>Deskripsi Singkat</FormLabel>
                        <FormDescription>
                            Deskripsi yang akan ditampilkan di preview
                        </FormDescription>
                        <FormControl>
                            <Textarea
                                rows={4}
                                placeholder="Ringkasan singkat tentang berita..."
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}

export default FormExternal