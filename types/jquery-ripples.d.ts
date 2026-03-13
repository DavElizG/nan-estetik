declare module 'jquery.ripples';

interface JQuery {
  ripples(options?: {
    imageUrl?: string;
    dropRadius?: number;
    perturbance?: number;
    resolution?: number;
    interactive?: boolean;
    crossOrigin?: string;
  }): JQuery;
  ripples(method: 'drop', x: number, y: number, radius: number, strength: number): JQuery;
  ripples(method: 'destroy' | 'hide' | 'show' | 'pause' | 'play' | 'updateSize'): JQuery;
  ripples(method: 'set', name: 'dropRadius' | 'perturbance' | 'interactive' | 'imageUrl' | 'crossOrigin', value: unknown): JQuery;
}
