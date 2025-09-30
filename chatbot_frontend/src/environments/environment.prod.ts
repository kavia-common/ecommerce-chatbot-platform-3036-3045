export const environment = {
  production: true,
  // PUBLIC_INTERFACE
  /** Base URL for backend REST API in production. Configure via NG_APP_API_BASE (CI/CD). */
  apiBaseUrl: (typeof process !== 'undefined' && (process.env?.['NG_APP_API_BASE'] as string)) || 'https://your-backend.example.com/api',
};
