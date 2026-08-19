import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSlugify,
  resetDictionary,
  resetLoanwords,
  resetWords,
  slugify,
  slugifyWithCounter,
} from '../src/index.ts';

afterEach(() => {
  resetLoanwords();
  resetDictionary();
  resetWords();
});

describe('prefix suffix hash', () => {
  it('applies prefix and suffix in order', () => {
    assert.equal(
      slugify('محصولات جدید', { prefix: 'shop', suffix: 'fa' }),
      'shop-product-jadid-fa',
    );
    assert.equal(
      slugify('محصولات جدید', { prefix: 'shop', postfix: 'fa' }),
      'shop-product-jadid-fa',
    );
  });

  it('slugifies latin prefix casing', () => {
    assert.equal(slugify('سلام', { prefix: 'Shop' }), 'shop-salam');
  });

  it('appends a deterministic hash from a stable seed', () => {
    const a = slugify('محصولات', { hash: 42, hashLength: 6 });
    const b = slugify('محصولات', { hash: 42, hashLength: 6 });
    const other = slugify('محصولات', { hash: 43, hashLength: 6 });
    assert.equal(a, b);
    assert.notEqual(a, other);
    assert.match(a, /^product-[a-z0-9]{6}$/);
  });

  it('hashes the title when hash is true', () => {
    const a = slugify('سلام دنیا', { hash: true, hashLength: 8 });
    const b = slugify('سلام دنیا', { hash: true, hashLength: 8 });
    const c = slugify('سلام دوستان', { hash: true, hashLength: 8 });
    assert.equal(a, b);
    assert.notEqual(a, c);
    assert.match(a, /^salam-donya-[a-z0-9]{8}$/);
  });

  it('respects hashLength minimum of 2', () => {
    const slug = slugify('سلام', { hash: 'id', hashLength: 1 });
    assert.match(slug, /^salam-[a-z0-9]{2}$/);
  });

  it('keeps hash when truncating to maxLength', () => {
    const slug = slugify('سلام دنیا کتابخانه', {
      hash: 'sku-9',
      hashLength: 4,
      maxLength: 16,
    });
    assert.match(slug, /-[a-z0-9]{4}$/);
    assert.ok(slug.length <= 16);
  });

  it('builds shop slugs from a factory', () => {
    const shopSlug = createSlugify({
      prefix: 'shop',
      hashLength: 6,
      dictionary: { پینوکس: 'pinoox' },
    });
    const slug = shopSlug('پینوکس محصولات', { hash: 7 });
    assert.match(slug, /^shop-pinoox-product-[a-z0-9]{6}$/);
    assert.equal(shopSlug('محصولات', { dictionary: false, prefix: undefined }).startsWith('product'), false);
  });
});

describe('famous slug APIs', () => {
  it('decamelizes latin identifiers', () => {
    assert.equal(slugify('fooBar'), 'foo-bar');
    assert.equal(slugify('fooBar', { decamelize: false }), 'foobar');
  });

  it('converts common symbols', () => {
    assert.equal(slugify('Dogs & Cats'), 'dogs-and-cats');
    assert.equal(slugify('100%'), '100-percent');
  });

  it('drops Persian stopwords when enabled', () => {
    assert.equal(slugify('سلام و دنیا', { stopwords: true }), 'salam-donya');
  });

  it('truncates on separator boundaries', () => {
    assert.equal(slugify('سلام دنیا', { maxLength: 8 }), 'salam');
  });

  it('can keep Persian letters', () => {
    const slug = slugify('سلام دنیا', { dictionary: false, transliterate: false });
    assert.equal(slug, 'سلام-دنیا');
  });

  it('preserves a trailing dash for live input', () => {
    assert.equal(slugify('foo-bar-', { preserveTrailingDash: true }), 'foo-bar-');
  });

  it('counts duplicate slugs', () => {
    const unique = slugifyWithCounter();
    assert.equal(unique('foo bar'), 'foo-bar');
    assert.equal(unique('foo bar'), 'foo-bar-2');
    unique.reset();
    assert.equal(unique('foo bar'), 'foo-bar');
  });

  it('applies custom replacements before conversion', () => {
    assert.equal(
      slugify('Foo@site', { customReplacements: [['@', ' at ']] }),
      'foo-at-site',
    );
  });
});
