export const APP_CONFIG = {
  name: 'DevTinder',
  apiBase: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SqG4GLi53wGpTb7IkGPOhAPSTx3aPwlkIl4x956g5GivaUfxLb0R1shrTr42gfLuVDkiFD9kr4jRFxjqsfZZwZ600eP4k6m82',
  queryStaleTime: 1000 * 60 * 5,   // 5 minutes
  toastDuration: 4000,
};

export const BREAKPOINTS = {
  mobile:  480,
  tablet:  768,
  desktop: 1024,
  wide:    1440,
};
