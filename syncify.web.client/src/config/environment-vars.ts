type REACT_APP_ENVIRONMENT = 'local' | 'development' | 'production';

export type Env = {
  isProductionBuild: boolean;
  publicUrl: string;

  name: REACT_APP_ENVIRONMENT;
  buildNumber: string;
  apiBaseUrl?: string;
  host: string;
  subdirectory?: string;
  appRoot: string;

  mixPanelToken?: string;
  googleAnalyticsId?: string;
  sentryKey?: string;
  sentryProjectId?: string;
};

const subdirectory = import.meta.env.VITE_SUBDIRECTORY;
const host = `${window.location.protocol}//${window.location.host}`;
const appRoot = `${host}${subdirectory}`;

export const Env: Env = {
  isProductionBuild: import.meta.env.NODE_ENV === 'production',
  publicUrl: import.meta.env.PUBLIC_URL,

  name: import.meta.env.VITE_ENVIRONMENT as REACT_APP_ENVIRONMENT,
  buildNumber: import.meta.env.VITE_BUILD_NUMBER || 'local',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

  host,
  subdirectory,
  appRoot,

  mixPanelToken: import.meta.env.VITE_MIXPANEL_TOKEN,
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  sentryKey: import.meta.env.VITE_SENTRY_PUBLIC_KEY,
  sentryProjectId: import.meta.env.VITE_SENTRY_PUBLIC_PROJECT_ID,
};