[English](./README.md) | **فارسی**

# `@pinooxhq/slug`

تبدیل فارسی به فینگلیش، سپس اسلاگ امن برای URL. روی **Vanilla JS**، **Vue**، **React** و **Svelte** کار می‌کند. بدون وابستگی زمان اجرا.

واژه‌های ناشناخته با موتور **هجا** تبدیل می‌شوند. اصطلاحات رایج CMS و فناوری اول جایگزین می‌شوند (`محصولات` → `product`، `لپتاپ` → `laptop`). دیکشنری را برای هر فراخوانی می‌توان خاموش کرد.

```js
import { slugify, toFinglish } from '@pinooxhq/slug'

toFinglish('سلام دنیا')                          // 'salam donya'
slugify('سلام دنیا')                             // 'salam-donya'
slugify('محصولات جدید')                          // 'product-jadid'
slugify('محصولات جدید', { dictionary: false })   // فقط هجا
slugify('لپتاپ گیمینگ')                           // 'laptop-gaming'
```

## فهرست

- [نصب](#install)
- [چطور کار می‌کند](#how-it-works)
- [شروع سریع](#quick-start)
- [Vanilla JS](#vanilla-js)
- [Vue](#vue)
- [React](#react)
- [Svelte](#svelte)
- [API](#api)
  - [`slugify`](#slugify)
  - [گزینه‌ها](#options)
  - [پیشوند، پسوند، هش](#prefix-suffix-hash)
  - [`createSlugify`](#createslugify)
  - [`slugifyWithCounter`](#slugifywithcounter)
  - [`toFinglish` / `toPinglish`](#tofinglish)
  - [`sanitizeSlug`](#sanitizeslug)
- [دیکشنری](#dictionary)
  - [خاموش یا گسترش](#disable-or-extend)
  - [نقشه CMS](#cms-map)
  - [وام‌واژه‌های فناوری](#tech-loanwords)
- [TypeScript](#typescript)
- [نکته‌ها](#notes)
- [مجوز](#license)

<h2 id="install">نصب</h2>

```bash
npm i @pinooxhq/slug
```

Peer dependencyهای `vue`، `react` و `svelte` **اختیاری**اند. فقط همانی را نصب کنید که استفاده می‌کنید و از `@pinooxhq/slug/vue`، `/react` یا `/svelte` ایمپورت کنید.

<h2 id="how-it-works">چطور کار می‌کند</h2>

شکل نهایی اسلاگ:

```text
{prefix}-{body}-{suffix}-{hash}
```

خط لوله:

1. نرمال حروف فارسی (`ي`/`ك`/`ة`، اعراب، نیم‌فاصله)
2. `customReplacements` و نمادها (`&` → `and`)
3. شکستن توکن روی فاصله **و** علائم (`سلام، دنیا!`)
4. جست‌وجوی دیکشنری (طولانی‌ترین کلید اول) — با `dictionary: false` رد می‌شود
5. هجا برای بقیهٔ واژه‌ها
6. kebab-case و فیلتر URL
7. پیشوند، پسوند، سپس هش
8. `maxLength` بدنه را می‌بُرد و جا برای پیشوند/پسوند/هش رزرو می‌کند

تطبیق **توکنی** است. کلید کوتاه داخل واژهٔ بلند نمی‌خورد: `موسسه` نمی‌شود `mouse`، `شاپور` نمی‌شود `shop`.

<h2 id="quick-start">شروع سریع</h2>

```js
import { slugify, createSlugify } from '@pinooxhq/slug'

slugify('کتابخانه')                    // 'ketabkhane'
slugify('سلام دنیا', { replacement: '_' }) // 'salam_donya'

slugify('محصولات جدید', {
  prefix: 'shop',
  suffix: 'fa',
  hash: 42,        // seed پایدار (id / sku) — بهتر از hash: true
  hashLength: 6,
})
// 'shop-product-jadid-fa-xxxxxx'

const shopSlug = createSlugify({ prefix: 'shop', hashLength: 8 })
shopSlug('محصولات جدید', { hash: productId })
```

<h2 id="vanilla-js">Vanilla JS</h2>

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

تگ اسکریپت (IIFE):

```html
<script src="https://unpkg.com/@pinooxhq/slug/dist/pinoox-slug.global.js"></script>
<script>
  PinooxSlug.slugify('سلام دنیا')
</script>
```

آدرس `unpkg` و `jsdelivr` هر دو به `dist/pinoox-slug.global.js` می‌روند.

<h2 id="vue">Vue</h2>

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

onTitleInput(form.title)     // form.slug را پر می‌کند مگر حالت دستی باشد
onSlugInput(rawValue)        // هنگام تایپ پاکسازی می‌کند
const slug = resolveSlug(form.title)
```

| تابع | نقش |
| --- | --- |
| `onTitleInput(value)` | تا وقتی دستی نشده، `form.slug` را از عنوان می‌سازد |
| `onSlugInput(value)` | حالت دستی و `sanitizeSlug` |
| `resolveSlug(title)` | `form.slug` یا اسلاگ تولیدشده |
| `enableSlugManual()` / `resetSlugManual()` | قفل / باز کردن پر شدن خودکار |
| `slugTouched` | ref — بعد از تایپ کاربر در اسلاگ `true` می‌شود |

هر گزینهٔ `slugify` را با `useSlugField(form, { slugify: { … } })` بدهید.

<h2 id="react">React</h2>

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
      {manual && <button type="button" onClick={resetManual}>اسلاگ خودکار</button>}
    </>
  )
}
```

| خروجی | نقش |
| --- | --- |
| `slug` / `setSlug` | رشتهٔ اسلاگ |
| `manual` | کاربر اسلاگ را ویرایش کرده |
| `onSlugInput(value)` | پاکسازی + حالت دستی |
| `resetManual()` / `enableManual()` | دوباره از عنوان پیروی کند / قفل |

<h2 id="svelte">Svelte</h2>

```js
import { writable } from 'svelte/store'
import { slugField, derivedSlug } from '@pinooxhq/slug/svelte'

const title = writable('')
const { slug, onSlugInput, resetManual, manual } = slugField(title, {
  slugify: { prefix: 'shop' },
})

// یک‌طرفه: همیشه تولید می‌شود، بدون ویرایش دستی
const auto = derivedSlug(title, { slugify: { dictionary: false } })
```

`slug` و `manual` استور writable هستند.

<h2 id="api">API</h2>

<h3 id="slugify"><code>slugify(text, options?)</code></h3>

ابتدا `toFinglish`، سپس اسلاگ URL.

```js
slugify('محصولات جدید', { dictionary: false })
slugify('سلام، دنیا!')   // 'salam-donya'
slugify('')              // ''
slugify(null)            // ''
```

<h3 id="options">گزینه‌ها</h3>

| گزینه | پیش‌فرض | معنی |
| --- | --- | --- |
| `dictionary` | `true` | `true` = نقشه CMS+فناوری؛ `false` = فقط هجا؛ آبجکت = ادغام برای همین فراخوانی |
| `prefix` | — | پیشوند پاکسازی‌شده (`Shop` → `shop`) |
| `suffix` / `postfix` | — | پسوند متنی (مثل `v2` یا `fa`) |
| `hash` | — | `true` از **عنوان** هش می‌گیرد (با تغییر عنوان عوض می‌شود)؛ رشته/عدد seed پایدار است |
| `hashLength` | `6` | طول هش، `[a-z0-9]`، حداقل `2` |
| `replacement` / `separator` | `'-'` | جداکننده (`separator` نام مستعار است) |
| `lower` | `true` | حروف کوچک |
| `strict` | `true` | فقط `[a-z0-9]` به‌علاوه جداکننده. با `transliterate: false` حروف فارسی می‌مانند |
| `trim` | `true` | حذف جداکننده از ابتدا و انتها |
| `maxLength` | — | برش روی جداکننده؛ جا برای prefix/suffix/hash رزرو می‌شود |
| `stopwords` | — | `true` واژه‌های `و از به در را که با` را حذف می‌کند؛ یا فهرست سفارشی |
| `symbols` | `true` | `&` → `and`، `%` → `percent`، `+` → `plus`، `♥`/`❤` → `love` |
| `decamelize` | `true` | `fooBar` → `foo-bar` |
| `transliterate` | `true` | `false` حروف فارسی را در اسلاگ نگه می‌دارد |
| `preserveTrailingDash` | `false` | حفظ جداکنندهٔ انتهایی هنگام تایپ |
| `customReplacements` | — | `[['@', ' at ']]` قبل از تبدیل |
| `remove` | — | `RegExp` اضافی قبل از جداکننده‌ها |

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

<h3 id="prefix-suffix-hash">پیشوند، پسوند، هش</h3>

ترتیب همیشه `{prefix}-{body}-{suffix}-{hash}` است.

```js
slugify('محصولات جدید', { prefix: 'shop', suffix: 'fa' })
// 'shop-product-jadid-fa'

slugify('محصولات', { hash: 42, hashLength: 6 })
// 'product-xxxxxx'   (همان seed → همان هش)

slugify('سلام دنیا', { hash: true, hashLength: 8 })
// با تغییر عنوان عوض می‌شود — برای permalink مناسب نیست
```

برای CMS از **`hash: product.id`** (یا SKU) استفاده کنید تا با ویرایش عنوان URL ثابت بماند. اگر دنبالهٔ آماده دارید (`v2`، `fa`) از `suffix` استفاده کنید. `postfix` نام مستعار `suffix` است.

<h3 id="createslugify"><code>createSlugify(defaults)</code></h3>

تابعی با پیش‌فرض‌های ثابت برمی‌گرداند. گزینهٔ هر فراخوانی روی آن سوار می‌شود. آبجکت‌های دیکشنری ادغام می‌شوند. چیزی سراسری ذخیره نمی‌شود — برای SSR و چند اپ روی یک صفحه امن‌تر است.

```js
const shopSlug = createSlugify({
  prefix: 'shop',
  hashLength: 8,
  dictionary: { پینوکس: 'pinoox' },
})

shopSlug('پینوکس محصولات', { hash: productId })
shopSlug('محصولات جدید', { dictionary: false })
```

<h3 id="slugifywithcounter"><code>slugifyWithCounter(defaults?)</code></h3>

خروجی تکراری می‌شود `title`، بعد `title-2`، `title-3`، … (برای `id` تیتر). با `.reset()` از نو شروع می‌شود.

```js
import { slugifyWithCounter } from '@pinooxhq/slug'

const unique = slugifyWithCounter()
unique('Example')  // 'example'
unique('Example')  // 'example-2'
unique.reset()
unique('Example')  // 'example'
```

<h3 id="tofinglish"><code>toFinglish(text, options?)</code> / <code>toPinglish(text)</code></h3>

رومی‌سازی فارسی به فینگلیش (فاصله، نه خط تیره). متن لاتین دست‌نخورده می‌ماند. فلگ‌های `dictionary`، `stopwords`، `symbols`، `decamelize`، `customReplacements` و `transliterate` را می‌گیرد. `toPinglish` نام مستعار است.

```js
toFinglish('سلام دنیا')                         // 'salam donya'
toFinglish('محصولات', { dictionary: false })    // هجا، نه 'product'
```

<h3 id="sanitizeslug"><code>sanitizeSlug(text, options?)</code></h3>

برای فیلدی که کاربر اسلاگ را دستی می‌نویسد. فاصله و علائم **حذف** می‌شوند، به خط تیره تبدیل نمی‌شوند.

```js
sanitizeSlug('Laptop Gamer!')  // 'laptopgamer'
sanitizeSlug('lap--top')       // 'lap-top'
sanitizeSlug('lap-top-', { preserveTrailingDash: true })  // 'lap-top-'
```

<h2 id="dictionary">دیکشنری</h2>

سه لایه **قبل از هجا**:

| لایه | نقش | مثال |
| --- | --- | --- |
| CMS | واژهٔ معنایی برای URL | `محصولات` → `product` |
| وام‌واژه فناوری | انگلیسی با املای فارسی | `لپتاپ` → `laptop` |
| `extendWords` | فقط املای فینگلیش | `تهران` → `tehran` |

کلیدها بعد از نرمال `ی`/`ک` و حذف نیم‌فاصله به‌صورت کل توکن تطبیق می‌خورند. کلید چندکلمه‌ای (`سبد خرید`، `ثبت نام`) بر کلید کوتاه‌تر برنده است.

برای دیدن یا کپی نقشه:

```js
import { DEFAULT_CMS_DICTIONARY, DEFAULT_LOANWORDS, PERSIAN_STOPWORDS } from '@pinooxhq/slug'
```

<h3 id="disable-or-extend">خاموش یا گسترش</h3>

```js
slugify('محصولات جدید', { dictionary: false })
slugify('پینوکس شاپ', { dictionary: { پینوکس: 'pinoox' } })  // ادغام همین فراخوانی
```

تابع‌های سراسری (بین همهٔ فراخوانی‌ها مشترک — در اپ‌ها `createSlugify` بهتر است):

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

`extendLoanwords` برای سازگاری با 0.1.x مانده است. کد جدید بهتر است `dictionary` را روی `createSlugify` / `slugify` بدهد.

<h3 id="cms-map">نقشه CMS</h3>

| فارسی | اسلاگ |
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

<h3 id="tech-loanwords">وام‌واژه‌های فناوری</h3>

| فارسی | اسلاگ |
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

<h2 id="typescript">TypeScript</h2>

تایپ‌ها همراه پکیج هستند:

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

ورودهای فریم‌ورک تایپ خودشان را هم صادر می‌کنند (`UseSlugFieldOptions`، `SlugFieldStores`، …).

<h2 id="notes">نکته‌ها</h2>

- ورودی خالی، `null` و `undefined` می‌شود `''`.
- `hash: true` از **عنوان فعلی** ساخته می‌شود. برای permalink شناسهٔ پایدار بدهید.
- نقشه‌های سراسری `extend*` برای کل فرایندند. اگر چند اپ یا تست یک process را شریک‌اند از `createSlugify({ dictionary })` استفاده کنید.
- برای واژه‌ای که در دیکشنری نیست، هجا مصوت کوتاه را حدس می‌زند؛ این رفتار عمدی است.

تغییرات 0.2.0 در [CHANGELOG.md](./CHANGELOG.md).

<h2 id="license">مجوز</h2>

MIT
