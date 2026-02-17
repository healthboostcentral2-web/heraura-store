/**
 * Application Configuration
 * 
 * Centralized management of environment variables.
 * Falls back to safe defaults if keys are missing (Development Mode).
 */

const getEnv = (key: string, fallback: string = '') => {
  // Vite Support: Check import.meta.env
  // Cast to any to avoid TS error: Property 'env' does not exist on type 'ImportMeta'
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }

  // Node/CRA Support: Check process.env (safely)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {
    // process is not defined
  }

  return fallback;
};

export const config = {
  firebase: {
    apiKey: getEnv('REACT_APP_FIREBASE_API_KEY'),
    authDomain: getEnv('REACT_APP_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('REACT_APP_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('REACT_APP_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('REACT_APP_FIREBASE_APP_ID'),
  },
  payment: {
    // Gateway specific public key (e.g., Stripe Publishable Key or Razorpay Key ID)
    gatewayKey: getEnv('REACT_APP_PAYMENT_GATEWAY_KEY'), 
    currency: getEnv('REACT_APP_CURRENCY', 'USD'),
    currencySymbol: getEnv('REACT_APP_CURRENCY_SYMBOL', '$'),
    // Force test mode if explicitly set, otherwise defaults to true if key is missing
    isTestMode: getEnv('REACT_APP_PAYMENT_MODE') !== 'production',
  },
  app: {
    baseUrl: getEnv('REACT_APP_BASE_URL', typeof window !== 'undefined' ? window.location.origin : ''),
    name: getEnv('REACT_APP_NAME', 'HerAura'),
    env: getEnv('NODE_ENV', 'development'),
  }
};

/**
 * Checks if a specific integration is fully configured
 */
export const isFirebaseConfigured = () => !!config.firebase.apiKey && !!config.firebase.projectId;
export const isPaymentConfigured = () => !!config.payment.gatewayKey;