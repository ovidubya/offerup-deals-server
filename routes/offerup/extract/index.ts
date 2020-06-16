import * as fs from "promise-fs";
import * as path from "path";
import { Router } from "express";
import { OfferupSettings, OfferupType } from "../../../types/offerup";
import { clean, run, Item } from "../../../strategies/offerup";

export const applyExtractRoute = (Router: Router) => {
  Router.post("/extract", async (req, res) => {
    let settings;
    try {
      settings = await fs.readFile(
        path.join(__dirname, "../", "settings.json"),
        "utf8"
      );
    } catch (e) {
      console.log("could not read settings");
    }

    if (settings) {
      let settingsJSON: OfferupSettings = JSON.parse(settings);
      run(settingsJSON).then(async (feedItems: OfferupType[]) => {
        let cleanedItems: Item[] = clean(feedItems, settingsJSON);

        try {
          await fs.writeFile(
            path.join(__dirname, "../", "data.json"),
            JSON.stringify(cleanedItems, null, 2),
            "utf8"
          );
          res.send({
            message: "updated file",
          });
        } catch (e) {
          console.log("unable to read data.json, creating a new one...");
          await fs.writeFile(
            path.join(__dirname, "../", "data.json"),
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
};
