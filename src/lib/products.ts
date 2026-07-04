/**
 * Real Vilfood catalogue (from VILFOOD_CATALOGUE 2025).
 * Names are product-specific (not UI strings) so they live here, localized
 * inline. Photos are the catalogue jar shots, trimmed to /img/products/v3/.
 * Volumes are in millilitres (unit label comes from i18n: t.products.unit).
 */
import type { Locale } from "./i18n";

export type ProductCategory = "sauces" | "spreads" | "pickles" | "compotes";

export interface CatalogueProduct {
  id: string;
  category: ProductCategory;
  img: string;
  vol: string;
  name: Record<Locale, string>;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "sauces",
  "spreads",
  "pickles",
  "compotes",
];

export const PRODUCTS: CatalogueProduct[] = [
  // ---- Tomatoes & sauces ----
  {
    id: "tomato-paste",
    category: "sauces",
    img: "/img/products/v3/tomato-paste.webp",
    vol: "250 / 440 / 720 / 900",
    name: { en: "Tomato Paste", ru: "Томатная паста", hy: "Տոմատի մածուկ" },
  },
  {
    id: "tomato-pulp",
    category: "sauces",
    img: "/img/products/v3/tomato-pulp.webp",
    vol: "720",
    name: { en: "Tomato Pulp", ru: "Томатная пульпа", hy: "Լոլիկի խյութ" },
  },
  {
    id: "peeled-tomatoes",
    category: "sauces",
    img: "/img/products/v3/peeled-tomatoes.webp",
    vol: "720 / 900",
    name: { en: "Peeled Tomatoes", ru: "Томаты очищенные", hy: "Կեղևահանված լոլիկ" },
  },
  {
    id: "ajika",
    category: "sauces",
    img: "/img/products/v3/ajika.webp",
    vol: "250 / 450 / 550",
    name: { en: "Ajika", ru: "Аджика", hy: "Աջիկա" },
  },
  {
    id: "lecho",
    category: "sauces",
    img: "/img/products/v3/lecho.webp",
    vol: "720",
    name: { en: "Lecho", ru: "Лечо", hy: "Լեչո" },
  },
  {
    id: "bell-lecho",
    category: "sauces",
    img: "/img/products/v3/bell-lecho.webp",
    vol: "550",
    name: { en: "Bell-Pepper Lecho", ru: "Болгарское лечо", hy: "Բուլղարական լեչո" },
  },

  // ---- Spreads & appetizers ----
  {
    id: "appetitka",
    category: "spreads",
    img: "/img/products/v3/appetitka.webp",
    vol: "550 / 720",
    name: { en: "Appetitka", ru: "Аппетитка", hy: "Ախորժակ" },
  },
  {
    id: "ajapsandal",
    category: "spreads",
    img: "/img/products/v3/ajapsandal.webp",
    vol: "550",
    name: { en: "Ajapsandal", ru: "Аджабсандал", hy: "Աջաբսանդալ" },
  },
  {
    id: "eggplant-caviar",
    category: "spreads",
    img: "/img/products/v3/eggplant-caviar.webp",
    vol: "550",
    name: { en: "Eggplant Caviar", ru: "Икра баклажанная", hy: "Ամբուկի խավիար" },
  },
  {
    id: "mutabal",
    category: "spreads",
    img: "/img/products/v3/mutabal.webp",
    vol: "550 / 900",
    name: { en: "Mutabal", ru: "Мутабал", hy: "Մութաբալ" },
  },
  {
    id: "lenten-salad",
    category: "spreads",
    img: "/img/products/v3/lenten-salad.webp",
    vol: "550",
    name: { en: "Lenten Salad", ru: "Постный салат", hy: "Պասային աղցան" },
  },
  {
    id: "baked-veg",
    category: "spreads",
    img: "/img/products/v3/baked-veg.webp",
    vol: "550 / 720",
    name: { en: "Baked Vegetables", ru: "Овощи печёные", hy: "Խորոված բանջարեղեն" },
  },
  {
    id: "fried-veg",
    category: "spreads",
    img: "/img/products/v3/fried-veg.webp",
    vol: "550 / 900",
    name: { en: "Fried Vegetables", ru: "Овощи жареные", hy: "Տապակած բանջարեղեն" },
  },

  // ---- Pickles & marinades ----
  {
    id: "cucumbers",
    category: "pickles",
    img: "/img/products/v3/cucumbers.webp",
    vol: "720 / 900 / 1800 / 3000",
    name: { en: "Marinated Cucumbers", ru: "Огурцы маринованные", hy: "Մարինացված վարունգ" },
  },
  {
    id: "gherkins",
    category: "pickles",
    img: "/img/products/v3/gherkins.webp",
    vol: "720 / 1800",
    name: { en: "Gherkins", ru: "Корнишоны", hy: "Կոռնիշոն" },
  },
  {
    id: "red-pepper",
    category: "pickles",
    img: "/img/products/v3/red-pepper.webp",
    vol: "550 / 720",
    name: { en: "Marinated Red Pepper", ru: "Перец красный", hy: "Կարմիր պղպեղ" },
  },
  {
    id: "chili-pepper",
    category: "pickles",
    img: "/img/products/v3/chili-pepper.webp",
    vol: "550 / 720",
    name: { en: "Chilli Peppers", ru: "Перец стручковый", hy: "Պղպեղ պատիճավոր" },
  },
  {
    id: "okra",
    category: "pickles",
    img: "/img/products/v3/okra.webp",
    vol: "550 / 720",
    name: { en: "Okra (Bamia)", ru: "Бамия", hy: "Բամիա" },
  },
  {
    id: "grape-leaves",
    category: "pickles",
    img: "/img/products/v3/grape-leaves.webp",
    vol: "720",
    name: { en: "Grape Leaves", ru: "Виноградные листья", hy: "Խաղողի տերև" },
  },
  {
    id: "wild-garlic",
    category: "pickles",
    img: "/img/products/v3/wild-garlic.webp",
    vol: "720",
    name: { en: "Marinated Ramson", ru: "Черемша", hy: "Դանձիլ" },
  },

  // ---- Compotes ----
  {
    id: "compotes",
    category: "compotes",
    img: "/img/products/v3/compotes.webp",
    vol: "1000",
    name: { en: "Compotes", ru: "Компоты", hy: "Կոմպոտներ" },
  },
];
