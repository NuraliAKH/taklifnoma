import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const { OliveEnvelopeWeddingSite } = await server.ssrLoadModule(
    '/src/templates/sites/OliveEnvelopeWeddingSite.tsx',
  );
  const { siteTemplatesRegistry } = await server.ssrLoadModule('/src/templates/sites/index.ts');

  const data = {
    groomName: 'Даниил',
    brideName: 'Анна',
    date: '2026-08-12',
    time: '17:00',
    venue: 'Villa Verde',
    address: 'Ташкент, ул. Амира Темура, 108',
  };

  const closedHtml = renderToString(
    React.createElement(OliveEnvelopeWeddingSite, { data, isOpened: false }),
  );
  const openedHtml = renderToString(
    React.createElement(OliveEnvelopeWeddingSite, { data, isOpened: true }),
  );
  const previewHtml = renderToString(
    React.createElement(OliveEnvelopeWeddingSite, { data, isOpened: false, isPreview: true }),
  );
  const customizedHtml = renderToString(
    React.createElement(OliveEnvelopeWeddingSite, {
      data: {
        ...data,
        photoUrl: '/custom-hero.jpg',
        photos: ['/custom-venue.jpg', '/custom-details.jpg'],
        loveStory: 'CUSTOM GUEST LETTER',
        details: 'CUSTOM DETAILS TEXT',
        phone: '+998 90 000 00 00',
      },
      isOpened: true,
    }),
  );
  const localizedHtml = Object.fromEntries(
    ['ru', 'uz', 'en'].map((lang) => [
      lang,
      renderToString(React.createElement(OliveEnvelopeWeddingSite, { data: {}, lang, isOpened: true })),
    ]),
  );
  const paletteVariants = [
    [26, 'olive-palette-emerald'],
    [27, 'olive-palette-champagne'],
    [28, 'olive-palette-dusty-rose'],
    [29, 'olive-palette-dusty-blue'],
    [30, 'olive-palette-navy'],
    [31, 'olive-palette-burgundy'],
  ];
  const paletteHtml = paletteVariants.map(([id, className]) => {
    const VariantComponent = siteTemplatesRegistry[id];
    return [id, className, renderToString(React.createElement(VariantComponent, { data, isOpened: false }))];
  });

  const checks = [
    ['closed envelope', closedHtml.includes('olive-envelope')],
    ['open invitation control', closedHtml.includes('Открыть приглашение')],
    ['phone-sized preview cover', previewHtml.includes('h-[640px]')],
    ['couple names', openedHtml.includes('Даниил') && openedHtml.includes('Анна')],
    ['project hero asset', openedHtml.includes('/olive-editorial-hero.webp')],
    ['guest letter screen', openedHtml.includes('id="letter"')],
    ['editorial calendar', openedHtml.includes('olive-date-grid')],
    ['marked date screen', openedHtml.includes('id="date"')],
    ['animated schedule route', openedHtml.includes('olive-route-line')],
    ['timeline screen', openedHtml.includes('id="timeline"')],
    ['reference schedule times', ['17:00', '17:30', '18:00', '22:00', '23:00'].every((time) => openedHtml.includes(time))],
    ['venue section', openedHtml.includes('Villa Verde')],
    ['project venue asset', openedHtml.includes('/olive-editorial-venue.webp')],
    ['dress code', openedHtml.includes('Дресс-код')],
    ['details section', openedHtml.includes('Детали')],
    ['project details asset', openedHtml.includes('/olive-editorial-details.webp')],
    ['RSVP form', openedHtml.includes('Анкета гостя')],
    ['guest count field', openedHtml.includes('Количество гостей')],
    ['map removed', !openedHtml.includes('olive-map-frame') && !openedHtml.includes('id="map"')],
    ['custom hero field is used', customizedHtml.includes('/custom-hero.jpg')],
    ['both custom gallery images are used', customizedHtml.includes('/custom-venue.jpg') && customizedHtml.includes('/custom-details.jpg')],
    ['custom guest letter is used', customizedHtml.includes('CUSTOM GUEST LETTER')],
    ['custom details text is used', customizedHtml.includes('CUSTOM DETAILS TEXT')],
    ['custom organizer phone is used', customizedHtml.includes('+998 90 000 00 00')],
    ['three-language switcher', ['ru', 'uz', 'en'].every((lang) => localizedHtml.ru.includes(`>${lang}</button>`))],
    ['Russian interface is complete', ['Приглашение на свадьбу', 'До нашей встречи', 'Количество гостей', 'Церемония'].every((text) => localizedHtml.ru.includes(text))],
    ['Uzbek interface is complete', ['To‘yga taklifnoma', 'Uchrashuvimizgacha', 'Mehmonlar soni', 'Marosim'].every((text) => localizedHtml.uz.includes(text))],
    ['English interface is complete', ['Wedding invitation', 'Until we meet', 'Number of guests', 'Ceremony'].every((text) => localizedHtml.en.includes(text))],
    ...paletteHtml.map(([id, className, html]) => [`palette template ${id}`, html.includes(className)]),
  ];

  const failed = checks.filter(([, passed]) => !passed);
  for (const [name, passed] of checks) {
    console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`);
  }

  if (failed.length > 0) process.exitCode = 1;
} finally {
  await server.close();
}
