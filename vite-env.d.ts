// Manually define ImportMeta to avoid "Cannot find type definition file for 'vite/client'" error
interface ImportMetaEnv {
  [key: string]: any;
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;
}

interface ImportMeta {
  url: string;
  readonly env: ImportMetaEnv;
  glob: (pattern: string) => Record<string, any>;
}
