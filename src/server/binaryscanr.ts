import axios, { AxiosResponse } from "axios";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as csrf from "csurf";
import * as express from "express";
import * as fs from "fs";
import * as helmet from "helmet";
import * as serveStatic from "serve-static";

import isValidFilter from "../client/helpers/isValidFilter";
import filterString from "./utils/filterString";

const MAX_FILTER_LEN = 254;
const MAX_HEX_LEN = 1500;

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

app.get(
    "/api/token",
    csrfProtection,
    (req: express.Request, res: express.Response): void => {
        res.set("Content-Type", "application/json");
        res.json({ "_csrf": req.csrfToken() });
    })

app.post(
    "/api/process",
    jsonParser,
    csrfProtection,
    (req: express.Request, res: express.Response): void => {
        res.set("Content-Type", "application/json");
        if (!req.body || !(req || {}).body.formatString.length) {
            res.sendStatus(400);
        } else {
            try {
                const { formatString = "", input = "" } = req.body || {};
                const body: string = JSON.stringify({
                    formatString: req.body.formatString,
                    input: req.body.input,
                });
                if (
                    input.length > MAX_HEX_LEN ||
                    formatString.length > MAX_FILTER_LEN ||
                    !isValidFilter(formatString)
                ) {
                    res.sendStatus(400);
                    return void 0;
                }
                axios.post(TCL_BACKEND_PATH, `${body}\n`)
                    .then((apiRes: AxiosResponse): void => {
                        res.status(200).send(filterString(apiRes.data));
                    })
                    .catch((err): void => {
                        let error: string | undefined;
                        const data = ((err || {}).response || {}).data;
                        try {
                            if (typeof data === "string") {
                                error = (JSON.parse(data) || {}).error;
                            }
                            if (Object.prototype.hasOwnProperty.call(data, "error")) {
                                error = data.error;
                            }
                        } catch (e) {
                            error = e.message;
                        }
                        res.status(500).json({
                            error: `Request Failed: ${error || err.message}`,
                        });
                    });
            } catch (err) {
                res.status(500).json({ error: err.message })
            }
        }
    },
);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
        if (err.code !== 'EBADCSRFTOKEN') return next(err);
        console.log(req.cookies);
        res.status(403).json({"error": "session has expired or tampered with"});
    });

module.exports = app;
