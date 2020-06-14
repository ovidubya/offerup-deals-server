export interface OfferupType {
  type: string;
  tile_id: string;
  item?: Item | null;
  ad?: Ad | null;
}
export type OfferupSettings = {
  query: string;
  delievery: "s" | "p";
  price_min: string;
  price_max: string;
  radius?: "5" | "10" | "20" | "30";
};

export interface Item {
  distance: number;
  get_img_medium_height: number;
  post_date: string;
  get_img_medium_width: number;
  owner: Owner;
  watched: boolean;
  get_img_small_width: number;
  id: number;
  category: Category;
  location_name: string;
  get_img_small_height: number;
  title: string;
  post_date_ago: string;
  get_full_url: string;
  priority: number;
  state: number;
  longitude: number;
  latitude: number;
  get_img_permalink_medium: string;
  sort_label: string;
  description: string;
  paid: boolean;
  payable: boolean;
  image_mob_det_hd: string;
  image_mob_list_hd: string;
  listing_type: number;
  condition: number;
  post_from_store_address: string;
  photos?: PhotosEntity[] | null;
  get_img_permalink_small: string;
  get_img_permalink_large: string;
  price: string;
  shipping_attributes: ShippingAttributes;
  generic_attributes?: null;
  visible: boolean;
}
export interface Owner {
  first_name: string;
  get_profile: GetProfile;
  id: number;
  identity_attributes: IdentityAttributes;
  date_joined: string;
  softBlocked: boolean;
  active: boolean;
}
export interface GetProfile {
  rating: Rating;
  verified: number;
  avatar_normal: string;
  avatar_square: string;
  public_location_name?: string | null;
  not_active: boolean;
  uses_default_avatar: boolean;
}
export interface Rating {
  count: number;
  average: number;
}
export interface IdentityAttributes {
  is_truyou_member: boolean;
  autos_dealer_payment_info_on_file: boolean;
  is_autos_dealer: boolean;
  is_small_business: boolean;
  potential_autos_seller: boolean;
}
export interface Category {
  id: number;
  name: string;
}
export interface PhotosEntity {
  uuid: string;
  images: Images;
}
export interface Images {
  detail_full: DetailFullOrDetailOrList;
  detail: DetailFullOrDetailOrList;
  list: DetailFullOrDetailOrList;
}
export interface DetailFullOrDetailOrList {
  url: string;
  width: number;
  height: number;
}
export interface ShippingAttributes {
  shipping_enabled: boolean;
  shipping_price: number;
  show_as_shipped: boolean;
  can_ship_to_buyer: boolean;
  buy_it_now_enabled: boolean;
  seller_pays_shipping: boolean;
  feed_show_shipping_icon: boolean;
  seller_manages_shipping: boolean;
  empty: boolean;
  shipping_parcel_id?: string | null;
}
export interface Ad {
  adId: string;
  type: string;
  bing_tile_ad: BingTileAd;
}
export interface BingTileAd {
  ad_request_id: string;
  ou_ad_id: string;
  ad_mediation_id: string;
  search_id: string;
  ad_experiment_id: string;
  type: string;
  image_url: string;
  image_width: number;
  image_height: number;
  content_url: string;
  price: number;
  price_currency: string;
  item_name: string;
  seller_name: string;
  impression_feedback_url: string;
  click_feedback_url: string;
  click_return_url: string;
  rating: number;
  number_of_reviews: number;
}
