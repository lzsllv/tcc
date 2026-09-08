export type AppEnv = ReturnType<typeof parseEnv>;
export declare function parseEnv(input: Record<string, string | undefined>): {
    databaseUrl: string;
    directUrl: string;
    supabaseUrl: string;
    supabasePublishableKey: string;
    supabaseSecretKey: string;
    corsOrigin: string;
    port: number;
    logLevel: "error" | "fatal" | "warn" | "info" | "debug" | "trace" | "silent";
};
