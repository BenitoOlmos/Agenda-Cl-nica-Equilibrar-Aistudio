import React, { useState, useEffect } from 'react';
import { Specialist, Role } from '../types';
import { X, Save } from 'lucide-react';

interface SpecialistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (specialist: Partial<Specialist>) => void;
  specialist?: Specialist | null;
}

const SpecialistModal: React.FC<SpecialistModalProps> = ({ isOpen, onClose, onSave, specialist }) => {
  const [formData, setFormData] = useState<Partial<Specialist>>({
    firstName: '',
    lastName: '',
    email: '',
    specialties: [],
    bio: '',
    color: '#3b82f6',
    role: Role.PROFESSIONAL
  });

  const [specialtiesInput, setSpecialtiesInput] = useState('');

  useEffect(() => {
    if (specialist) {
      setFormData(specialist);
      setSpecialtiesInput(specialist.specialties.join(', '));
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        specialties: [],
        bio: '',
        color: '#3b82f6',
        role: Role.PROFESSIONAL
      });
      setSpecialtiesInput('');
    }
  }, [specialist, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specialtiesArray = specialtiesInput.split(',').map(s => s.trim()).filter(s => s !== '');
    onSave({ ...formData, specialties: specialtiesArray });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {specialist ? 'Editar Especialista' : 'Nuevo Especialista'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input
                type="text"
                required
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

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
            <label className="block text-sm font-medium text-slate-700 mb-1">Especialidades (separadas por coma)</label>
            <input
              type="text"
              placeholder="Ej: Psicología Clínica, Terapia de Pareja"
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
              value={specialtiesInput}
              onChange={e => setSpecialtiesInput(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Biografía</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none resize-none"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Color (para calendario)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-10 w-20 rounded cursor-pointer border border-slate-200"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
              />
              <span className="text-sm text-slate-500">{formData.color}</span>
            </div>
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
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialistModal;
