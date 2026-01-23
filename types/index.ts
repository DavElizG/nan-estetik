/**
 * Tipos TypeScript globales
 * 
 * Definiciones de tipos reutilizables en toda la aplicación
 */

/**
 * Tipo para respuestas de API
 */
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * Tipo para opciones de paginación
 */
export type PaginationOptions = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

/**
 * Tipo para respuestas paginadas
 */
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};

/**
 * Tipo para formularios de paciente
 */
export type PatientFormData = {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth?: Date | string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  allergies?: string;
  medicalHistory?: string;
};

/**
 * Tipo para formularios de bitácora
 */
export type PatientRecordFormData = {
  patientId: string;
  type: 'CONSULTATION' | 'TREATMENT' | 'FOLLOW_UP' | 'EMERGENCY';
  treatmentName: string;
  description: string;
  observations?: string;
  productsUsed?: string;
  nextAppointment?: Date | string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  documents?: string[];
};

/**
 * Tipo para filtros de búsqueda de pacientes
 */
export type PatientSearchFilters = {
  search?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateFrom?: Date;
  dateTo?: Date;
};

/**
 * Tipo para filtros de búsqueda de bitácoras
 */
export type RecordSearchFilters = {
  patientId?: string;
  type?: 'CONSULTATION' | 'TREATMENT' | 'FOLLOW_UP' | 'EMERGENCY';
  dateFrom?: Date;
  dateTo?: Date;
};

/**
 * Tipo para sesión de usuario
 */
export type UserSession = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF';
};

/**
 * Tipo para opciones de select
 */
export type SelectOption = {
  value: string;
  label: string;
};
