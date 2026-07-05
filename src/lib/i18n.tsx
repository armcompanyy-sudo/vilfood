import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ============================================================
   Vilfood content — EN · RU · HY (Eastern Armenian)
   ------------------------------------------------------------
   EN is the complete source of truth. RU and HY are full
   translations typed as deep-partial and merged over EN, so any
   accidentally-missing key still falls back to English instead
   of breaking. All three are kept complete and in sync.
   ============================================================ */

export type Locale = "en" | "ru" | "hy";

// Labels are text (not flags); `long` is the language's endonym (used for a11y).
export const LOCALES: { code: Locale; label: string; long: string }[] = [
  { code: "en", label: "EN", long: "English" },
  { code: "ru", label: "RU", long: "Русский" },
  { code: "hy", label: "ՀԱՅ", long: "Հայերեն" },
];

export interface Stat {
  n: string;
  l: string;
}
export interface ProductLine {
  id: string;
  name: string;
  native: string;
  tagline: string;
  desc: string;
  flavors: string[];
}
export interface Step {
  t: string;
  b: string;
}
export interface Dict {
  meta: {
    title: string;
    description: string;
  };
  a11y: {
    home: string;
    menuOpen: string;
    menuClose: string;
    heroImage: string;
    footerNav: string;
    close: string;
  };
  nav: {
    story: string;
    products: string;
    process: string;
    find: string;
    contact: string;
    cta: string;
    since: string;
  };
  hero: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    sub: string;
    cta1: string;
    cta2: string;
    badge: string;
  };
  story: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    stats: Stat[];
  };
  products: {
    eyebrow: string;
    title: string;
    intro: string;
    unit: string;
    hint: string;
    cats: {
      sauces: string;
      spreads: string;
      pickles: string;
      compotes: string;
    };
  };
  process: {
    eyebrow: string;
    title: string;
    lede: string;
    steps: Step[];
  };
  quality: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
  };
  find: {
    eyebrow: string;
    title: string;
    intro: string;
    more: string;
    note: string;
    cta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lede: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    thanks: string;
    errName: string;
    errEmail: string;
    errMsg: string;
    errSend: string;
    addrLabel: string;
    address: string;
    phoneLabel: string;
    emailLabel: string;
    dirLabel: string;
    director: string;
  };
  footer: {
    tagline: string;
    rights: string;
    lang: string;
  };
}

