export type SectionVisibilityChecker = (id: string, legacyFlag?: boolean) => boolean;

const GIFT_ALIASES = ['giftCard', 'gift'] as const;
const VENUE_ALIASES = ['dateVenue', 'venue', 'calendar'] as const;
const PHOTO_ALIASES = ['photo', 'couple', 'showHeroPhoto'] as const;

/**
 * Creates a section visibility predicate function taking aliases into account:
 * - giftCard | gift
 * - dateVenue | venue | calendar
 * - photo | couple | showHeroPhoto
 */
export function createSectionVisibility(hiddenSections?: string[]): SectionVisibilityChecker {
  const hidden = hiddenSections || [];
  const hiddenSet = new Set(hidden);

  const hasGiftHidden = GIFT_ALIASES.some((alias) => hiddenSet.has(alias));
  const hasVenueHidden = VENUE_ALIASES.some((alias) => hiddenSet.has(alias));
  const hasPhotoHidden = PHOTO_ALIASES.some((alias) => hiddenSet.has(alias));

  return (sectionKey: string, legacyFlag?: boolean): boolean => {
    if (legacyFlag === false) return false;
    if (hiddenSet.has(sectionKey)) return false;

    if (GIFT_ALIASES.includes(sectionKey as (typeof GIFT_ALIASES)[number]) && hasGiftHidden) {
      return false;
    }
    if (VENUE_ALIASES.includes(sectionKey as (typeof VENUE_ALIASES)[number]) && hasVenueHidden) {
      return false;
    }
    if (PHOTO_ALIASES.includes(sectionKey as (typeof PHOTO_ALIASES)[number]) && hasPhotoHidden) {
      return false;
    }

    return true;
  };
}
