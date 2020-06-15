import * as express from "express";
import * as fs from "promise-fs";
import * as path from "path";
import { run, clean, Item } from "../../strategies/offerup";
import { OfferupType, OfferupSettings } from "../../types/offerup";
import * as cron from "cron";
import { cronJob } from "./cron";

const MINUTE_15 = "*/15 * * * *";

let JOB_STATUS = false;

const job = new cron.CronJob(
  MINUTE_15,
  cronJob,
  null,
  true,
  "America/Resolute"
);
job.start();

const Router = express.Router();

Router.post("/settings", async (req, res) => {
  await fs.writeFile(
    path.join(__dirname, "settings.json"),
    JSON.stringify(req.body, null, 2),
    "utf8"
  );
  res.json({
    message: "ok",
  });
});

Router.get("/settings", async (req, res) => {
  let rawFileData;

  try {
    rawFileData = await fs.readFile(
      path.join(__dirname, "settings.json"),
      "utf8"
    );
  } catch (e) {
    console.log("file could not be read");
  }

  if (rawFileData) {
    res.json(JSON.parse(rawFileData));
  } else {
    res.json({
      message: "No file",
    });
  }
});

Router.post("/blacklist/:id", async (req, res) => {
  let blackListFile: Array<number> = [];
  if (req.params.id === "clear") {
    await fs.writeFile(
      path.join(__dirname, "blacklist.json"),
      JSON.stringify([], null, 2),
      "utf8"
    );
    res.json({
      message: "clear complete",
    });
  } else {
    try {
      blackListFile = JSON.parse(
        await fs.readFile(path.join(__dirname, "blacklist.json"), "utf8")
      );
      blackListFile.push(Number(req.params.id));
      await fs.writeFile(
        path.join(__dirname, "blacklist.json"),
        JSON.stringify(blackListFile, null, 2),
        "utf8"
      );
      res.json({
        message: "ok",
      });
    } catch (e) {
      console.log("error updating blacklist, creating a new one");
      await fs.writeFile(
        path.join(__dirname, "blacklist.json"),
        JSON.stringify([req.params.id]),
        "utf8"
      );
      res.json([req.params.id]);
    }
  }
});

Router.get("/blacklist", async (req, res) => {
  let rawFileData;

  try {
    rawFileData = await fs.readFile(
      path.join(__dirname, "blacklist.json"),
      "utf8"
    );
  } catch (e) {
    console.log("file could not be read");
  }

  if (rawFileData) {
    res.json(JSON.parse(rawFileData));
  } else {
    res.json({
      message: "No file",
    });
  }
});

Router.delete("/blacklist/:id", async (req, res) => {
  let blackListFile: Array<number> = [];
  try {
    blackListFile = JSON.parse(
      await fs.readFile(path.join(__dirname, "blacklist.json"), "utf8")
    );
    blackListFile = blackListFile.filter((el) => el !== Number(req.params.id));
    await fs.writeFile(
      path.join(__dirname, "blacklist.json"),
      JSON.stringify(blackListFile, null, 2),
      "utf8"
    );
    res.json({
      message: "ok",
    });
  } catch (e) {
    console.log("error updating blacklist");
    res.json({
      message: "erorr updating file, possibly empy",
    });
  }
});

Router.post("/extract", async (req, res) => {
  let settings;
  try {
    settings = await fs.readFile(path.join(__dirname, "settings.json"), "utf8");
  } catch (e) {
    console.log("could not read settings");
  }

  if (settings) {
    let settingsJSON: OfferupSettings = JSON.parse(settings);
    run(settingsJSON).then(async (feedItems: OfferupType[]) => {
      let cleanedItems: Item[] = clean(feedItems, settingsJSON.query);

      try {
        await fs.writeFile(
          path.join(__dirname, "data.json"),
          JSON.stringify(cleanedItems, null, 2),
          "utf8"
        );
        res.send({
          message: "updated file",
        });
      } catch (e) {
        console.log("unable to read data.json, creating a new one...");
        await fs.writeFile(
          path.join(__dirname, "data.json"),
          JSON.stringify(cleanedItems, null, 2),
          "utf8"
        );
        res.send({
          message: "done",
        });
      }
    });
  } else {
    res.send({
      message: "could not read settings file",
    });
  }
});

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

Router.post("/expo-token", async (req, res) => {
  await fs.writeFile(
    path.join(__dirname, "token.json"),
    JSON.stringify(req.body),
    "utf8"
  );
});

Router.get("/data", async (req, res) => {
  let blackList: Array<number> = [],
    data: Item[];

  try {
    blackList = JSON.parse(
      await fs.readFile(path.join(__dirname, "blacklist.json"), "utf8")
    );
  } catch (e) {
    console.log("unable to read blacklist");
  }

  try {
    data = JSON.parse(
      await fs.readFile(path.join(__dirname, "data.json"), "utf8")
    );
  } catch (e) {
    console.log("unable to read data");
  }

  if (data) {
    res.json({
      data: data.filter((item) => {
        return !blackList.includes(item.id);
      }),
    });
  } else {
    res.json({
      message: "no data sorry",
    });
  }
});

export default Router;
