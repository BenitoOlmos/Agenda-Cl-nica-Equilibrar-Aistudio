import React, { useState, useMemo, useEffect } from 'react';
import { Appointment, User, Role, Specialist, Service, Patient, AppointmentStatus, PaymentStatus } from '../types';
import { ChevronLeft, ChevronRight, Clock, User as UserIcon, MapPin, Video, Ban, DollarSign, CheckCircle } from 'lucide-react';

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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

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
    const totalMinutes = 13 * 60; 

    const top = (startMinutesFrom8 / totalMinutes) * 100;
    const height = (durationMinutes / totalMinutes) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`
    };
  };

  const getCurrentTimePosition = () => {
    const now = currentTime;
    const startHour = now.getHours();
    const startMin = now.getMinutes();
    
    if (startHour < 8 || startHour >= 21) return null;

    const startMinutesFrom8 = (startHour - 8) * 60 + startMin;
    const totalMinutes = 13 * 60;
    
    return (startMinutesFrom8 / totalMinutes) * 100;
  };

  const currentTimeTop = getCurrentTimePosition();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px] md:h-[800px]">
      {/* Controls Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between bg-slate-50 gap-4 flex-shrink-0">
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

      {/* Scrollable Calendar Area */}
      <div className="flex-1 overflow-auto relative bg-white">
        <div className="min-w-[800px] h-full flex flex-col">
            
            {/* Sticky Header Row (Days) */}
            <div className="flex border-b border-slate-200 sticky top-0 z-30 bg-white shadow-sm">
                <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50 sticky left-0 z-40"></div>
                {weekDays.map((day, dayIndex) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    return (
                        <div key={dayIndex} className={`flex-1 h-14 flex flex-col items-center justify-center border-r border-slate-100 ${isToday ? 'bg-blue-50/30' : ''}`}>
                            <span className={`text-xs font-semibold uppercase tracking-wider ${isToday ? 'text-brand-blue' : 'text-slate-500'}`}>
                                {DAYS[dayIndex]}
                            </span>
                            <div className={`text-lg font-bold leading-none mt-0.5 w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-800'}`}>
                                {day.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Grid Body */}
            <div className="flex relative flex-1 min-h-[1300px]">
                {/* Time Column */}
                <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50 sticky left-0 z-20">
                    {HOURS.map(hour => (
                        <div key={hour} className="absolute w-full text-right pr-2 text-xs font-medium text-slate-400 -mt-2.5" style={{ top: `${((hour - 8) / 13) * 100}%` }}>
                            {hour}:00
                        </div>
                    ))}
                </div>

                {/* Days Columns */}
                {weekDays.map((day, dayIndex) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    const isToday = day.toDateString() === new Date().toDateString();

                    return (
                        <div key={dayIndex} className={`flex-1 relative border-r border-slate-100 ${isToday ? 'bg-blue-50/10' : ''}`}>
                            {/* Grid Lines */}
                            {HOURS.map(hour => (
                                <React.Fragment key={hour}>
                                    {/* Hour line */}
                                    <div className="absolute w-full border-b border-slate-100" style={{ top: `${((hour - 8) / 13) * 100}%` }}></div>
                                    {/* Half-hour line (dashed) */}
                                    {hour < 21 && (
                                        <div className="absolute w-full border-b border-slate-50 border-dashed" style={{ top: `${((hour - 8 + 0.5) / 13) * 100}%` }}></div>
                                    )}
                                </React.Fragment>
                            ))}

                            {/* Current Time Indicator */}
                            {isToday && currentTimeTop !== null && (
                                <div 
                                    className="absolute w-full border-t-2 border-red-400 z-20 pointer-events-none flex items-center"
                                    style={{ top: `${currentTimeTop}%` }}
                                >
                                    <div className="w-2 h-2 bg-red-400 rounded-full -ml-1"></div>
                                </div>
                            )}

                            {/* Appointments */}
                            {dayAppointments.map(apt => {
                                const isBlocked = apt.status === AppointmentStatus.BLOCKED;
                                const service = services.find(s => s.id === apt.serviceId);
                                const specialist = users.find(u => u.id === apt.specialistId) as Specialist;
                                const patient = patients.find(p => p.id === apt.patientId);
                                const style = getPositionStyle(apt.dateStart, apt.dateEnd);
                                const isOnline = service?.type === 'ONLINE';
                                const isPaid = apt.paymentStatus === PaymentStatus.PAID;

                                if (isBlocked) {
                                    return (
                                        <div
                                            key={apt.id}
                                            className="absolute left-1 right-1 rounded-md p-1 bg-slate-100 border-l-4 border-slate-400 flex items-center justify-center shadow-sm opacity-80"
                                            style={{ ...style, zIndex: 5 }}
                                        >
                                            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium transform -rotate-0">
                                                <Ban size={12} />
                                                <span className="hidden sm:inline">Bloqueado</span>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={apt.id}
                                        onClick={() => onAppointmentClick(apt)}
                                        className={`absolute left-1 right-1 rounded-md p-1.5 cursor-pointer transition-all hover:brightness-95 hover:z-30 hover:shadow-md border-l-4 overflow-hidden group
                                            ${isOnline 
                                                ? 'bg-blue-50 border-brand-blue text-blue-900' 
                                                : 'bg-teal-50 border-brand-accent text-teal-900'}
                                        `}
                                        style={{ ...style, zIndex: 10 }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="font-bold text-xs truncate pr-4">
                                                {patient?.firstName} {patient?.lastName}
                                            </div>
                                            {isPaid && (
                                                <div className="text-green-600" title="Pagado">
                                                    <CheckCircle size={10} />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="text-[10px] leading-tight opacity-90 truncate mt-0.5 font-medium">
                                            {service?.name}
                                        </div>
                                        
                                        {(currentUser.role === Role.ADMIN || currentUser.role === Role.COORDINATOR) && (
                                            <div className="flex items-center gap-1 mt-1 opacity-75 truncate text-[10px]">
                                                <UserIcon size={9} />
                                                <span>{specialist?.firstName} {specialist?.lastName}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center gap-1 mt-auto pt-1 opacity-75 text-[10px]">
                                            {isOnline ? <Video size={9} /> : <MapPin size={9} />}
                                            <span>
                                                {new Date(apt.dateStart).toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})} - 
                                                {new Date(apt.dateEnd).toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
