export type Language = "ar" | "en";

export type RestaurantSettings = {
  name_ar: string;
  name_en: string | null;
  menu_title_ar: string;
  menu_title_en: string | null;
  menu_subtitle_ar: string | null;
  menu_subtitle_en: string | null;
  logo_url: string | null;
  pattern_url: string | null;
  currency_symbol: string;
};

export type Category = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string | null;
  image_url: string | null;
  sort_order: number;
};

export type ItemImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

export type ItemAddon = {
  id: string;
  name_ar: string;
  name_en: string | null;
  price: number;
  sort_order: number;
};

export type Item = {
  id: string;
  category_id: string;
  name_ar: string;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  sort_order: number;
  item_images: ItemImage[];
  item_addons?: ItemAddon[];
};


