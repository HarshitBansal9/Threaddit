



export const PROD = process.env.NODE_ENV === 'production'
export const PORT = process.env.PORT || "9000"

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
    password: process.env.DB_PASSWORD ?? "pass",
    port: normalizePort(process.env.DB_PORT),
    database: "threaddit",
    ssl: false,
};
