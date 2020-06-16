import * as express from "express";

export const Router = express.Router();

import { applySettingsRoute } from "./settings/";
import { applyBlacklistRoute } from "./blacklist/";
import { applyJobsRoute } from "./jobs/";
import { applyTokenRoute } from "./token/";
import { applyDataRoute } from "./data/";
import { applyExtractRoute } from "./extract/";

applySettingsRoute(Router);
applyBlacklistRoute(Router);
applyJobsRoute(Router);
applyTokenRoute(Router);
applyDataRoute(Router);
applyExtractRoute(Router);
