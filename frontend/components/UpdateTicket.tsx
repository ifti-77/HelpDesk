import { Categories, Ticket, TicketPriority } from '@/CustomTypes/TicketType'
import React, { useState } from 'react'
import * as zod from 'zod'
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

function UpdateTicket({ selectedTicket,
    setSelectedTicket, setUpdateTicketView, setTickets }: {
        selectedTicket: Ticket,
        setSelectedTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
        setUpdateTicketView: React.Dispatch<React.SetStateAction<boolean>>,
        setTickets: React.Dispatch<React.SetStateAction<Ticket[] | null>>
    }) {

    const [updateTitle, setUpdateTitle] = useState<string>(selectedTicket.title)
    const [updateDescription, setUpdateDescription] = useState<string>(selectedTicket.description)
    const [updatePriority, setUpdatePriority] = useState<TicketPriority>(selectedTicket.priority)
    const [updateCategory, setUpdateCategory] = useState<Categories>(selectedTicket.category)

    const [errorFrontend, setErrorFrontend] = useState<ErrorFrontendType | null>(null)
    const [errorBackend, setErrorBackend] = useState<string | null>(null)
    const [updateing, setupdateing] = useState(false)

    const handleUpdateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setErrorFrontend(null)
        setErrorBackend(null)
        setupdateing(true)

        const formData = new FormData(e.currentTarget)

        const formValues = {

            title: updateTitle,
            description: updateDescription,
            priority: updatePriority,
            category: updateCategory
        }

        const validData = ticketSchema.safeParse(formValues)

        if (!validData.success) {
            setErrorFrontend(zod.flattenError(validData.error).fieldErrors)
            setupdateing(false)
            return
        }

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets/${selectedTicket.id}`, 
                {...validData.data,status:selectedTicket.status}, {
                withCredentials: true
            })
            if (response.status === 200) {
                alert('Ticket Updated successfully')
                setupdateing(false)
                setSelectedTicket(response.data)
                setTickets((tickets) => tickets ? tickets.map(ticket => ticket.id === response.data.id ? response.data : ticket) : tickets)
                setUpdateTicketView(false)
            } else {
                throw new Error('Failed to update ticket')
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorBackend(error.response.data?.message)
            }
            else if (error instanceof Error) {
                setErrorBackend(error.message)
            } else {
                setErrorBackend('Could not update ticket, try again later')
            }
            setupdateing(false)
        }

    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-[90%] rounded-2xl bg-white p-6 shadow-2xl">
                <form className="mb-5 flex flex-col items-start justify-between" onSubmit={handleUpdateTicket}>
                    {errorBackend && (
                        <div className="mb-4 p-4 bg-blue-100 border border-red-700 text-red-700 rounded">
                            {errorBackend}
                        </div>
                    )}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <span className="text-red-500">{errorFrontend?.title && errorFrontend.title.join(', ')}</span>
                        <input type="text" id="title" name="title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Enter ticket title" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <span className="text-red-500">{errorFrontend?.description && errorFrontend.description.join(', ')}</span>
                        <textarea id="description" name="description" rows={4} value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Describe the issue in detail"></textarea>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <span className="text-red-500">{errorFrontend?.priority && errorFrontend.priority.join(', ')}</span>
                        <select id="priority" name="priority" value={updatePriority} onChange={(e) => setUpdatePriority(e.target.value as TicketPriority)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            <option value="" hidden>Select priority</option>
                            <option value={TicketPriority.LOW}>{TicketPriority.LOW}</option>
                            <option value={TicketPriority.MEDIUM}>{TicketPriority.MEDIUM}</option>
                            <option value={TicketPriority.HIGH}>{TicketPriority.HIGH}</option>
                            <option value={TicketPriority.URGENT}>{TicketPriority.URGENT}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <span className="text-red-500">{errorFrontend?.category && errorFrontend.category.join(', ')}</span>
                        <select id="category" name="category" value={updateCategory} onChange={(e) => setUpdateCategory(e.target.value as Categories)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            <option value="" hidden>Select category</option>
                            <option value={Categories.Account}>{Categories.Account}</option>
                            <option value={Categories.Asset}>{Categories.Asset}</option>
                            <option value={Categories.General}>{Categories.General}</option>
                            <option value={Categories.Hardware}>{Categories.Hardware}</option>
                            <option value={Categories.Network}>{Categories.Network}</option>
                            <option value={Categories.Software}>{Categories.Software}</option>
                        </select>
                    </div>
                    <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' disabled={updateing}>
                        {updateing ? 'Updating...' : 'Update Ticket'}
                    </button>
                </form>
                <button onClick={() => setUpdateTicketView(false)} className='text-gray-500 hover:underline'>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default UpdateTicket