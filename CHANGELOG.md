# Changelog

## 0.2.0

- Add a CMS + tech dictionary with **token** matching (longest key first).
- Allow disabling or extending the dictionary per `slugify` / `toFinglish` call.
- Add `prefix`, `suffix` / `postfix`, and optional deterministic `hash` with `hashLength`.
- Add `createSlugify()` and `slugifyWithCounter()`.
- Add `maxLength`, `stopwords`, `symbols`, `decamelize`, `transliterate: false`, `preserveTrailingDash`, `separator`, and `customReplacements`.
- Tokenize on punctuation as well as spaces so titles like `سلام، دنیا!` slugify cleanly.
- Keep `extendLoanwords` for compatibility; add `extendDictionary`.
