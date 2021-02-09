require('regenerator-runtime/runtime');
const path = require('path');

import { formatDate, formatSize } from '../src/shared/utils';

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

  it('should show image data in list', async () => {
    await expect(page).toHaveText('[draggable]', '-unsplash.jpg');
    await expect(page).toHaveText('[draggable]', '640 x 424');
    await expect(page).toHaveText('[draggable]', 'JPG');
    await expect(page).toHaveText('[draggable]', formatSize(24000));
    await expect(page).toHaveText('[draggable]', formatDate(new Date()));
  });

  it('should search for images', async () => {
    await page.fill('[placeholder="Search by filename, title, alt or tag"]', 'ricky');
    await expect(page).toHaveSelectorCount('[draggable]', 1);
    await page.fill('[placeholder="Search by filename, title, alt or tag"]', '');
    await expect(page).toHaveSelectorCount('[draggable]', IMAGES.length);
  });

  it('should open edit dialog by double click', async () => {
    await page.dblclick(`text=${IMAGES[0]}`);
    await expect(page).toHaveText('[role="dialog"]', IMAGES[0]);
  });

  it('should close edit dialog by escape', async () => {
    await page.keyboard.press('Escape');
    await expect(page).not.toHaveText('[role="dialog"]', IMAGES[0]);
  });

  it('should open edit dialog by edit asset button', async () => {
    await page.click(`text=${IMAGES[0]}`);
    await page.click('text=Edit asset');
    await expect(page).toHaveText('[role="dialog"]', IMAGES[0]);
  });

  it('should close edit dialog by cancel button', async () => {
    await page.click('text=Cancel');
    await expect(page).not.toHaveText('[role="dialog"]', IMAGES[0]);
  });

  it('should add title to image and search for it', async () => {
    await page.dblclick(`text=${IMAGES[0]}`);
    await expect(page).toHaveText('[role="dialog"]', IMAGES[0]);
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

  // it('should remove unused tag', async () => {
  //   await page.dblclick(`img`);
  //   await expect(page).toHaveSelectorCount('[role="dialog"]', 1);
  //   await page.fill('[value="TEST_TAG1"]', '');
  //   await page.click('text=Save changes');
  //   await expect(page).not.toHaveText('TEST_TAG1');
  // });

  it('should sort the assets', async () => {
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
    await expect(page).toHaveText('[draggable]', 'TITLE_A');

    await page.selectOption('select', 'za');
    await expect(page).toHaveText('[draggable]', 'TITLE_D');
  });

  it('should show custom fields', async () => {
    await page.dblclick('[draggable]');
    await expect(page).toHaveText('[role="dialog"]', 'Title');
    await expect(page).toHaveText('[role="dialog"]', 'Alt text');
    await expect(page).toHaveText('[role="dialog"]', 'Tags');
    await expect(page).toHaveText('[role="dialog"]', 'Additional description');
    await expect(page).toHaveText('[role="dialog"]', 'Decade when photo captured');
    await expect(page).toHaveText('[role="dialog"]', 'Is a premium photo');
    await expect(page).toHaveText('[role="dialog"]', 'Attribution');
    await expect(page).toHaveText('[role="dialog"]', 'Location');
    await expect(page).toHaveText('[role="dialog"]', 'Latitude');
    await expect(page).toHaveText('[role="dialog"]', 'Altitude');
    await expect(page).toHaveText('[role="dialog"]', 'Copyright');
  });

  it('should store custom fields', async () => {
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

    await page.dblclick('[draggable]');
    await expect(page).toHaveSelectorCount('[role="dialog"] [value="TEST_ALT"]', 1);
    await expect(page).toHaveSelectorCount('[role="dialog"] [value="TEST_TAG"]', 1);
    await expect(page).toHaveSelectorCount('[role="dialog"] [value="TEST_DESCRIPTION"]', 1);
    await expect(page).toHaveSelectorCount('[role="dialog"] [value="1800"]', 1);
    await expect(page).toHaveSelectorCount('[role="dialog"] [type="checkbox"]:checked', 1);
    await expect(page).toHaveSelectorCount('[role="dialog"] [value="MY_ATTRIBUTION"]', 1);
    await expect(page).toHaveSelectorCount('[role="dialog"] [value="-34.397"]', 1);
    await expect(page).toHaveSelectorCount('[role="dialog"] [value="150.644"]', 1);
    await expect(page).toHaveSelectorCount('[role="dialog"] [value="10"]', 1);
    await expect(page).toEqualValue('[role="dialog"] select', 'public-domain', 1);
    await page.click('text=Cancel');
  });

  it('should remove files', async () => {
    await page.click('button[aria-label="grid"]');
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
