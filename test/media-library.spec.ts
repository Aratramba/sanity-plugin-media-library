import { test, expect } from '@playwright/test';

const path = require('path');

const DOMAIN = 'http://localhost:3000';
const INTERNET_SPEED_TIMEOUT = 5000;

require('dotenv').config();

const IMAGES = [
  'alejandro-contreras-wTPp323zAEw-unsplash.jpg',
  'boris-smokrovic-lyvCvA8sKGc-unsplash.jpg',
  'gwen-weustink-I3C1sSXj1i8-unsplash.jpg',
  'ricky-kharawala-adK3Vu70DEQ-unsplash.jpg',
];

async function setCookies(context) {
  await context.addCookies([
    {
      name: 'sanitySession',
      value: process.env.SANITY_PLAYWRIGHT_TEST_TOKEN,
      secure: true,
      path: '/',
      httpOnly: true,
      sameSite: 'None',
      domain: `.${process.env.SANITY_PROJECT_ID}.api.sanity.io`,
    },
  ]);
}

async function countSelector(page, selector) {
  const items = await page.$$(selector);
  return items.length;
}

async function dialogVisible(page) {
  const isVisible = await page.isVisible('[role="dialog"]');
  return isVisible;
}

async function dialogHidden(page) {
  const isVisible = await page.isHidden('[role="dialog"]');
  return isVisible;
}

