import { Role, User, Patient, Specialist, Service, Appointment, AppointmentStatus, PaymentStatus, ServiceType, ClinicalRecord, Branch } from '../types';

// Helper para simular UUIDs
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// --- DATA SEEDING (Inicialización de datos) ---

// Sucursales
export const BRANCHES: Branch[] = [
  {
    id: 'br-1',
    name: 'Sucursal Santiago Centro',
    address: 'Alameda 1234, Oficina 505',
    commune: 'Santiago',
    type: 'PHYSICAL',
    emergencyPhone: '+56 2 2222 3333',
    contactName: 'Juan Pérez'
  },
  {
    id: 'br-2',
    name: 'Sucursal Vitacura',
    address: 'Av. Vitacura 5678, Piso 3',
    commune: 'Vitacura',
    type: 'PHYSICAL',
    emergencyPhone: '+56 2 4444 5555',
    contactName: 'María González'
  },
  {
    id: 'br-virtual',
    name: 'Sucursal Virtual',
    type: 'VIRTUAL',
    meetLink: 'https://meet.google.com/abc-defg-hij'
  }
];

// Servicios
export const SERVICES: Service[] = [
  {
    id: 'svc-1',
    name: 'Psicoterapia Adultos',
    durationMinutes: 60,
    price: 45000,
    type: ServiceType.ONLINE,
    description: 'Sesión individual online.',
    specialistId: 'usr-spec-2',
    branchId: 'br-virtual'
  },
  {
    id: 'svc-2',
    name: 'Psiquiatría Evaluación',
    durationMinutes: 45,
    price: 60000,
    type: ServiceType.PRESENTIAL,
    description: 'Evaluación inicial y diagnóstico.',
    specialistId: 'usr-spec-1',
    branchId: 'br-1'
  },
  {
    id: 'svc-3',
    name: 'Psiquiatría',
    durationMinutes: 60,
    price: 70000,
    type: ServiceType.PRESENTIAL,
    description: 'Sesión de psiquiatría presencial.',
    specialistId: 'usr-spec-3',
    branchId: 'br-2'
  },
  {
    id: 'svc-4',
    name: 'Psiquiatría Online',
    durationMinutes: 60,
    price: 65000,
    type: ServiceType.ONLINE,
    description: 'Sesión de psiquiatría online.',
    specialistId: 'usr-spec-3',
    branchId: 'br-virtual'
  },
  {
    id: 'svc-5',
    name: 'Psicología',
    durationMinutes: 60,
    price: 45000,
    type: ServiceType.PRESENTIAL,
    description: 'Sesión de psicología presencial.',
    specialistId: 'usr-spec-4',
    branchId: 'br-1'
  },
  {
    id: 'svc-6',
    name: 'Psicología Online',
    durationMinutes: 60,
    price: 40000,
    type: ServiceType.ONLINE,
    description: 'Sesión de psicología online.',
    specialistId: 'usr-spec-4',
    branchId: 'br-virtual'
  },
  {
    id: 'svc-7',
    name: 'Neurociencia',
    durationMinutes: 60,
    price: 55000,
    type: ServiceType.PRESENTIAL,
    description: 'Sesión de neurociencia presencial.',
    specialistId: 'usr-spec-5',
    branchId: 'br-2'
  },
  {
    id: 'svc-8',
    name: 'Neurociencia Online',
    durationMinutes: 60,
    price: 50000,
    type: ServiceType.ONLINE,
    description: 'Sesión de neurociencia online.',
    specialistId: 'usr-spec-5',
    branchId: 'br-virtual'
  },
  {
    id: 'svc-9',
    name: 'Corporalidad',
    durationMinutes: 60,
    price: 40000,
    type: ServiceType.PRESENTIAL,
    description: 'Sesión de corporalidad presencial.',
    specialistId: 'usr-spec-6',
    branchId: 'br-1'
  },
  {
    id: 'svc-10',
    name: 'Corporalidad Online',
    durationMinutes: 60,
    price: 35000,
    type: ServiceType.ONLINE,
    description: 'Sesión de corporalidad online.',
    specialistId: 'usr-spec-6',
    branchId: 'br-virtual'
  }
];

