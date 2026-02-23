import React, { useEffect, useState } from 'react';
import { Patient, User, Role } from '../types';
import { getPatients, getAppointments } from '../services/mockData';
import { Search, Plus, MoreVertical, Mail, Phone, FileText, Trash2, Edit } from 'lucide-react';
import ClinicalRecordView from './ClinicalRecordView';
import PatientModal from './PatientModal';

interface PatientListProps {
  currentUser: User;
}

const PatientList: React.FC<PatientListProps> = ({ currentUser }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allPatients, allAppointments] = await Promise.all([
          getPatients(),
          getAppointments()
        ]);

        if (currentUser.role === Role.PROFESSIONAL) {
          // Filter patients who have appointments with this professional
          const myPatientIds = new Set(
            allAppointments
              .filter(apt => apt.specialistId === currentUser.id)
              .map(apt => apt.patientId)
          );
          setPatients(allPatients.filter(p => myPatientIds.has(p.id)));
        } else {
          setPatients(allPatients);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSavePatient = (patientData: Partial<Patient>) => {
    if (editingPatient) {
      // Edit existing patient
      setPatients(patients.map(p => p.id === editingPatient.id ? { ...p, ...patientData } as Patient : p));
    } else {
      // Create new patient
      const newPatient: Patient = {
        id: `pt-${Date.now()}`,
        ...patientData as Patient,
        avatarUrl: `https://ui-avatars.com/api/?name=${patientData.firstName}+${patientData.lastName}&background=random`
      };
      setPatients([...patients, newPatient]);
    }
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = (patientId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      setPatients(patients.filter(p => p.id !== patientId));
    }
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.rut && patient.rut.includes(searchTerm))
  );

  if (selectedPatient) {
    return (
      <ClinicalRecordView 
        patient={selectedPatient} 
        currentUser={currentUser} 
        onBack={() => setSelectedPatient(null)} 
      />
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando pacientes...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pacientes</h2>
          <p className="text-slate-500">Gestión de historias clínicas y datos personales</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o RUT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Previsión</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={patient.avatarUrl || `https://ui-avatars.com/api/?name=${patient.firstName}+${patient.lastName}&background=random`}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{patient.firstName} {patient.lastName}</p>
                        <p className="text-xs text-slate-500">RUT: {patient.rut || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        {patient.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {patient.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${patient.healthSystem === 'ISAPRE' ? 'bg-purple-100 text-purple-800' : 
                        patient.healthSystem === 'FONASA' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-800'}`}>
                      {patient.healthSystem || 'N/A'}
                    </span>
                    {patient.isapreName && <span className="text-xs text-slate-500 ml-2">{patient.isapreName}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => setSelectedPatient(patient)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Ver Ficha Clínica"
                        >
                            <FileText size={16} />
                            <span className="hidden sm:inline">Ficha</span>
                        </button>
                        <button 
                          onClick={() => openEditModal(patient)}
                          className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Editar"
                        >
                            <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Eliminar"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPatients.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
              <Search className="text-slate-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No se encontraron pacientes</h3>
            <p className="text-slate-500 mt-1">Intenta con otros términos de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Patient Modal */}
      {isModalOpen && (
        <PatientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePatient}
          patient={editingPatient}
        />
      )}
    </div>
  );
};

export default PatientList;
