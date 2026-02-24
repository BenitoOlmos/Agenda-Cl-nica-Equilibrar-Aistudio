import React, { useState, useEffect } from 'react';
import { User, PaymentStatus, PaymentMethod } from '../types';
import { getAppointments, PATIENTS, SERVICES } from '../services/mockData';
import { CreditCard, DollarSign, Calendar, CheckCircle, Clock, Search, Banknote, Link as LinkIcon, Smartphone } from 'lucide-react';

interface PaymentListProps {
  currentUser: User;
}

const PaymentList: React.FC<PaymentListProps> = ({ currentUser }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching payments from appointments
    getAppointments().then(appointments => {
      const paymentData = appointments.map(apt => {
        const patient = PATIENTS.find(p => p.id === apt.patientId);
        const service = SERVICES.find(s => s.id === apt.serviceId);
        
        // Mock payment method logic for demo purposes
        let paymentMethod = PaymentMethod.TRANSBANK;
        if (apt.id.charCodeAt(0) % 3 === 0) paymentMethod = PaymentMethod.TRANSFER;
        if (apt.id.charCodeAt(0) % 3 === 1) paymentMethod = PaymentMethod.CASH;

        return {
          id: `pay-${apt.id}`,
          appointmentId: apt.id,
          patientId: patient?.id,
          patientName: `${patient?.firstName} ${patient?.lastName}`,
          serviceName: service?.name,
          amount: service?.price || 0,
          date: apt.dateStart,
          status: apt.paymentStatus,
          method: paymentMethod
        };
      });
      setPayments(paymentData);
    });
  }, []);

  const filteredPayments = payments.filter(p => {
    if (selectedPatientId && p.patientId !== selectedPatientId) return false;
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  const totalRevenue = filteredPayments.reduce((acc, curr) => acc + (curr.status === 'PAID' ? curr.amount : 0), 0);
  const pendingRevenue = filteredPayments.reduce((acc, curr) => acc + (curr.status === 'PENDING' ? curr.amount : 0), 0);

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH: return <Banknote size={14} />;
      case PaymentMethod.TRANSFER: return <Smartphone size={14} />;
      case PaymentMethod.TRANSBANK: return <CreditCard size={14} />;
      default: return <LinkIcon size={14} />;
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH: return 'Efectivo';
      case PaymentMethod.TRANSFER: return 'Transferencia';
      case PaymentMethod.TRANSBANK: return 'WebPay / Link';
      default: return 'Otro';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Pagos</h2>
          <p className="text-slate-500">Registro de transacciones y estados de pago</p>
        </div>
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('PAID')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'PAID' ? 'bg-white shadow-sm text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pagados
          </button>
          <button 
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'PENDING' ? 'bg-white shadow-sm text-yellow-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pendientes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Total Recaudado</p>
          <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Por Cobrar</p>
          <p className="text-2xl font-bold text-yellow-600">${pendingRevenue.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Transacciones</p>
          <p className="text-2xl font-bold text-slate-900">{filteredPayments.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Search size={18} className="text-slate-400" />
            <input 
                type="text" 
                placeholder="Buscar por paciente..." 
                className="w-full outline-none text-sm text-slate-600"
                onChange={(e) => {
                    const term = e.target.value.toLowerCase();
                    if (!term) {
                        setSelectedPatientId(null);
                        return;
                    }
                    const foundPatient = PATIENTS.find(p => 
                        p.firstName.toLowerCase().includes(term) || 
                        p.lastName.toLowerCase().includes(term)
                    );
                    if (foundPatient) setSelectedPatientId(foundPatient.id);
                }}
            />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Paciente</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Servicio</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Fecha</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Monto</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Método</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                      <div>{payment.patientName}</div>
                      {selectedPatientId === payment.patientId && (
                          <div className="text-xs text-blue-600 font-normal mt-1">Historial Filtrado</div>
                      )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{payment.serviceName}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(payment.date).toLocaleDateString('es-CL')}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    ${payment.amount.toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2" title={getPaymentMethodLabel(payment.method)}>
                        {getPaymentMethodIcon(payment.method)}
                        <span>{getPaymentMethodLabel(payment.method)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                    `}>
                      {payment.status === 'PAID' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {payment.status === 'PAID' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No se encontraron pagos con el filtro seleccionado.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentList;
