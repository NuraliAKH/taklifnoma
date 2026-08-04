import React from 'react';
import { SimpleWeddingSite } from './SimpleWeddingSite';
import { MarmarWeddingSite } from './MarmarWeddingSite';
import { AnorWeddingSite } from './AnorWeddingSite';
import { HilalWeddingSite } from './HilalWeddingSite';
import { TaklifetPinkSite } from './TaklifetPinkSite';
import { MalikaUlugbekWeddingSite } from './MalikaUlugbekWeddingSite';
import type { WebsiteTemplateProps } from './types';

const BirthdayCelebrationSite: React.FC<WebsiteTemplateProps> = (props) =>
  React.createElement(SimpleWeddingSite, { ...props, visualVariant: 'birthday' });

const SapphireHilalWeddingSite: React.FC<WebsiteTemplateProps> = (props) =>
  React.createElement(HilalWeddingSite, { ...props, visualVariant: 'sapphire' });

const RoseHilalWeddingSite: React.FC<WebsiteTemplateProps> = (props) =>
  React.createElement(HilalWeddingSite, { ...props, visualVariant: 'rose' });

// Map of Template ID / Slug to Component
export const siteTemplatesRegistry: Record<string | number, React.ComponentType<WebsiteTemplateProps>> = {
  // Template ID 4: Zar Atlas Web
  4: SimpleWeddingSite,
  'zar-atlas': SimpleWeddingSite,
  'zar_atlas': SimpleWeddingSite,
  
  // Template ID 5: Marmar Web
  5: MarmarWeddingSite,
  'marmar': MarmarWeddingSite,

  // Template ID 6: Anor Web
  6: AnorWeddingSite,
  'anor': AnorWeddingSite,

  // Template ID 7: Hilal Emerald Islamic Web
  7: HilalWeddingSite,
  'hilal': HilalWeddingSite,
  'emerald': HilalWeddingSite,

  // Template ID 11: Sapphire & silver Hilal variation
  11: SapphireHilalWeddingSite,
  'sapphire-hilal': SapphireHilalWeddingSite,

  // Template ID 12: Rose & blush Hilal variation
  12: RoseHilalWeddingSite,
  'rose-hilal': RoseHilalWeddingSite,

  // Template ID 8: Taklifet Pink Lavender Floral Web
  8: TaklifetPinkSite,
  'taklifet-pink': TaklifetPinkSite,
  'flower': TaklifetPinkSite,
  'pink': TaklifetPinkSite,

  // Template ID 9: Malika & Ulugbek Silk Gold Luxury Web
  9: MalikaUlugbekWeddingSite,
  'malika-ulugbek': MalikaUlugbekWeddingSite,
  'gold-silk': MalikaUlugbekWeddingSite,
  'silk': MalikaUlugbekWeddingSite,

  // Template ID 10: Violet birthday variation
  10: BirthdayCelebrationSite,
  'violet-birthday': BirthdayCelebrationSite,

  simple: SimpleWeddingSite,
  default: SimpleWeddingSite,
};

export interface DispatcherProps extends WebsiteTemplateProps {
  templateId?: number | string;
}

export const WebsiteTemplateDispatcher: React.FC<DispatcherProps> = ({
  templateId,
  ...props
}) => {
  const Component: React.ComponentType<WebsiteTemplateProps> = 
    (templateId && siteTemplatesRegistry[templateId])
      ? siteTemplatesRegistry[templateId]
      : SimpleWeddingSite;

  return React.createElement(Component, props);
};

export * from './types';
export * from './SimpleWeddingSite';
export * from './MarmarWeddingSite';
export * from './AnorWeddingSite';
export * from './HilalWeddingSite';
export * from './TaklifetPinkSite';
export * from './MalikaUlugbekWeddingSite';
