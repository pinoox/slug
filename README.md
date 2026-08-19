**English** | [فارسی](./README.fa.md)

# `@pinooxhq/slug`

Persian → Finglish, then a URL-safe slug. Works in **vanilla JS**, **Vue**, **React**, and **Svelte**. Zero runtime dependencies.

Conversion is **heja-based** (Persian syllables): any unknown word is split into CV/CVC/CVCC units. A built-in **CMS + tech dictionary** maps common terms first (`محصولات` → `product`, `لپتاپ` → `laptop`). Turn it off per call when you want pure Finglish.

```js
import { slugify, toFinglish } from '@pinooxhq/slug'

toFinglish('سلام دنیا')                 // 'salam donya'
slugify('سلام دنیا')                    // 'salam-donya'
slugify('محصولات جدید')                 // 'product-jadid'
slugify('محصولات جدید', { dictionary: false }) // heja only
slugify('لپتاپ گیمینگ')                  // 'laptop-gaming'
```

## Install

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

`toFinglish`, then a URL slug: `{prefix}-{body}-{suffix}-{hash}`.

```js
slugify('محصولات جدید', {
  prefix: 'shop',
  suffix: 'fa',
  hash: 42,          // stable seed (id / sku). Prefer this over hash: true
  hashLength: 6,
})
// 'shop-product-jadid-fa-xxxxxx'

slugify('محصولات جدید', { dictionary: false })
// Finglish only — no CMS/tech replacements
```

| Option | Default | Meaning |
| --- | --- | --- |
| `dictionary` | `true` | `true` uses CMS+tech maps; `false` disables them; object merges extra entries for this call |
| `prefix` | — | Sanitized prefix |
| `suffix` / `postfix` | — | Sanitized suffix (literal extra, e.g. `v2`) |
| `hash` | — | `true` hashes the title (changes if the title changes); string/number is a stable seed |
| `hashLength` | `6` | Hash length (`[a-z0-9]`, minimum 2) |
| `replacement` / `separator` | `'-'` | Separator between words |
| `lower` | `true` | Lowercase the result |
| `strict` | `true` | Keep only `[a-z0-9]` plus the separator (Persian kept if `transliterate: false`) |
| `trim` | `true` | Strip leading/trailing separators |
| `maxLength` | — | Truncate on a separator; room is reserved for prefix/suffix/hash |
| `stopwords` | — | `true` drops `و از به در را که با`; or pass a custom list |
| `symbols` | `true` | `&` → `and`, `%` → `percent`, `+` → `plus` |
| `decamelize` | `true` | `fooBar` → `foo-bar` |
| `transliterate` | `true` | `false` keeps Persian letters in the slug |
| `preserveTrailingDash` | `false` | Keep a trailing separator while typing |
| `customReplacements` | — | `[['@', ' at ']]` replacements before conversion |
| `remove` | — | Extra `RegExp` to strip before separators |

### `createSlugify(defaults)`

Instance with default options (no global mutation):

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

Same slug twice becomes `title`, then `title-2` (useful for heading ids). Call `.reset()` to clear.

### `toFinglish(text, options?)` / `toPinglish(text)`

Romanize Persian to Finglish. Accepts the same `dictionary` / `stopwords` / `symbols` flags. Latin text is left as-is.

### `sanitizeSlug(text, options?)`

Keep URL-safe characters while the user types a slug by hand. Spaces and punctuation are dropped (not turned into dashes).

```js
sanitizeSlug('Laptop Gamer!')  // 'laptopgamer'
sanitizeSlug('lap--top')       // 'lap-top'
sanitizeSlug('lap-top-', { preserveTrailingDash: true }) // 'lap-top-'
```

### Dictionary

Built-in maps (token match, longest key first — `موسسه` is not `mouse`):

- **CMS:** `محصولات` → `product`, `دسته` → `category`, `مقاله` → `article`, …
- **Tech loanwords:** `لپتاپ` → `laptop`, `گیمینگ` → `gaming`, …

```js
import { extendDictionary, extendLoanwords, extendWords } from '@pinooxhq/slug'

extendDictionary({ برند: 'brand' })
extendLoanwords({ پینوکس: 'pinoox' })
extendWords({ تهران: 'tehran' }) // Finglish spelling override only
```

`extendLoanwords` stays for compatibility. Prefer `createSlugify({ dictionary })` so apps do not share global state.

If you pass `hash: true`, the suffix changes whenever the title changes. For CMS records, pass a stable id: `{ hash: product.id }`.

## TypeScript

The package ships its own types. Framework adapters are optional peer dependencies (`vue`, `react`, `svelte`).

## License

MIT
