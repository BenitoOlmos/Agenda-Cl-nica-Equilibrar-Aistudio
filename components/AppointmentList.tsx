import React, { useEffect, useState } from 'react';
import { Appointment, Role, User, AppointmentStatus, Patient, PaymentStatus } from '../types';
import { getAppointments, SERVICES, USERS, PATIENTS } from '../services/mockData';
import { Clock, Video, MapPin, CheckCircle, X, Calendar, List, Ban } from 'lucide-react';
import CalendarView from './CalendarView';
import ClinicalRecordView from './ClinicalRecordView';
import BlockTimeModal from './BlockTimeModal';

interface AppointmentListProps {
  currentUser: User;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ currentUser }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('CALENDAR');
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState<Patient | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  useEffect(() => {
    getAppointments().then(data => {
      let filtered = data;
      // Los especialistas solo ven sus citas
      if (currentUser.role === Role.PROFESSIONAL) {
        filtered = data.filter(a => a.specialistId === currentUser.id);
      }
      // Coordinadores y Admin ven todo (podría filtrarse más si se desea)
      setAppointments(filtered);
    });
  }, [currentUser]);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED: return 'bg-green-100 text-green-700';
      case AppointmentStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case AppointmentStatus.CANCELLED: return 'bg-red-100 text-red-700';
      case AppointmentStatus.BLOCKED: return 'bg-slate-200 text-slate-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAppointmentClick = (apt: Appointment) => {
    if (apt.status === AppointmentStatus.BLOCKED) return;

    // If specialist, open clinical record
    if (currentUser.role === Role.PROFESSIONAL) {
        const patient = PATIENTS.find(p => p.id === apt.patientId);
        if (patient) {
            setSelectedPatientForRecord(patient);
        }
    } else {
        // For admins/coordinators, maybe show details modal (not implemented yet)
        alert(`Cita: ${apt.id} - ${apt.status}`);
    }
  };

  const handleBlockTime = (date: string, startTime: string, endTime: string) => {
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const newBlockedSlot: Appointment = {
      id: `blocked-${Date.now()}`,
      patientId: 'blocked',
      specialistId: currentUser.id,
      serviceId: 'blocked',
      dateStart: start.toISOString(),
      dateEnd: end.toISOString(),
      status: AppointmentStatus.BLOCKED,
      paymentStatus: PaymentStatus.PAID // Irrelevant for blocked
    };

    setAppointments([...appointments, newBlockedSlot]);
    setIsBlockModalOpen(false);
  };

  if (selectedPatientForRecord) {
      return (
          <ClinicalRecordView 
            patient={selectedPatientForRecord}
            currentUser={currentUser}
            onBack={() => setSelectedPatientForRecord(null)}
          />
      );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {currentUser.role === Role.PROFESSIONAL ? 'Mi Agenda' : 'Agenda General'}
        </h2>
        
        <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg mr-2">
                <button 
                    onClick={() => setViewMode('LIST')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'LIST' ? 'bg-white shadow-sm text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <List size={20} />
                </button>
                <button 
                    onClick={() => setViewMode('CALENDAR')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'CALENDAR' ? 'bg-white shadow-sm text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Calendar size={20} />
                </button>
            </div>

            {currentUser.role === Role.PROFESSIONAL && (
              <button 
                onClick={() => setIsBlockModalOpen(true)}
                className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors mr-2"
              >
                <Ban size={16} />
                Bloquear
              </button>
            )}

            {/* Solo coordinadores y administradores suelen agendar manualmente en el dashboard principal en este diseño simplificado */}
            {(currentUser.role === Role.ADMIN || currentUser.role === Role.COORDINATOR) && (
                <button className="bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors shadow-sm shadow-teal-200">
                + Nueva Cita
                </button>
            )}
        </div>
      </div>

      {viewMode === 'CALENDAR' ? (
          <CalendarView 
            appointments={appointments}
            currentUser={currentUser}
            users={USERS}
            services={SERVICES}
            patients={PATIENTS}
            onAppointmentClick={handleAppointmentClick}
          />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {appointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
                No hay citas programadas para el criterio seleccionado.
            </div>
            ) : (
            <ul className="divide-y divide-slate-100">
                {appointments.map(apt => {
                if (apt.status === AppointmentStatus.BLOCKED) return null; // Don't show blocked in list view for now

                const service = SERVICES.find(s => s.id === apt.serviceId);
                const specialist = USERS.find(u => u.id === apt.specialistId);
                const patient = PATIENTS.find(p => p.id === apt.patientId);
                const date = new Date(apt.dateStart);

                return (
                    <li key={apt.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleAppointmentClick(apt)}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        
                        {/* Fecha y Hora */}
                        <div className="flex items-start gap-4">
                        <div className="bg-blue-50 text-brand-blue p-3 rounded-xl flex flex-col items-center min-w-[70px]">
                            <span className="text-xs font-bold uppercase">{date.toLocaleDateString('es-CL', { month: 'short' })}</span>
                            <span className="text-xl font-bold">{date.getDate()}</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">{service?.name}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            <span className="font-medium text-brand-blue">
                                Paciente: {patient?.firstName} {patient?.lastName}
                            </span>
                            </p>
                            {/* Mostrar Especialista si el usuario NO es el especialista (ej. Admin/Coord) */}
                            {currentUser.role !== Role.PROFESSIONAL && (
                            <p className="text-xs text-slate-400 mt-0.5">
                                Especialista: {specialist?.firstName} {specialist?.lastName}
                            </p>
                            )}
                            
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Clock size={14}/> {date.toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})}</span>
                            {service?.type === 'ONLINE' ? 
                                <span className="flex items-center gap-1 text-brand-blue"><Video size={14}/> Online (Meet)</span> : 
                                <span className="flex items-center gap-1 text-slate-600"><MapPin size={14}/> Presencial</span>
                            }
                            </div>
                        </div>
                        </div>

                        {/* Estado y Acciones */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                {apt.status}
                            </span>
                            {apt.meetLink && apt.status === AppointmentStatus.CONFIRMED && (
                                <a 
                                href={apt.meetLink} 
                                target="_blank" 
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 border border-brand-blue text-brand-blue rounded-lg text-xs font-medium hover:bg-brand-blue hover:text-white transition-colors"
                                >
                                Link Sala
                                </a>
                            )}
                        </div>

                    </div>
                    </li>
                );
                })}
            </ul>
            )}
        </div>
      )}

      {isBlockModalOpen && (
        <BlockTimeModal 
          isOpen={isBlockModalOpen} 
          onClose={() => setIsBlockModalOpen(false)} 
          onBlock={handleBlockTime} 
        />
      )}
    </div>
  );
};

export default AppointmentList;
