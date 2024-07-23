'use client'

import { useState, useEffect } from 'react'
import { Event } from '@prisma/client'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', location: '', imageUrl: '', 
    startDateTime: '', endDateTime: '', price: '', isFree: false, 
    url: '', categoryId: '', organizerId: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const eventsPerPage = 10

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const response = await fetch('/api/events')
    const data = await response.json()
    setEvents(data)
  }

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })
    if (response.ok) {
      fetchEvents()
      setNewEvent({
        title: '', description: '', location: '', imageUrl: '', 
        startDateTime: '', endDateTime: '', price: '', isFree: false, 
        url: '', categoryId: '', organizerId: ''
      })
    }
  }

  const updateEvent = async (event: Event) => {
    setEditingEvent(event)
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return

    const response = await fetch('/api/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingEvent)
    })

    if (response.ok) {
      fetchEvents()
      setEditingEvent(null)
    } else {
      alert('Failed to update event')
    }
  }

  const deleteEvent = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (response.ok) fetchEvents()
    }
  }

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="p-8 rounded-xl shadow-lg bg-white max-w-7xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Events</h1>
      
      <form onSubmit={addEvent} className="mb-8 grid grid-cols-2 gap-4">
        <input
          type="text"
          value={newEvent.title}
          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
          placeholder="Event Title"
          className="border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <input
          type="text"
          value={newEvent.location}
          onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
          placeholder="Location"
          className="border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <input
          type="datetime-local"
          value={newEvent.startDateTime}
          onChange={(e) => setNewEvent({...newEvent, startDateTime: e.target.value})}
          className="border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <input
          type="datetime-local"
          value={newEvent.endDateTime}
          onChange={(e) => setNewEvent({...newEvent, endDateTime: e.target.value})}
          className="border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <input
          type="text"
          value={newEvent.price}
          onChange={(e) => setNewEvent({...newEvent, price: e.target.value})}
          placeholder="Price"
          className="border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={newEvent.isFree}
            onChange={(e) => setNewEvent({...newEvent, isFree: e.target.checked})}
            className="mr-2"
          />
          <label>Is Free</label>
        </div>
        <input
          type="text"
          value={newEvent.categoryId}
          onChange={(e) => setNewEvent({...newEvent, categoryId: e.target.value})}
          placeholder="Category ID"
          className="border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <input
          type="text"
          value={newEvent.organizerId}
          onChange={(e) => setNewEvent({...newEvent, organizerId: e.target.value})}
          placeholder="Organizer ID"
          className="border rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 col-span-2">Add Event</button>
      </form>

      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded-full p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentEvents.map(event => (
              <tr key={event.id} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(event.startDate).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(event.endDate).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.isFree ? 'Free' : event.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => updateEvent(event)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full mr-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105">Update</button>
                  <button onClick={() => deleteEvent(event.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:scale-105">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-4 py-2 rounded-full transition duration-300 ease-in-out ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {editingEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={editingEvent.startDate.toString().slice(0, 16)}
                  onChange={(e) => setEditingEvent({...editingEvent, startDate: new Date(e.target.value)})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={editingEvent.endDate.toString().slice(0, 16)}
                  onChange={(e) => setEditingEvent({...editingEvent, endDate: new Date(e.target.value)})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Event
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}