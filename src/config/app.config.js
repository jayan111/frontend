export const APP_CONFIG = {
  name: 'DevTinder',
  apiBase: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  queryStaleTime: 1000 * 60 * 5,   // 5 minutes
  toastDuration: 4000,
};

export const BREAKPOINTS = {
  mobile:  480,
  tablet:  768,
  desktop: 1024,
  wide:    1440,
};
