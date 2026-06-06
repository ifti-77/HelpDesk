"use client"
import React, { useEffect } from 'react'
import { Ticket, TicketStatus } from '@/CustomTypes/TicketType'
import { UserRole } from '@/CustomTypes/UserType'
import axios from 'axios'
import ViewTicketDetails from './ViewTicketDetails'
import CreateTicket from './CreateTicket'
import UpdateTicket from './UpdateTicket'
import SearchTicket from './SearchTicket'
function EmployeeTickets({ employeeId }: { employeeId: string }) {
    const [viewWindow, setViewWindow] = React.useState<'create-tickets' | 'view-tickets' | TicketStatus.CLOSED>('create-tickets')
    const [tickets, setTickets] = React.useState<Ticket[] | null>([{
        id: '1', title: 'Sample Ticket',
        priority: 'MEDIUM' as any,
        status: TicketStatus.OPEN as any,
        description: 'This is a sample ticket.',
        createdBy: { name: 'John Doe' } as any,
        assignedTo: null,
        category: 'Bug Report' as any,
        comments: [{ user: { name: 'John Doe' }, message: 'This is a sample comment.', createdAt: new Date() },
        { user: { name: 'Jane Smith' }, message: 'This is another comment.', createdAt: new Date() },
        { user: { name: 'Jane Doe' }, message: 'This is another 2nd comment.', createdAt: new Date() }] as any[],
        createdAt: new Date() as any,
        updatedAt: new Date() as any
    } as Ticket])
    const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
    const [viewTicketDetails, setViewTicketDetails] = React.useState<boolean>(false)
    const [updateTicketView, setUpdateTicketView] = React.useState<boolean>(false)



    const FetchSelfTickets = async (viewWindow: 'view-tickets' | TicketStatus.CLOSED) => {
        try {
            let response
            if (viewWindow === TicketStatus.CLOSED) {
                response = await axios.get<Ticket[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets/status/${viewWindow}`, {
                    withCredentials: true
                })

            } else {
                response = await axios.get<Ticket[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets`, {
                    withCredentials: true
                })
            }

            if (response && response.status === 200) {
                const data = await response.data
                setTickets(data)
            } else {
                throw new Error('Failed to fetch tickets')
            }
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
            alert('Failed to fetch tickets, try again later')
        }
    }

    useEffect(() => {
        if (viewWindow !== 'create-tickets') {
            FetchSelfTickets(viewWindow)
        }
    }, [viewWindow === TicketStatus.CLOSED, viewWindow === 'view-tickets'])


    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Tickets</h1>
            <div className="flex justify-start gap-1 w-full mt-1">
                <div className="flex flex-col items-center justify-start gap-1 w-full">

                    <button className={`inline w-full rounded-sm ${viewWindow === 'create-tickets' ? 'bg-indigo-900 text-white hover:bg-indigo-950' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                        onClick={() => setViewWindow('create-tickets')}
                    >
                        Create Tickets
                    </button>
                    <button className={`inline w-full rounded-sm ${viewWindow === 'view-tickets' ? 'bg-indigo-900 text-white hover:bg-indigo-950' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                        onClick={() => setViewWindow('view-tickets')}
                    >
                        View Tickets
                    </button>
                </div>
                <div className="flex flex-col items-center justify-start gap-1 w-full">

                    <button className={`inline w-full rounded-sm ${viewWindow === TicketStatus.CLOSED ? 'bg-indigo-900 text-white hover:bg-indigo-950' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                        onClick={() => setViewWindow(TicketStatus.CLOSED)}
                    >
                        Closed Tickets
                    </button>
                    <SearchTicket userRole={UserRole.EMPLOYEE} setTickets={setTickets} />
                </div>
            </div>
            <div>
                {viewWindow === 'create-tickets' ? (
                    <div className="my-4 space-y-4 flex-1 rounded-sm bg-gray-100 p-4">
                        <CreateTicket />
                    </div>
                ) : (
                    <div>
                        {Array.isArray(tickets) && tickets.length > 0 ? (
                            <div className="my-4 space-y-4 flex flex-wrap gap-2 rounded-sm bg-slate-100 p-4 overflow-auto">
                                {tickets?.map((ticket) => (
                                    <div key={ticket.id} className="rounded-sm bg-white p-2 border border-slate-400 min-w-62.5 h-48">
                                        <h2 className='font-medium italic text-indigo-950'>{ticket.title}</h2>
                                        <p className='mt-2 text-sm text-slate-800'>
                                            <span className='rounded-xs px-1 bg-purple-100 text-sm text-slate-700'>Priority:</span>
                                            {' '+ticket.priority+' '}<span className=' border border-purple-400 rounded-sm ml-4 px-1 bg-transparent text-sm text-slate-700'>{ticket.status}</span>
                                        </p>
                                        <p className='mt-2 text-sm text-slate-800'>
                                            <span className='rounded-xs px-1 bg-mauve-100 text-sm text-slate-700'>Category:</span>
                                            {' '+ticket.category}
                                        </p>
                                        <p className='mt-2 text-sm text-slate-800'>
                                            <span className='rounded-xs px-1 bg-mauve-100 text-sm text-slate-700'>Created:</span>
                                            {' '+new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className='mt-2 text-sm text-slate-800'>
                                            <span className='rounded-xs px-1 bg-mauve-100 text-sm text-slate-700'>Updated:</span>
                                            {new Date(ticket.updatedAt).toLocaleDateString() ?? 'Not yet'}
                                        </p>

                                        <button onClick={() => {
                                            setSelectedTicket(ticket);
                                            setViewTicketDetails(true);
                                        }} className="mt-2 text-blue-600 hover:underline mx-1 cursor-pointer">
                                            View Details
                                        </button>
                                        {ticket.status === TicketStatus.OPEN && <button onClick={() => {
                                            setSelectedTicket(ticket);
                                            setUpdateTicketView(true);
                                        }} className="mt-2 text-orange-600 hover:underline mx-1 cursor-pointer">
                                            Update
                                        </button>}
                                    </div>
                                ))}
                            </div>) : (<div className="my-4 space-y-4 rounded-sm bg-slate-100 p-4"> <p>No {viewWindow} Ticket Available</p></div>)}
                    </div>)}
            </div>

            {(viewTicketDetails && selectedTicket) && (<ViewTicketDetails userRole={UserRole.EMPLOYEE} userId={employeeId}
                setTickets={setTickets}
                selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket}
                viewTicketDetails={viewTicketDetails} setViewTicketDetails={setViewTicketDetails} />)}

            {(updateTicketView && selectedTicket) && (<UpdateTicket
                selectedTicket={selectedTicket}
                setSelectedTicket={setSelectedTicket}
                setUpdateTicketView={setUpdateTicketView}
                setTickets={setTickets}
            />)}
        </div>
    )

}

export default EmployeeTickets
