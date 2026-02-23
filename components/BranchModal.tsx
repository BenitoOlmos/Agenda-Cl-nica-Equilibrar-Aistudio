import React, { useState, useEffect } from 'react';
import { Branch } from '../types';
import { X, Save } from 'lucide-react';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branch: Partial<Branch>) => void;
  branch?: Branch | null;
}

const BranchModal: React.FC<BranchModalProps> = ({ isOpen, onClose, onSave, branch }) => {
  const [formData, setFormData] = useState<Partial<Branch>>({
    name: '',
    address: '',
    commune: '',
    type: 'PHYSICAL'
  });

  useEffect(() => {
    if (branch) {
      setFormData(branch);
    } else {
      setFormData({
        name: '',
        address: '',
        commune: '',
        type: 'PHYSICAL'
      });
    }
  }, [branch, isOpen]);

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
            {branch ? 'Editar Sucursal' : 'Nueva Sucursal'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Sucursal</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Comuna</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={formData.commune || ''}
                onChange={e => setFormData({ ...formData, commune: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as 'PHYSICAL' | 'VIRTUAL' })}
              >
                <option value="PHYSICAL">Física</option>
                <option value="VIRTUAL">Virtual</option>
              </select>
            </div>
          </div>

          {formData.type === 'PHYSICAL' && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono Emergencia</label>
                <input
                  type="tel"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.emergencyPhone || ''}
                  onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Contacto</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  value={formData.contactName || ''}
                  onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                />
              </div>
            </div>
          )}

          {formData.type === 'VIRTUAL' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link Google Meet</label>
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={formData.meetLink || ''}
                onChange={e => setFormData({ ...formData, meetLink: e.target.value })}
              />
            </div>
          )}

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

export default BranchModal;
