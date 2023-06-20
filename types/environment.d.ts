declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXTAUTH_SECRET: string;
    readonly NEXTAUTH_GOOGLE_CLIENT_ID: string;
    readonly NEXTAUTH_GOOGLE_CLIENT_SECRET: string;

    readonly SMTP_HOST: string;
    readonly SMTP_USER: string;
    readonly SMTP_PASSWORD: string;
    readonly SMTP_PORT: string;
    readonly EMAIL_FROM: string;
    readonly FREE_CREDITS: number;


    readonly OSS_ENDPOINT: string;
    readonly OSS_BUCKET: string;
    readonly OSS_ACCESS_KEY: string;
    readonly OSS_ACCESS_SECRET: string;
    readonly OSS_VOLUME_PATH?: string;
  }
}
