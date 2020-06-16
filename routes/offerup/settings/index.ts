import { Router } from "express";
import * as fs from "promise-fs";
import * as path from "path";

export const applySettingsRoute = (Router: Router) => {
  Router.post("/settings", async (req, res) => {
    await fs.writeFile(
      path.join(__dirname, "../", "settings.json"),
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
        path.join(__dirname, "../", "settings.json"),
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
};
