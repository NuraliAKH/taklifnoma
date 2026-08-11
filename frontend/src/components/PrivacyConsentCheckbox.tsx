export function PrivacyConsentCheckbox() {
  return (
    <label className="flex items-start gap-2 text-left text-[10px] leading-relaxed opacity-75">
      <input type="checkbox" required className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-amber-500" />
      <span>
        Я согласен(на) с обработкой персональных данных и{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">политикой конфиденциальности</a>.
      </span>
    </label>
  );
}
