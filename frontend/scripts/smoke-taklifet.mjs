import React, { Suspense } from 'react';
import { renderToString, renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import { createServer } from 'vite';

async function renderAsync(node) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    const stream = new Writable({
      write(chunk, enc, cb) {
        chunks.push(Buffer.from(chunk));
        cb();
      },
      final(cb) {
        resolve(Buffer.concat(chunks).toString('utf8'));
        cb();
      }
    });
    const { pipe } = renderToPipeableStream(node, {
      onAllReady() {
        pipe(stream);
      },
      onError(err) {
        reject(err);
      }
    });
  });
}

const server = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const { TaklifetPinkSite, ENVELOPE_PALETTES } = await server.ssrLoadModule(
    '/src/templates/sites/TaklifetPinkSite.tsx'
  );
  const { siteTemplatesRegistry } = await server.ssrLoadModule('/src/templates/sites/index.ts');

  const baseData = {
    groomName: 'Jasur',
    brideName: 'Madina',
    date: '2026-09-18',
    time: '18:00',
    venue: 'Navroʻz saroyi',
    address: 'Toshkent sh., Alisher Navoiy koʻchasi, 15-uy',
  };

  // 1. Closed state
  const closedHtml = renderToString(
    React.createElement(TaklifetPinkSite, { data: baseData, isOpened: false, visualVariant: 'default' })
  );

  // 2. Opened state
  const openedHtml = renderToString(
    React.createElement(TaklifetPinkSite, { data: baseData, isOpened: true, visualVariant: 'default' })
  );

  // 3. Custom wishText & giftCard
  const customizedHtml = renderToString(
    React.createElement(TaklifetPinkSite, {
      data: {
        ...baseData,
        wishText: 'Bizning baxtimizga sherik boʻling!',
        wishFrom: 'Shomurodovlar xonadoni',
        giftCardNumber: '9860 1234 5678 9012',
        giftCardOwner: 'Jasur Sh.',
      },
      isOpened: true,
      visualVariant: 'default',
    })
  );

  // 4. Localized outputs
  const localizedHtml = Object.fromEntries(
    ['ru', 'uz', 'en'].map((lang) => [
      lang,
      renderToString(React.createElement(TaklifetPinkSite, { data: baseData, lang, isOpened: true })),
    ])
  );

  // 5. Test all 8 registered IDs: 8, 13-19
  const templateIds = [8, 13, 14, 15, 16, 17, 18, 19];
  const registeredComponents = await Promise.all(
    templateIds.map(async (id) => {
      const Component = siteTemplatesRegistry[id];
      if (!Component) throw new Error(`Template ID ${id} not found in registry!`);
      const html = await renderAsync(
        React.createElement(
          Suspense,
          { fallback: null },
          React.createElement(Component, { data: baseData, isOpened: true })
        )
      );
      return { id, html };
    })
  );

  // 6. Test all 8 variants
  const variantKeys = [
    'default',
    'pink-envelope',
    'emerald-envelope',
    'champagne-envelope',
    'dusty-rose-envelope',
    'dusty-blue-envelope',
    'navy-envelope',
    'burgundy-envelope',
  ];

  const variantHtmls = variantKeys.map((key) => {
    const palette = ENVELOPE_PALETTES[key];
    const html = renderToString(
      React.createElement(TaklifetPinkSite, { data: baseData, visualVariant: key, isOpened: false })
    );
    return { key, palette, html };
  });

  const checks = [
    // Zero Tailwind violet/purple checks
    ['no #7C3AED in default', !openedHtml.includes('#7C3AED') && !closedHtml.includes('#7C3AED')],
    ['no #8B5CF6 in default', !openedHtml.includes('#8B5CF6') && !closedHtml.includes('#8B5CF6')],
    ['no #581C87 in default', !openedHtml.includes('#581C87') && !closedHtml.includes('#581C87')],
    ['no purple-900 in default', !openedHtml.includes('purple-900') && !closedHtml.includes('purple-900')],
    ['no Unsplash images', !openedHtml.includes('images.unsplash.com') && !closedHtml.includes('images.unsplash.com')],

    // CSS variables
    ['CSS var --env-paper', closedHtml.includes('--env-paper:') && openedHtml.includes('--env-paper:')],
    ['CSS var --env-flap', closedHtml.includes('--env-flap:')],
    ['CSS var --env-pocket', closedHtml.includes('--env-pocket:')],
    ['CSS var --env-ink', closedHtml.includes('--env-ink:')],
    ['CSS var --env-accent', closedHtml.includes('--env-accent:')],
    ['CSS var --env-seal', closedHtml.includes('--env-seal:')],

    // Envelope construction
    ['C6 aspect ratio container', closedHtml.includes('aspect-[1.42/1]')],
    ['rounded corners 8px (not 24px)', closedHtml.includes('rounded-[8px]')],
    ['paper grain filter defined', closedHtml.includes('id="taklifet-paper-grain"')],
    ['floral lining pattern defined', closedHtml.includes('id="taklifet-floral-lining"')],
    ['wax seal button', closedHtml.includes('aria-label="MUHRNI BOSING"')],
    ['monogram without heart', closedHtml.includes('J · M') && !closedHtml.includes('J♡M') && !closedHtml.includes('J ♡ M')],

    // Section wishText
    ['custom wishText is rendered', customizedHtml.includes('Bizning baxtimizga sherik boʻling!')],
    ['custom wishFrom is rendered', customizedHtml.includes('Shomurodovlar xonadoni')],
    ['default wish text in uz', localizedHtml.uz.includes('Gulday ochilgan bu baxt kunida siz bilan birga boʻlishni istardik')],
    ['default wish text in ru', localizedHtml.ru.includes('В этот счастливый день мы будем рады видеть вас рядом с нами')],
    ['default wish text in en', localizedHtml.en.includes('On this joyous day, we would be delighted')],

    // Venue & Maps
    ['venue has proper Uzbek ʻ', openedHtml.includes('Navroʻz saroyi')],
    ['both Google and Yandex maps', openedHtml.includes('Google Maps') && openedHtml.includes('Yandex Maps')],
    ['calendar actions exist', openedHtml.includes('Taqvimga qoʻshish') || openedHtml.includes('Google Taqvim')],

    // Gift card
    ['custom gift card rendered', customizedHtml.includes('9860 1234 5678 9012')],
    ['custom gift card owner rendered', customizedHtml.includes('Jasur Sh.')],
    ['gift card hidden when empty on guest site', !openedHtml.includes('8600 7710 4420 8911')],

    // All 8 registry templates render
    ...registeredComponents.map(({ id, html }) => [
      `registry template ID ${id} renders`,
      html.includes('Taklifnoma') || html.includes('Jasur'),
    ]),

    // All 8 variants apply correct themeClass & CSS variables
    ...variantHtmls.map(({ key, palette, html }) => [
      `variant ${key} applies ${palette.themeClass} and ${palette.paper}`,
      html.includes(palette.themeClass) && html.includes(palette.paper),
    ]),
  ];

  let failedCount = 0;
  for (const [name, passed] of checks) {
    if (!passed) {
      console.error(`FAIL: ${name}`);
      failedCount++;
    } else {
      console.log(`PASS: ${name}`);
    }
  }

  if (failedCount > 0) {
    console.error(`\n${failedCount} checks failed.`);
    process.exit(1);
  } else {
    console.log(`\nALL ${checks.length} SMOKE CHECKS PASSED!`);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await server.close();
}