// Usuarios del Sistema (Staff)
export const USERS: (User | Specialist)[] = [
  {
    id: 'usr-admin-1',
    firstName: 'María',
    lastName: 'Directora',
    email: 'admin@equilibrar.cl',
    role: Role.ADMIN,
    avatarUrl: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: 'usr-coord-1',
    firstName: 'Carlos',
    lastName: 'Coordinador',
    email: 'coord@equilibrar.cl',
    role: Role.COORDINATOR,
    avatarUrl: 'https://picsum.photos/100/100?random=2'
  },
  {
    id: 'usr-spec-1',
    firstName: 'Dra. Ana',
    lastName: 'Pérez',
    email: 'ana.perez@equilibrar.cl',
    role: Role.PROFESSIONAL,
    specialties: ['Psiquiatría', 'Adicciones'],
    bio: 'Médico Psiquiatra con 10 años de experiencia.',
    color: '#8884d8',
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    phone: '+56 9 1111 1111'
  } as Specialist,
  {
    id: 'usr-spec-2',
    firstName: 'Ps. Juan',
    lastName: 'Soto',
    email: 'juan.soto@equilibrar.cl',
    role: Role.PROFESSIONAL,
    specialties: ['Psicología Clínica', 'Terapia Cognitiva'],
    bio: 'Psicólogo Clínico especialista en ansiedad.',
    color: '#82ca9d',
    avatarUrl: 'https://picsum.photos/100/100?random=4',
    phone: '+56 9 2222 2222'
  } as Specialist,
  {
    id: 'usr-spec-3',
    firstName: 'Alan',
    lastName: 'Gómez',
    email: 'alan.gomez@equilibrar.cl',
    role: Role.PROFESSIONAL,
    specialties: ['Psiquiatría', 'Trastornos del Ánimo'],
    bio: 'Psiquiatra enfocado en trastornos del ánimo y ansiedad.',
    color: '#ffc658',
    avatarUrl: 'https://picsum.photos/100/100?random=16',
    phone: '+56 9 3333 3333'
  } as Specialist,
  {
    id: 'usr-spec-4',
    firstName: 'Claudio',
    lastName: 'Muñoz',
    email: 'claudio.munoz@equilibrar.cl',
    role: Role.PROFESSIONAL,
    specialties: ['Psicología', 'Terapia Familiar'],
    bio: 'Psicólogo con experiencia en terapia familiar y de pareja.',
    color: '#ff8042',
    avatarUrl: 'https://picsum.photos/100/100?random=17',
    phone: '+56 9 4444 4444'
  } as Specialist,
  {
    id: 'usr-spec-5',
    firstName: 'Carlos',
    lastName: 'Vargas',
    email: 'carlos.vargas@equilibrar.cl',
    role: Role.PROFESSIONAL,
    specialties: ['Neurociencia', 'Rehabilitación Cognitiva'],
    bio: 'Especialista en neurociencia y rehabilitación cognitiva.',
    color: '#0088fe',
    avatarUrl: 'https://picsum.photos/100/100?random=18',
    phone: '+56 9 5555 5555'
  } as Specialist,
  {
    id: 'usr-spec-6',
    firstName: 'Valentin',
    lastName: 'Rojas',
    email: 'valentin.rojas@equilibrar.cl',
    role: Role.PROFESSIONAL,
    specialties: ['Corporalidad', 'Terapia Corporal'],
    bio: 'Terapeuta corporal enfocado en la integración mente-cuerpo.',
    color: '#00C49F',
    avatarUrl: 'https://picsum.photos/100/100?random=19',
    phone: '+56 9 6666 6666'
  } as Specialist
];

