import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

export default function AppointmentCalendar({ 
  appointments = [], 
  slotBlockers = [],
  onSelectEvent,
  onEventDrop,
  onEventResize,
  view: controlledView,
  onViewChange,
  date: controlledDate,
  onNavigate
}) {
  const [currentView, setCurrentView] = useState(controlledView || 'month')
  const [currentDate, setCurrentDate] = useState(controlledDate || new Date())

  const view = controlledView || currentView
  const date = controlledDate || currentDate

  const handleViewChange = (newView) => {
    if (onViewChange) {
      onViewChange(newView)
    } else {
      setCurrentView(newView)
    }
  }

  const handleNavigate = (newDate) => {
    if (onNavigate) {
      onNavigate(newDate)
    } else {
      setCurrentDate(newDate)
    }
  }

  // Convert appointments to calendar events
  const events = appointments.map(apt => {
    const start = new Date(apt.appointment_date)
    // Calculate end time based on services duration or default to 1 hour
    const duration = apt.services?.reduce((sum, s) => sum + (s.duration || 60), 0) || 60
    const end = new Date(start.getTime() + duration * 60000)
    
    // Get color based on appointment color or status
    let backgroundColor = '#3174ad' // Default blue
    if (apt.color) {
      const colorMap = {
        'green': '#28a745',
        'yellow': '#ffc107',
        'red': '#dc3545',
        'blue': '#007bff',
        'orange': '#fd7e14',
        'purple': '#6f42c1'
      }
      backgroundColor = colorMap[apt.color] || apt.color
    } else {
      // Default colors by status
      const statusColors = {
        'scheduled': '#28a745', // green
        'pending': '#ffc107', // yellow
        'cancelled': '#dc3545', // red
        'completed': '#007bff' // blue
      }
      backgroundColor = statusColors[apt.status] || backgroundColor
    }

    return {
      id: apt.id,
      title: `${apt.customer?.name || 'Customer'} - ${apt.services?.map(s => s.name).join(', ') || 'Service'}`,
      start,
      end,
      resource: apt,
      backgroundColor,
      borderColor: backgroundColor
    }
  })

  // Convert slot blockers to calendar events (grayed out)
  const blockerEvents = slotBlockers.map(blocker => ({
    id: `blocker-${blocker.id}`,
    title: blocker.reason || 'Blocked',
    start: new Date(blocker.start_date),
    end: new Date(blocker.end_date),
    resource: blocker,
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
    allDay: false
  }))

  const allEvents = [...events, ...blockerEvents]

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        borderWidth: '2px',
        borderRadius: '4px',
        color: '#fff',
        padding: '2px 4px',
        fontSize: '12px'
      }
    }
  }

  const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('PREV')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{label}</h2>
          <Button variant="outline" size="sm" onClick={() => onNavigate('NEXT')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY')} className="ml-4">
            Today
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={view === 'month' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onView('month')}
          >
            Month
          </Button>
          <Button 
            variant={view === 'week' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onView('week')}
          >
            Week
          </Button>
          <Button 
            variant={view === 'day' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onView('day')}
          >
            Day
          </Button>
          <Button 
            variant={view === 'agenda' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onView('agenda')}
          >
            Agenda
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[600px] w-full">
      <DragAndDropCalendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        onSelectEvent={onSelectEvent}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        eventPropGetter={eventStyleGetter}
        components={{
          toolbar: CustomToolbar
        }}
        popup
        selectable
        resizable
      />
    </div>
  )
}