/* ============================== English ============================== */
const en: Dict = {
  meta: {
    title: "Vilfood — Sunlight, sealed since 2007",
    description:
      "Natural Armenian fruit & vegetable preserves from Hrazdan since 2007 — compotes, jams, vegetable preserves and trusted imported goods. Sunlight, sealed.",
  },
  a11y: {
    home: "Vilfood — home",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    heroImage:
      "Vilfood preserves set in an Armenian mountain landscape with poppies, pomegranates and a hilltop church",
    footerNav: "Footer",
    close: "Close",
  },
  nav: {
    story: "Story",
    products: "Products",
    process: "Process",
    find: "Where to Buy",
    contact: "Contact",
    cta: "Where to buy",
    since: "Since 2007",
  },
  hero: {
    eyebrow: "Natural preserves · Hrazdan, Armenia",
    titleA: "Sunlight,",
    titleB: "sealed.",
    sub: "Natural Armenian fruit & vegetable preserves — orchard-ripe, jarred the traditional way, on tables from Hrazdan to Moscow since 2007.",
    cta1: "Explore the harvest",
    cta2: "Where to buy",
    badge: "Est. 2007 · Kotayk",
  },
  story: {
    eyebrow: "Our story",
    title: "From a small workshop in Hrazdan, 2007.",
    p1: "Vilfood began in 2007 in Hrazdan, high in Armenia's Kotayk Province, with one stubborn conviction: fruit this good doesn't need changing. We cook it the way Armenian households always have — slowly, simply, in season — and seal it at the peak of ripeness.",
    p2: "That honesty earned local trust fast. Today our jars line the shelves of Armenia's best supermarkets, and a meaningful share of every harvest travels north to Russia — to partners and families who taste home in every spoonful.",
    stats: [
      { n: "2007", l: "Founded in Hrazdan" },
      { n: "4", l: "Product lines" },
      { n: "7", l: "Retail partners" },
    ],
  },
  products: {
    eyebrow: "What we make",
    title: "The Vilfood pantry, jar by jar.",
    intro: "Tomato sauces, hand-packed pickles, vegetable spreads and orchard compotes — over twenty preserves, canned at the peak of the season.",
    unit: "ml",
    hint: "Drag the shelf — or just keep scrolling",
    cats: {
      sauces: "Tomatoes & Sauces",
      spreads: "Spreads & Salads",
      pickles: "Pickles & Marinades",
      compotes: "Compotes",
    },
  },
  process: {
    eyebrow: "Orchard to jar",
    title: "One day, from branch to lid.",
    lede: "The fruit barely has time to cool. Picked ripe, prepared by hand, and sealed under modern food-safety standards — all between sunrise and the day's last light.",
    steps: [
      {
        t: "Harvest",
        b: "Fruit is picked at peak ripeness from orchards across the Kotayk highlands, in the cool of the morning.",
      },
      {
        t: "Prepare",
        b: "Sorted, washed and readied by hand. Only ripe, whole fruit makes the cut — everything else goes back to the earth.",
      },
      {
        t: "Seal",
        b: "Cooked gently and sealed the same day under certified food-safety controls, so nothing is lost but time.",
      },
      {
        t: "Deliver",
        b: "Cased, labelled and sent — to Armenia's best supermarkets and across the border to partners in Russia.",
      },
    ],
  },
  quality: {
    eyebrow: "Quality & trust",
    title: "Old recipes, modern standards.",
    body: "Every jar is made from natural ingredients — no imitation, no shortcuts — under certified, modern food-safety controls. It's a balance we've held since 2007: the taste of something made at home, produced to a standard that travels. Which is why families across Armenia, and our partners in Russia, keep coming back.",
    points: [
      "Made the traditional way",
      "Certified food-safety standards",
      "Trusted export partners in Russia",
    ],
  },
  find: {
    eyebrow: "Where to buy",
    title: "On the best shelves in Armenia.",
    intro: "You'll find Vilfood across Armenia's leading supermarket chains — and, by the case, with our partners in Russia.",
    more: "+ more",
    note: "Looking to stock Vilfood, or to import abroad?",
    cta: "Talk to us",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk preserves.",
    lede: "Wholesale, export, or just a question about a jar — we'd love to hear from you.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    thanks: "Thank you — we'll be in touch soon.",
    errName: "Please tell us your name.",
    errEmail: "Please enter a valid email.",
    errMsg: "Please add a short message.",
    errSend: "Couldn't send — please try again, or email us directly.",
    addrLabel: "Visit",
    address: "Vanatur 1, Hrazdan, Kotayk Province, Armenia",
    phoneLabel: "Call",
    emailLabel: "Email",
    dirLabel: "Director",
    director: "Armen Arakelyan",
  },
  footer: {
    tagline: "Sunlight, sealed since 2007.",
    rights: "© 2026 VIL FOOD LLC · Hrazdan, Armenia",
    lang: "Language",
  },
};

