import React, { useState, useEffect } from 'react';
import { Appointment, User, Patient, Service, AppointmentStatus, PaymentStatus, Role, PaymentMethod } from '../types';
import { X, Save, Calendar as CalendarIcon, Clock, User as UserIcon, FileText, CreditCard, DollarSign } from 'lucide-react';
import { USERS, SERVICES, PATIENTS } from '../services/mockData';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Partial<Appointment>) => void;
  currentUser: User;
  appointment?: Appointment | null;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, onSave, currentUser, appointment }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    specialistId: '',
    serviceId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    notes: '',
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: '' as PaymentMethod | ''
  });

  // Filter specialists
  const specialists = USERS.filter(u => u.role === Role.PROFESSIONAL);

  useEffect(() => {
    if (appointment) {
      const start = new Date(appointment.dateStart);
      setFormData({
        patientId: appointment.patientId,
        specialistId: appointment.specialistId,
        serviceId: appointment.serviceId,
        date: start.toISOString().split('T')[0],
        time: start.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        notes: appointment.notes || '',
        paymentStatus: appointment.paymentStatus,
        paymentMethod: appointment.paymentMethod || ''
      });
    } else {
      // Reset for new appointment
      setFormData({
        patientId: '',
        specialistId: currentUser.role === Role.PROFESSIONAL ? currentUser.id : '',
        serviceId: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        notes: '',
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: ''
      });
    }
  }, [appointment, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const service = SERVICES.find(s => s.id === formData.serviceId);
    if (!service) return;

    const startDateTime = new Date(`${formData.date}T${formData.time}`);
    const endDateTime = new Date(startDateTime.getTime() + service.durationMinutes * 60000);

    const newAppointment: Partial<Appointment> = {
      id: appointment?.id, // Keep ID if editing
      patientId: formData.patientId,
      specialistId: formData.specialistId,
      serviceId: formData.serviceId,
      dateStart: startDateTime.toISOString(),
      dateEnd: endDateTime.toISOString(),
      status: appointment?.status || AppointmentStatus.PENDING,
      paymentStatus: formData.paymentStatus,
      paymentMethod: formData.paymentMethod || undefined,
      notes: formData.notes
    };

    onSave(newAppointment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">{appointment ? 'Editar Cita' : 'Nueva Cita'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
            <select
              required
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
              value={formData.patientId}
              onChange={e => setFormData({ ...formData, patientId: e.target.value })}
              disabled={!!appointment} // Disable patient change on edit? Maybe allowed. Let's keep it enabled unless critical.
            >
              <option value="">Seleccionar Paciente</option>
              {PATIENTS.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} - {patient.rut}
                </option>
              ))}
            </select>
          </div>

          {/* Especialista (Solo si no es profesional, o si es admin/coord) */}
          {(currentUser.role !== Role.PROFESSIONAL || appointment) && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Especialista</label>
              <select
                required
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={formData.specialistId}
                onChange={e => setFormData({ ...formData, specialistId: e.target.value })}
                disabled={currentUser.role === Role.PROFESSIONAL && !appointment}
              >
                <option value="">Seleccionar Especialista</option>
                {specialists.map(spec => (
                  <option key={spec.id} value={spec.id}>
                    {spec.firstName} {spec.lastName} - {spec.role}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Servicio */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Servicio</label>
            <select
              required
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
              value={formData.serviceId}
              onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
            >
              <option value="">Seleccionar Servicio</option>
              {SERVICES.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.durationMinutes} min) - ${service.price.toLocaleString('es-CL')}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <div className="relative">
                <CalendarIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  required
                  className="w-full pl-10 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="time"
                  required
                  className="w-full pl-10 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Pago */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado de Pago</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  className="w-full pl-10 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.paymentStatus}
                  onChange={e => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                >
                  <option value={PaymentStatus.PENDING}>Pendiente</option>
                  <option value={PaymentStatus.PAID}>Pagado</option>
                  <option value={PaymentStatus.REFUNDED}>Reembolsado</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Método de Pago</label>
              <div className="relative">
                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  className="w-full pl-10 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                >
                  <option value="">Seleccionar...</option>
                  <option value={PaymentMethod.TRANSBANK}>WebPay / Link</option>
                  <option value={PaymentMethod.TRANSFER}>Transferencia</option>
                  <option value={PaymentMethod.CASH}>Efectivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none resize-none"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Save size={18} />
              <span>{appointment ? 'Actualizar Cita' : 'Guardar Cita'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
