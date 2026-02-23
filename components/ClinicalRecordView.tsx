import React, { useEffect, useState } from 'react';
import { ClinicalRecord, Patient, User, ClinicalEntry } from '../types';
import { getClinicalRecord, USERS } from '../services/mockData';
import { FileText, Plus, Calendar, User as UserIcon, Download, ArrowLeft, Save } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ClinicalRecordViewProps {
  patient: Patient;
  currentUser: User;
  onBack: () => void;
}

const ClinicalRecordView: React.FC<ClinicalRecordViewProps> = ({ patient, currentUser, onBack }) => {
  const [record, setRecord] = useState<ClinicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  
  // Form State
  const [newEntry, setNewEntry] = useState<Partial<ClinicalEntry>>({
    reason: '',
    diagnosis: '',
    treatment: '',
    evolution: '',
    observations: ''
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await getClinicalRecord(patient.id);
        setRecord(data);
      } catch (error) {
        console.error("Error fetching clinical record:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [patient.id]);

  const handleExportPDF = () => {
    if (!record) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Ficha Clínica', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Paciente: ${patient.firstName} ${patient.lastName}`, 14, 30);
    doc.text(`RUT: ${patient.rut}`, 14, 35);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 40);

    // Table
    const tableData = record.entries.map(entry => {
      const specialist = USERS.find(u => u.id === entry.specialistId);
      return [
        new Date(entry.date).toLocaleDateString(),
        `${specialist?.firstName} ${specialist?.lastName}`,
        entry.reason,
        entry.diagnosis,
        entry.treatment
      ];
    });

    autoTable(doc, {
      startY: 50,
      head: [['Fecha', 'Especialista', 'Motivo', 'Diagnóstico', 'Indicaciones']],
      body: tableData,
    });

    doc.save(`ficha_clinica_${patient.lastName}_${patient.firstName}.pdf`);
  };

  const handleSaveEntry = () => {
    if (!record) return;
    
    const entry: ClinicalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString(),
      specialistId: currentUser.id,
      reason: newEntry.reason || '',
      diagnosis: newEntry.diagnosis || '',
      treatment: newEntry.treatment || '',
      evolution: newEntry.evolution || '',
      observations: newEntry.observations || ''
    };

    // In a real app, this would be an API call
    const updatedRecord = {
      ...record,
      entries: [entry, ...record.entries]
    };
    
    setRecord(updatedRecord);
    setShowNewEntryForm(false);
    setNewEntry({ reason: '', diagnosis: '', treatment: '', evolution: '', observations: '' });
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando ficha clínica...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ficha Clínica</h1>
            <p className="text-slate-500">Historia médica confidencial (Ley N° 20.584)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            <span>Exportar PDF</span>
          </button>
          <button 
            onClick={() => setShowNewEntryForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Nueva Atención</span>
          </button>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-6">
          <img 
            src={patient.avatarUrl} 
            alt="Patient" 
            className="w-24 h-24 rounded-xl object-cover bg-slate-100"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Identificación</h3>
              <p className="font-semibold text-slate-900 text-lg">{patient.firstName} {patient.lastName}</p>
              <p className="text-slate-600">RUT: {patient.rut}</p>
              <p className="text-slate-600">{patient.email}</p>
              <p className="text-slate-600">{patient.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Dirección</h3>
              <p className="text-slate-600">{patient.address}</p>
              <p className="text-slate-600">{patient.commune}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Previsión</h3>
              <p className="font-medium text-slate-900">{patient.healthSystem}</p>
              {patient.isapreName && <p className="text-slate-600">{patient.isapreName}</p>}
              {patient.complementaryInsurance && (
                <p className="text-slate-600 text-sm mt-1">
                  <span className="font-medium">Seguro Comp:</span> {patient.complementaryInsurance}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Entry Form */}
      {showNewEntryForm && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-brand-blue/20 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-brand-blue" />
            Nueva Evolución / Atención
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Motivo de Consulta</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={newEntry.reason}
                onChange={e => setNewEntry({...newEntry, reason: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diagnóstico</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={newEntry.diagnosis}
                onChange={e => setNewEntry({...newEntry, diagnosis: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Evolución</label>
              <textarea 
                rows={3}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={newEntry.evolution}
                onChange={e => setNewEntry({...newEntry, evolution: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Indicaciones / Tratamiento</label>
              <textarea 
                rows={3}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                value={newEntry.treatment}
                onChange={e => setNewEntry({...newEntry, treatment: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setShowNewEntryForm(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSaveEntry}
              className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              Guardar Atención
            </button>
          </div>
        </div>
      )}

      {/* Timeline of Entries */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">Historial de Atenciones</h3>
        
        {record && record.entries.length > 0 ? (
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-8">
            {record.entries.map((entry) => {
              const specialist = USERS.find(u => u.id === entry.specialistId);
              return (
                <div key={entry.id} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-brand-blue"></div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={16} />
                        <span className="font-medium text-slate-700">
                          {new Date(entry.date).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>{new Date(entry.date).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-blue-50 text-brand-blue px-3 py-1 rounded-full">
                        <UserIcon size={14} />
                        <span className="font-medium">{specialist?.firstName} {specialist?.lastName}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">Motivo de Consulta</h4>
                        <p className="text-slate-600">{entry.reason}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Diagnóstico</h4>
                          <p className="text-slate-800 font-medium">{entry.diagnosis}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Evolución</h4>
                          <p className="text-slate-800">{entry.evolution}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">Indicaciones / Tratamiento</h4>
                        <p className="text-slate-600 bg-green-50 p-3 rounded-lg border border-green-100 text-sm">
                          {entry.treatment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-slate-900 font-medium">Sin historial clínico</h3>
            <p className="text-slate-500 text-sm">No hay registros de atenciones previas para este paciente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalRecordView;
