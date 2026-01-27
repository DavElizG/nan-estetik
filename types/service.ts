/**
 * Types for Services
 */

export interface Treatment {
  id: string;
  name: string;
  description: string;
  icon: string;
  benefits: string[];
  duration: string;
  price: string;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: string;
  isPremium: boolean;
  order: number;
  treatments: Treatment[];
}
