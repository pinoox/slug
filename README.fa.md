[English](./README.md) | **فارسی**

# `@pinooxhq/slug`

تبدیل فارسی به فینگلیش، سپس اسلاگ امن برای URL. روی **Vanilla JS**، **Vue**، **React** و **Svelte** کار می‌کند. بدون وابستگی زمان اجرا.

تبدیل بر اساس **هجا** است: هر واژه به واحدهای CV/CVC/CVCC شکسته می‌شود، مصوت‌های نوشته‌شده (`ا`/`و`/`ی`) حفظ می‌شوند و مصوت‌های کوتاه نانوشته درج می‌شوند. فهرست ثابتی از واژه‌های فارسی وجود ندارد. `extendLoanwords` فقط برای وام‌واژه‌های انگلیسی با املای فارسی است (`لپتاپ` → `laptop`). `extendWords` بازنویسی اختیاری یک واژه است.

```js
import { slugify, toFinglish } from '@pinooxhq/slug'

toFinglish('سلام دنیا')     // 'salam donya'
slugify('سلام دنیا')        // 'salam-donya'
slugify('لپتاپ گیمینگ')     // 'laptop-gaming'
```

## نصب

```bash
npm i @pinooxhq/slug
```

## Vanilla JS

ESM:

```js
import { toFinglish, toPinglish, slugify, sanitizeSlug, extendLoanwords } from '@pinooxhq/slug'

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
const { onTitleInput, onSlugInput, resolveSlug } = useSlugField(form)

onTitleInput(form.title)          // form.slug را پر می‌کند مگر کاربر دستی ویرایش کرده باشد
onSlugInput(rawValue)             // هنگام تایپ اسلاگ را پاکسازی می‌کند
const slug = resolveSlug(title)   // form.slug یا اسلاگ تولیدشده
```

## React

```js
import { useSlugField } from '@pinooxhq/slug/react'

function ProductForm() {
  const [title, setTitle] = useState('')
  const { slug, onSlugInput } = useSlugField(title)
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
const { slug, onSlugInput } = slugField(title)
```

## API

### `toFinglish(text)` / `toPinglish(text)`

رومی‌سازی فارسی به فینگلیش. متن لاتین دست‌نخورده می‌ماند. `toPinglish` نام مستعار `toFinglish` است.

### `slugify(text, options?)`

ابتدا `toFinglish`، سپس اسلاگ URL.

| گزینه | پیش‌فرض | معنی |
| --- | --- | --- |
| `replacement` | `'-'` | جداکننده بین کلمات |
| `lower` | `true` | حروف کوچک |
| `strict` | `true` | فقط `[a-z0-9]` به‌علاوه جداکننده |
| `trim` | `true` | حذف جداکننده از ابتدا و انتها |
| `remove` | — | `RegExp` اضافی برای حذف قبل از جداکننده‌ها |

```js
slugify('سلام دنیا', { replacement: '_' })  // 'salam_donya'
```

### `sanitizeSlug(text)`

هنگام تایپ دستی اسلاگ، فقط کاراکترهای امن URL را نگه می‌دارد. فاصله و علائم حذف می‌شوند (به خط تیره تبدیل نمی‌شوند).

```js
sanitizeSlug('Laptop Gamer!')  // 'laptopgamer'
sanitizeSlug('lap--top')       // 'lap-top'
```

### `extendLoanwords(map)`

وام‌واژه‌های انگلیسی که با فارسی نوشته شده‌اند با نگاشت حروف بازیابی نمی‌شوند (`لپتاپ` → `lptap`). ورودی‌های داخلی واژه‌های رایج فناوری را پوشش می‌دهند؛ برای دامنه خودتان موارد بیشتری اضافه کنید:

```js
extendLoanwords({ پینوکس: 'pinoox' })
slugify('پینوکس شاپ')  // 'pinoox-shop'
```

### `extendWords(map)`

بازنویسی اختیاری یک واژه. موتور هجا هر واژه فارسی را تبدیل می‌کند؛ این فقط وقتی لازم است که یک املای خاص باید برنده شود.

```js
extendWords({ تهران: 'tehran' })
```

## TypeScript

پکیج تایپ‌های خودش را دارد. آداپتورهای فریم‌ورک peer dependency اختیاری هستند (`vue`، `react`، `svelte`).

## مجوز

MIT
