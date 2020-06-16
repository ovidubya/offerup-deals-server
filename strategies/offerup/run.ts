import * as playwright from "playwright";
import * as fs from "fs";
import * as path from "path";
import { getUrl } from "./util";
import { OfferupSettings } from "../../types/offerup";

export const pause = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  });
};

export const run = async (settings: OfferupSettings) => {
  const browserType = "webkit";
  const browser = await playwright[browserType].launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(getUrl(settings));
  await page.goto("https://www.google.com");
  await page.screenshot({
    path: path.join(process.cwd(), "public/google.png"),
  });
  await page.goto(getUrl(settings));

  if (settings.delievery === "p") {
    await page.screenshot({
      path: path.join(process.cwd(), "public/screenshot_before.png"),
    });
    await page.waitForSelector("input[value=Nearby]", { state: "attached" });
    await page.fill(
      "input[value=Nearby]",
      !!settings.zipCode ? settings.zipCode : "60645"
    );
    console.log("pausing...");
    await pause(3000);
    await page.click(".dropdown-menu-item:nth-child(2)");
    await pause(3000);
    await page.reload();
    await page.screenshot({
      path: path.join(process.cwd(), "public/screenshot_after.png"),
    });
  } else if (settings.delievery === "s") {
    await page.screenshot({
      path: path.join(process.cwd(), "public/screenshot_before.png"),
    });
    await page.reload();
    await pause(3000);
    await page.screenshot({
      path: path.join(process.cwd(), "public/screenshot_after.png"),
    });
  }
  const feedItems = await page.evaluate(
    // @ts-ignore
    () => window.__OU_PROPS__.searchResponse.feedItems
  );
  await browser.close();
  console.log("done");

  return feedItems;
};
