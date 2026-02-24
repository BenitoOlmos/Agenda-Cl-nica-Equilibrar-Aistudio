import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { X, Save } from 'lucide-react';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Partial<Patient>) => void;
  patient?: Patient | null;
}

const PatientModal: React.FC<PatientModalProps> = ({ isOpen, onClose, onSave, patient }) => {
  const [formData, setFormData] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    email: '',
    rut: '',
    phone: '',
    address: '',
    commune: '',
    healthSystem: 'FONASA',
    isapreName: '',
    complementaryInsurance: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        rut: '',
        phone: '',
        address: '',
        commune: '',
        healthSystem: 'FONASA',
        isapreName: '',
        complementaryInsurance: ''
      });
    }
  }, [patient, isOpen]);

  if (!isOpen) return null;

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    
    // Si es un paciente nuevo (no tiene ID o no se está editando un paciente existente), generar contraseña
    if (!patient && !dataToSave.password) {
        dataToSave.password = generatePassword();
    }
    
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Información Personal</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">RUT</label>
                <input
                  type="text"
                  required
                  placeholder="12.345.678-9"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.rut}
                  onChange={e => setFormData({ ...formData, rut: e.target.value })}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Contacto</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Dirección</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Calle y Número</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Comuna</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    value={formData.commune}
                    onChange={e => setFormData({ ...formData, commune: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Health System */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Previsión</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sistema de Salud</label>
                  <select
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    value={formData.healthSystem}
                    onChange={e => setFormData({ ...formData, healthSystem: e.target.value as any })}
                  >
                    <option value="FONASA">FONASA</option>
                    <option value="ISAPRE">ISAPRE</option>
                    <option value="PARTICULAR">PARTICULAR</option>
                  </select>
                </div>
                {formData.healthSystem === 'ISAPRE' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Isapre</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                      value={formData.isapreName}
                      onChange={e => setFormData({ ...formData, isapreName: e.target.value })}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seguro Complementario</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    value={formData.complementaryInsurance}
                    onChange={e => setFormData({ ...formData, complementaryInsurance: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
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
              <span>Guardar Paciente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;
