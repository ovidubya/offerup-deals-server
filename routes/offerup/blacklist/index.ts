import { Router } from "express";
import * as fs from "promise-fs";
import * as path from "path";

export const applyBlacklistRoute = (Router: Router) => {
  Router.post("/blacklist/:id", async (req, res) => {
    let blackListFile: Array<number> = [];
    if (req.params.id === "clear") {
      await fs.writeFile(
        path.join(__dirname, "../", "blacklist.json"),
        JSON.stringify([], null, 2),
        "utf8"
      );
      res.json({
        message: "clear complete",
      });
    } else {
      try {
        blackListFile = JSON.parse(
          await fs.readFile(
            path.join(__dirname, "../", "blacklist.json"),
            "utf8"
          )
        );

        blackListFile.push(Number(req.params.id));
        await fs.writeFile(
          path.join(__dirname, "../", "blacklist.json"),
          JSON.stringify(blackListFile, null, 2),
          "utf8"
        );
        res.json({
          message: "ok",
        });
      } catch (e) {
        console.log("error updating blacklist, creating a new one");
        await fs.writeFile(
          path.join(__dirname, "../", "blacklist.json"),
          JSON.stringify([Number(req.params.id)]),
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
        path.join(__dirname, "../", "blacklist.json"),
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
        await fs.readFile(path.join(__dirname, "../", "blacklist.json"), "utf8")
      );
      blackListFile = blackListFile.filter(
        (el) => el !== Number(req.params.id)
      );
      await fs.writeFile(
        path.join(__dirname, "../", "blacklist.json"),
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
};
