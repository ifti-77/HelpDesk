"use client"
import React, { useEffect} from 'react'
import { Ticket, TicketStatus } from '@/CustomTypes/TicketType'
import { UserRole } from '@/CustomTypes/UserType'
import axios from 'axios'
import ViewTicketDetails from './ViewTicketDetails'
function AdminTickets() {
    const [viewWindow, setViewWindow] = React.useState<TicketStatus.OPEN | TicketStatus.IN_PROGRESS | TicketStatus.REJECTED>(TicketStatus.OPEN)
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
    const [viewTicketDetails, setViewTicketDetails] = React.useState(false)



    const FetchStatusBaseTickets = async (status: TicketStatus) => {
        try {

            const response = await axios.get<Ticket[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/admin/tickets/status/${status}`, {
                withCredentials: true
            })

            if (response.status === 200) {
                const data = await response.data
                setTickets(data)
            }
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }

    useEffect(()=>{
        FetchStatusBaseTickets(viewWindow)
    }, [viewWindow])

    


    return (
        <div>
            <div>

                <h1 className="text-3xl font-bold text-slate-900">Manage Tickets</h1>
                <button className={`inline w-[50%] rounded-lg ${viewWindow === TicketStatus.OPEN ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                    onClick={() => setViewWindow(TicketStatus.OPEN)}
                >
                    Newly Opened Tickets
                </button>
                <button className={`inline w-[50%] rounded-lg ${viewWindow === TicketStatus.IN_PROGRESS ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                    onClick={() => setViewWindow(TicketStatus.IN_PROGRESS)}
                >
                    In-Progress Tickets
                </button>
                <button className={`inline w-[50%] rounded-lg ${viewWindow === TicketStatus.REJECTED ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                    onClick={() => setViewWindow(TicketStatus.REJECTED)}
                >
                    Rejected Tickets
                </button>
            </div>
            {Array.isArray(tickets) && tickets.length > 0? (<div className="my-4 space-y-4 flex-1 rounded-lg bg-slate-100 p-4">
                {tickets?.map((ticket) => (
                    <div key={ticket.id}>
                        <h2>{ticket.title}</h2>
                        <p><span>{ticket.priority}</span></p>
                        <p>{ticket.description}</p>
                        <button onClick={() => {
                            setSelectedTicket(ticket);
                            setViewTicketDetails(true);
                        }} className="text-blue-600 hover:underline">
                            View Details
                        </button>
                    </div>
                ))}
            </div>):(<div className="my-4 space-y-4 rounded-lg bg-slate-100 p-4"> <p>No {viewWindow} Ticket Available</p></div>)}


            {(viewTicketDetails && selectedTicket) && (<ViewTicketDetails userRole={UserRole.ADMIN} 
            selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} 
            viewTicketDetails={viewTicketDetails} setViewTicketDetails={setViewTicketDetails} />)}
        </div>
    )
}

export default AdminTickets


