
import { Ticket, TicketStatus } from '@/CustomTypes/TicketType'
import { User, UserRole } from '@/CustomTypes/UserType'
import axios from 'axios'


import { useState, useEffect, useRef, useLayoutEffect } from 'react'


const ViewTicketDetails = ({ userRole, userId,
    setTickets,
    selectedTicket, setSelectedTicket,
    viewTicketDetails, setViewTicketDetails }: {
        userRole: UserRole | null, userId: string,
        setTickets: React.Dispatch<React.SetStateAction<Ticket[] | null>>,
        selectedTicket: Ticket | null,
        setSelectedTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
        viewTicketDetails: boolean, setViewTicketDetails: React.Dispatch<React.SetStateAction<boolean>>
    }) => {

    const [assignAbleAgents, setAssignAbleAgents] = useState<User[] | null>(null)
    const [selectedAgent, setSelectedAgent] = useState<string>("Assign To Agent")

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [value, setValue] = useState("") //post comment textarea value

    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [selectedComment, setSelectedComment] = useState<string>('')
    const [editCommentValue, setEditCommentValue] = useState<string>('')
    const commentTextareaRef = useRef<HTMLTextAreaElement>(null)






    useEffect(() => {
        if (userRole === UserRole.ADMIN &&
            (selectedTicket?.status === TicketStatus.OPEN ||
                selectedTicket?.status === TicketStatus.REJECTED)) {
            const fetchAssignAbleAgents = async () => {
                try {

                    const response = await axios.get<User[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/role/${UserRole.AGENT}`, {
                        withCredentials: true
                    })

                    console.log(response.status)
                    if (response.status === 200) {
                        const data = await response.data
                        setAssignAbleAgents(data)
                    }
                }
                catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        alert(error.response.data?.message)
                    }
                }
            }
            fetchAssignAbleAgents()
        }
    }, [selectedTicket])

    useLayoutEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = textareaRef.current?.scrollHeight + "px"
        }
    }, [value])

    useLayoutEffect(() => {
        if (commentTextareaRef.current) {
            commentTextareaRef.current.style.height = "auto"
            commentTextareaRef.current.style.height = commentTextareaRef.current?.scrollHeight + "px"
        }
    }, [editCommentValue])

    const handleAssignAgent = async (agentId: string) => {
        if (userRole !== UserRole.ADMIN) {
            alert('Only Admins can assign agents')
            return
        }
        if (!agentId || agentId === "Assign To Agent") {
            alert('Please select an agent to assign')
            return
        }

        if (selectedTicket?.status !== TicketStatus.OPEN && selectedTicket?.status !== TicketStatus.REJECTED) {
            alert('Only OPEN or REJECTED tickets can be assigned')
            return
        }
        if (confirm(`Assign '${assignAbleAgents?.find((a) => a.id === agentId)?.name}' to this ticket?`) === false) return

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/admin/tickets/assign/${selectedTicket?.id}`, {
                assignedToId: agentId
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                const data = await response.data
                alert('Agent assigned successfully')
                if (data !== null) {
                    setSelectedTicket(data)
                    setTickets((prev) => {
                        if (!prev) return prev
                        const updatedTickets = prev.filter((ticket) => ticket.id !== data?.id)
                        return updatedTickets
                    })
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }

    const handlePostComment = async () => {
        if (value.trim().length === 0) {
            alert('Comment cannot be empty')
            return
        }
        try {
            let response

            if (userRole === UserRole.ADMIN) {
                response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/tickets/comments/${selectedTicket?.id}`, {
                    comment: value
                }, {
                    withCredentials: true
                })
            }
            else if (userRole === UserRole.AGENT) {
                response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/agent/tickets/comments/${selectedTicket?.id}`, {
                    comment: value
                }, {
                    withCredentials: true
                })
            }
            else if (userRole === UserRole.EMPLOYEE) {

                response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets/comments/${selectedTicket?.id}`, {
                    comment: value
                }, {
                    withCredentials: true
                })
            } else {
                alert('Invalid user role')
                return
            }

            if (response?.status === 201) {
                alert('Comment posted successfully')
                setValue("")
                setSelectedTicket((prev) => {
                    if (!prev) return prev
                    const updatedComments = [...prev.comments, response.data]
                    return { ...prev, comments: updatedComments }
                })
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.map((ticket) => {
                        if (ticket.id === selectedTicket?.id) {
                            const updatedComments = [...ticket.comments, response.data]
                            return { ...ticket, comments: updatedComments }
                        }
                        return ticket
                    })
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }

    const DeleteTicket = async () => {
        if (userRole !== UserRole.EMPLOYEE) {
            alert('Only Employees can delete tickets')
            return
        }
        if (selectedTicket?.status !== TicketStatus.OPEN) {
            alert('Only OPEN tickets can be deleted')
            return
        }

        const confirmDelete = confirm(`Delete '${selectedTicket?.title}' this ticket?`)
        if (!confirmDelete) return

        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets/${selectedTicket?.id}`, {
                withCredentials: true
            })
            if (response.status === 200) {
                alert('Ticket deleted successfully')
                setViewTicketDetails(false)
                setSelectedTicket(null)
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.filter((ticket) => ticket.id !== selectedTicket?.id)
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }
    const CloseTicket = async () => {

        if (userRole !== UserRole.EMPLOYEE) {
            alert('Only Employees can Close tickets')
            return
        }

        if (selectedTicket?.status !== TicketStatus.RESOLVED) {
            alert('Only RESOLVED tickets can be closed')
            return
        }

        const confirmClose = confirm(`Close '${selectedTicket?.title}' this ticket?`)
        if (!confirmClose) return

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets/status/${selectedTicket?.id}`, {
                status: TicketStatus.CLOSED
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                alert('Ticket closed successfully')
                setViewTicketDetails(false)
                setSelectedTicket(null)
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.filter((ticket) => ticket.id !== selectedTicket?.id)
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }
    const ResolveTicket = async () => {

        if (userRole !== UserRole.AGENT) {
            alert('Only Agents can resolve tickets')
            return
        }

        if (selectedTicket?.status !== TicketStatus.IN_PROGRESS) {
            alert('Only IN_PROGRESS tickets can be resolved')
            return
        }

        const confirmResolve = confirm(`Resolve '${selectedTicket?.title}' this ticket?`)
        if (!confirmResolve) return

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/agent/tickets/status/${selectedTicket?.id}`, {
                status: TicketStatus.RESOLVED
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                alert('Ticket resolved successfully')
                setViewTicketDetails(false)
                setSelectedTicket(null)
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.filter((ticket) => ticket.id !== selectedTicket?.id)
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }
    const RejectTicket = async () => {

        if (userRole !== UserRole.AGENT) {
            alert('Only Agents can reject tickets')
            return
        }

        if (selectedTicket?.status !== TicketStatus.IN_PROGRESS) {
            alert('Only IN_PROGRESS tickets can be rejected')
            return
        }

        const confirmReject = confirm(`Reject '${selectedTicket?.title}' this ticket?`)
        if (!confirmReject) return

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/agent/tickets/status/${selectedTicket?.id}`, {
                status: TicketStatus.REJECTED
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                alert('Ticket rejected successfully')
                setViewTicketDetails(false)
                setSelectedTicket(null)
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.filter((ticket) => ticket.id !== selectedTicket?.id)
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }

    const UpdateComment = async () => {

        const updatedComment = editCommentValue.trim()
        
        if (updatedComment === '') {
            alert('Comment is empty')
            return
        }

        if (!selectedComment) {
            alert('No comment selected')
            return
        }

        let url = ''

        if(userRole === UserRole.ADMIN)
        {
            url = `${process.env.NEXT_PUBLIC_API_URL}/admin`
        }else if(userRole === UserRole.AGENT)
        {
            url = `${process.env.NEXT_PUBLIC_API_URL}/agent`
        }else if(userRole === UserRole.EMPLOYEE)
        {
            url = `${process.env.NEXT_PUBLIC_API_URL}/employee`
        }else{
            alert('Invalid user role')
            return
        }

        try {
            const response = await axios.patch(`${url}/tickets/comments/${selectedTicket?.id}/${selectedComment}`,
                {comment: updatedComment}, {
                    withCredentials:true
                }
            )

            if(response.status === 200)
            {
                const data = await response.data

                if(data !== null)
                {
                    
                    setSelectedTicket((ticket) => (ticket && {...ticket, comments: ticket?.comments?.map(comment => comment.id === data?.id ? data : comment)}))
                    setTickets((tickets) => tickets ? tickets.map(ticket => ticket.id === selectedTicket?.id ? {...ticket, comments: ticket.comments?.map(comment => comment.id === data?.id ? data : comment)} : ticket) : tickets)
                    setSelectedComment('')
                    setEditCommentValue('')
                    setIsEdit(false)
                }
            }

        } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    alert( error.response.data?.message)
                }else if(error instanceof Error){
                    alert(error.message)
                }
        }
    }
    const DeleteComment = async (commentId: string) => {

        if(!commentId)
        {
            alert('Invalid comment ID')
            return
        }

        const confirmDelete = confirm(`Delete this comment?`)

        if(!confirmDelete) return

        let url = ''

        if(userRole === UserRole.ADMIN)
        {
            url = `${process.env.NEXT_PUBLIC_API_URL}/admin`
        }else if(userRole === UserRole.AGENT)
        {
            url = `${process.env.NEXT_PUBLIC_API_URL}/agent`
        }else if(userRole === UserRole.EMPLOYEE)
        {
            url = `${process.env.NEXT_PUBLIC_API_URL}/employee`
        }else{
            alert('Invalid user role')
            return
        }

        try {
            const response = await axios.delete(`${url}/tickets/comments/${selectedTicket?.id}/${commentId}`, {
                withCredentials:true
            })

            if(response.status === 200)
            {
                const data = await response.data

                if(data === true)
                {
                    
                    setSelectedTicket((ticket) => (ticket && {...ticket, comments: ticket?.comments?.filter(comment => comment.id !== commentId)}))
                    setTickets((tickets) => tickets ? tickets.map(ticket => ticket.id === selectedTicket?.id ? {...ticket, comments: ticket.comments?.filter(comment => comment.id !== commentId)} : ticket) : tickets)

                }
            }

        } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    alert( error.response.data?.message)
                }else if(error instanceof Error){
                    alert(error.message)
                }
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-[90%] rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-5 flex flex-col items-start justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Ticket Details</h2> 
                    <div className="flex w-full items-center justify-between">
                        <p className="mt-1 text-sm text-slate-500">
                            {selectedTicket?.title}
                        </p>
                        <span className="mt-1 text-sm text-slate-700 border border-slate-300 rounded-md px-2 py-1">
                            {selectedTicket?.id}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${selectedTicket?.priority === 'HIGH' ? 'bg-red-100 text-red-800' : selectedTicket?.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {selectedTicket?.priority}
                        </span>
                        <div>
                            {ReturnStatusStyle(selectedTicket?.status)}
                        </div>
                    </div>
                        <p className="my-1 text-sm text-slate-500">
                            Category: {selectedTicket?.category} 
                            <span className="mx-2">|</span> Created At: {new Date(selectedTicket?.createdAt || '').toLocaleString()}
                            <span className="mx-2">|</span> Updated At: {new Date(selectedTicket?.updatedAt || '').toLocaleString()}
                            <span className="mx-2">|</span> Resolved At: {selectedTicket?.resolvedAt ? new Date(selectedTicket?.resolvedAt || '').toLocaleString() : 'Not yet'}
                        </p>
                        
                    <div className="flex flex-col items-start gap-2 mt-2">
                        <span className="text-sm text-slate-500">Created by: 
                            <span className='text-sm text-blue-950 font-medium'>{' '+selectedTicket?.createdBy?.name}</span></span>
                        <span className="text-sm text-slate-500">Assigned to: 
                            <span className='text-sm text-blue-950 font-medium'>{' '+selectedTicket?.assignedTo ? selectedTicket?.assignedTo?.name : 'Unassigned'}</span></span>
                        {userRole === UserRole.ADMIN && (selectedTicket?.status === TicketStatus.OPEN ||
                            selectedTicket?.status === TicketStatus.REJECTED) && <div>
                                <select className='border-2 border-slate-500 outline-slate-700' defaultValue={selectedAgent}
                                    onChange={(e) => setSelectedAgent(e.target.value)}>
                                    <option value="Assign To Agent" disabled>
                                        Assign To Agent
                                    </option>
                                    {assignAbleAgents && assignAbleAgents.length > 0 ? (
                                        assignAbleAgents.map((agents, index) => agents.id !== selectedTicket?.assignedTo?.id && (<option key={index} value={agents.id}>{agents.name}-{agents.email}</option>))
                                    ) : (<option disabled>No Agent availabe</option>)}
                                </select>
                                <button className='bg-green-300 hover:bg-green-500 px-4 py-1.5 m-2 rounded-md text-white'
                                    onClick={() => handleAssignAgent(selectedAgent)}
                                    disabled={(!selectedAgent || selectedAgent === "Assign To Agent") || assignAbleAgents?.length === 0}
                                >
                                    Assign
                                </button>
                            </div>}
                    </div>
                    <div className="mt-4 text-xs text-slate-700 w-[75%]">
                        <p className=''> Description:</p>
                        <textarea className="text-sm text-indigo-950 border border-slate-300 px-3 py-1.5 resize-none w-full h-24" disabled
                        defaultValue={selectedTicket?.description}>
                        </textarea>
                    </div>

                    <div className="w-full flex justify-between gap-2 mt-4 max-h-60 rounded-lg bg-slate-50 p-4">
                        <div className='min-w-[45%] overflow-auto'>

                            <h3 className="text-lg font-semibold text-slate-900">Comments</h3>
                            {selectedTicket?.comments.length === 0 ? (
                                <p className="text-sm text-slate-500">No comments yet.</p>
                            ) : (
                                <ul className="space-y-2 ">
                                    {selectedTicket?.comments.map((comment, index) => (
                                        <li key={index} className="text-sm text-slate-700 bg-slate-100 p-3 rounded-lg">
                                            <span className="font-medium bg-slate-200 p-1 rounded">
                                                {comment.user.name}:
                                            </span> {(isEdit && selectedComment === comment.id) ? (
                                                <textarea
                                                    className="border border-slate-300 p-1 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 resize-none"
                                                    ref={commentTextareaRef}
                                                    value={editCommentValue}
                                                    onChange={(e) => setEditCommentValue(e.target.value) }></textarea>
                                            ) : comment.message} - <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                            {(userId && comment.user.id === userId) && (
                                                !isEdit ? <div>
                                                    <button className='ml-2 text-xs text-red-500 hover:underline'
                                                        onClick={() => {
                                                            setEditCommentValue(comment.message)
                                                            setIsEdit(true)
                                                            setSelectedComment(comment.id)
                                                        }}>
                                                        Edit
                                                    </button>
                                                    <button className='ml-2 text-xs text-red-500 hover:underline'
                                                    onClick={()=>DeleteComment(comment.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div> : <div>
                                                    <button className='ml-2 text-xs text-red-500 hover:underline'
                                                        onClick={() => UpdateComment()}>
                                                        Update
                                                    </button>
                                                    <button className='ml-2 text-xs text-red-500 hover:underline'
                                                        onClick={() => {
                                                            setEditCommentValue('')
                                                            setIsEdit(false)
                                                            setSelectedComment('')
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {selectedTicket?.status !== TicketStatus.CLOSED && (
                            <div className="flex w-[45%] flex-col items-end gap-2">
                                <textarea wrap='soft' className="w-full rounded-lg border border-slate-300 p-2 
                                        text-sm text-slate-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 resize-none"
                                    ref={textareaRef}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Add a comment...">
                                </textarea>
                                <button className='block bg-transparent border-b rounded-md px-3 py-1 hover:text-blue-700 border-b-blue-500 hover:border-2
                                         hover:border-blue-600 transition-all delay-25 duration-50 ease-in-out cursor-pointer'
                                    onClick={handlePostComment}>
                                    Post Comment
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between gap-3 pt-3 w-full">
                        <button
                            type="button"
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            onClick={() => {
                                setViewTicketDetails(false)
                                setSelectedTicket(null)
                            }}
                        >
                            Close
                        </button>
                        <div className="flex gap-2">

                            {userRole === UserRole.EMPLOYEE && selectedTicket?.status === TicketStatus.OPEN && (
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    onClick={() => DeleteTicket()}
                                >
                                    Delete Ticket
                                </button>)}

                            {userRole === UserRole.EMPLOYEE && selectedTicket?.status === TicketStatus.RESOLVED && (
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    onClick={() => CloseTicket()}
                                >
                                    Close Ticket
                                </button>)}

                            {userRole === UserRole.AGENT && selectedTicket?.status === TicketStatus.IN_PROGRESS && (
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    onClick={() => ResolveTicket()}
                                >
                                    Resolve Ticket
                                </button>)}

                            {userRole === UserRole.AGENT && selectedTicket?.status === TicketStatus.IN_PROGRESS && (
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    onClick={() => RejectTicket()}
                                >
                                    Reject Ticket
                                </button>)}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewTicketDetails



function ReturnStatusStyle(status: TicketStatus | undefined) {
    if (status === TicketStatus.OPEN) {

        return (
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-blue-100 text-blue-800">{status}</span>
        )

    }
    else if (status === TicketStatus.IN_PROGRESS) {
        return (
            <>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">{TicketStatus.OPEN}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-yellow-100 text-yellow-800">{status}</span>
            </>
        )
    }
    else if (status === TicketStatus.REJECTED) {
        return (
            <>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">{TicketStatus.OPEN}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">{TicketStatus.IN_PROGRESS}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-red-100 text-red-800">{status}</span>
            </>
        )
    }
    else if (status === TicketStatus.RESOLVED) {
        return (
            <>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">{TicketStatus.OPEN}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">{TicketStatus.IN_PROGRESS}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-green-100 text-green-800">{status}</span>
            </>
        )
    }
    else {
        return (
            <>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">{TicketStatus.OPEN}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">{TicketStatus.IN_PROGRESS}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800">{TicketStatus.RESOLVED}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-gray-100 text-gray-800">{status}</span>
            </>
        )
    }
}