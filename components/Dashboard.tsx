import React, { useEffect, useState, useMemo } from 'react';
import { User, Appointment, Role, Service, ServiceType } from '../types';
import { getAppointments, getMyStats, SERVICES, USERS, PATIENTS } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, Sparkles, Clock } from './ui/Icons';
import { generateDailySummary } from '../services/geminiService';
import { Briefcase } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // Initial Data Fetch
    getAppointments().then(setAppointments);
    getMyStats().then(setStats);
  }, []);

  const handleGenerateAiSummary = async () => {
    setLoadingAi(true);
    const summary = await generateDailySummary(appointments, USERS, SERVICES);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const isAdmin = currentUser.role === Role.ADMIN;
  const isCoord = currentUser.role === Role.COORDINATOR;
  const isProfessional = currentUser.role === Role.PROFESSIONAL;

  // --- Dynamic Stats Calculation ---
  const dashboardData = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Filter appointments based on role
    let relevantAppointments = appointments;
    if (isProfessional) {
      relevantAppointments = appointments.filter(apt => apt.specialistId === currentUser.id);
    }

    // Filter for current month
    const monthlyAppointments = relevantAppointments.filter(apt => {
      const date = new Date(apt.dateStart);
      return date >= startOfMonth && date <= endOfMonth;
    });

    // 1. Total Hours this month
    const totalMinutes = monthlyAppointments.reduce((acc, apt) => {
      const start = new Date(apt.dateStart);
      const end = new Date(apt.dateEnd);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);
    const totalHours = Math.round(totalMinutes / 60);

    // 2. Active Patients (Unique patients in relevant appointments)
    const uniquePatients = new Set(relevantAppointments.map(apt => apt.patientId)).size;

    // 3. Pending Appointments
    const pendingCount = relevantAppointments.filter(apt => apt.status === 'PENDING').length;

    // 4. Chart Data: Appointments per day (Current Week)
    // Simplified: Just taking the last 5 appointments or mocking a week for now based on actual data would be better
    // For this example, let's aggregate by day of week from the monthly appointments
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const appointmentsByDay = new Array(7).fill(0);
    monthlyAppointments.forEach(apt => {
      const day = new Date(apt.dateStart).getDay();
      appointmentsByDay[day]++;
    });
    
    // Shift to start on Monday
    const chartData = [
      { name: 'Lun', citas: appointmentsByDay[1] },
      { name: 'Mar', citas: appointmentsByDay[2] },
      { name: 'Mie', citas: appointmentsByDay[3] },
      { name: 'Jue', citas: appointmentsByDay[4] },
      { name: 'Vie', citas: appointmentsByDay[5] },
    ];

    // 5. Pie Data: By Service Type
    let onlineCount = 0;
    let presentialCount = 0;
    
    monthlyAppointments.forEach(apt => {
      const service = SERVICES.find(s => s.id === apt.serviceId);
      if (service?.type === ServiceType.ONLINE) onlineCount++;
      else if (service?.type === ServiceType.PRESENTIAL) presentialCount++;
    });

    const pieData = [
      { name: 'Online', value: onlineCount },
      { name: 'Presencial', value: presentialCount },
    ];

    // 6. Total Specialists (Admin/Coord)
    const totalSpecialists = USERS.filter(u => u.role === Role.PROFESSIONAL).length;

    // 7. Total Patients (Admin/Coord)
    const totalPatients = PATIENTS.length;

    return {
      totalHours,
      uniquePatients,
      pendingCount,
      chartData,
      pieData,
      totalSpecialists,
      totalPatients
    };
  }, [appointments, currentUser.id, isProfessional]);

  const COLORS = ['#0F2C59', '#14B8A6'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hola, {currentUser.firstName}</h1>
          <p className="text-slate-500">Bienvenido a tu panel de control.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-slate-600 border border-slate-100">
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Hours (Everyone) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-brand-blue rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Horas Ocupadas (Mes)</p>
            <h3 className="text-2xl font-bold text-slate-800">{dashboardData.totalHours} hrs</h3>
          </div>
        </div>

        {/* Card 2: Patients (Everyone) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{isProfessional ? 'Mis Pacientes' : 'Pacientes Totales'}</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {isProfessional ? dashboardData.uniquePatients : dashboardData.totalPatients}
            </h3>
          </div>
        </div>

        {/* Card 3: Specialists (Admin/Coord) OR Pending Appointments (Professional) */}
        {!isProfessional ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-teal-50 text-brand-accent rounded-xl">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Especialistas</p>
              <h3 className="text-2xl font-bold text-slate-800">{dashboardData.totalSpecialists}</h3>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-teal-50 text-brand-accent rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Citas Pendientes</p>
              <h3 className="text-2xl font-bold text-slate-800">{dashboardData.pendingCount}</h3>
            </div>
          </div>
        )}

      </div>

      {/* AI Assistant Section */}
      {(isAdmin || isCoord) && (
        <div className="bg-gradient-to-r from-brand-blue to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-400" />
              <h2 className="text-lg font-semibold">Gemini Assistant - Resumen Operativo</h2>
            </div>
            {!aiSummary && (
                <button 
                onClick={handleGenerateAiSummary}
                disabled={loadingAi}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                {loadingAi ? 'Analizando...' : 'Generar Reporte'}
                </button>
            )}
          </div>
          
          {aiSummary ? (
            <div className="bg-white/10 p-4 rounded-xl text-sm leading-relaxed animate-pulse-once">
              <p className="whitespace-pre-line">{aiSummary}</p>
            </div>
          ) : (
            <p className="text-slate-300 text-sm">
              Utiliza la inteligencia artificial para analizar el rendimiento de la clínica y detectar anomalías en la agenda.
            </p>
          )}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-6">Citas por Día (Este Mes)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="citas" fill="#0F2C59" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-6">Horas por Tipo de Servicio</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-blue"></div> Online
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-accent"></div> Presencial
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
