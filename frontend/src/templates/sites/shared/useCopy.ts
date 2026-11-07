import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * Hook for copying text to clipboard.
 * Supports modern navigator.clipboard with reliable textarea + execCommand fallback
 * for restricted WebViews (Telegram, WhatsApp, in-app browsers).
 */
export function useCopyToClipboard(timeoutMs = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const fallbackCopy = (val: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = val;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, val.length);
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      return false;
    }
  };

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false;

      let ok = false;
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch {
          ok = fallbackCopy(text);
        }
      } else {
        ok = fallbackCopy(text);
      }

      if (ok) {
        setCopied(true);
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
          setCopied(false);
        }, timeoutMs);
      }

      return ok;
    },
    [timeoutMs]
  );

  return { copied, copy };
}
