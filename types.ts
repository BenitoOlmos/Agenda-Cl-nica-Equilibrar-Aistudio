/**
 * DEFINICIÓN DE ARQUITECTURA DE DATOS
 * Uso de UUIDs para integridad referencial y escalabilidad.
 */

export enum Role {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
  PROFESSIONAL = 'PROFESSIONAL'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  BLOCKED = 'BLOCKED'
}

export enum PaymentMethod {
  TRANSBANK = 'TRANSBANK',
  TRANSFER = 'TRANSFER',
  CASH = 'CASH'
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  REFUNDED = 'REFUNDED'
}

export enum ServiceType {
  ONLINE = 'ONLINE', // Google Meet
  PRESENTIAL = 'PRESENTIAL'
}

// Entidad Usuario Base (Staff)
export interface User {
  id: string; // UUID
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

// Entidad Paciente (Separada de Usuarios del Sistema)
export interface Patient {
  id: string; // UUID
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  rut: string; // RUT Chileno
  phone: string;
  address: string;
  commune: string;
  healthSystem: 'FONASA' | 'ISAPRE' | 'PARTICULAR';
  isapreName?: string; // Solo si es ISAPRE
  complementaryInsurance?: string;
  paymentIds?: string[]; // Vínculo a pagos generados
  password?: string; // Contraseña generada automáticamente
}

// Ficha Clínica (Ley N° 20.584)
export interface ClinicalRecord {
  id: string; // UUID
  patientId: string; // FK -> Patient
  entries: ClinicalEntry[];
}

// Entrada en la Ficha Clínica (Atención)
export interface ClinicalEntry {
  id: string; // UUID
  date: string; // ISO 8601 UTC
  specialistId: string; // FK -> Specialist
  reason: string; // Motivo de consulta
  diagnosis: string; // Diagnóstico
  treatment: string; // Indicaciones/Tratamiento
  evolution: string; // Evolución
  observations?: string; // Observaciones adicionales
}

// Extensión para Especialistas
export interface Specialist extends User {
  specialties: string[];
  bio: string;
  color: string; // Para el calendario
  phone?: string;
  performedServiceIds?: string[]; // Vínculo a servicios realizados
  treatedPatientIds?: string[]; // Vínculo a pacientes tratados
}

// Servicio Clínico
export interface Service {
  id: string; // UUID
  name: string;
  durationMinutes: number;
  price: number;
  type: ServiceType;
  description: string;
  specialistId?: string;
  branchId?: string;
}

// Cita Médica (Tabla Pivote Central)
export interface Appointment {
  id: string; // UUID
  patientId: string; // FK -> Patient
  specialistId: string; // FK -> Specialist
  serviceId: string; // FK -> Service
  dateStart: string; // ISO 8601 UTC string
  dateEnd: string; // ISO 8601 UTC string
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  meetLink?: string; // Para citas Online
  notes?: string;
}

// Registro de Pago
export interface Payment {
  id: string; // UUID
  appointmentId: string; // FK -> Appointment
  amount: number;
  method: PaymentMethod;
  date: string; // ISO 8601 UTC
  proofUrl?: string; // URL al comprobante (Storage)
  transactionId?: string; // ID externo (ej. Transbank)
}

// Interfaces de Estado de la App
export interface AuthState {
  user: User | Specialist | null;
  isAuthenticated: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  commune?: string;
  type: 'PHYSICAL' | 'VIRTUAL';
  emergencyPhone?: string;
  contactName?: string;
  meetLink?: string;
}
