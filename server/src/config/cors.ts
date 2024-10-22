import { PROD } from "./environment";
import type { CorsOptions } from "cors";
const allowedOrigins = ["https://myapp.com"];
if (!PROD) {
  allowedOrigins.push("http://localhost:5173");
}

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    //allows requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

export default corsOptions;
