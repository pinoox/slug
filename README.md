**English** | [فارسی](./README.fa.md)

# `@pinooxhq/slug`

Persian → Finglish, then a URL-safe slug. Works in **vanilla JS**, **Vue**, **React**, and **Svelte**. Zero runtime dependencies.

Conversion is **heja-based** (Persian syllables): any word is split into CV/CVC/CVCC units, written vowels (`ا`/`و`/`ی`) are kept, and missing short vowels are inserted. There is no fixed dictionary of Persian words. `extendLoanwords` is only for English words written in Persian (`لپتاپ` → `laptop`). `extendWords` is an optional exact-word override.

```js
import { slugify, toFinglish } from '@pinooxhq/slug'

toFinglish('سلام دنیا')     // 'salam donya'
slugify('سلام دنیا')        // 'salam-donya'
slugify('لپتاپ گیمینگ')     // 'laptop-gaming'
```

## Install

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

Script tag (IIFE):

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

onTitleInput(form.title)          // fills form.slug unless the user edited it
onSlugInput(rawValue)             // sanitizes while typing
const slug = resolveSlug(title)   // form.slug or a generated slug
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

Romanize Persian to Finglish. Latin text is left as-is. `toPinglish` is an alias of `toFinglish`.

### `slugify(text, options?)`

`toFinglish`, then a URL slug.

| Option | Default | Meaning |
| --- | --- | --- |
| `replacement` | `'-'` | Separator between words |
| `lower` | `true` | Lowercase the result |
| `strict` | `true` | Keep only `[a-z0-9]` plus the separator |
| `trim` | `true` | Strip leading/trailing separators |
| `remove` | — | Extra `RegExp` to strip before separators |

```js
slugify('سلام دنیا', { replacement: '_' })  // 'salam_donya'
```

### `sanitizeSlug(text)`

Keep URL-safe characters while the user types a slug by hand. Spaces and punctuation are dropped (not turned into dashes).

```js
sanitizeSlug('Laptop Gamer!')  // 'laptopgamer'
sanitizeSlug('lap--top')       // 'lap-top'
```

### `extendLoanwords(map)`

English loanwords written in Persian cannot be recovered by letter-mapping (`لپتاپ` → `lptap`). Built-in entries cover common tech words; add more for your domain:

```js
extendLoanwords({ پینوکس: 'pinoox' })
slugify('پینوکس شاپ')  // 'pinoox-shop'
```

### `extendWords(map)`

Optional exact-word override. The heja engine already converts any Persian word; use this only when a specific spelling must win.

```js
extendWords({ تهران: 'tehran' })
```

## TypeScript

The package ships its own types. Framework adapters are optional peer dependencies (`vue`, `react`, `svelte`).

## License

MIT
