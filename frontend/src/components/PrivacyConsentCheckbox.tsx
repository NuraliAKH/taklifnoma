import React from 'react';

export interface PrivacyConsentCheckboxProps {
  lang?: 'ru' | 'uz' | 'en';
  className?: string;
  checkboxClassName?: string;
  linkClassName?: string;
}

export function PrivacyConsentCheckbox({
  lang = 'ru',
  className = 'flex items-start gap-2 text-left text-xs leading-relaxed opacity-80',
  checkboxClassName = 'mt-0.5 h-3.5 w-3.5 shrink-0 accent-amber-500',
  linkClassName = 'underline underline-offset-2'
}: PrivacyConsentCheckboxProps) {
  if (lang === 'uz') {
    return (
      <label className={className}>
        <input type="checkbox" required className={checkboxClassName} />
        <span>
          Shaxsiy ma'lumotlarni qayta ishlashga va{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className={linkClassName}>
            maxfiylik siyosatiga
          </a>{' '}
          roziman.
        </span>
      </label>
    );
  }

  if (lang === 'en') {
    return (
      <label className={className}>
        <input type="checkbox" required className={checkboxClassName} />
        <span>
          I agree to the processing of personal data and the{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className={linkClassName}>
            privacy policy
          </a>.
        </span>
      </label>
    );
  }

  // Default: Russian
  return (
    <label className={className}>
      <input type="checkbox" required className={checkboxClassName} />
      <span>
        Я согласен(на) с обработкой персональных данных и{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className={linkClassName}>
          политикой конфиденциальности
        </a>.
      </span>
    </label>
  );
}