/* ============================== Русский ============================== */
const ru: DeepPartial<Dict> = {
  meta: {
    title: "Vilfood — Солнце в банке с 2007 года",
    description:
      "Натуральные армянские фруктовые и овощные заготовки из Раздана с 2007 года — компоты, варенья, овощные консервы и проверенные импортные товары. Солнце в банке.",
  },
  a11y: {
    home: "Vilfood — на главную",
    menuOpen: "Открыть меню",
    menuClose: "Закрыть меню",
    heroImage:
      "Заготовки Vilfood на фоне армянского горного пейзажа с маками, гранатами и церковью на холме",
    footerNav: "Нижнее меню",
    close: "Закрыть",
  },
  nav: {
    story: "История",
    products: "Продукция",
    process: "Процесс",
    find: "Где купить",
    contact: "Контакты",
    cta: "Где купить",
    since: "С 2007 года",
  },
  hero: {
    eyebrow: "Натуральные заготовки · Раздан, Армения",
    titleA: "Солнце,",
    titleB: "в банке.",
    sub: "Натуральные армянские фруктовые и овощные заготовки — спелые, закрытые по-домашнему. На столах от Раздана до Москвы с 2007 года.",
    cta1: "Смотреть урожай",
    cta2: "Где купить",
    badge: "Осн. 2007 · Котайк",
  },
  story: {
    eyebrow: "Наша история",
    title: "Из маленькой мастерской в Раздане, 2007.",
    p1: "Vilfood начался в 2007 году в Раздане, высоко в Котайкской области Армении, с одного упрямого убеждения: такие фрукты не нужно менять. Мы готовим их так, как всегда делали в армянских домах, — медленно, просто, по сезону — и закрываем на пике спелости.",
    p2: "Эта честность быстро завоевала доверие. Сегодня наши банки стоят на полках лучших супермаркетов Армении, а заметная часть каждого урожая едет на север, в Россию, — к партнёрам и семьям, что узнают вкус дома в каждой ложке.",
    stats: [
      { n: "2007", l: "Основан в Раздане" },
      { n: "4", l: "Линейки продукции" },
      { n: "7", l: "Торговых партнёров" },
    ],
  },
  products: {
    eyebrow: "Наша продукция",
    title: "Кладовая Vilfood — банка за банкой.",
    intro: "Томатные соусы, соленья ручной закатки, овощные закуски и фруктовые компоты — более двадцати заготовок, закрытых на пике сезона.",
    unit: "мл",
    hint: "Тяните полку — или просто листайте",
    cats: {
      sauces: "Томаты и соусы",
      spreads: "Закуски и салаты",
      pickles: "Соленья и маринады",
      compotes: "Компоты",
    },
  },
  process: {
    eyebrow: "Из сада в банку",
    title: "Один день — от ветки до крышки.",
    lede: "Фрукт едва успевает остыть. Снят спелым, подготовлен вручную и закрыт по современным стандартам пищевой безопасности — всё между рассветом и последним светом дня.",
    steps: [
      {
        t: "Сбор",
        b: "Фрукты снимают на пике спелости в садах Котайкского нагорья, в утренней прохладе.",
      },
      {
        t: "Подготовка",
        b: "Сортируют, моют и готовят вручную. Идёт только спелый, целый фрукт — остальное возвращается земле.",
      },
      {
        t: "Закрытие",
        b: "Варят бережно и закрывают в тот же день под сертифицированным контролем безопасности — теряется только время.",
      },
      {
        t: "Доставка",
        b: "Упаковано, подписано и отправлено — в лучшие супермаркеты Армении и за границу, партнёрам в России.",
      },
    ],
  },
  quality: {
    eyebrow: "Качество и доверие",
    title: "Старые рецепты, современные стандарты.",
    body: "Каждая банка — из натуральных ингредиентов, без имитаций и компромиссов, под сертифицированным современным контролем безопасности. Этот баланс мы держим с 2007 года: вкус домашнего, произведённый по стандарту, который не боится дороги. Поэтому семьи по всей Армении и наши партнёры в России возвращаются снова.",
    points: [
      "Приготовлено традиционным способом",
      "Сертифицированные стандарты безопасности",
      "Надёжные партнёры по экспорту в России",
    ],
  },
  find: {
    eyebrow: "Где купить",
    title: "На лучших полках Армении.",
    intro: "Vilfood — в ведущих супермаркетах Армении и, ящиками, у наших партнёров в России.",
    more: "+ ещё",
    note: "Хотите продавать Vilfood или импортировать за рубеж?",
    cta: "Напишите нам",
  },
  contact: {
    eyebrow: "Контакты",
    title: "Поговорим о заготовках.",
    lede: "Опт, экспорт или просто вопрос о банке — будем рады вам.",
    name: "Имя",
    email: "Эл. почта",
    message: "Сообщение",
    send: "Отправить",
    sending: "Отправка…",
    thanks: "Спасибо — мы скоро свяжемся с вами.",
    errName: "Пожалуйста, представьтесь.",
    errEmail: "Введите корректный адрес почты.",
    errMsg: "Добавьте короткое сообщение.",
    errSend: "Не удалось отправить — попробуйте ещё раз или напишите нам напрямую.",
    addrLabel: "Адрес",
    address: "ул. Ванатур 1, Раздан, Котайкская область, Армения",
    phoneLabel: "Телефон",
    emailLabel: "Почта",
    dirLabel: "Директор",
    director: "Армен Аракелян",
  },
  footer: {
    tagline: "Солнце в банке с 2007 года.",
    rights: "© 2026 ООО «ВИЛ ФУД» · Раздан, Армения",
    lang: "Язык",
  },
};

