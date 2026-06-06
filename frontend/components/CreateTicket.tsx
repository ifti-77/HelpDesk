"use client"

import { useState } from 'react'
import * as zod from 'zod'
import { TicketPriority, Categories } from '@/CustomTypes/TicketType'
import { input } from 'zod/v4/core'
import axios from 'axios'

const ticketSchema = zod.object({
    title: zod.string().min(5).max(150),
    description: zod.string().min(10).max(500),
    priority: zod.enum(TicketPriority),
    category: zod.enum(Categories)
})

interface ErrorFrontendType {
    title?: string[]
    description?: string[]
    priority?: string[]
    category?: string[]

}

function CreateTicket() {
    const [errorFrontend, setErrorFrontend] = useState<ErrorFrontendType | null>(null)
    const [errorBackend, setErrorBackend] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmitTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setErrorFrontend(null)
        setErrorBackend(null)
        setSubmitting(true)
        
        const formData = new FormData(e.currentTarget)

        const formValues = {

            title: formData.get("title") as string,
            description: formData.get("description") as string,
            priority: formData.get("priority") as TicketPriority,
            category: formData.get("category") as Categories
        }

        const validData = ticketSchema.safeParse(formValues)

        if (!validData.success) {
            setErrorFrontend(zod.flattenError(validData.error).fieldErrors)
            setSubmitting(false)
            return
        }

        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets`, validData.data, {
                withCredentials: true
            })
            if (response.status === 201) {
                alert('Ticket created successfully')
                e.currentTarget?.reset()
                setSubmitting(false)
            } else {
                throw new Error('Failed to create ticket')
            }

        }catch(error) {
            if(axios.isAxiosError(error) && error.response) {
                setErrorBackend(error.response.data?.message)
            }
            else if(error instanceof Error) {
                setErrorBackend(error.message)
            }else
            {
                setErrorBackend('Could not create ticket, try again later')
            }
            setSubmitting(false)
        }

    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Create a New Ticket</h1>
            {errorBackend && (
                <div className="mb-4 p-4 bg-red-50 border border-red-700 text-red-700 rounded-sm">
                    {errorBackend}
                </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmitTicket}>
                <div>
                    <label htmlFor="title" className="block text-md font-medium text-gray-700">Title</label>
                    <span className="text-red-500">{errorFrontend?.title && errorFrontend.title.join(', ')}</span>
                    <input type="text" id="title" name="title" className="mt-1 py-1.5 px-2 block w-full rounded-sm border border-gray-300 outline-indigo-300 sm:text-sm" placeholder="Enter ticket title" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-md font-medium text-gray-700">Description</label>
                    <span className="text-red-500">{errorFrontend?.description && errorFrontend.description.join(', ')}</span>
                    <textarea id="description" name="description" rows={4} className="mt-1 py-1.5 px-2 block w-full rounded-sm border border-gray-300 outline-indigo-300 resize-none sm:text-sm" placeholder="Describe the issue in detail"></textarea>
                </div>
                <div>
                    <label htmlFor="priority" className="block text-md font-medium text-gray-700">Priority</label>
                    <span className="text-red-500">{errorFrontend?.priority && errorFrontend.priority.join(', ')}</span>
                    <select id="priority" name="priority" className="mt-1 py-1.5 px-2 block w-full rounded-sm border border-gray-300 outline-indigo-300 sm:text-sm">
                        <option value="" hidden>Select priority</option>
                        <option value={TicketPriority.LOW}>{TicketPriority.LOW}</option>
                        <option value={TicketPriority.MEDIUM}>{TicketPriority.MEDIUM}</option>
                        <option value={TicketPriority.HIGH}>{TicketPriority.HIGH}</option>
                        <option value={TicketPriority.URGENT}>{TicketPriority.URGENT}</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="category" className="block text-md font-medium text-gray-700">Category</label>
                    <span className="text-red-500">{errorFrontend?.category && errorFrontend.category.join(', ')}</span>
                    <select id="category" name="category" className="mt-1 py-1.5 px-2 block w-full rounded-sm border border-gray-300 outline-indigo-300 sm:text-sm">
                        <option value="" hidden>Select category</option>
                        <option value={Categories.Account}>{Categories.Account}</option>
                        <option value={Categories.Asset}>{Categories.Asset}</option>
                        <option value={Categories.General}>{Categories.General}</option>
                        <option value={Categories.Hardware}>{Categories.Hardware}</option>
                        <option value={Categories.Network}>{Categories.Network}</option>
                        <option value={Categories.Software}>{Categories.Software}</option>
                    </select>
                </div>
                <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
            </form>
        </div>
    )
}

export default CreateTicket