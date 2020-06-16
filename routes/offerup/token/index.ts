import { Router } from "express";
import * as fs from "promise-fs";
import * as path from "path";

export const applyTokenRoute = (Router: Router) => {
  Router.post("/expo-token", async (req, res) => {
    await fs.writeFile(
      path.join(__dirname, "../", "token.json"),
      JSON.stringify(req.body),
      "utf8"
    );
    res.json({
      message: "done",
    });
  });
};
