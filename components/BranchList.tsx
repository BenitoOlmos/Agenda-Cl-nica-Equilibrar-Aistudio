import React, { useState } from 'react';
import { User, Branch, Role } from '../types';
import { MapPin, Video, ExternalLink, Plus, Edit, Trash2, Phone, User as UserIcon } from 'lucide-react';
import { USERS, BRANCHES } from '../services/mockData';
import BranchModal from './BranchModal';

interface BranchListProps {
  currentUser: User;
}

const BranchList: React.FC<BranchListProps> = ({ currentUser }) => {
  const specialists = USERS.filter(u => u.role === Role.PROFESSIONAL);

  const [branches, setBranches] = useState<Branch[]>(BRANCHES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleSave = (data: Partial<Branch>) => {
    if (editingBranch) {
      setBranches(branches.map(b => b.id === editingBranch.id ? { ...b, ...data } as Branch : b));
    } else {
      const newBranch: Branch = {
        id: `br-${Date.now()}`,
        ...data as Branch
      };
      setBranches([...branches, newBranch]);
    }
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta sucursal?')) {
      setBranches(branches.filter(b => b.id !== id));
    }
  };

  const openNewModal = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const physicalBranches = branches.filter(b => b.type === 'PHYSICAL');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sucursales</h2>
          <p className="text-slate-500">Gestión de ubicaciones físicas y virtuales</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Nueva Sucursal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Physical Branches */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <MapPin className="text-brand-accent" />
            Sucursales Físicas
          </h3>
          {physicalBranches.map(branch => (
            <div key={branch.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group relative">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(branch)}
                  className="p-2 bg-slate-50 text-slate-600 hover:text-brand-blue rounded-full hover:bg-slate-100 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(branch.id)}
                  className="p-2 bg-slate-50 text-red-400 hover:text-red-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h4 className="font-bold text-slate-900">{branch.name}</h4>
              <p className="text-slate-600 mt-1">{branch.address}</p>
              <p className="text-sm text-slate-500 mt-1 mb-3">{branch.commune}</p>
              
              {(branch.contactName || branch.emergencyPhone) && (
                <div className="pt-3 border-t border-slate-100 space-y-1">
                  {branch.contactName && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <UserIcon size={14} className="text-slate-400" />
                      <span>{branch.contactName}</span>
                    </div>
                  )}
                  {branch.emergencyPhone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={14} className="text-slate-400" />
                      <span>{branch.emergencyPhone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Virtual Branches */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Video className="text-brand-blue" />
            Sucursales Virtuales
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {/* General Virtual Branch Info if available */}
              {branches.filter(b => b.type === 'VIRTUAL').map(branch => (
                 <div key={branch.id} className="p-4 bg-blue-50/50 flex items-center justify-between group relative">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(branch)} className="p-1 text-slate-400 hover:text-brand-blue"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(branch.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{branch.name}</h4>
                      {branch.meetLink && (
                        <a href={branch.meetLink} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink size={12} /> {branch.meetLink}
                        </a>
                      )}
                    </div>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <BranchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          branch={editingBranch}
        />
      )}
    </div>
  );
};

export default BranchList;
