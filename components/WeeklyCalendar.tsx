import React, { useState } from 'react';
import { Appointment, Role, User, ServiceType } from '../types';
import { SERVICES, USERS, PATIENTS } from '../services/mockDb';
import { ChevronLeft, ChevronRight, Video, MapPin } from 'lucide-react';

interface WeeklyCalendarProps {
  appointments: Appointment[];
  currentUser: User;
}

const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => i + 9);
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ appointments, currentUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekDates = (baseDate: Date) => {
    const current = new Date(baseDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(current);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates.push(d);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentDate);

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const isSameDate = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const getAppointmentsForSlot = (date: Date, hour: number) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateStart);
      return isSameDate(aptDate, date) && aptDate.getHours() === hour;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[800px]">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800 capitalize">
            {weekDates[0].toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button onClick={prevWeek} className="p-1 hover:bg-white rounded-md transition-colors">
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <button onClick={nextWeek} className="p-1 hover:bg-white rounded-md transition-colors">
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-slate-600">Online</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Presencial</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b border-slate-100 sticky top-0 bg-white z-10">
            <div className="p-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-100">
              Hora
            </div>
            {weekDates.map((date, i) => (
              <div key={i} className={`p-3 text-center border-r border-slate-100 ${isSameDate(date, new Date()) ? 'bg-blue-50/50' : ''}`}>
                <div className="text-xs font-medium text-slate-500 uppercase mb-1">{DAYS[i]}</div>
                <div className={`text-lg font-bold ${isSameDate(date, new Date()) ? 'text-brand-blue' : 'text-slate-800'}`}>
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>

          {TIME_SLOTS.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-slate-50 min-h-[100px]">
              <div className="p-2 text-xs font-medium text-slate-400 text-center border-r border-slate-100 relative">
                <span className="-top-3 relative bg-white px-1">
                  {hour}:00
                </span>
              </div>

              {weekDates.map((date, dayIndex) => {
                const slotAppointments = getAppointmentsForSlot(date, hour);
                const isToday = isSameDate(date, new Date());

                return (
                  <div key={dayIndex} className={`relative border-r border-slate-100 p-1 ${isToday ? 'bg-blue-50/10' : ''}`}>
                    <div className="flex gap-1 h-full w-full overflow-x-auto">
                      {slotAppointments.map(apt => {
                        const service = SERVICES.find(s => s.id === apt.serviceId);
                        const specialist = USERS.find(u => u.id === apt.specialistId);
                        const patient = PATIENTS.find(p => p.id === apt.patientId);
                        const isOnline = service?.type === ServiceType.ONLINE;
                        
                        const bgColor = isOnline ? 'bg-blue-100 border-blue-200' : 'bg-emerald-100 border-emerald-200';
                        const textColor = isOnline ? 'text-blue-700' : 'text-emerald-700';

                        return (
                          <div 
                            key={apt.id}
                            className={`flex-1 min-w-[100px] rounded-lg border p-2 text-xs ${bgColor} ${textColor} shadow-sm cursor-pointer hover:opacity-90 transition-opacity flex flex-col justify-between`}
                            title={`${service?.name} - ${specialist?.firstName} ${specialist?.lastName}`}
                          >
                            <div>
                              <div className="font-bold truncate">{patient?.firstName} {patient?.lastName}</div>
                              <div className="truncate opacity-80 text-[10px]">{service?.name}</div>
                            </div>
                            
                            <div className="mt-1 flex items-center justify-between">
                               {currentUser.role !== Role.PROFESSIONAL && (
                                 <div className="flex items-center gap-1 truncate max-w-[70%]">
                                    <div 
                                      className="w-4 h-4 rounded-full bg-slate-200 flex-shrink-0" 
                                      style={{ backgroundImage: `url(${specialist?.avatarUrl})`, backgroundSize: 'cover' }}
                                    />
                                    <span className="truncate text-[10px]">{specialist?.firstName}</span>
                                 </div>
                               )}
                               
                               {isOnline ? <Video size={12} /> : <MapPin size={12} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
