import arraySort from "array-sort";
import { OfferupType, OfferupSettings } from "../../types/offerup";

export class Owner {
  constructor(
    public isTruYou,
    public ownerReviews,
    public ownerStars,
    public ownerJoinedYear,
    public verified,
    public avatarUrlImage
  ) {}
}

export class Item {
  constructor(
    public id,
    public owner,
    public url,
    public price,
    public title,
    public description,
    public imageUrls,
    public postDate,
    public isShipping
  ) {}
}

export const clean = (
  data: OfferupType[],
  settings: OfferupSettings
): Item[] => {
  let cleanData = [];

  data = data.filter((el) => {
    return el?.item?.title?.toLowerCase().includes(settings.query);
  });

  if (settings?.yearMin) {
    data = data.filter((el) => {
      return (
        new Date(el.item.post_date).getFullYear() >= Number(settings.yearMin)
      );
    });
  }

  data.forEach((el) => {
    cleanData.push(
      new Item(
        el?.item?.id,
        new Owner(
          el?.item?.owner?.identity_attributes?.is_truyou_member ? true : false,
          el?.item?.owner?.get_profile?.rating?.count,
          el?.item?.owner?.get_profile?.rating?.average,
          new Date(el?.item?.owner.date_joined).getFullYear(),
          el?.item?.owner?.get_profile?.verified,
          el?.item?.owner?.get_profile?.avatar_normal
        ),
        el?.item.get_full_url,
        el?.item?.price,
        el?.item?.title,
        el?.item?.description,
        el?.item?.photos.map((image) => image?.images?.detail_full?.url),
        el?.item?.post_date,
        el?.item?.shipping_attributes?.shipping_enabled
      )
    );
  });
  arraySort(
    cleanData,
    ["owner.isTruYou", "owner.ownerReviews", "owner.ownerJoinedYear"],
    { reverse: true }
  );
  return cleanData;
};
