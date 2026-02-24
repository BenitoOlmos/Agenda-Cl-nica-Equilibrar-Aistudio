import React, { useState } from 'react';
import { AuthState, Role, User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AppointmentList from './components/AppointmentList';
import PatientList from './components/PatientList';
import SpecialistList from './components/SpecialistList';
import ServiceList from './components/ServiceList';
import BranchList from './components/BranchList';
import PaymentList from './components/PaymentList';
import { mockLogin } from './services/mockData';
import { 
  Activity, 
  Users, 
  Calendar, 
  CreditCard, 
  LogOut, 
  Menu, 
  X,
  MapPin
} from 'lucide-react';

function App() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'CALENDAR' | 'CLIENTS' | 'PAYMENTS' | 'SPECIALISTS' | 'SERVICES' | 'BRANCHES'>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = async (role: Role) => {
    try {
      const user = await mockLogin(role);
      setAuth({ user, isAuthenticated: true });
      setCurrentView('DASHBOARD');
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view as any);
        setIsSidebarOpen(false); // Close mobile menu on click
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
        ${currentView === view 
          ? 'bg-brand-blue text-white shadow-md shadow-blue-900/20' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-brand-blue'
        }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (!auth.isAuthenticated || !auth.user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-light">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        flex flex-col
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 bg-brand-blue rounded-lg flex items-center justify-center">
            <Activity className="text-white" size={18} />
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">Equilibrar</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem view="DASHBOARD" icon={Activity} label="Dashboard" />
          <NavItem view="CALENDAR" icon={Calendar} label="Agenda & Citas" />
          
          {(auth.user.role === Role.ADMIN || auth.user.role === Role.COORDINATOR || auth.user.role === Role.PROFESSIONAL) && (
             <NavItem view="CLIENTS" icon={Users} label="Pacientes" />
          )}

          {(auth.user.role === Role.ADMIN || auth.user.role === Role.COORDINATOR) && (
             <>
               <NavItem view="SPECIALISTS" icon={Users} label="Especialistas" />
               <NavItem view="SERVICES" icon={Activity} label="Servicios" />
               <NavItem view="BRANCHES" icon={MapPin} label="Sucursales" />
             </>
          )}
          
          {(auth.user.role === Role.ADMIN || auth.user.role === Role.COORDINATOR) && (
            <NavItem view="PAYMENTS" icon={CreditCard} label="Pagos" />
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <img 
              src={auth.user.avatarUrl} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full bg-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {auth.user.firstName} {auth.user.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate capitalize">
                {auth.user.role.toLowerCase()}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative w-full">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 bg-brand-blue rounded-lg flex items-center justify-center">
                <Activity className="text-white" size={18} />
             </div>
             <span className="font-bold text-slate-800">Equilibrar</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {currentView === 'DASHBOARD' && <Dashboard currentUser={auth.user} />}
          {currentView === 'CALENDAR' && <AppointmentList currentUser={auth.user} />}
          
          {currentView === 'CLIENTS' && (
            <PatientList currentUser={auth.user} />
          )}

          {currentView === 'SPECIALISTS' && (
            <SpecialistList currentUser={auth.user} />
          )}

          {currentView === 'SERVICES' && (
            <ServiceList currentUser={auth.user} />
          )}

          {currentView === 'BRANCHES' && (
            <BranchList currentUser={auth.user} />
          )}

          {currentView === 'PAYMENTS' && (
             <PaymentList currentUser={auth.user} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
