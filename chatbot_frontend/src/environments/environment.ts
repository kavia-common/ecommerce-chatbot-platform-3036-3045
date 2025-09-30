export const environment = {
  production: false,
  // PUBLIC_INTERFACE
  /** Base URL for backend REST API. Set via NG_APP_API_BASE at build time or defaults to local dev. */
  apiBaseUrl: (typeof process !== 'undefined' && (process.env?.['NG_APP_API_BASE'] as string)) || 'http://localhost:8000/api',
};