/* ============================== Հայերեն ============================== */
const hy: DeepPartial<Dict> = {
  meta: {
    title: "Vilfood — Արևը բանկայում՝ 2007-ից",
    description:
      "Բնական հայկական մրգային և բանջարեղենային պահածոներ Հրազդանից՝ 2007-ից — կոմպոտ, մուրաբա, բանջարեղենի պահածո և վստահելի ներմուծվող ապրանքներ։ Արևը՝ բանկայում։",
  },
  a11y: {
    home: "Vilfood — գլխավոր էջ",
    menuOpen: "Բացել ընտրացանկը",
    menuClose: "Փակել ընտրացանկը",
    heroImage:
      "Vilfood-ի պահածոները հայկական լեռնային բնապատկերի ֆոնին՝ կակաչներով, նռներով և բլրի վրա կանգնած եկեղեցով",
    footerNav: "Ստորին ընտրացանկ",
    close: "Փակել",
  },
  nav: {
    story: "Պատմություն",
    products: "Արտադրանք",
    process: "Գործընթաց",
    find: "Որտեղ գնել",
    contact: "Կապ",
    cta: "Որտեղ գնել",
    since: "2007-ից",
  },
  hero: {
    eyebrow: "Բնական պահածոներ · Հրազդան, Հայաստան",
    titleA: "Արևը՝",
    titleB: "բանկայում.",
    sub: "Բնական հայկական մրգային և բանջարեղենային պահածոներ՝ այգու հասունությամբ, ավանդական ձևով փակված։ Հրազդանից Մոսկվա՝ 2007-ից։",
    cta1: "Տեսնել բերքը",
    cta2: "Որտեղ գնել",
    badge: "Հիմն. 2007 · Կոտայք",
  },
  story: {
    eyebrow: "Մեր պատմությունը",
    title: "Հրազդանի փոքրիկ արհեստանոցից, 2007։",
    p1: "Vilfood-ը սկսվեց 2007-ին Հրազդանում՝ Կոտայքի մարզի բարձունքներում, մեկ համառ համոզմունքով. այսքան լավ միրգը փոխելու կարիք չունի։ Մենք եփում ենք այն այնպես, ինչպես միշտ արել են հայկական տներում՝ դանդաղ, պարզ, սեզոնին, և փակում ենք հասունության գագաթնակետին։",
    p2: "Այդ ազնվությունն արագ վաստակեց տեղի վստահությունը։ Այսօր մեր բանկաները Հայաստանի լավագույն սուպերմարկետների դարակներին են, և յուրաքանչյուր բերքի զգալի մասը մեկնում է հյուսիս՝ Ռուսաստան, գործընկերների ու ընտանիքների մոտ, որոնք ամեն գդալում տան համն են զգում։",
    stats: [
      { n: "2007", l: "Հիմնադրվել է Հրազդանում" },
      { n: "4", l: "Արտադրանքի գիծ" },
      { n: "7", l: "Առևտրային գործընկեր" },
    ],
  },
  products: {
    eyebrow: "Մեր արտադրանքը",
    title: "Vilfood-ի մառանը՝ բանկա առ բանկա։",
    intro: "Տոմատի սոուսներ, ձեռքով փակած թթուներ, բանջարեղենային նախուտեստներ և մրգային կոմպոտներ՝ ավելի քան քսան պահածո, փակված սեզոնի գագաթնակետին։",
    unit: "մլ",
    hint: "Քաշեք դարակը կամ պարզապես ոլորեք",
    cats: {
      sauces: "Տոմատ և սոուս",
      spreads: "Նախուտեստ և աղցան",
      pickles: "Թթու և մարինադ",
      compotes: "Կոմպոտ",
    },
  },
  process: {
    eyebrow: "Այգուց բանկա",
    title: "Մեկ օր՝ ճյուղից կափարիչ։",
    lede: "Միրգը հազիվ է հասցնում սառչել։ Քաղված հասուն, ձեռքով պատրաստված և փակված ժամանակակից սննդի անվտանգության չափանիշներով՝ արևածագից մինչև օրվա վերջին լույսը։",
    steps: [
      {
        t: "Բերքահավաք",
        b: "Միրգը քաղվում է հասունության գագաթնակետին՝ Կոտայքի լեռնաշխարհի այգիներից, առավոտյան զովին։",
      },
      {
        t: "Նախապատրաստում",
        b: "Տեսակավորվում, լվացվում և պատրաստվում է ձեռքով։ Անցնում է միայն հասուն, ամբողջական միրգը՝ մնացածը վերադառնում է հողին։",
      },
      {
        t: "Փակում",
        b: "Եփվում է նրբորեն և փակվում նույն օրը՝ հավաստագրված անվտանգության հսկողությամբ, որ կորչի միայն ժամանակը։",
      },
      {
        t: "Առաքում",
        b: "Փաթեթավորվում, պիտակվում և ուղարկվում է՝ Հայաստանի լավագույն սուպերմարկետներ և սահմանից այն կողմ՝ ռուս գործընկերներին։",
      },
    ],
  },
  quality: {
    eyebrow: "Որակ և վստահություն",
    title: "Հին բաղադրատոմս, ժամանակակից չափանիշ։",
    body: "Յուրաքանչյուր բանկա պատրաստված է բնական բաղադրիչներից՝ առանց կեղծիքի, առանց զիջումների, հավաստագրված ժամանակակից անվտանգության հսկողությամբ։ Այս հավասարակշռությունը պահում ենք 2007-ից՝ տանը պատրաստվածի համը՝ արտադրված չափանիշով, որ դիմանում է ճանապարհին։ Ահա թե ինչու Հայաստանի ընտանիքներն ու Ռուսաստանի մեր գործընկերները նորից ու նորից վերադառնում են։",
    points: [
      "Պատրաստված ավանդական եղանակով",
      "Սննդի անվտանգության հավաստագրված չափանիշներ",
      "Վստահելի արտահանման գործընկերներ Ռուսաստանում",
    ],
  },
  find: {
    eyebrow: "Որտեղ գնել",
    title: "Հայաստանի լավագույն դարակներին։",
    intro: "Vilfood-ը կգտնեք Հայաստանի առաջատար սուպերմարկետների ցանցերում, իսկ արկղով՝ Ռուսաստանի մեր գործընկերների մոտ։",
    more: "+ ևս",
    note: "Ցանկանո՞ւմ եք վաճառել Vilfood կամ ներմուծել արտերկիր։",
    cta: "Գրեք մեզ",
  },
  contact: {
    eyebrow: "Կապ",
    title: "Խոսենք պահածոների մասին։",
    lede: "Մեծածախ, արտահանում կամ պարզապես հարց բանկայի մասին՝ ուրախ կլինենք լսել ձեզ։",
    name: "Անուն",
    email: "Էլ. փոստ",
    message: "Հաղորդագրություն",
    send: "Ուղարկել",
    sending: "Ուղարկվում է…",
    thanks: "Շնորհակալություն՝ շուտով կկապվենք ձեզ հետ։",
    errName: "Խնդրում ենք նշել ձեր անունը։",
    errEmail: "Մուտքագրեք վավեր էլ. փոստի հասցե։",
    errMsg: "Ավելացրեք կարճ հաղորդագրություն։",
    errSend: "Չհաջողվեց ուղարկել — փորձեք նորից կամ գրեք մեզ ուղիղ։",
    addrLabel: "Հասցե",
    address: "Վանատուր 1, Հրազդան, Կոտայքի մարզ, Հայաստան",
    phoneLabel: "Հեռախոս",
    emailLabel: "Փոստ",
    dirLabel: "Տնօրեն",
    director: "Արմեն Առաքելյան",
  },
  footer: {
    tagline: "Արևը բանկայում՝ 2007-ից։",
    rights: "© 2026 «ՎԻԼ ՖՈՒԴ» ՍՊԸ · Հրազդան, Հայաստան",
    lang: "Լեզու",
  },
};

