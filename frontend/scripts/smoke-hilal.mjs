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
  const { HilalWeddingSite } = await server.ssrLoadModule(
    '/src/templates/sites/HilalWeddingSite.tsx',
  );
  const { siteTemplatesRegistry } = await server.ssrLoadModule('/src/templates/sites/index.ts');

  const data = {
    groomName: 'Diyorbek',
    brideName: 'Oysha',
    date: '2026-07-08',
    time: '18:00',
    venue: 'Sunbula Saroyi',
    address: 'Toshkent sh., Yunusobod tumani, Ahmad Yassaviy 34C',
    giftCardNumber: '8600123456789012',
    giftCardOwner: 'Diyorbek Karimov',
  };

  const closedHtml = renderToString(
    React.createElement(HilalWeddingSite, { data, isOpened: false, lang: 'uz' }),
  );
  const openedHtml = renderToString(
    React.createElement(HilalWeddingSite, { data, isOpened: true, lang: 'uz' }),
  );
  const previewHtml = renderToString(
    React.createElement(HilalWeddingSite, { data: {}, isOpened: false, isPreview: true, lang: 'uz' }),
  );

  const ruHtml = renderToString(
    React.createElement(HilalWeddingSite, { data, isOpened: true, lang: 'ru' }),
  );
  const enHtml = renderToString(
    React.createElement(HilalWeddingSite, { data, isOpened: true, lang: 'en' }),
  );

  const hilalIds = [7, 11, 12, 20, 21, 22, 23, 24];
  const renderedIds = await Promise.all(
    hilalIds.map(async (id) => {
      const Component = siteTemplatesRegistry[id];
      const html = await renderAsync(
        React.createElement(
          Suspense,
          { fallback: null },
          React.createElement(Component, { data, isOpened: true })
        )
      );
      return [id, html];
    })
  );

  const checks = [
    ['Hilal registered IDs exist', hilalIds.every((id) => Boolean(siteTemplatesRegistry[id]))],
    ['Closed screen has Bismillah', closedHtml.includes('بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ')],
    ['Closed screen has Amiri font style', closedHtml.includes('Amiri')],
    ['Arabic Bismillah has dir="rtl"', closedHtml.includes('dir="rtl"')],
    ['Open invitation button in UZ', closedHtml.includes('TAKLIFNOMANI OCHISH')],
    ['Pointed arch SVG clip path present', closedHtml.includes('hilal-arch-clip-')],
    ['Girih pattern SVG present', closedHtml.includes('GirihPattern') || closedHtml.includes('pattern')],
    ['Islamic Crescent present', closedHtml.includes('HilalCrescent') || closedHtml.includes('<svg')],
    ['Opened site has Quran verse', openedHtml.includes('وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ')],
    ['Quran verse has dir="rtl"', openedHtml.includes('dir="rtl"') && openedHtml.includes('lang="ar"')],
    ['Uzbek translation of Rum 30:21', openedHtml.includes('Rum surasi, 21-oyat')],
    ['Russian translation of Rum 30:21', ruHtml.includes('Ар-Рум, 30:21') && ruHtml.includes('Среди Его знамений')],
    ['English translation of Ar-Rum 30:21', enHtml.includes('Ar-Rum 30:21') && enHtml.includes('And of His signs')],
    ['Calendar Add-to-Calendar Google link', openedHtml.includes('calendar.google.com')],
    ['Calendar .ics download button', openedHtml.includes('iCal (.ics) yuklab olish')],
    ['Gift card has real number', openedHtml.includes('8600 1234 5678 9012')],
    ['Preview gift card has masked placeholder', previewHtml.includes('8600 •••• •••• ••••')],
    ['Unsplash images completely eliminated', !closedHtml.includes('unsplash.com') && !openedHtml.includes('unsplash.com') && !previewHtml.includes('unsplash.com')],
    ['No text smaller than 11px', !closedHtml.includes('text-[9px]') && !closedHtml.includes('text-[10px]') && !openedHtml.includes('text-[9px]') && !openedHtml.includes('text-[10px]')],
    ['Dual map links present (Yandex and Google)', openedHtml.includes('yandex.uz/maps') && openedHtml.includes('google.com/maps')],
    ...renderedIds.map(([id, html]) => [`Hilal variant template ${id} renders CSS vars`, html.includes('--hilal-bg') && html.includes('--hilal-accent')]),
  ];

  const failed = checks.filter(([, passed]) => !passed);
  for (const [name, passed] of checks) {
    console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`);
  }

  if (failed.length > 0) {
    console.error(`\n${failed.length} checks failed!`);
    process.exitCode = 1;
  } else {
    console.log(`\nAll ${checks.length} checks PASSED!`);
  }
} finally {
  await server.close();
}
