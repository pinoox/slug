import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  extendLoanwords,
  resetLoanwords,
  sanitizeSlug,
  slugify,
  toFinglish,
  toPinglish,
} from '../src/index.ts';

describe('slugify', () => {
  it('restores English loanwords written in Persian', () => {
    assert.equal(slugify('لپتاپ'), 'laptop');
    assert.equal(slugify('لپ‌تاپ'), 'laptop');
    assert.equal(slugify('لپتاپ گیمینگ'), 'laptop-gaming');
    assert.equal(slugify('موبایل سامسونگ'), 'mobile-samsung');
    assert.equal(slugify('شاپ'), 'shop');
  });

  it('uses Finglish vowels for native Persian words', () => {
    assert.equal(slugify('سلام دنیا'), 'salam-donya');
    assert.equal(slugify('کتابخانه'), 'ketabkhane');
    assert.equal(slugify('کامپیوتر'), 'computer');
  });

  it('keeps latin titles as kebab-case', () => {
    assert.equal(slugify('Gaming Laptop'), 'gaming-laptop');
    assert.equal(slugify(''), '');
  });

  it('accepts slugify-style options', () => {
    assert.equal(slugify('سلام دنیا', { replacement: '_' }), 'salam_donya');
  });
});

describe('toFinglish', () => {
  it('aliases toPinglish', () => {
    assert.equal(toFinglish('سلام دنیا'), 'salam donya');
    assert.equal(toPinglish('سلام دنیا'), 'salam donya');
  });

  it('converts unseen Persian words without a dictionary', () => {
    assert.equal(slugify('نان'), 'nan');
    assert.equal(slugify('ایران'), 'iran');
    assert.equal(slugify('خوش'), 'khosh');
    assert.equal(toFinglish('درخت'), 'darakht');
  });

  it('allows extra loanwords', () => {
    extendLoanwords({ پینوکس: 'pinoox' });
    assert.equal(slugify('پینوکس شاپ'), 'pinoox-shop');
    resetLoanwords();
  });
});

describe('sanitizeSlug', () => {
  it('keeps url-safe characters while typing', () => {
    assert.equal(sanitizeSlug('Laptop Gamer!'), 'laptopgamer');
    assert.equal(sanitizeSlug('lap--top'), 'lap-top');
  });
});
