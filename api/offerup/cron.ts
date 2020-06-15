import * as fs from "promise-fs";
import * as path from "path";
import { run, clean, Item } from "../../strategies/offerup";
import { OfferupType, OfferupSettings } from "../../types/offerup";
import * as fetch from "node-fetch";

export const cronJob = async () => {
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

        let blackList: Array<number> = [];

        try {
          blackList = JSON.parse(
            await fs.readFile(path.join(__dirname, "blacklist.json"), "utf8")
          );
          cleanedItems = cleanedItems.filter((item) => {
            return !blackList.includes(item.id);
          });

          if (cleanedItems.length !== 0) {
            let expoToken;
            try {
              expoToken = JSON.parse(
                await fs.readFile(path.join(__dirname, "token.json"), "utf8")
              ).token;
              const message = {
                to: expoToken,
                sound: "default",
                title: "OfferUp ",
                body: "Potential new deals, check them out!",
                _displayInForeground: true,
              };
              try {
                const response = await fetch(
                  "https://exp.host/--/api/v2/push/send",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Accept-encoding": "gzip, deflate",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(message),
                  }
                );
                console.log("sent a token message", new Date().toISOString());
              } catch (e) {
                console.log(e);
                console.log("unable to call expo server");
              }
            } catch (e) {
              console.log("unable to get token");
            }
          }
        } catch (e) {
          console.log("unable to read blacklist");
        }
      } catch (e) {
        console.log("unable to read data.json, creating a new one...");
        await fs.writeFile(
          path.join(__dirname, "data.json"),
          JSON.stringify(cleanedItems, null, 2),
          "utf8"
        );
      }
    });
  } else {
    console.log("could not read settings file");
  }
};
