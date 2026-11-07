export interface CalendarEvent {
  title: string;
  start: Date;
  durationMinutes?: number;
  location?: string;
  description?: string;
}

function formatIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcsText(text?: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generates an .ics file in browser and triggers download.
 * Uses standard RFC 5545 UTC timestamps and character escaping.
 */
export function downloadIcs(event: CalendarEvent): void {
  const { title, start, durationMinutes = 180, location, description } = event;
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const now = new Date();

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Web-Taklifnoma//NONSGML v1.0//UZ',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).slice(2, 9)}@web-taklifnoma.uz`,
    `DTSTAMP:${formatIcsUtc(now)}`,
    `DTSTART:${formatIcsUtc(start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    location ? `LOCATION:${escapeIcsText(location)}` : '',
    description ? `DESCRIPTION:${escapeIcsText(description)}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  const icsContent = lines.join('\r\n');
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeFilename = title.trim().replace(/[^a-zA-Z0-9а-яА-ЯёЁoʻgʻOʻGʻ_-]+/g, '_') || 'invitation';
  a.download = `${safeFilename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates direct Google Calendar "Add to Calendar" URL.
 */
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const { title, start, durationMinutes = 180, location, description } = event;
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const dates = `${formatIcsUtc(start)}/${formatIcsUtc(end)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates,
  });

  if (location) params.set('location', location);
  if (description) params.set('details', description);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
