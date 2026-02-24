import React, { useState, useMemo } from 'react';
import { Appointment, User, Role, Specialist, Service, Patient, AppointmentStatus } from '../types';
import { ChevronLeft, ChevronRight, Clock, User as UserIcon, MapPin, Video, Ban } from 'lucide-react';

interface CalendarViewProps {
  appointments: Appointment[];
  currentUser: User;
  users: (User | Specialist)[];
  services: Service[];
  patients: Patient[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 to 21:00
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const CalendarView: React.FC<CalendarViewProps> = ({ 
  appointments, 
  currentUser, 
  users, 
  services,
  patients,
  onAppointmentClick 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get start of the week (Monday)
  const startOfWeek = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }, [currentDate]);

  // Generate days for the header
  const weekDays = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, [startOfWeek]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateStart);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getPositionStyle = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startHour = startDate.getHours();
    const startMin = startDate.getMinutes();
    const endHour = endDate.getHours();
    const endMin = endDate.getMinutes();

    // Start from 8:00 (8 * 60 = 480 minutes)
    const startMinutesFrom8 = (startHour - 8) * 60 + startMin;
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    
    // Total minutes from 8:00 to 21:00 is 13 * 60 = 780
    // We use a slightly larger range to ensure 21:00 fits comfortably
    const totalMinutes = 13 * 60; 

    const top = (startMinutesFrom8 / totalMinutes) * 100;
    const height = (durationMinutes / totalMinutes) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px] md:h-[800px]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between bg-slate-50 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {startOfWeek.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-50 text-slate-600 border-r border-slate-200">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Hoy
            </button>
            <button onClick={handleNextWeek} className="p-2 hover:bg-slate-50 text-slate-600 border-l border-slate-200">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-500 w-full md:w-auto justify-center md:justify-end overflow-x-auto">
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-brand-blue"></div>
                <span>Online</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-brand-accent"></div>
                <span>Presencial</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-slate-400"></div>
                <span>Bloqueado</span>
            </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto relative flex">
        {/* Time Column */}
        <div className="w-16 flex-shrink-0 bg-slate-50 border-r border-slate-200">
          <div className="h-12 border-b border-slate-200"></div> {/* Header spacer */}
          <div className="relative h-[1300px]"> {/* Increased height for better spacing */}
            {HOURS.map(hour => (
              <div key={hour} className="absolute w-full text-right pr-2 text-xs text-slate-400 -mt-2" style={{ top: `${((hour - 8) / 13) * 100}%` }}>
                {hour}:00
              </div>
            ))}
          </div>
        </div>

        {/* Days Columns */}
        <div className="flex-1 flex overflow-x-auto">
          {weekDays.map((day, dayIndex) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div key={dayIndex} className="flex-1 min-w-[150px] border-r border-slate-100 relative bg-white">
                {/* Day Header */}
                <div className={`h-12 border-b border-slate-200 flex flex-col items-center justify-center sticky top-0 z-10 bg-white ${isToday ? 'bg-blue-50/50' : ''}`}>
                  <span className={`text-xs font-medium uppercase ${isToday ? 'text-brand-blue' : 'text-slate-500'}`}>
                    {DAYS[dayIndex]}
                  </span>
                  <span className={`text-lg font-bold ${isToday ? 'text-brand-blue' : 'text-slate-800'}`}>
                    {day.getDate()}
                  </span>
                </div>

                {/* Day Grid */}
                <div className="relative h-[1300px]">
                  {/* Grid Lines */}
                  {HOURS.map(hour => (
                    <div key={hour} className="absolute w-full border-b border-slate-50" style={{ top: `${((hour - 8) / 13) * 100}%` }}></div>
                  ))}

                  {/* Appointments */}
                  {dayAppointments.map(apt => {
                    const isBlocked = apt.status === AppointmentStatus.BLOCKED;
                    const service = services.find(s => s.id === apt.serviceId);
                    const specialist = users.find(u => u.id === apt.specialistId) as Specialist;
                    const patient = patients.find(p => p.id === apt.patientId);
                    const style = getPositionStyle(apt.dateStart, apt.dateEnd);
                    const isOnline = service?.type === 'ONLINE';

                    if (isBlocked) {
                        return (
                            <div
                                key={apt.id}
                                className="absolute left-1 right-1 rounded-lg p-2 text-xs bg-slate-100 border-l-4 border-slate-400 text-slate-500 flex items-center justify-center shadow-sm"
                                style={{ ...style, zIndex: 5 }}
                            >
                                <div className="flex items-center gap-1 font-medium">
                                    <Ban size={12} />
                                    <span>Bloqueado</span>
                                </div>
                            </div>
                        );
                    }

                    return (
                      <div
                        key={apt.id}
                        onClick={() => onAppointmentClick(apt)}
                        className={`absolute left-1 right-1 rounded-lg p-2 text-xs cursor-pointer transition-all hover:brightness-95 hover:z-20 shadow-sm border-l-4 overflow-hidden
                            ${isOnline ? 'bg-blue-50 border-brand-blue text-blue-900' : 'bg-teal-50 border-brand-accent text-teal-900'}
                        `}
                        style={{ ...style, zIndex: 10 }}
                      >
                        <div className="font-bold truncate">{patient?.firstName} {patient?.lastName}</div>
                        <div className="truncate opacity-90">{service?.name}</div>
                        
                        {(currentUser.role === Role.ADMIN || currentUser.role === Role.COORDINATOR) && (
                            <div className="flex items-center gap-1 mt-1 opacity-75 truncate">
                                <UserIcon size={10} />
                                <span>{specialist?.firstName} {specialist?.lastName}</span>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-1 mt-1 opacity-75">
                            {isOnline ? <Video size={10} /> : <MapPin size={10} />}
                            <span>{new Date(apt.dateStart).toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
