import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../App';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      if (auth?.setTokenAndFetchUser) {
        auth.setTokenAndFetchUser(token)
          .then(() => {
            navigate('/cabinet', { replace: true });
          })
          .catch(() => {
            navigate('/login', { replace: true });
          });
      } else {
        localStorage.setItem('token', token);
        window.location.href = '/cabinet';
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, auth]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-6 text-center">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
      <h2 className="text-lg font-bold">Авторизация через Google...</h2>
      <p className="text-xs text-slate-400 mt-2">Пожалуйста, подождите, выполняем вход в систему.</p>
    </div>
  );
};
