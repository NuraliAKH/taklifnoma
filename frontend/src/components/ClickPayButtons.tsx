import React from 'react';

interface ClickPayButtonsProps {
  orderId: string;
  amount: number;
  clickUpUrl?: string;
  clickCardUrl?: string;
  onPaymentInitiated?: () => void;
}

export const ClickPayButtons: React.FC<ClickPayButtonsProps> = ({
  orderId,
  amount,
  clickUpUrl,
  clickCardUrl,
  onPaymentInitiated,
}) => {
  // Service configuration
  const serviceId = '108456';
  const merchantId = '63342';

  const defaultUpUrl = clickUpUrl || `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount}&transaction_param=${orderId}`;
  const defaultCardUrl = clickCardUrl || defaultUpUrl;

  const formattedAmount = new Intl.NumberFormat('ru-RU').format(amount);

  const handlePayClick = (url: string) => {
    if (onPaymentInitiated) {
      onPaymentInitiated();
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl text-white space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-slate-100">
          Выберите способ оплаты
        </h3>
        <p className="text-sm text-slate-400">
          Сумма к оплате: <span className="font-bold text-sky-400">{formattedAmount} сум</span>
        </p>
      </div>

      {/* Payment Buttons Container */}
      <div className="space-y-3.5">
        {/* Button 1: Click UP / App */}
        <button
          onClick={() => handlePayClick(defaultUpUrl)}
          className="group relative w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-sky-600/20 hover:shadow-sky-500/30 transition-all duration-300 transform active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <span className="font-extrabold text-sm tracking-wider text-white">CLICK</span>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Оплатить через CLICK</div>
              <div className="text-xs text-sky-100/80">Оплата через приложение Click Up</div>
            </div>
          </div>
          <svg className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Button 2: Pay by Card */}
        <button
          onClick={() => handlePayClick(defaultCardUrl)}
          className="group relative w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-white font-medium shadow-md transition-all duration-300 transform active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-100">Оплата любой картой</div>
              <div className="text-xs text-slate-400">Uzcard / Humo без регистрации</div>
            </div>
          </div>
          <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Security Footer Notice */}
      <div className="pt-2 flex items-center justify-center text-xs text-slate-500 space-x-1.5">
        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Безопасное соединение и фискализация чека через Click</span>
      </div>
    </div>
  );
};
