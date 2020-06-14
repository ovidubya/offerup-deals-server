import { OfferupSettings } from "../../types/offerup";

export const getUrl = (settings: OfferupSettings) => {
  const url = `https://offerup.com/search/?q=${settings.query}&delivery_param=${
    settings.delievery
  }${
    settings.delievery === "p" && settings.radius
      ? `&radius=${settings.radius}`
      : ""
  }&price_min=${settings.price_min}&price_max=${
    settings.price_max
  }&sort=-posted`;
  return url;
};
