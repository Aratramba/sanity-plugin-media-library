require('regenerator-runtime/runtime');
const path = require('path');
const fs = require('fs');

// Needs to be higher than the default Playwright timeout
jest.setTimeout(40 * 1000);

const DOMAIN = 'http://localhost:3000';

const IMAGES = [
  'alejandro-contreras-wTPp323zAEw-unsplash.jpg',
  'boris-smokrovic-lyvCvA8sKGc-unsplash.jpg',
  'gwen-weustink-I3C1sSXj1i8-unsplash.jpg',
  'ricky-kharawala-adK3Vu70DEQ-unsplash.jpg',
];

describe('Media library', () => {
  it('should login', async () => {
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

    await page.goto(`${DOMAIN}/desk`);
    await expect(page).toHaveText('h1', 'Media Library');
  });

  it('should open the media library', async () => {
    await page.goto(`${DOMAIN}/media-library`);
    await expect(page).toHaveText('h2', 'Filters');
  });

  it('should upload images', async () => {
    await page.setInputFiles(
      'input[type="file"]',
      IMAGES.map((img) => path.join(__dirname, 'fixtures', img)),
      {}
    );
    await page.waitForTimeout(2000);
    await expect(page).toHaveSelectorCount('[draggable]', IMAGES.length);
  });

  it('should show list view', async () => {
    await page.click('button[aria-label="list"]');
    await expect(page).toHaveText('header', 'Title');
    await expect(page).toHaveText('header', 'Alt');
    await expect(page).toHaveText('header', 'Tags');
    await expect(page).toHaveText('header', 'Dimensions');
    await expect(page).toHaveText('header', 'Type');
    await expect(page).toHaveText('header', 'Size');
    await expect(page).toHaveText('header', 'Created at');
  });

  it('should search for images', async () => {
    await page.fill('[placeholder="Search by filename, title, alt or tag"]', 'ricky');
    await expect(page).toHaveSelectorCount('[draggable]', 1);
    await page.fill('[placeholder="Search by filename, title, alt or tag"]', '');
    await expect(page).toHaveSelectorCount('[draggable]', IMAGES.length);
  });

  it('should open edit dialog', async () => {
    await page.dblclick(`text=${IMAGES[0]}`);
    await expect(page).toHaveText('[role="dialog"]', IMAGES[0]);
  });

  it('should add title to image and search for it', async () => {
    await page.fill('[placeholder="No title yet"]', 'TEST_TITLE');
    await page.click('text=Save changes');
    await page.fill('[placeholder="Search by filename, title, alt or tag"]', 'TEST_TITLE');
    await expect(page).toHaveSelectorCount('[draggable]', 1);
  });

  it('should add tags to image', async () => {
    await page.dblclick(`img`);
    await expect(page).toHaveText('[role="dialog"]', 'TEST_TITLE');
    await page.fill('[placeholder="No tags yet"]', 'TEST_TAG1');
    await page.click('text=Save changes');
    await page.fill('[placeholder="Search by filename, title, alt or tag"]', '');
    await expect(page).toHaveSelectorCount('[draggable]', 4);
    await page.click('text=TEST_TAG1');
    await expect(page).toHaveSelectorCount('[draggable]', 1);
    await page.click('text=Clear all filters');
    await expect(page).toHaveSelectorCount('[draggable]', 4);
  });

  it('should remove files', async () => {
    await page.click(`[draggable]`, { modifiers: ['Shift'] });
    await page.click('text=Delete Asset');
    await expect(page).toHaveText('[role="dialog"]', 'Are you sure you want to delete this asset?');
    await page.click('[role="dialog"] button');
    await page.waitForTimeout(2000);

    await page.click(`[draggable]`, { modifiers: ['Shift'] });
    await page.click('text=Delete Asset');
    await expect(page).toHaveText('[role="dialog"]', 'Are you sure you want to delete this asset?');
    await page.click('[role="dialog"] button');
    await page.waitForTimeout(2000);

    await page.click(`[draggable]`, { modifiers: ['Shift'] });
    await page.click(`[draggable]:nth-of-type(2)`, { modifiers: ['Shift'] });
    await page.click('text=Delete Asset');
    await expect(page).toHaveText('[role="dialog"]', 'Are you sure you want to delete these 2 assets?');
    await page.click('[role="dialog"] button');
    await page.waitForTimeout(2000);

    await expect(page).toHaveText('No files yet');
  });

  it('should open the asset modal', async () => {
    await page.goto(
      `${DOMAIN}/desk/imageAsset%2Ctemplate%3DimageAsset;0b947db4-a12c-4d91-86d1-be430f783008%2Ctemplate%3DimageAsset`
    );
    await expect(page).toHaveText('h3', 'No documents of this type found');
    await page.click('text=Select');
    await expect(page).toHaveText('[role="dialog"]', 'Filters');
    await page.click('text=Cancel');
  });
});
