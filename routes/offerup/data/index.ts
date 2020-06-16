import * as fs from "promise-fs";
import * as path from "path";
import { Router } from "express";
import { Item } from "../../../types/offerup";

export const applyDataRoute = (Router: Router) => {
  Router.get("/data", async (req, res) => {
    let blackList: Array<number> = [],
      data: Item[];

    try {
      blackList = JSON.parse(
        await fs.readFile(path.join(__dirname, "../", "blacklist.json"), "utf8")
      );
    } catch (e) {
      console.log("unable to read blacklist");
    }

    try {
      data = JSON.parse(
        await fs.readFile(path.join(__dirname, "../", "data.json"), "utf8")
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
};
