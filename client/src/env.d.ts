
interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    // اضافه کن هر متغیر VITE_ دلخواه دیگه‌ای که می‌خوای اینجا
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }