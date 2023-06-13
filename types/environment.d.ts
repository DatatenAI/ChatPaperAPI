declare namespace NodeJS {
    export interface ProcessEnv {
        readonly NEXTAUTH_SECRET: string;
        readonly NEXTAUTH_GITHUB_CLIENT_ID: string;
        readonly NEXTAUTH_GITHUB_CLIENT_SECRET: string;

        readonly SMTP_HOST: string;
        readonly SMTP_USER: string;
        readonly SMTP_PASSWORD: string;
        readonly SMTP_PORT: string;
        readonly EMAIL_FROM: string;

    }
}