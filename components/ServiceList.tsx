import React, { useState } from 'react';
import { User, ServiceType, Service } from '../types';
import { Activity, Clock, DollarSign, Video, MapPin, Plus, Edit, Trash2, User as UserIcon, Building } from 'lucide-react';
import { SERVICES, USERS, BRANCHES } from '../services/mockData';
import ServiceModal from './ServiceModal';

interface ServiceListProps {
  currentUser: User;
}

const ServiceList: React.FC<ServiceListProps> = ({ currentUser }) => {
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleSave = (data: Partial<Service>) => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...data } as Service : s));
    } else {
      const newService: Service = {
        id: `svc-${Date.now()}`,
        ...data as Service
      };
      setServices([...services, newService]);
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const openNewModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Servicios</h2>
          <p className="text-slate-500">Catálogo de prestaciones médicas y terapias</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const specialist = USERS.find(u => u.id === service.specialistId);
          const branch = BRANCHES.find(b => b.id === service.branchId);

          return (
            <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                  onClick={() => openEditModal(service)}
                  className="p-2 bg-white/90 text-slate-600 hover:text-brand-blue rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="p-2 bg-white/90 text-red-400 hover:text-red-600 rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${
                  service.type === ServiceType.ONLINE 
                    ? 'bg-blue-50 text-brand-blue' 
                    : 'bg-teal-50 text-brand-accent'
                }`}>
                  {service.type === ServiceType.ONLINE ? <Video size={24} /> : <MapPin size={24} />}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                  {service.type === ServiceType.ONLINE ? 'Online' : 'Presencial'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors">
                {service.name}
              </h3>
              <p className="text-slate-500 text-sm mb-4 h-10 line-clamp-2">
                {service.description}
              </p>

              <div className="space-y-2 mb-4">
                 {specialist && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <UserIcon size={14} className="text-slate-400" />
                        <span>{specialist.firstName} {specialist.lastName}</span>
                    </div>
                 )}
                 {branch && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Building size={14} className="text-slate-400" />
                        <span>{branch.name}</span>
                    </div>
                 )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                  <Clock size={16} className="text-slate-400" />
                  <span>{service.durationMinutes} min</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-slate-900">
                  <DollarSign size={16} className="text-slate-400" />
                  <span>{service.price.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <ServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          service={editingService}
        />
      )}
    </div>
  );
};

export default ServiceList;