// Pacientes (No tienen acceso al sistema)
export const PATIENTS: Patient[] = [
  {
    id: 'pt-1',
    firstName: 'Valentina',
    lastName: 'Cliente',
    email: 'val.client@gmail.com',
    avatarUrl: 'https://picsum.photos/100/100?random=5',
    rut: '18.123.456-7',
    phone: '+56 9 8765 4321',
    address: 'Av. Providencia 1234, Depto 502',
    commune: 'Providencia',
    healthSystem: 'ISAPRE',
    isapreName: 'Colmena',
    complementaryInsurance: 'Seguros BCI'
  },
  {
    id: 'pt-2',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=6',
    rut: '15.987.654-3',
    phone: '+56 9 1111 2222',
    address: 'Calle Falsa 123',
    commune: 'Santiago',
    healthSystem: 'FONASA'
  },
  {
    id: 'pt-3',
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=7',
    rut: '16.555.444-2',
    phone: '+56 9 3333 4444',
    address: 'Los Leones 456',
    commune: 'Providencia',
    healthSystem: 'ISAPRE',
    isapreName: 'Cruz Blanca'
  },
  {
    id: 'pt-4',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=8',
    rut: '17.888.999-K',
    phone: '+56 9 5555 6666',
    address: 'Alameda 789',
    commune: 'Santiago',
    healthSystem: 'FONASA'
  },
  {
    id: 'pt-5',
    firstName: 'Ana',
    lastName: 'Fernández',
    email: 'ana.fernandez@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=9',
    rut: '19.222.333-4',
    phone: '+56 9 7777 8888',
    address: 'Vitacura 321',
    commune: 'Vitacura',
    healthSystem: 'PARTICULAR'
  },
  {
    id: 'pt-6',
    firstName: 'Luis',
    lastName: 'Martínez',
    email: 'luis.martinez@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=10',
    rut: '14.111.222-3',
    phone: '+56 9 9999 0000',
    address: 'Las Condes 654',
    commune: 'Las Condes',
    healthSystem: 'ISAPRE',
    isapreName: 'Banmédica'
  },
  {
    id: 'pt-7',
    firstName: 'Sofía',
    lastName: 'López',
    email: 'sofia.lopez@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=11',
    rut: '20.555.666-7',
    phone: '+56 9 1212 3434',
    address: 'Irarrázaval 987',
    commune: 'Ñuñoa',
    healthSystem: 'FONASA'
  },
  {
    id: 'pt-8',
    firstName: 'Diego',
    lastName: 'Sánchez',
    email: 'diego.sanchez@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=12',
    rut: '13.444.555-6',
    phone: '+56 9 5656 7878',
    address: 'Vicuña Mackenna 111',
    commune: 'La Florida',
    healthSystem: 'FONASA'
  },
  {
    id: 'pt-9',
    firstName: 'Laura',
    lastName: 'Ramírez',
    email: 'laura.ramirez@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=13',
    rut: '18.999.000-1',
    phone: '+56 9 8989 0101',
    address: 'Pajaritos 222',
    commune: 'Maipú',
    healthSystem: 'ISAPRE',
    isapreName: 'Consalud'
  },
  {
    id: 'pt-10',
    firstName: 'Javier',
    lastName: 'Torres',
    email: 'javier.torres@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=14',
    rut: '16.777.888-9',
    phone: '+56 9 2323 4545',
    address: 'Gran Avenida 333',
    commune: 'San Miguel',
    healthSystem: 'FONASA'
  },
  {
    id: 'pt-11',
    firstName: 'Camila',
    lastName: 'Flores',
    email: 'camila.flores@email.com',
    avatarUrl: 'https://picsum.photos/100/100?random=15',
    rut: '19.333.444-5',
    phone: '+56 9 6767 8989',
    address: 'Apoquindo 444',
    commune: 'Las Condes',
    healthSystem: 'PARTICULAR'
  }
];

// Fichas Clínicas Mock
export const CLINICAL_RECORDS: ClinicalRecord[] = [
  {
    id: 'cr-1',
    patientId: 'pt-1',
    entries: [
      {
        id: 'entry-1',
        date: '2023-10-15T10:00:00Z',
        specialistId: 'usr-spec-1',
        reason: 'Ansiedad y problemas de sueño',
        diagnosis: 'Trastorno de ansiedad generalizada leve',
        treatment: 'Se indica higiene del sueño y ejercicios de respiración. Control en 2 semanas.',
        evolution: 'Paciente refiere mejora leve en conciliación del sueño.'
      },
      {
        id: 'entry-2',
        date: '2023-10-29T10:00:00Z',
        specialistId: 'usr-spec-1',
        reason: 'Control',
        diagnosis: 'Trastorno de ansiedad generalizada leve',
        treatment: 'Mantener indicaciones. Se sugiere inicio de psicoterapia.',
        evolution: 'Paciente más tranquila, duerme 6 horas continuas.'
      }
    ]
  }
];

// Citas Mock
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const APPOINTMENTS: Appointment[] = [
  {
    id: uuidv4(),
    patientId: 'pt-1',
    specialistId: 'usr-spec-1',
    serviceId: 'svc-1',
    dateStart: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
    dateEnd: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    status: AppointmentStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Sesión de seguimiento.'
  },
  {
    id: uuidv4(),
    patientId: 'pt-1',
    specialistId: 'usr-spec-2',
    serviceId: 'svc-2',
    dateStart: new Date(tomorrow.setHours(15, 0, 0, 0)).toISOString(),
    dateEnd: new Date(tomorrow.setHours(15, 45, 0, 0)).toISOString(),
    status: AppointmentStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING
  }
];

// --- SERVICIOS MOCK (Simulando API calls) ---

export const mockLogin = async (role: Role): Promise<User | Specialist> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS.find(u => u.role === role);
      if (user) {
        resolve(user);
      } else {
        reject(new Error("Usuario no encontrado para este rol"));
      }
    }, 600);
  });
};

export const getAppointments = async (): Promise<Appointment[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...APPOINTMENTS]), 400));
};

export const getPatients = async (): Promise<Patient[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...PATIENTS]), 400));
};

export const getClinicalRecord = async (patientId: string): Promise<ClinicalRecord | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const record = CLINICAL_RECORDS.find(r => r.patientId === patientId);
      resolve(record || { id: uuidv4(), patientId, entries: [] });
    }, 400);
  });
};

export const getMyStats = async () => {
  // Simulación de cálculo de backend
  return {
    totalRevenue: 1540000,
    pendingAppointments: 12,
    activeClients: 45
  };
};
