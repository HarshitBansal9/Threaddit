import express from "express";
import corsOptions from "./config/cors";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import querystring from "querystring";
import jwt from "jsonwebtoken";
import { AppError, HttpCode } from "./config/errors";
import axios from "axios";
import api from "./routes";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    JWT_SECRET,
    UI_ROOT_URL,
} from "./config/environment";
import expressAsyncHandler from "express-async-handler";
import db from "./lib/db";
import { users } from "./lib/db/schema/users";

//parses incoming cookies and makes sure they are signed
app.use(cookieParser());
app.use(cors(corsOptions));

//parses incoming JSON payloads with a Content-Tpye header of application/json
app.use(express.json({ limit: "50mb" }));

//parses incoming form payloads with a Content-Type header of application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//implementing oauth login and signup
const redirectURL = "auth/google";

function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `http://localhost:9000/${redirectURL}`, //where google sends the user after they login
        client_id: GOOGLE_CLIENT_ID,
        access_type: "offline", // users can receive a new access token on expiry so that they dont need to re authenticate everytime
        response_type: "code", //this helps to receive a code from google which we can then turn into a jwt
        prompt: "consent", //users have to grant permission eveytime they login
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
}

// Getting login URL
app.get("/auth/google/url", (req, res) => {
    res.send(getGoogleAuthURL());
});

//This function gets the google access token after it receives the code
function getToken({
    code,
    clientId,
    clientSecret,
    redirectURL,
}: {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectURL: string;
}): Promise<{
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
}> {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectURL,
        grant_type: "authorization_code",
    };
    //sending the code + client secret in order to get the access token back
    return axios
        .post(url, querystring.stringify(values), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((res) => res.data)
        .catch((error) => {
            console.error(`Failed to fetch auth tokens`);
            throw new Error(error.message);
        });
}

//Getting the user  data from google with the token
app.get(`/${redirectURL}`, async (req, res) => {
    const code = req.query.code as string;

    const { id_token, access_token } = await getToken({
        code: code,
        clientId: GOOGLE_CLIENT_ID ?? "",
        clientSecret: GOOGLE_CLIENT_SECRET ?? "",
        redirectURL: `http://localhost:9000/${redirectURL}`,
    });

    const googleUser = await axios
        .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        )
        .then((res) => res.data)
        .catch((error) => {
            console.error("Error while fetching user data");
            throw new Error(error.message);
        });

    //adding a new user
    const newUser = {
        email: googleUser.email as string,
        username: googleUser.name as string,
        createdAt: new Date() as Date,
    };

    const data = await db
        .insert(users)
        .values(newUser)
        .onConflictDoNothing({ target: users.email })
        .returning();
    console.log(data);
    console.log("Google User: ", googleUser);

    const token = jwt.sign(googleUser, JWT_SECRET);

    res.redirect(`${UI_ROOT_URL}/callback?token=${token}`);
});


app.use("/api", api);

// catch 404
app.use((_req, _res, next) => {
    next(
        new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: "Requested endpoint does not exist",
        })
    );
});

export default app;
