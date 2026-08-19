[English](./README.md) | **فارسی**

# `@pinooxhq/slug`

تبدیل فارسی به فینگلیش، سپس اسلاگ امن برای URL. روی **Vanilla JS**، **Vue**، **React** و **Svelte** کار می‌کند. بدون وابستگی زمان اجرا.

تبدیل بر اساس **هجا** است: هر واژهٔ ناشناخته به واحدهای CV/CVC/CVCC شکسته می‌شود. **دیکشنری CMS و فناوری** اول اعمال می‌شود (`محصولات` → `product`، `لپتاپ` → `laptop`). برای هر فراخوانی می‌توان آن را خاموش کرد.

```js
import { slugify, toFinglish } from '@pinooxhq/slug'

toFinglish('سلام دنیا')                 // 'salam donya'
slugify('سلام دنیا')                    // 'salam-donya'
slugify('محصولات جدید')                 // 'product-jadid'
slugify('محصولات جدید', { dictionary: false }) // فقط هجا
slugify('لپتاپ گیمینگ')                  // 'laptop-gaming'
```

## نصب

```bash
npm i @pinooxhq/slug
```

## Vanilla JS

ESM:

```js
import { toFinglish, slugify, sanitizeSlug, createSlugify } from '@pinooxhq/slug'

slugify('کتابخانه')           // 'ketabkhane'
sanitizeSlug('Lap--Top!')     // 'laptop'
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

## Vue

```js
import { useSlugField } from '@pinooxhq/slug/vue'

const form = reactive({ title: '', slug: '', slugManual: false })
const { onTitleInput, onSlugInput, resolveSlug } = useSlugField(form, {
  slugify: { prefix: 'shop' },
})
```

## React

```js
import { useSlugField } from '@pinooxhq/slug/react'

function ProductForm() {
  const [title, setTitle] = useState('')
  const { slug, onSlugInput } = useSlugField(title, { slugify: { prefix: 'shop' } })
  return (
    <>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <input dir="ltr" value={slug} onChange={(e) => onSlugInput(e.target.value)} />
    </>
  )
}
```

## Svelte

```js
import { writable } from 'svelte/store'
import { slugField } from '@pinooxhq/slug/svelte'

const title = writable('')
const { slug, onSlugInput } = slugField(title, { slugify: { prefix: 'shop' } })
```

## API

### `slugify(text, options?)`

ابتدا `toFinglish`، سپس اسلاگ: `{prefix}-{body}-{suffix}-{hash}`.

```js
slugify('محصولات جدید', {
  prefix: 'shop',
  suffix: 'fa',
  hash: 42,          // seed پایدار (id / sku). بهتر از hash: true
  hashLength: 6,
})
// 'shop-product-jadid-fa-xxxxxx'

slugify('محصولات جدید', { dictionary: false })
// فقط فینگلیش — بدون جایگزینی CMS/فناوری
```

| گزینه | پیش‌فرض | معنی |
| --- | --- | --- |
| `dictionary` | `true` | `true` نقشهٔ CMS+فناوری؛ `false` خاموش؛ آبجکت برای ادغام در همین فراخوانی |
| `prefix` | — | پیشوند پاکسازی‌شده |
| `suffix` / `postfix` | — | پسوند متنی (مثلاً `v2`) |
| `hash` | — | `true` از عنوان هش می‌گیرد (با تغییر عنوان عوض می‌شود)؛ رشته/عدد seed پایدار است |
| `hashLength` | `6` | طول هش (`[a-z0-9]`، حداقل ۲) |
| `replacement` / `separator` | `'-'` | جداکننده |
| `lower` | `true` | حروف کوچک |
| `strict` | `true` | فقط `[a-z0-9]` به‌علاوه جداکننده (با `transliterate: false` حروف فارسی می‌مانند) |
| `trim` | `true` | حذف جداکننده از ابتدا و انتها |
| `maxLength` | — | برش روی جداکننده؛ جا برای prefix/suffix/hash رزرو می‌شود |
| `stopwords` | — | `true` واژه‌های `و از به در را که با` را حذف می‌کند؛ یا فهرست سفارشی |
| `symbols` | `true` | `&` → `and`، `%` → `percent`، `+` → `plus` |
| `decamelize` | `true` | `fooBar` → `foo-bar` |
| `transliterate` | `true` | `false` حروف فارسی را در اسلاگ نگه می‌دارد |
| `preserveTrailingDash` | `false` | حفظ جداکنندهٔ انتهایی هنگام تایپ |
| `customReplacements` | — | جایگزینی قبل از تبدیل، مثل `[['@', ' at ']]` |
| `remove` | — | `RegExp` اضافی قبل از جداکننده‌ها |

### `createSlugify(defaults)`

نمونه با پیش‌فرض، بدون تغییر سراسری:

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

اسلاگ تکراری می‌شود `title` سپس `title-2` (برای id تیتر). با `.reset()` پاک می‌شود.

### `toFinglish(text, options?)` / `toPinglish(text)`

رومی‌سازی فارسی به فینگلیش. همان فلگ‌های `dictionary` / `stopwords` / `symbols` را می‌گیرد. متن لاتین دست‌نخورده می‌ماند.

### `sanitizeSlug(text, options?)`

هنگام تایپ دستی اسلاگ، فقط کاراکترهای امن URL را نگه می‌دارد. فاصله و علائم حذف می‌شوند (به خط تیره تبدیل نمی‌شوند).

```js
sanitizeSlug('Laptop Gamer!')  // 'laptopgamer'
sanitizeSlug('lap--top')       // 'lap-top'
sanitizeSlug('lap-top-', { preserveTrailingDash: true }) // 'lap-top-'
```

### دیکشنری

نقشه‌های داخلی (تطبیق توکن، طولانی‌ترین کلید اول — `موسسه` نمی‌شود `mouse`):

- **CMS:** `محصولات` → `product`، `دسته` → `category`، `مقاله` → `article`، …
- **وام‌واژه فناوری:** `لپتاپ` → `laptop`، `گیمینگ` → `gaming`، …

```js
import { extendDictionary, extendLoanwords, extendWords } from '@pinooxhq/slug'

extendDictionary({ برند: 'brand' })
extendLoanwords({ پینوکس: 'pinoox' })
extendWords({ تهران: 'tehran' }) // فقط املای فینگلیش
```

`extendLoanwords` برای سازگاری مانده است. برای اپ‌ها `createSlugify({ dictionary })` بهتر است تا state سراسری اشتراک نشود.

اگر `hash: true` بدهید، با تغییر عنوان هش عوض می‌شود. برای رکورد CMS شناسهٔ پایدار بدهید: `{ hash: product.id }`.

## TypeScript

پکیج تایپ‌های خودش را دارد. آداپتورهای فریم‌ورک peer dependency اختیاری هستند (`vue`، `react`، `svelte`).

## مجوز

MIT
