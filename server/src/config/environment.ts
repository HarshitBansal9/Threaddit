export const PROD = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT || "9000";

const defaultPort = 5432;
function normalizePort(val: string | undefined) {
    if (!val) return defaultPort;
    const port = parseInt(val, 10);
    if (isNaN(port)) return defaultPort;
    if (port >= 0) return port;
    return defaultPort;
}

export const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

export const CONFIG_PG = {
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "admin",
    password: process.env.DB_PASSWORD ?? "postgres",
    port: normalizePort(process.env.DB_PORT),
    database: process.env.DB_DB ?? "threaddit",
    ssl: false,
};

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const UI_ROOT_URL = process.env.UI_ROOT_URL ?? "http://localhost:5173";

export const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
export const REDIS_PORT = normalizePort(process.env.REDIS_PORT ?? "6379");
