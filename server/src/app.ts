import express from 'express';
import corsOptions from './config/cors';
const app = express();
import cors from 'cors';
import cookieParser from "cookie-parser";
import { AppError, HttpCode } from './config/errors';

//parses incoming cookies and makes sure they are signed
app.use(cookieParser());
app.use(cors(corsOptions));

//parses incoming JSON payloads with a Content-Tpye header of application/json
app.use(express.json({limit: '50mb'}));


//parses incoming form payloads with a Content-Type header of application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// catch 404
app.use((_req, _res, next) => {
    next(
        new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: "Requested endpoint does not exist",
        })
    );
});

// error handler


export default app;