import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  extendDictionary,
  resetDictionary,
  resetLoanwords,
  resetWords,
  slugify,
  toFinglish,
} from '../src/index.ts';

afterEach(() => {
  resetLoanwords();
  resetDictionary();
  resetWords();
});

describe('dictionary', () => {
  it('maps CMS terms to English URL words', () => {
    assert.equal(slugify('محصولات'), 'product');
    assert.equal(slugify('دسته'), 'category');
    assert.equal(slugify('دسته‌بندی'), 'category');
    assert.equal(slugify('دسته بندی'), 'category');
    assert.equal(slugify('محصولات جدید'), 'product-jadid');
    assert.equal(slugify('مقاله جدید'), 'article-jadid');
    assert.equal(slugify('سبد خرید'), 'cart');
    assert.equal(slugify('ثبت نام'), 'register');
    assert.equal(slugify('صفحه اصلی'), 'home');
  });

  it('can disable the dictionary for one call', () => {
    const withDict = slugify('محصولات');
    const without = slugify('محصولات', { dictionary: false });
    assert.equal(withDict, 'product');
    assert.notEqual(without, 'product');
    assert.match(without, /^[a-z]+$/);
    assert.equal(toFinglish('محصولات', { dictionary: false }).includes('product'), false);
  });

  it('merges per-call dictionary entries', () => {
    assert.equal(slugify('پینوکس شاپ', { dictionary: { پینوکس: 'pinoox' } }), 'pinoox-shop');
  });

  it('extends the dictionary globally', () => {
    extendDictionary({ 'برند ویژه': 'label' });
    assert.equal(slugify('برند ویژه'), 'label');
  });

  it('does not replace short keys inside longer words', () => {
    assert.notEqual(slugify('موسسه'), 'mouse');
    assert.equal(slugify('موسسه').startsWith('mouse'), false);
    assert.notEqual(slugify('شاپور'), 'shop');
    assert.equal(slugify('شاپور').startsWith('shop'), false);
    assert.equal(slugify('موس'), 'mouse');
    assert.equal(slugify('شاپ'), 'shop');
  });
});
