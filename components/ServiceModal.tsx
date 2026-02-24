import React, { useState, useEffect } from 'react';
import { Service, ServiceType, Role } from '../types';
import { X, Save } from 'lucide-react';
import { USERS, BRANCHES } from '../services/mockData';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
  service?: Service | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSave, service }) => {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    durationMinutes: 60,
    price: 0,
    type: ServiceType.PRESENTIAL,
    description: '',
    specialistId: '',
    branchId: ''
  });

  const specialists = USERS.filter(u => u.role === Role.PROFESSIONAL);
  
  // Filter branches based on service type
  const availableBranches = BRANCHES.filter(b => {
    if (formData.type === ServiceType.ONLINE) return b.type === 'VIRTUAL';
    if (formData.type === ServiceType.PRESENTIAL) return b.type === 'PHYSICAL';
    return true;
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: '',
        durationMinutes: 60,
        price: 0,
        type: ServiceType.PRESENTIAL,
        description: '',
        specialistId: '',
        branchId: ''
      });
    }
  }, [service, isOpen]);

  // Reset branch selection when type changes if current branch is invalid for new type
  useEffect(() => {
    const currentBranch = BRANCHES.find(b => b.id === formData.branchId);
    if (currentBranch) {
        const isValid = (formData.type === ServiceType.ONLINE && currentBranch.type === 'VIRTUAL') ||
                        (formData.type === ServiceType.PRESENTIAL && currentBranch.type === 'PHYSICAL');
        if (!isValid) {
            setFormData(prev => ({ ...prev, branchId: '' }));
        }
    }
  }, [formData.type]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Servicio</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duración (minutos)</label>
              <input
                type="number"
                required
                min="1"
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={formData.durationMinutes}
                onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio (CLP)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Servicio</label>
            <select
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as ServiceType })}
            >
              <option value={ServiceType.PRESENTIAL}>Presencial</option>
              <option value={ServiceType.ONLINE}>Online</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Especialista Vinculado</label>
                <select
                    required
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    value={formData.specialistId || ''}
                    onChange={e => setFormData({ ...formData, specialistId: e.target.value })}
                >
                    <option value="">Seleccionar...</option>
                    {specialists.map(spec => (
                        <option key={spec.id} value={spec.id}>{spec.firstName} {spec.lastName}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sucursal Vinculada</label>
                <select
                    required
                    className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    value={formData.branchId || ''}
                    onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                >
                    <option value="">Seleccionar...</option>
                    {availableBranches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
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
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