/* ---------------- deep-merge so RU/HY fall back to EN ---------------- */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mergeDeep<T>(base: T, over: DeepPartial<T> | undefined): T {
  if (!over) return base;
  if (Array.isArray(base)) {
    const ov = over as unknown as unknown[];
    return (base as unknown[]).map((item, i) =>
      ov[i] !== undefined ? mergeDeep(item, ov[i] as never) : item,
    ) as unknown as T;
  }
  if (isObject(base)) {
    const out: Record<string, unknown> = { ...(base as object) };
    for (const key of Object.keys(base as object)) {
      const o = (over as Record<string, unknown>)[key];
      if (o !== undefined) out[key] = mergeDeep((base as never)[key], o as never);
    }
    return out as T;
  }
  return (over as unknown as T) ?? base;
}

const dictionaries: Record<Locale, Dict> = {
  en,
  ru: mergeDeep(en, ru),
  hy: mergeDeep(en, hy),
};

/* ---------------- React context ---------------- */
interface I18nValue {
  t: Dict;
  locale: Locale;
  setLocale: (l: Locale) => void;
}
const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "vilfood-locale";

function initialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && saved in dictionaries) return saved;
  const nav = window.navigator.language.slice(0, 2);
  if (nav === "ru" || nav === "hy") return nav;
  return "en";
}

const HTML_LANG: Record<Locale, string> = { en: "en", ru: "ru", hy: "hy" };

/** Keep <html lang>, document title and SEO meta in sync with the locale. */
function applyDocumentMeta(locale: Locale) {
  const dict = dictionaries[locale];
  document.documentElement.lang = HTML_LANG[locale];
  document.title = dict.meta.title;
  const set = (selector: string, attr: string, value: string) => {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', "content", dict.meta.description);
  set('meta[property="og:title"]', "content", dict.meta.title);
  set('meta[property="og:description"]', "content", dict.meta.description);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    applyDocumentMeta(locale);
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<I18nValue>(
    () => ({ t: dictionaries[locale], locale, setLocale: setLocaleState }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
