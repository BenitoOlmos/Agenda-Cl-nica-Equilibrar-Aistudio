import React, { useState } from 'react';
import { User, Specialist, Role } from '../types';
import { Users, Mail, Star, Plus, Edit, Trash2 } from 'lucide-react';
import { USERS } from '../services/mockData';
import SpecialistModal from './SpecialistModal';

interface SpecialistListProps {
  currentUser: User;
}

const SpecialistList: React.FC<SpecialistListProps> = ({ currentUser }) => {
  const [specialists, setSpecialists] = useState<Specialist[]>(
    USERS.filter(u => u.role === Role.PROFESSIONAL) as Specialist[]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);

  const handleSave = (data: Partial<Specialist>) => {
    if (editingSpecialist) {
      setSpecialists(specialists.map(s => s.id === editingSpecialist.id ? { ...s, ...data } as Specialist : s));
    } else {
      const newSpecialist: Specialist = {
        id: `usr-spec-${Date.now()}`,
        role: Role.PROFESSIONAL,
        avatarUrl: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
        ...data as Specialist
      };
      setSpecialists([...specialists, newSpecialist]);
    }
    setIsModalOpen(false);
    setEditingSpecialist(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este especialista?')) {
      setSpecialists(specialists.filter(s => s.id !== id));
    }
  };

  const openNewModal = () => {
    setEditingSpecialist(null);
    setIsModalOpen(true);
  };

  const openEditModal = (specialist: Specialist) => {
    setEditingSpecialist(specialist);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Especialistas</h2>
          <p className="text-slate-500">Equipo médico y profesionales de la salud</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Nuevo Especialista</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialists.map((specialist) => (
          <div key={specialist.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => openEditModal(specialist)}
                className="p-2 bg-white/90 text-slate-600 hover:text-brand-blue rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => handleDelete(specialist.id)}
                className="p-2 bg-white/90 text-red-400 hover:text-red-600 rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="h-24 bg-gradient-to-r from-blue-500 to-teal-400 relative">
              <div className="absolute -bottom-10 left-6">
                <img 
                  src={specialist.avatarUrl} 
                  alt={specialist.firstName} 
                  className="w-20 h-20 rounded-xl border-4 border-white bg-white object-cover shadow-sm"
                />
              </div>
            </div>
            <div className="pt-12 p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{specialist.firstName} {specialist.lastName}</h3>
                  <p className="text-brand-blue font-medium text-sm">{specialist.specialties.join(', ')}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <Star className="text-yellow-400 w-5 h-5 fill-current" />
                </div>
              </div>
              
              <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{specialist.bio}</p>
              
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{specialist.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <SpecialistModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          specialist={editingSpecialist}
        />
      )}
    </div>
  );
};

export default SpecialistList;