test.describe('Media library', () => {
  test.beforeEach(async ({ page, context }) => {
    setCookies(context);
    await page.goto(`${DOMAIN}/media-library`);
  });

  test('login', async ({ page }) => {
    await page.waitForTimeout(INTERNET_SPEED_TIMEOUT); // TODO: is this needed for the Github action to succeed?
    expect(await page.textContent('h2')).toBe('Filters');
  });

  test('upload', async ({ page }) => {
    await page.setInputFiles(
      'input[type="file"]',
      IMAGES.map((img) => path.join(__dirname, 'fixtures', img)),
      {}
    );
    await page.waitForTimeout(INTERNET_SPEED_TIMEOUT);
    const draggables = await page.$$('[draggable]');
    expect(draggables.length).toBe(IMAGES.length);
  });

  test('listview', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    expect(await page.textContent('header')).toContain('Title');
    expect(await page.textContent('header')).toContain('Alt');
    expect(await page.textContent('header')).toContain('Tags');
    expect(await page.textContent('header')).toContain('Dimensions');
    expect(await page.textContent('header')).toContain('Type');
    expect(await page.textContent('header')).toContain('Size');
    expect(await page.textContent('header')).toContain('Created at');
  });

  test('imagedata', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    expect(await page.textContent('[draggable]')).toContain('-unsplash.jpg');
    expect(await page.textContent('[draggable]')).toContain(' x ');
    expect(await page.textContent('[draggable]')).toContain('JPG');
    expect(await page.textContent('[draggable]')).toContain(' kb');
  });

  test('search', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    await page.fill('[placeholder="Search by filename, title, alt or tag"]', 'ricky');
    expect(await countSelector(page, '[draggable]')).toBe(1);
    await page.fill('[placeholder="Search by filename, title, alt or tag"]', '');
    expect(await countSelector(page, '[draggable]')).toBe(IMAGES.length);
  });

  test('edit dialog double click', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    await page.dblclick(`text=${IMAGES[0]}`);
    expect(await dialogVisible(page)).toBeTruthy();
    expect(await page.textContent('[role="dialog"]')).toContain(IMAGES[0]);

    await page.keyboard.press('Escape');
    expect(await dialogHidden(page)).toBeTruthy();
  });

  test('edit dialog edit asset', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    await page.click(`text=${IMAGES[0]}`);
    await page.click('text=Edit asset');
    await dialogVisible(page);
    expect(await page.textContent('[role="dialog"]')).toContain(IMAGES[0]);

    await page.click('text=Cancel');
    expect(await dialogHidden(page)).toBeTruthy();
  });

  test('edit title', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    await page.dblclick(`text=${IMAGES[0]}`);
    await dialogVisible(page);
    expect(await page.textContent('[role="dialog"]')).toContain(IMAGES[0]);
    await page.fill('[placeholder="No title yet"]', 'TEST_TITLE');
    await page.click('text=Save changes');
    await dialogHidden(page);
    expect(await page.isVisible('text=TEST_TITLE'));
  });

  test('edit tags', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    await page.dblclick(`img`);
    await dialogVisible(page);
    await page.fill('[placeholder="No tags yet"]', 'TEST_TAG1');
    await page.click('text=Save changes');
    await dialogHidden(page);

    await page.fill('[placeholder="Search by filename, title, alt or tag"]', '');
    expect(await countSelector(page, '[draggable]')).toBe(4);
    await page.click('text=TEST_TAG1');
    expect(await countSelector(page, '[draggable]')).toBe(1);
    await page.click('text=Clear all filters');
    expect(await countSelector(page, '[draggable]')).toBe(4);
  });

  test('sort assets', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    await page.dblclick(`[draggable]:nth-of-type(1)`);
    await page.fill('[role="dialog"] input[type="text"]', 'TITLE_A');
    await page.click('text=Save changes');

    await page.dblclick(`[draggable]:nth-of-type(2)`);
    await page.fill('[role="dialog"] input[type="text"]', 'TITLE_B');
    await page.click('text=Save changes');

    await page.dblclick(`[draggable]:nth-of-type(3)`);
    await page.fill('[role="dialog"] input[type="text"]', 'TITLE_C');
    await page.click('text=Save changes');

    await page.dblclick(`[draggable]:nth-of-type(4)`);
    await page.fill('[role="dialog"] input[type="text"]', 'TITLE_D');
    await page.click('text=Save changes');

    await page.click('button[aria-label="list"]');
    await page.selectOption('select', 'az');
    expect(await page.textContent('[draggable]')).toContain('TITLE_A');

    await page.selectOption('select', 'za');
    expect(await page.textContent('[draggable]')).toContain('TITLE_D');
  });

  test('show custom fields', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    await page.dblclick('[draggable]');
    expect(await page.textContent('[role="dialog"]')).toContain('Title');
    expect(await page.textContent('[role="dialog"]')).toContain('Alt text');
    expect(await page.textContent('[role="dialog"]')).toContain('Tags');
    expect(await page.textContent('[role="dialog"]')).toContain('Additional description');
    expect(await page.textContent('[role="dialog"]')).toContain('Decade when photo captured');
    expect(await page.textContent('[role="dialog"]')).toContain('Is a premium photo');
    expect(await page.textContent('[role="dialog"]')).toContain('Attribution');
    expect(await page.textContent('[role="dialog"]')).toContain('Location');
    expect(await page.textContent('[role="dialog"]')).toContain('Latitude');
    expect(await page.textContent('[role="dialog"]')).toContain('Altitude');
    expect(await page.textContent('[role="dialog"]')).toContain('Copyright');
  });

  test('store custom fields', async ({ page }) => {
    await page.click('button[aria-label="list"]');
    await page.dblclick('[draggable]');
    await page.fill('[role="dialog"] [placeholder="No alt text yet"]', 'TEST_ALT');
    await page.fill('[role="dialog"] [placeholder="No tags yet"]', 'TEST_TAG');
    await page.fill('[role="dialog"] [placeholder="No description yet"]', 'TEST_DESCRIPTION');
    await page.fill('[role="dialog"] [placeholder="Between 1800 and 2200"]', '1800');
    await page.check('[role="dialog"] [type="checkbox"]');
    await page.fill('[role="dialog"] [placeholder="No attribution yet"]', 'MY_ATTRIBUTION');
    await page.fill('[role="dialog"] [name="lat"]', '-34.397');
    await page.fill('[role="dialog"] [name="lng"]', '150.644');
    await page.fill('[role="dialog"] [name="alt"]', '10');
    await page.selectOption('[role="dialog"] select', 'public-domain');
    await page.click('text=Save changes');
    await dialogHidden(page);

    await page.dblclick('[draggable]');
    expect(await countSelector(page, '[role="dialog"] [value="TEST_ALT"]')).toBe(1);
    expect(await countSelector(page, '[role="dialog"] [value="TEST_TAG"]')).toBe(1);
    expect(await countSelector(page, '[role="dialog"] [value="TEST_DESCRIPTION"]')).toBe(1);
    expect(await countSelector(page, '[role="dialog"] [value="1800"]')).toBe(1);
    expect(await countSelector(page, '[role="dialog"] [type="checkbox"]:checked')).toBe(1);
    expect(await countSelector(page, '[role="dialog"] [value="MY_ATTRIBUTION"]')).toBe(1);
    expect(await countSelector(page, '[role="dialog"] [value="-34.397"]')).toBe(1);
    expect(await countSelector(page, '[role="dialog"] [value="150.644"]')).toBe(1);
    expect(await countSelector(page, '[role="dialog"] [value="10"]')).toBe(1);
    expect(await page.$eval('[role="dialog"] select', (e: HTMLSelectElement) => e.selectedIndex)).toBe(2);

    await page.click('text=Cancel');
    await dialogHidden(page);
  });

  test('remove files', async ({ page }) => {
    await page.click('button[aria-label="grid"]');
    await page.click(`[draggable]`, { modifiers: ['Shift'] });
    await page.click('text=Delete Asset');
    expect(await page.textContent('[role="dialog"]')).toContain('Are you sure you want to delete this asset?');
    await page.click('[role="dialog"] button');
    await page.waitForTimeout(INTERNET_SPEED_TIMEOUT);

    await page.click(`[draggable]`, { modifiers: ['Shift'] });
    await page.click('text=Delete Asset');
    expect(await page.textContent('[role="dialog"]')).toContain('Are you sure you want to delete this asset?');
    await page.click('[role="dialog"] button');
    await page.waitForTimeout(INTERNET_SPEED_TIMEOUT);

    await page.click(`[draggable]`, { modifiers: ['Shift'] });
    await page.click(`[draggable]:nth-of-type(2)`, { modifiers: ['Shift'] });
    await page.click('text=Delete Asset');
    expect(await page.textContent('[role="dialog"]')).toContain('Are you sure you want to delete 2 assets?');
    await page.click('[role="dialog"] button');
    await page.waitForTimeout(INTERNET_SPEED_TIMEOUT);

    expect(await page.isVisible('#noContent'));
  });

  test('asset modal', async ({ page }) => {
    await page.goto(
      `${DOMAIN}/desk/imageAsset%2Ctemplate%3DimageAsset;0b947db4-a12c-4d91-86d1-be430f783008%2Ctemplate%3DimageAsset`
    );
    expect(await page.textContent('h3')).toBe('No documents of this type found');
    await page.click('text=Select');
    expect(await page.textContent('[role="dialog"]')).toContain('Filters');
    await page.click('text=Cancel');
  });
});
