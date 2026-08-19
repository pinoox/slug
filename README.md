**English** | [فارسی](./README.fa.md)

# `@pinooxhq/slug`

Persian → Finglish, then a URL-safe slug. Works in **vanilla JS**, **Vue**, **React**, and **Svelte**. Zero runtime dependencies.

Unknown Persian words are converted with a **heja** (syllable) engine. Common CMS and tech terms are mapped first (`محصولات` → `product`, `لپتاپ` → `laptop`). The dictionary can be turned off per call.

```js
import { slugify, toFinglish } from '@pinooxhq/slug'

toFinglish('سلام دنیا')                          // 'salam donya'
slugify('سلام دنیا')                             // 'salam-donya'
slugify('محصولات جدید')                          // 'product-jadid'
slugify('محصولات جدید', { dictionary: false })   // heja only
slugify('لپتاپ گیمینگ')                           // 'laptop-gaming'
```

## Contents

- [Install](#install)
- [How it works](#how-it-works)
- [Quick start](#quick-start)
- [Vanilla JS](#vanilla-js)
- [Vue](#vue)
- [React](#react)
- [Svelte](#svelte)
- [API](#api)
  - [`slugify`](#slugifytext-options)
  - [Options](#options)
  - [Prefix, suffix, hash](#prefix-suffix-hash)
  - [`createSlugify`](#createslugifydefaults)
  - [`slugifyWithCounter`](#slugifywithcounterdefaults)
  - [`toFinglish` / `toPinglish`](#tofinglishtext-options--topinglishtext)
  - [`sanitizeSlug`](#sanitizeslugtext-options)
- [Dictionary](#dictionary)
  - [Disable or extend](#disable-or-extend)
  - [CMS map](#cms-map)
  - [Tech loanwords](#tech-loanwords)
- [TypeScript](#typescript)
- [Notes](#notes)
- [License](#license)

## Install

```bash
npm i @pinooxhq/slug
```

Peer dependencies `vue`, `react`, and `svelte` are **optional**. Install only the one you use, and import from `@pinooxhq/slug/vue`, `/react`, or `/svelte`.

## How it works

Final shape:

```text
{prefix}-{body}-{suffix}-{hash}
```

Pipeline:

1. Normalize Persian letters (`ي`/`ك`/`ة`, diacritics, ZWNJ)
2. Optional `customReplacements` and symbol maps (`&` → `and`)
3. Tokenize on spaces **and** punctuation (`سلام، دنیا!`)
4. Dictionary lookup (longest token first) — skip if `dictionary: false`
5. Heja transliteration for anything left
6. Kebab-case / strict URL filter
7. Prefix, suffix, then hash
8. `maxLength` truncates the **body** and reserves room for affixes and hash

Matching is **token-based**. Short keys do not match inside longer words: `موسسه` is not `mouse`, `شاپور` is not `shop`.

## Quick start

```js
import { slugify, createSlugify } from '@pinooxhq/slug'

slugify('کتابخانه')                    // 'ketabkhane'
slugify('سلام دنیا', { replacement: '_' }) // 'salam_donya'

slugify('محصولات جدید', {
  prefix: 'shop',
  suffix: 'fa',
  hash: 42,        // stable seed (id / sku) — prefer this over hash: true
  hashLength: 6,
})
// 'shop-product-jadid-fa-xxxxxx'

const shopSlug = createSlugify({ prefix: 'shop', hashLength: 8 })
shopSlug('محصولات جدید', { hash: productId })
```

## Vanilla JS

ESM:

```js
import { toFinglish, slugify, sanitizeSlug, createSlugify } from '@pinooxhq/slug'

slugify('کتابخانه')        // 'ketabkhane'
sanitizeSlug('Lap--Top!')  // 'laptop'
```

CommonJS:

```js
const { slugify } = require('@pinooxhq/slug')
```

Script tag (IIFE):

```html
<script src="https://unpkg.com/@pinooxhq/slug/dist/pinoox-slug.global.js"></script>
<script>
  PinooxSlug.slugify('سلام دنیا')
</script>
```

CDN aliases: `unpkg` and `jsdelivr` both point at `dist/pinoox-slug.global.js`.

## Vue

```js
import { reactive } from 'vue'
import { useSlugField } from '@pinooxhq/slug/vue'

const form = reactive({ title: '', slug: '', slugManual: false })

const {
  onTitleInput,
  onSlugInput,
  resolveSlug,
  resetSlugManual,
  enableSlugManual,
} = useSlugField(form, {
  slugify: { prefix: 'shop' },
})

onTitleInput(form.title)     // fills form.slug unless the user edited it
onSlugInput(rawValue)        // sanitizes while typing
const slug = resolveSlug(form.title)
```

| Helper | Role |
| --- | --- |
| `onTitleInput(value)` | Updates `form.slug` from the title while not in manual mode |
| `onSlugInput(value)` | Marks the field manual and runs `sanitizeSlug` |
| `resolveSlug(title)` | `form.slug` or a generated slug |
| `enableSlugManual()` / `resetSlugManual()` | Lock / unlock auto-fill |
| `slugTouched` | Vue ref — true after the user typed in the slug |

Pass any `slugify` options through `useSlugField(form, { slugify: { … } })`.

## React

```jsx
import { useState } from 'react'
import { useSlugField } from '@pinooxhq/slug/react'

function ProductForm() {
  const [title, setTitle] = useState('')
  const { slug, onSlugInput, resetManual, manual } = useSlugField(title, {
    slugify: { prefix: 'shop', preserveTrailingDash: true },
  })

  return (
    <>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <input dir="ltr" value={slug} onChange={(e) => onSlugInput(e.target.value)} />
      {manual && <button type="button" onClick={resetManual}>Auto slug</button>}
    </>
  )
}
```

| Return | Role |
| --- | --- |
| `slug` / `setSlug` | Current slug string |
| `manual` | User has edited the slug |
| `onSlugInput(value)` | Sanitize + switch to manual |
| `resetManual()` / `enableManual()` | Follow the title again / lock |

## Svelte

```js
import { writable } from 'svelte/store'
import { slugField, derivedSlug } from '@pinooxhq/slug/svelte'

const title = writable('')
const { slug, onSlugInput, resetManual, manual } = slugField(title, {
  slugify: { prefix: 'shop' },
})

// one-way: always generated, no manual editing
const auto = derivedSlug(title, { slugify: { dictionary: false } })
```

`slug` and `manual` are Svelte writable stores.

## API

### `slugify(text, options?)`

Runs `toFinglish`, then builds a URL slug.

```js
slugify('محصولات جدید', { dictionary: false })
slugify('سلام، دنیا!')   // 'salam-donya'
slugify('')              // ''
slugify(null)            // ''
```

### Options

| Option | Default | Meaning |
| --- | --- | --- |
| `dictionary` | `true` | `true` = CMS + tech maps; `false` = heja only; object = extra entries merged for this call |
| `prefix` | — | Sanitized prefix (`Shop` → `shop`) |
| `suffix` / `postfix` | — | Sanitized suffix (literal extra such as `v2` or `fa`) |
| `hash` | — | `true` hashes the **title** (changes if the title changes); string/number is a stable seed |
| `hashLength` | `6` | Hash length, `[a-z0-9]`, minimum `2` |
| `replacement` / `separator` | `'-'` | Word separator (`separator` is an alias) |
| `lower` | `true` | Lowercase the result |
| `strict` | `true` | Keep `[a-z0-9]` plus the separator. Persian letters stay if `transliterate: false` |
| `trim` | `true` | Strip leading/trailing separators |
| `maxLength` | — | Truncate on a separator; prefix/suffix/hash are reserved and not cut |
| `stopwords` | — | `true` drops `و از به در را که با`; or pass a custom list |
| `symbols` | `true` | `&` → `and`, `%` → `percent`, `+` → `plus`, `♥`/`❤` → `love` |
| `decamelize` | `true` | `fooBar` → `foo-bar` |
| `transliterate` | `true` | `false` keeps Persian letters in the slug |
| `preserveTrailingDash` | `false` | Keep a trailing separator while typing |
| `customReplacements` | — | `[['@', ' at ']]` applied before conversion |
| `remove` | — | Extra `RegExp` stripped before separators |

```js
slugify('fooBar')                              // 'foo-bar'
slugify('fooBar', { decamelize: false })       // 'foobar'
slugify('Dogs & Cats')                         // 'dogs-and-cats'
slugify('سلام و دنیا', { stopwords: true })     // 'salam-donya'
slugify('سلام دنیا', { maxLength: 8 })          // 'salam'
slugify('سلام دنیا', { transliterate: false }) // 'سلام-دنیا'
slugify('Foo@site', { customReplacements: [['@', ' at ']] })
// 'foo-at-site'
```

### Prefix, suffix, hash

Order is always `{prefix}-{body}-{suffix}-{hash}`.

```js
slugify('محصولات جدید', { prefix: 'shop', suffix: 'fa' })
// 'shop-product-jadid-fa'

slugify('محصولات', { hash: 42, hashLength: 6 })
// 'product-xxxxxx'   (same seed → same hash)

slugify('سلام دنیا', { hash: true, hashLength: 8 })
// changes if the title changes — not ideal for CMS permalinks
```

Use **`hash: product.id`** (or SKU) so the URL stays stable when the title is edited. Use `suffix` when you already have a literal tail (`v2`, `fa`). `postfix` is an alias of `suffix`.

### `createSlugify(defaults)`

Returns a function with frozen defaults. Per-call options override them. Dictionary objects are merged. Nothing is stored globally — safer for SSR and multiple apps on one page.

```js
const shopSlug = createSlugify({
  prefix: 'shop',
  hashLength: 8,
  dictionary: { پینوکس: 'pinoox' },
})

shopSlug('پینوکس محصولات', { hash: productId })
shopSlug('محصولات جدید', { dictionary: false })
```

### `slugifyWithCounter(defaults?)`

Repeating the same output appends `-2`, `-3`, … (heading `id`s). Call `.reset()` to start over.

```js
import { slugifyWithCounter } from '@pinooxhq/slug'

const unique = slugifyWithCounter()
unique('Example')  // 'example'
unique('Example')  // 'example-2'
unique.reset()
unique('Example')  // 'example'
```

### `toFinglish(text, options?)` / `toPinglish(text)`

Romanize Persian to Finglish (spaces, not dashes). Latin is left as-is. Accepts `dictionary`, `stopwords`, `symbols`, `decamelize`, `customReplacements`, and `transliterate`. `toPinglish` is an alias.

```js
toFinglish('سلام دنیا')                         // 'salam donya'
toFinglish('محصولات', { dictionary: false })    // heja, not 'product'
```

### `sanitizeSlug(text, options?)`

For a slug input the user types by hand. Spaces and punctuation are **dropped**, not turned into dashes.

```js
sanitizeSlug('Laptop Gamer!')  // 'laptopgamer'
sanitizeSlug('lap--top')       // 'lap-top'
sanitizeSlug('lap-top-', { preserveTrailingDash: true })  // 'lap-top-'
```

## Dictionary

Three layers run **before** heja:

| Layer | Role | Example |
| --- | --- | --- |
| CMS | Semantic URL words | `محصولات` → `product` |
| Tech loanwords | English written in Persian | `لپتاپ` → `laptop` |
| `extendWords` | Finglish spelling override only | `تهران` → `tehran` |

Keys are matched as whole tokens after normalizing `ی`/`ک` and stripping ZWNJ. Multi-word keys (`سبد خرید`, `ثبت نام`) win over shorter ones.

Import the maps if you need to inspect or copy them:

```js
import { DEFAULT_CMS_DICTIONARY, DEFAULT_LOANWORDS, PERSIAN_STOPWORDS } from '@pinooxhq/slug'
```

### Disable or extend

```js
slugify('محصولات جدید', { dictionary: false })
slugify('پینوکس شاپ', { dictionary: { پینوکس: 'pinoox' } })  // merge for this call
```

Global helpers (shared by every caller — prefer `createSlugify` in apps):

```js
import {
  extendDictionary,
  resetDictionary,
  extendLoanwords,
  resetLoanwords,
  extendWords,
  resetWords,
} from '@pinooxhq/slug'

extendDictionary({ 'برند ویژه': 'label' })
extendLoanwords({ پینوکس: 'pinoox' })
extendWords({ تهران: 'tehran' })
```

`extendLoanwords` is kept for compatibility with 0.1.x. New code should use `dictionary` on `createSlugify` / `slugify`.

### CMS map

| Persian | Slug |
| --- | --- |
| محصول، محصولات | `product` |
| دسته، دسته بندی، دسته‌بندی | `category` |
| مقاله، مقالات | `article` |
| نوشته، پست | `post` |
| برگه، صفحه | `page` |
| فروشگاه | `shop` |
| کاربر، کاربران | `user` |
| سفارش | `order` |
| پرداخت | `payment` |
| سبد، سبد خرید | `cart` |
| تخفیف | `discount` |
| بلاگ، وبلاگ | `blog` |
| خبر، اخبار | `news` |
| ورود | `login` |
| ثبت نام، ثبت‌نام | `register` |
| پروفایل | `profile` |
| تنظیمات | `settings` |
| جستجو | `search` |
| تماس | `contact` |
| خانه، صفحه اصلی، صفحه نخست | `home` |
| درباره ما | `about` |
| برند | `brand` |
| قیمت | `price` |
| گالری | `gallery` |
| ویدیو، فیلم | `video` |
| تصویر، عکس | `image` |
| فایل | `file` |
| دانلود | `download` |
| ادمین، مدیریت | `admin` |

### Tech loanwords

| Persian | Slug |
| --- | --- |
| لپتاپ، لپ تاپ، لپ‌تاپ | `laptop` |
| موبایل | `mobile` |
| تبلت | `tablet` |
| هدفون | `headphone` |
| هندزفری | `handsfree` |
| شارژر | `charger` |
| کیبورد | `keyboard` |
| ماوس، موس | `mouse` |
| مانیتور | `monitor` |
| اسپیکر | `speaker` |
| پرینتر | `printer` |
| اسکنر | `scanner` |
| گیمینگ | `gaming` |
| شاپ | `shop` |
| کنسول | `console` |
| ایرپاد | `airpod` |
| سامسونگ | `samsung` |
| شیائومی | `xiaomi` |
| پلی استیشن، پلی‌استیشن | `playstation` |
| ایکس باکس، ایکس‌باکس | `xbox` |
| بلوتوث | `bluetooth` |
| وای فای، وای‌فای، وایفای | `wifi` |
| کامپیوتر | `computer` |

## TypeScript

Types ship in the package:

```ts
import type {
  SlugifyOptions,
  SlugifyFn,
  DictionaryMap,
  DictionaryOption,
  WordMap,
  LoanwordMap,
  SanitizeSlugOptions,
} from '@pinooxhq/slug'
```

Framework entry points export their own option/return types (`UseSlugFieldOptions`, `SlugFieldStores`, …).

## Notes

- Empty, `null`, and `undefined` inputs become `''`.
- `hash: true` is derived from the **current title**. For permalinks, pass a stable id.
- Global `extend*` maps are process-wide. Use `createSlugify({ dictionary })` when more than one app or test file shares the process.
- Heja still guesses short vowels for words that are not in the dictionary; that is expected.

See [CHANGELOG.md](./CHANGELOG.md) for 0.2.0.

## License

MIT
