import axios, { AxiosResponse } from "axios";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as csrf from "csurf";
import * as express from "express";
import * as fs from "fs";
import * as helmet from "helmet";
import * as serveStatic from "serve-static";

const pathExistSync = (pathName: string): boolean => {
	try {
		fs.accessSync(pathName);
		return true;
	} catch (err) {
		return false;
	}
};

// Set Up Express Server
const app: express.Express = express();

// Middleware
const jsonParser = bodyParser.json();
const csrfProtection = csrf({ cookie: true });

// Constants
const TCL_BACKEND_PATH = "http://localhost:8001/api/process";

if (pathExistSync("dist")) {
    process.chdir("dist");
}

const STATIC_PATH = process.cwd() + "/static/";

// Adjust HTTP header setting for security
//  - Enabled: dnsPrefetchControl, framegurd, hidePoweredBy, hsts, isNoOpen, xssFilter
//  - Disabled: contentSecurityPolicy, HTTP Public Key Pinning, noCache
app.use(helmet());
app.use(cookieParser());
app.use(compression());

// ToDo: Change to render initial state into HTML using template
app.use(serveStatic(STATIC_PATH, { index: ["index.html"] }));

app.use(
    "/api/*",
    (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        if (req.headers["Content-Type"] === "application/json") {
            res.set("Content-Type", "application/json");
        }
        next();
    });

app.get(
    "/api/token",
    csrfProtection,
    (req: express.Request, res: express.Response): void => {
        res.json({ "_csrf": req.csrfToken() });
    })

app.post(
    "/api/process",
    jsonParser,
    csrfProtection,
    (req: express.Request, res: express.Response): void => {
        if (!req.body) {
            res.sendStatus(400);
        } else {
            const body: string = JSON.stringify({
                formatString: req.body.formatString,
                input: req.body.input,
            });
            axios.post(TCL_BACKEND_PATH, `${body}\n`)
            .then((apiRes: AxiosResponse): void => {
                res.status(200);
                res.send(apiRes.data);
            })
            .catch((apiRes: AxiosResponse): void => {
                res.status(apiRes.status);
                res.send({ error: "Request Failed" });
            });
        }
    },
);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
        if (err.code !== 'EBADCSRFTOKEN') return next(err);
        console.log(req.cookies);
        res.status(403).json({"error": "session has expired or tampered with"});
    });

module.exports = app;
