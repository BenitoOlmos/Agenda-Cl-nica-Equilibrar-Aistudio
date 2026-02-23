import React, { useState } from 'react';
import { Role } from '../types';
import { Shield, Activity, Users } from 'lucide-react';

interface LoginProps {
  onLogin: (role: Role) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    setLoading(role);
    // Simular delay de red
    setTimeout(() => {
      onLogin(role);
      setLoading(null);
    }, 800);
  };

  const RoleButton = ({ role, label, icon: Icon, desc }: { role: Role, label: string, icon: any, desc: string }) => (
    <button
      onClick={() => handleRoleSelect(role)}
      disabled={loading !== null}
      className={`
        relative group flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-brand-accent
        ${loading === role ? 'ring-2 ring-brand-accent animate-pulse' : ''}
      `}
    >
      <div className="p-3 rounded-full bg-slate-50 text-brand-blue mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
        <Icon size={28} />
      </div>
      <h3 className="font-semibold text-slate-800 mb-1">{label}</h3>
      <p className="text-xs text-slate-500 text-center">{desc}</p>
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
             <div className="h-16 w-16 bg-brand-blue rounded-full flex items-center justify-center shadow-lg">
                <Activity className="text-brand-accent" size={32} />
             </div>
          </div>
          <h1 className="text-4xl font-bold text-brand-blue mb-2 tracking-tight">Clínica Equilibrar</h1>
          <p className="text-slate-500">Sistema de Gestión Integral</p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white">
          <h2 className="text-xl font-medium text-center text-slate-700 mb-8">Seleccione su perfil de acceso</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RoleButton 
              role={Role.PROFESSIONAL} 
              label="Especialista" 
              icon={Activity} 
              desc="Mi agenda y pacientes"
            />
             <RoleButton 
              role={Role.COORDINATOR} 
              label="Coordinación" 
              icon={Users} 
              desc="Gestión de citas y servicios"
            />
             <RoleButton 
              role={Role.ADMIN} 
              label="Administración" 
              icon={Shield} 
              desc="Control total y finanzas"
            />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Versión Demo v1.0.0 | Datos seguros y encriptados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
