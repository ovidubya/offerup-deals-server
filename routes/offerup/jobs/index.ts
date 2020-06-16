import * as cron from "cron";
import { Router } from "express";
import { cronJob } from "../cron";

export const applyJobsRoute = (Router: Router) => {
  const MINUTE_15 = "*/15 * * * *";
  const MINUTE = "* * * * *";

  let JOB_STATUS = false;

  const job = new cron.CronJob(
    MINUTE_15,
    cronJob,
    null,
    true,
    "America/Resolute"
  );
  job.stop();

  Router.post("/start-job", async (req, res) => {
    job.start();
    JOB_STATUS = true;
    res.send({
      message: "job started",
    });
  });

  Router.post("/end-job", async (req, res) => {
    job.stop();
    JOB_STATUS = false;
    res.send({
      message: "job ended",
    });
  });

  Router.get("/job-status", async (req, res) => {
    res.json({
      isJobRunning: JOB_STATUS,
    });
  });
};
