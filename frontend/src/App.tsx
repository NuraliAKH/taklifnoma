import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useParams, 
  useSearchParams,
  Navigate
} from 'react-router-dom';
import { 
  Globe,
  Heart,
  Image as ImageIcon, 
  Video as VideoIcon, 
  Download, 
  Loader2, 
  Sliders, 
  ArrowLeft, 
  Eye, 
  CheckCircle2, 
  Printer,
  ChevronRight,
  User as UserIcon,
  LogOut,
  Shield,
  KeyRound,
  Mail,
  Lock,
  History,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Upload,
  X,
  Sun,
  Moon,
  Sparkles,
  Zap,
  MapPin,
  Music,
  ChevronDown,
  Star,
  MessageSquare,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebsiteTemplateDispatcher } from './templates/sites';
import { HeroThreeCanvas } from './components/HeroThreeCanvas';
import { ClickPayButtons } from './components/ClickPayButtons';
import { parseEventDateTime, calculateTimeLeft, useCountdownTimer } from './utils/timer';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// ----------------- THEME CONTEXT -----------------
type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('app-theme') as ThemeMode;
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (!digits) return value;

  let numberPart = digits;
  if (digits.startsWith('998')) {
    numberPart = digits.slice(3);
  }
  
  numberPart = numberPart.slice(0, 9);
  
  let result = '+998';
  if (numberPart.length > 0) {
    result += ` (${numberPart.slice(0, 2)}`;
  }
  if (numberPart.length > 2) {
    result += `) ${numberPart.slice(2, 5)}`;
  }
  if (numberPart.length > 5) {
    result += `-${numberPart.slice(5, 7)}`;
  }
  if (numberPart.length > 7) {
    result += `-${numberPart.slice(7, 9)}`;
  }
  
  return numberPart.length === 0 ? value : result;
};

// Interfaces
interface Template {
  id: number;
  type: 'virtual' | 'physical' | 'website';
  category: string;
  media_url: string;
  price: number;
  discount_price: number | null;
  text_config: {
    dimensions: { width: number; height: number };
    fields: {
      id: string;
      label: string;
      placeholder: string;
      fontFamily: string;
      fontSize: number;
      color: string;
      x: number;
      y: number;
      align: 'left' | 'center' | 'right';
      maxLength?: number;
    }[];
  };
}

interface Order {
  id: string;
  user_data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  final_asset_url: string | null;
  total_price: number;
  createdAt: string;
  template: Template;
  user?: {
    email: string;
  };
}

interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

// ----------------- AUTH CONTEXT -----------------
interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearError = () => setError(null);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Ошибка входа');
      }
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Ошибка регистрации');
      }
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, error, loading, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

// ----------------- ROUTE GUARDS -----------------
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Helper to resolve media URLs
const getMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  const serverHost = API_URL.replace(/\/api\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${serverHost}${cleanPath}`;
};

const getTemplateName = (t: Template) => {
  if (t.id === 1) return 'Классическое Золото';
  if (t.id === 2) return 'Праздничный Розовый';
  if (t.id === 3) return 'Минималистичное Видео';
  if (t.id === 4) return 'Zar Atlas Web (Сайт)';
  if (t.id === 5) return 'Marmar Web (Сайт)';
  if (t.id === 6) return 'Anor Web (Сайт)';
  if (t.id === 7) return 'Hilal Web (Сайт)';
  if (t.id === 8) return 'Taklifet Pink Floral Web (Сайт)';
  
  const categoryRu = t.category === 'wedding' ? 'Свадебное' : t.category === 'birthday' ? 'День Рождения' : t.category;
  const typeRu = t.type === 'physical' ? '(Печать)' : t.type === 'website' ? '(Сайт)' : '(Электронное)';
  return `Макет #${t.id} - ${categoryRu} ${typeRu}`;
};

// ----------------- ROOT LAYOUT -----------------
function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 selection:bg-amber-500 selection:text-slate-900 relative ${
      isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Full Page WebGL 3D Interactive Background */}
      <HeroThreeCanvas isDark={isDark} />

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b py-4 px-6 md:px-12 flex justify-between items-center transition-colors duration-300 backdrop-blur-md ${
        isDark ? 'bg-[#090d16]/80 border-white/5 text-slate-100' : 'bg-white/80 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <Heart className="w-6 h-6 text-amber-400 fill-amber-400/20" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider gold-gradient-text">WEB-TAKLIFNOMA</h1>
            <p className="text-[10px] text-amber-500/70 tracking-widest font-medium uppercase">Премиум Web-Приглашения</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 md:gap-3">
          <Link to="/" className={`px-3 py-2 text-sm font-semibold transition-colors ${
            isDark ? 'text-slate-300 hover:text-slate-100' : 'text-slate-700 hover:text-slate-950'
          }`}>
            Каталог
          </Link>
          
          {/* Day / Night Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 px-3.5 rounded-xl border transition-all flex items-center gap-2 text-sm font-semibold cursor-pointer ${
              isDark 
                ? 'bg-slate-900/80 border-amber-500/30 text-amber-400 hover:bg-slate-800 hover:border-amber-400 shadow-lg' 
                : 'bg-amber-50 border-amber-500/40 text-amber-800 hover:bg-amber-100 shadow-sm'
            }`}
            title={isDark ? 'Включить дневной режим' : 'Включить ночной режим'}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="hidden sm:inline text-xs font-bold text-amber-300">День</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline text-xs font-bold text-amber-700">Ночь</span>
              </>
            )}
          </button>

          {user ? (
            <>
              <Link 
                to="/cabinet" 
                className={`px-4 py-2 border rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300 hover:text-slate-100' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
                }`}
              >
                <UserIcon className="w-4 h-4" /> Кабинет
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-400 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Shield className="w-4 h-4" /> Админка
                </Link>
              )}
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className={`p-2 border rounded-lg transition-all ${
                  isDark
                    ? 'bg-white/5 hover:bg-rose-500/15 border-white/5 hover:border-rose-500/25 text-slate-400 hover:text-rose-400'
                    : 'bg-slate-100 hover:bg-rose-100 border-slate-300 hover:border-rose-300 text-slate-600 hover:text-rose-600'
                }`}
                title="Выйти"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2 bg-amber-500 text-slate-950 text-sm font-bold rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-amber-500/15 hover:bg-amber-400"
            >
              Войти
            </Link>
          )}
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col z-10 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className={`py-6 border-t text-center text-xs mt-12 z-10 relative backdrop-blur-sm transition-colors duration-300 ${
        isDark ? 'border-white/5 text-slate-500 bg-slate-950/80' : 'border-slate-200 text-slate-500 bg-white/80'
      }`}>
        © 2026 web-taklifnoma.uz. Все права защищены.
      </footer>
    </div>
  );
}

// ----------------- APPLICATION CONTAINER -----------------
export function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Layout><CatalogPage /></Layout>} />
      <Route path="/editor/:id" element={<Layout><EditorPage /></Layout>} />
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
      <Route path="/invite/:id" element={<InvitationPage />} />
      
      {/* Protected User Dashboard */}
      <Route 
        path="/cabinet" 
        element={
          <ProtectedRoute>
            <Layout>
              <CabinetPage />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Protected Admin Board */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <Layout>
              <AdminPage />
            </Layout>
          </AdminRoute>
        } 
      />

      {/* Redirect fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

// ----------------- CATALOG PAGE -----------------
function CatalogPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('website');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetch(`${API_URL}/templates`)
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error(err));
  }, []);

  const filteredTemplates = templates.filter(t => {
    // Exclude video templates completely
    if (t.media_url?.endsWith('.mp4')) return false;

    const matchCategory = categoryFilter === 'all' || t.category === categoryFilter || t.type === 'website';
    const matchType = 
      typeFilter === 'all' || 
      (typeFilter === 'virtual_photo' && t.type === 'virtual') ||
      (typeFilter === 'physical' && t.type === 'physical') ||
      (typeFilter === 'website' && t.type === 'website');
    return matchCategory && matchType;
  });

  const faqItems = [
    {
      q: 'Как гости открывают онлайн таклифному?',
      a: 'Вы отправляете гостям персональную веб-ссылку через Telegram, WhatsApp или SMS. Гости открывают её на смартфоне или компьютере без установки любых приложений.'
    },
    {
      q: 'Как работает сбор ответов (RSVP)?',
      a: 'Гости выбирают, придут ли они на мероприятие, и указывают количество человек. Все ответы мгновенно сохраняются и отображаются в вашем личном кабинете.'
    },
    {
      q: 'Можно ли добавить свою музыку и фото?',
      a: 'Да! В редакторе сайтов-пригласительных вы можете загрузить собственные фотографии, выбрать фоновую песню и изменить текст приглашения.'
    },
    {
      q: 'Сколько времени доступен готовый сайт?',
      a: 'Ваше веб-приглашение будет активно до и после проведения вашего торжества.'
    }
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-16 flex-1 relative">
      {/* Glow background highlight */}
      <div className="glow-ambient w-96 h-96 bg-amber-500 top-0 left-1/4 -z-10" />

      {/* Hero Header Section */}
      <section className="py-6 md:py-10 flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="flex flex-col gap-5 max-w-2xl text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className={`border text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-widest backdrop-blur-md shadow-lg flex items-center gap-2 ${
              isDark 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-amber-100 text-amber-800 border-amber-400/50'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Электронная Таклифнома #1 в Узбекистане
            </span>
          </div>

          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight transition-colors ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Создайте <span className="gold-gradient-text">стильный сайт-приглашение</span> на свадьбу за 1 минуту
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed max-w-xl transition-colors ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Интерактивные веб-пригласительные с RSVP-подтверждением гостей, Яндекс/Google картами, таймером отсчета и фоновой музыкой.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Мгновенный редактор
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <MapPin className="w-3.5 h-3.5 text-teal-400" /> Навигатор для гостей
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <Music className="w-3.5 h-3.5 text-rose-400" /> Фоновая музыка
            </span>
          </div>
        </div>

        {/* Stats Card */}
        <div className={`flex gap-6 items-center p-6 rounded-2xl backdrop-blur-xl shadow-2xl shrink-0 transition-all border ${
          isDark 
            ? 'bg-slate-900/70 border-amber-500/20 text-slate-100' 
            : 'bg-white/90 border-amber-500/30 text-slate-900'
        }`}>
          <div className="flex flex-col items-center border-r border-slate-500/20 pr-6">
            <span className="text-3xl font-extrabold text-amber-500 font-mono">1 мин</span>
            <span className={`text-[11px] font-medium uppercase tracking-wider mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Готовность</span>
          </div>
          <div className="flex flex-col items-center pr-6 border-r border-slate-500/20">
            <span className="text-3xl font-extrabold text-amber-500 font-mono">100%</span>
            <span className={`text-[11px] font-medium uppercase tracking-wider mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Интерактивно</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="text-2xl font-bold font-mono">4.9</span>
            </div>
            <span className={`text-[11px] font-medium uppercase tracking-wider mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Отзывы</span>
          </div>
        </div>
      </section>

      {/* Catalog Filters Section */}
      <section className="flex flex-col gap-6">
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-6 transition-colors ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex flex-col gap-1">
            <h2 className={`text-xl font-bold tracking-wide ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Каталог шаблонов
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Выберите готовый стиль для вашего праздника
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex p-1 rounded-xl border gap-1 transition-colors ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200/70 border-slate-300/80'
            }`}>
              {[
                { id: 'virtual_photo', label: 'Электронные фото', disabled: false },
                { id: 'website', label: 'Сайты-приглашения', disabled: false },
                { id: 'physical', label: 'Макеты для печати', disabled: true }
              ].map(item => (
                <button 
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => !item.disabled && setTypeFilter(item.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                    item.disabled
                      ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-500/10 border border-slate-500/20'
                      : typeFilter === item.id 
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold cursor-pointer' 
                        : isDark ? 'text-slate-400 hover:text-slate-200 cursor-pointer' : 'text-slate-600 hover:text-slate-900 cursor-pointer'
                  }`}
                  title={item.disabled ? 'Раздел временно недоступен' : undefined}
                >
                  {item.label}
                  {item.disabled && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                      Скоро
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className={`flex p-1 rounded-xl border gap-1 transition-colors ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200/70 border-slate-300/80'
            }`}>
              {[
                { id: 'all', label: 'Все категории' },
                { id: 'wedding', label: 'Свадьба' },
                { id: 'birthday', label: 'День рождения' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setCategoryFilter(item.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    categoryFilter === item.id 
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold' 
                      : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div 
                key={template.id}
                onClick={() => navigate(`/editor/${template.id}`)}
                className="group rounded-2xl overflow-hidden glass-panel-interactive flex flex-col cursor-pointer"
              >
                <div className="aspect-[3/4] w-full bg-slate-900/40 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  {/* Transparent Overlay */}
                  <div className="absolute inset-0 z-20 cursor-pointer" />

                  {template.type === 'website' ? (
                    <div className="scale-[0.66] origin-center shrink-0 pointer-events-none">
                      <TemplatePreview 
                        template={template} 
                        formData={{}} 
                        autoScrollOnHover={true}
                      />
                    </div>
                  ) : (
                    <img 
                      src={getMediaUrl(template.media_url)} 
                      alt={template.category} 
                      className="w-full h-full object-cover scale-100 group-hover:scale-[1.04] transition-all duration-500"
                    />
                  )}

                  <div className="absolute top-4 left-4 z-30 pointer-events-none">
                    {template.type === 'website' ? (
                      <span className="flex items-center gap-1 bg-teal-500/90 text-teal-950 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-teal-400/30 backdrop-blur-md shadow-md">
                        <Globe className="w-3 h-3" /> Web-Сайт
                      </span>
                    ) : template.type === 'physical' ? (
                      <span className="flex items-center gap-1 bg-pink-500/90 text-pink-950 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-pink-400/30 backdrop-blur-md shadow-md">
                        <Printer className="w-3 h-3" /> Печать (A5)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-amber-500/90 text-amber-950 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-md shadow-md">
                        <ImageIcon className="w-3 h-3" /> Фото-карточка
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3 flex-1 justify-between bg-gradient-to-b from-transparent to-black/10">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className={`font-bold text-base tracking-wide transition-colors truncate max-w-[190px] ${
                        isDark ? 'text-slate-100 group-hover:text-amber-400' : 'text-slate-900 group-hover:text-amber-600'
                      }`}>
                        {getTemplateName(template)}
                      </h3>
                      <span className={`text-[10px] border px-2 py-0.5 rounded-full tracking-wider capitalize shrink-0 ${
                        isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                        {template.category === 'wedding' ? 'Свадебный' : template.category === 'birthday' ? 'День рождения' : template.category}
                      </span>
                    </div>
                    {template.type === 'website' ? (
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Формат: Адаптивный веб-сайт</p>
                    ) : (
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Размер: {template.text_config.dimensions?.width}x{template.text_config.dimensions?.height} px</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                    <div className="flex flex-col">
                      {template.discount_price !== null && template.discount_price !== undefined ? (
                        <>
                          <span className="text-[10px] text-slate-500 line-through font-mono">
                            {Number(template.price).toLocaleString('ru-RU')} сум
                          </span>
                          <span className="text-sm font-bold font-mono text-amber-400">
                            {Number(template.discount_price).toLocaleString('ru-RU')} сум
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold font-mono text-amber-400">
                          {Number(template.price || 0).toLocaleString('ru-RU')} сум
                        </span>
                      )}
                    </div>

                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      Создать <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3">
            <p className="text-slate-400 text-sm">Шаблоны не найдены</p>
          </div>
        )}
      </section>

      {/* Advantages Section */}
      <section className="py-8 flex flex-col gap-8 border-t border-white/10 pt-12">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Почему выбирают <span className="gold-gradient-text">Web-Taklifnoma</span>
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Самый удобный способ пригласить родных и близких на главное событие вашей жизни
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6 text-amber-400" />,
              title: 'Мгновенное редактирование',
              desc: 'Меняйте имена, дату, время и фотографии прямо в браузере за 1 минуту.'
            },
            {
              icon: <MessageSquare className="w-6 h-6 text-teal-400" />,
              title: 'Сбор ответов гостей (RSVP)',
              desc: 'Гости легко подтверждают присутствие, а вы сразу видите список в кабинете.'
            },
            {
              icon: <MapPin className="w-6 h-6 text-rose-400" />,
              title: 'Интерактивная навигация',
              desc: 'Прямые ссылки на Яндекс.Карты и Google Maps для быстрой ориентации гостей.'
            },
            {
              icon: <Music className="w-6 h-6 text-indigo-400" />,
              title: 'Музыка и обратный отсчет',
              desc: 'Романтичное звуковое сопровождение и таймер отсчета до дня торжества.'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-2xl border flex flex-col gap-3 transition-all ${
                isDark 
                  ? 'bg-slate-900/50 border-white/5 hover:border-amber-500/30' 
                  : 'bg-white/80 border-slate-200 hover:border-amber-500/40 shadow-sm'
              }`}
            >
              <div className="p-3 bg-white/5 rounded-xl w-fit border border-white/10">
                {item.icon}
              </div>
              <h3 className={`font-bold text-base ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {item.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Step by Step Section */}
      <section className="py-8 flex flex-col gap-8 border-t border-white/10 pt-12">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            3 простых шага к <span className="gold-gradient-text">вашему приглашению</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Выберите стиль',
              desc: 'Ознакомьтесь с премиум макетами (Hilal, Anor, Marmar, Taklifet) и кликните "Настроить".'
            },
            {
              step: '02',
              title: 'Заполните детали',
              desc: 'Внесите имена молодоженов, дату, время, место ресторана и загрузите фото.'
            },
            {
              step: '03',
              title: 'Отправьте ссылку',
              desc: 'Скопируйте уникальную ссылку и отправьте её вашим гостям в Telegram или WhatsApp.'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-2xl border flex flex-col gap-3 relative overflow-hidden ${
                isDark ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-4xl font-extrabold font-mono text-amber-500/20 absolute top-4 right-4">
                {item.step}
              </span>
              <h3 className={`font-bold text-lg ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {item.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-8 flex flex-col gap-8 border-t border-white/10 pt-12">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Часто задаваемые вопросы (FAQ)
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Всё, что вам нужно знать об онлайн-пригласительных Web-Taklifnoma
          </p>
        </div>

        <div className="max-w-3xl mx-auto w-full flex flex-col gap-3">
          {faqItems.map((faq, idx) => (
            <div 
              key={idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 md:p-5 text-left flex justify-between items-center gap-4 cursor-pointer font-bold text-sm md:text-base text-slate-100"
              >
                <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 shrink-0 text-amber-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className={`px-4 pb-5 md:px-5 text-xs md:text-sm leading-relaxed border-t pt-3 ${
                  isDark ? 'border-white/5 text-slate-400' : 'border-slate-100 text-slate-600'
                }`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ----------------- EDITOR PAGE -----------------
function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [previewTab, setPreviewTab] = useState<'opened' | 'cover'>('opened');

  // Promocode state
  const [promocodeInput, setPromocodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const handleApplyPromocode = async () => {
    if (!promocodeInput.trim() || !template) return;
    setIsValidatingPromo(true);
    setPromoError(null);
    try {
      const basePrice = template.discount_price !== null && template.discount_price !== undefined
        ? Number(template.discount_price)
        : Number(template.price);

      const res = await fetch(`${API_URL}/promocodes/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promocodeInput, orderAmount: basePrice }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Ошибка применения промокода');
      }

      setAppliedPromo(data);
    } catch (err: any) {
      setPromoError(err.message);
      setAppliedPromo(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const uploadMediaFile = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append('file', file);
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}/templates/upload`, {
      method: 'POST',
      headers,
      body: data
    });
    if (!res.ok) throw new Error('Ошибка при загрузке файла');
    const result = await res.json();
    return result.url;
  };

  const handleHeroPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const url = await uploadMediaFile(file);
      setFormData(prev => ({ ...prev, photoUrl: url }));
    } catch (err: any) {
      alert(err.message || 'Ошибка загрузки фото');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentPhotos = Array.isArray(formData.photos) ? formData.photos : [];
    const maxPhotos = (template?.id === 9 || template?.id === '9') ? 6 : 10;

    if (currentPhotos.length + files.length > maxPhotos) {
      alert(`Maksimal ${maxPhotos} ta rasm yuklash mumkin! Hozirda ${currentPhotos.length} ta rasm bor.`);
      return;
    }

    setUploadingMedia(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const u = await uploadMediaFile(file);
        urls.push(u);
      }
      setFormData(prev => ({
        ...prev,
        photos: [...(Array.isArray(prev.photos) ? prev.photos : []), ...urls]
      }));
    } catch (err: any) {
      alert(err.message || 'Ошибка загрузки галереи');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const url = await uploadMediaFile(file);
      setFormData(prev => ({ ...prev, videoUrl: url }));
    } catch (err: any) {
      alert(err.message || 'Ошибка загрузки видео');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Load template data
  useEffect(() => {
    fetch(`${API_URL}/templates/${id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setTemplate(data);
        const fields = data.text_config?.fields || [];
        if (data.type === 'website') {
          const hasPhoto = fields.some((f: any) => f.id === 'photoUrl' || f.type === 'image');
          const hasGallery = fields.some((f: any) => f.id === 'photos' || f.type === 'gallery');
          const extraFields = [...fields];
          if (!hasPhoto) {
            extraFields.push({ id: 'photoUrl', label: 'Главное фото молодожёнов', type: 'image' });
          }
          if (!hasGallery) {
            extraFields.push({
              id: 'photos',
              label: 'Галерея фотографий',
              type: 'gallery',
              max: (data.id === 9 || data.id === '9') ? 6 : 10
            });
          }
          setCustomFields(extraFields);
        } else {
          setCustomFields(fields);
        }
        
        // Restore formData from sessionStorage if user was redirected from auth flow
        const savedForm = sessionStorage.getItem(`draft_order_${id}`);
        if (savedForm) {
          const parsed = JSON.parse(savedForm);
          setFormData(parsed);
          if (parsed._customFields) {
            setCustomFields(parsed._customFields);
          }
          sessionStorage.removeItem(`draft_order_${id}`);
        } else {
          const initialForm: Record<string, string> = {};
          data.text_config.fields.forEach((f: any) => {
            initialForm[f.id] = f.placeholder;
          });
          setFormData(initialForm);
        }
      })
      .catch(() => navigate('/'));
  }, [id, navigate]);

  const handleInputChange = (fieldId: string, val: string) => {
    let finalVal = val;
    if (fieldId === 'phone') {
      const prevVal = formData[fieldId] || '';
      if (val.length < prevVal.length) {
        const lastCharOfPrev = prevVal[prevVal.length - 1];
        if (/\D/.test(lastCharOfPrev)) {
          const digitsOnly = prevVal.replace(/\D/g, '');
          if (digitsOnly.length > 0) {
            const newDigits = digitsOnly.slice(0, -1);
            finalVal = newDigits;
          }
        }
      }
      finalVal = formatPhoneNumber(finalVal);
    }
    setFormData(prev => ({ ...prev, [fieldId]: finalVal }));
  };

  const handleAddUserField = () => {
    const label = window.prompt('Введите название нового поля (например, Дресс-код):');
    if (!label || !label.trim()) return;

    const id = `custom_${Date.now()}`;
    const newField = {
      id,
      label: label.trim(),
      placeholder: 'Введите значение...',
      fontFamily: 'Montserrat',
      fontSize: 16,
      color: '#333333',
      x: 600,
      y: 1200,
      align: 'center',
      maxLength: 100
    };

    setCustomFields(prev => [...prev, newField]);
    setFormData(prev => ({ ...prev, [id]: '' }));
  };

  const handleRemoveUserField = (fieldId: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== fieldId));
    setFormData(prev => {
      const copy = { ...prev };
      delete copy[fieldId];
      return copy;
    });
  };

  const handleCreateOrder = async () => {
    if (!template) return;

    // Check Authorization before generation
    if (!token) {
      // Save customized fields so the user doesn't lose inputs!
      const draftData = {
        ...formData,
        _customFields: customFields
      };
      sessionStorage.setItem(`draft_order_${id}`, JSON.stringify(draftData));
      navigate(`/login?redirect=/editor/${id}`);
      return;
    }

    // Instantly open modal and set draft state to prevent delayed click feeling
    setIsSubmitting(true);
    setCurrentOrder({
      id: 'draft',
      status: 'pending',
      user_data: {
        ...formData,
        _customFields: customFields
      },
      final_asset_url: null,
      total_price: 0,
      createdAt: '',
      template
    } as any);

    const startTime = Date.now();
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          templateId: template.id,
          formData: {
            ...formData,
            _customFields: customFields
          },
          promocode: appliedPromo?.code,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.message || 'Ошибка генерации');
      
      // Calculate elapsed time and add a minimum of 1.2s delay for photo templates,
      // so the scanning animation is visible and looks high-quality.
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 1500 - elapsed);

      setTimeout(() => {
        setCurrentOrder(orderData);
        if (orderData.status === 'pending' || orderData.status === 'processing') {
          pollOrderStatus(orderData.id);
        }
      }, delay);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const pollOrderStatus = (orderId: string) => {
    const startTime = Date.now();
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${orderId}`);
        const orderData = await res.json();

        if (orderData.status === 'completed' || orderData.status === 'failed') {
          clearInterval(interval);
          const elapsed = Date.now() - startTime;
          const delay = Math.max(0, 1500 - elapsed);

          setTimeout(() => {
            setCurrentOrder(orderData);
          }, delay);
        } else {
          setCurrentOrder(orderData);
        }
      } catch (err) {
        clearInterval(interval);
        setIsSubmitting(false);
      }
    }, 2000);
  };

  const handleToggleSection = (sectionKey: string) => {
    setFormData(prev => {
      const currentHidden = Array.isArray(prev.hiddenSections) ? prev.hiddenSections : [];
      const updated = currentHidden.includes(sectionKey)
        ? currentHidden.filter((k: string) => k !== sectionKey)
        : [...currentHidden, sectionKey];
      return { ...prev, hiddenSections: updated };
    });
  };

  if (!template) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link 
        to="/" 
        className="flex items-center gap-2 self-start px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 transition-all text-xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Назад к каталогу
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Preview Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {template.type === 'website' && (
            <div className="flex items-center justify-center gap-2 font-sans text-xs">
              <button
                type="button"
                onClick={() => setPreviewTab('opened')}
                className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                  previewTab === 'opened' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Содержимое сайта
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('cover')}
                className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                  previewTab === 'cover' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Обложка (Конверт)
              </button>
            </div>
          )}
          <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/10 flex items-center justify-center p-4">
            <TemplatePreview 
              template={template} 
              formData={formData} 
              isOpened={previewTab === 'opened'}
              onToggleSection={handleToggleSection} 
            />
          </div>
          <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Live-превью в реальном времени
          </div>
        </div>

        {/* Right: Customization Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-semibold tracking-wide">Персонализация</h2>
                <p className="text-xs text-slate-400 mt-1">Внесите изменения в поля шаблона</p>
              </div>
              <Sliders className="w-5 h-5 text-amber-500" />
            </div>

            <div className="flex flex-col gap-5">
              {customFields.map(field => {
                const isImageField = field.type === 'image' || field.id === 'photoUrl' || field.id === 'heroPhoto';
                const isGalleryField = field.type === 'gallery' || field.id === 'photos';
                const isVideoField = field.type === 'video' || field.id === 'videoUrl';

                if (isImageField) {
                  return (
                    <div key={field.id} className="flex flex-col gap-2 relative">
                      <label className="text-xs font-semibold text-slate-300 flex justify-between items-center">
                        <span>{field.label || 'Главное фото'}</span>
                        {formData.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                            className="text-[10px] text-rose-400 hover:underline"
                          >
                            Удалить
                          </button>
                        )}
                      </label>
                      <div className="flex gap-2 items-center">
                        {formData.photoUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-slate-900">
                            <img src={getMediaUrl(formData.photoUrl)} alt="Hero" className="w-full h-full object-cover" />
                          </div>
                        ) : null}
                        <label className="flex-1 cursor-pointer py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-amber-400 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-all">
                          {uploadingMedia ? (
                            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 text-amber-400" />
                          )}
                          <span>{formData.photoUrl ? 'Заменить главное фото' : 'Загрузить фото'}</span>
                          <input type="file" accept="image/*" onChange={handleHeroPhotoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  );
                }

                if (isGalleryField) {
                  const maxCount = field.max || ((template?.id === 9 || template?.id === '9') ? 6 : 10);
                  return (
                    <div key={field.id} className="flex flex-col gap-2 relative">
                      <label className="text-xs font-semibold text-slate-300 flex justify-between items-center">
                        <span>{field.label || 'Галерея фотографий'}</span>
                        <span className="text-[10px] text-amber-400 font-mono">
                          {Array.isArray(formData.photos) ? formData.photos.length : 0} / {maxCount}
                        </span>
                      </label>
                      {Array.isArray(formData.photos) && formData.photos.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 my-1">
                          {formData.photos.map((pUrl: string, idx: number) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                              <img src={getMediaUrl(pUrl)} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    photos: (prev.photos as any || []).filter((_: any, i: number) => i !== idx)
                                  }));
                                }}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="cursor-pointer py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-amber-400 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-all">
                        {uploadingMedia ? (
                          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 text-amber-400" />
                        )}
                        <span>Добавить фото в галерею</span>
                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                      </label>
                    </div>
                  );
                }

                if (isVideoField) {
                  return (
                    <div key={field.id} className="flex flex-col gap-2 relative">
                      <label className="text-xs font-semibold text-slate-300 flex justify-between items-center">
                        <span>{field.label || 'Видео-ролик / Заставка'}</span>
                        {formData.videoUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                            className="text-[10px] text-rose-400 hover:underline"
                          >
                            Удалить
                          </button>
                        )}
                      </label>
                      {formData.videoUrl ? (
                        <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-black flex items-center justify-center">
                          <video src={getMediaUrl(formData.videoUrl)} controls className="w-full h-full object-contain" />
                        </div>
                      ) : null}
                      <label className="cursor-pointer py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-amber-400 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-all">
                        {uploadingMedia ? (
                          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                        ) : (
                          <VideoIcon className="w-4 h-4 text-indigo-400" />
                        )}
                        <span>{formData.videoUrl ? 'Заменить видео-файл' : 'Загрузить видео (MP4 / WebM)'}</span>
                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={field.id} className="flex flex-col gap-2 relative">
                    <label className="text-xs font-semibold text-slate-300 tracking-wide flex justify-between items-center">
                      <span>{field.label}</span>
                      <div className="flex items-center gap-2">
                        {field.maxLength && (
                          <span className="text-[10px] text-slate-500">
                            {(formData[field.id] || '').length}/{field.maxLength}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveUserField(field.id)}
                          className="text-slate-500 hover:text-rose-500 transition-colors p-1"
                          title="Удалить поле"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </label>
                    
                    {field.id === 'loveStory' || field.type === 'textarea' ? (
                      <textarea 
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-amber-500 focus:bg-white/10 rounded-xl outline-none text-sm transition-all placeholder:text-slate-600 resize-none font-sans"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        maxLength={field.maxLength}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    ) : (
                      <input 
                        type="text"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-amber-500 focus:bg-white/10 rounded-xl outline-none text-sm transition-all placeholder:text-slate-600"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        maxLength={field.maxLength}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddUserField}
                className="w-full py-2.5 border border-dashed border-white/15 hover:border-amber-500/50 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-400 transition-all flex items-center justify-center gap-1.5 mt-1"
              >
                <Plus className="w-4 h-4" /> Добавить новое текстовое поле
              </button>

              {/* SECTION VISIBILITY MANAGER */}
              <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" /> Видимость разделов сайта
                  </span>
                  {Array.isArray(formData.hiddenSections) && formData.hiddenSections.length > 0 && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                      Скрыто: {formData.hiddenSections.length}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Вы можете скрыть любые ненужные разделы сайта. Скрытые разделы не будут видны вашим гостям:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'hero', label: 'Главная карточка' },
                    { id: 'photo', label: 'Главное фото' },
                    { id: 'video', label: 'Видео-ролик' },
                    { id: 'loveStory', label: 'История любви' },
                    { id: 'dateVenue', label: 'Дата и Место' },
                    { id: 'countdown', label: 'Таймер отсчета' },
                    { id: 'schedule', label: 'Программа дня' },
                    { id: 'gallery', label: 'Фотогалерея' },
                    { id: 'dressCode', label: 'Дресс-код' },
                    { id: 'rsvp', label: 'Анкета гостей' },
                    { id: 'giftCard', label: 'Подарки и карта' },
                    { id: 'phone', label: 'Контакты' },
                  ].map(sec => {
                    const isHidden = Array.isArray(formData.hiddenSections) && formData.hiddenSections.includes(sec.id);
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => handleToggleSection(sec.id)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                          isHidden 
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 line-through' 
                            : 'bg-white/5 border-white/10 text-slate-200 hover:border-white/20'
                        }`}
                      >
                        <span className="truncate">{sec.label}</span>
                        {isHidden ? (
                          <X className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-1" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {Array.isArray(formData.hiddenSections) && formData.hiddenSections.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, hiddenSections: [] }))}
                    className="mt-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    Показать все скрытые блоки
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5 mt-2 flex flex-col gap-4">
              {!token && (
                <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/25 p-3 rounded-lg text-[11px] text-amber-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Для продолжения и генерации приглашения потребуется авторизация. Ваши данные сохранятся.</span>
                </div>
              )}
              
              {/* Promocode Input Section */}
              <div className="flex flex-col gap-2 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Промокод на скидку
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Например: TOY2026"
                    className="flex-1 bg-slate-950/60 border border-white/10 px-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 uppercase tracking-wider font-mono text-slate-200"
                    value={promocodeInput}
                    onChange={(e) => {
                      setPromocodeInput(e.target.value);
                      setPromoError(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromocode}
                    disabled={isValidatingPromo || !promocodeInput.trim()}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1"
                  >
                    {isValidatingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Применить'}
                  </button>
                </div>

                {promoError && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{promoError}</p>
                )}

                {appliedPromo && (
                  <div className="flex items-center justify-between bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-lg mt-1 text-xs text-emerald-400 font-semibold">
                    <span>Скидка "{appliedPromo.code}": -{appliedPromo.discountAmount.toLocaleString('ru-RU')} сум</span>
                    <button 
                      type="button" 
                      onClick={() => { setAppliedPromo(null); setPromocodeInput(''); }}
                      className="text-rose-400 hover:underline text-[10px] ml-2"
                    >
                      Отменить
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Стоимость заказа:</span>
                <div className="flex flex-col items-end">
                  {appliedPromo ? (
                    <>
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {appliedPromo.originalPrice.toLocaleString('ru-RU')} сум
                      </span>
                      <span className="text-xl font-bold text-emerald-400 font-mono">
                        {appliedPromo.finalPrice.toLocaleString('ru-RU')} сум
                      </span>
                    </>
                  ) : template.discount_price !== null && template.discount_price !== undefined ? (
                    <>
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {Number(template.price).toLocaleString('ru-RU')} сум
                      </span>
                      <span className="text-xl font-bold text-amber-400 font-mono">
                        {Number(template.discount_price).toLocaleString('ru-RU')} сум
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-amber-400 font-mono">
                      {Number(template.price || 0).toLocaleString('ru-RU')} сум
                    </span>
                  )}
                </div>
              </div>


              <button 
                onClick={handleCreateOrder}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Рендеринг...
                  </>
                ) : (
                  token ? 'Создать приглашение' : 'Войти и создать'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Loader Polling Overlay */}
      <AnimatePresence>
        {isSubmitting && currentOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel-heavy p-8 rounded-3xl max-w-md w-full border border-white/10 flex flex-col items-center text-center gap-6 shadow-2xl"
            >
              {currentOrder.status === 'completed' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="flex flex-col items-center gap-5 w-full"
                >
                  <div className="relative w-fit">
                    {/* Glowing outer ring */}
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl animate-pulse"></div>
                    <div className="relative border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl p-2 bg-slate-950/80 w-[180px] h-[240px] flex items-center justify-center">
                      {template.type === 'website' ? (
                        <div className="scale-[0.45] origin-center shrink-0 pointer-events-none">
                          <TemplatePreview 
                            template={template} 
                            formData={currentOrder.user_data || formData || {}} 
                            autoScrollOnHover={true} 
                          />
                        </div>
                      ) : template.media_url.endsWith('.mp4') ? (
                        <video 
                          src={getMediaUrl(currentOrder.final_asset_url || template.media_url)} 
                          className="w-full h-full object-cover rounded-xl"
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                        />
                      ) : (
                        <img 
                          src={getMediaUrl(currentOrder.final_asset_url || template.media_url)} 
                          className="w-full h-full object-cover rounded-xl"
                          alt="Finalized Invite" 
                        />
                      )}
                    </div>
                    {/* Glowing Checkmark Badge */}
                    <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-full border-4 border-slate-950 text-slate-950 shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold tracking-wide gold-gradient-text">Ваше приглашение готово!</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {template.type === 'website' ? 'Сайт-приглашение создан и готов к отправке.' : 'Финальный макет сгенерирован в высоком качестве.'}
                    </p>
                  </div>

                  {currentOrder.status !== 'paid' && Number(currentOrder.total_price || 0) > 0 && (
                    <div className="w-full mt-2">
                      <ClickPayButtons
                        orderId={currentOrder.id}
                        amount={Number(currentOrder.total_price || template.price || 0)}
                      />
                    </div>
                  )}

                  {(currentOrder.status === 'paid' || Number(currentOrder.total_price || 0) === 0) && (
                    <div className="w-full p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{Number(currentOrder.total_price || 0) === 0 ? 'Бесплатное приглашение' : 'Заказ успешно оплачен через Click!'}</span>
                    </div>
                  )}

                  {(currentOrder.status === 'paid' || Number(currentOrder.total_price || template.price || 0) === 0) ? (
                    <div className="flex flex-col gap-2.5 w-full mt-2">
                      {template.type === 'website' ? (
                        <>
                          <button 
                            onClick={() => {
                              const fullUrl = `${window.location.origin}/invite/${currentOrder.id}`;
                              navigator.clipboard.writeText(fullUrl);
                              alert('Ссылка скопирована!');
                            }}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/15 flex items-center justify-center gap-2"
                          >
                            Скопировать ссылку
                          </button>
                          <a 
                            href={`/invite/${currentOrder.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-500/15 flex items-center justify-center gap-2"
                          >
                            Открыть приглашение
                          </a>
                        </>
                      ) : (
                        <a 
                          href={getMediaUrl(currentOrder.final_asset_url || '')}
                          download 
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/15 flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Скачать макет
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-center mt-2 w-full">
                      <p className="text-xs text-amber-400 font-semibold flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span>Ссылка и файлы будут доступны сразу после оплаты Click</span>
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2.5 w-full mt-2">
                    <button 
                      onClick={() => { setIsSubmitting(false); navigate('/cabinet'); }}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl transition-all text-xs font-semibold text-slate-300"
                    >
                      Перейти в Личный кабинет
                    </button>
                    <button 
                      onClick={() => setIsSubmitting(false)}
                      className="text-xs text-slate-500 hover:text-slate-400 transition-colors mt-1"
                    >
                      Закрыть окно
                    </button>
                  </div>
                </motion.div>
              ) : currentOrder.status === 'failed' ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-rose-500/15 rounded-full border border-rose-500/30 text-rose-400">
                    <AlertCircle className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-wide">Ошибка генерации</h3>
                    <p className="text-xs text-slate-400 mt-2">Произошел сбой при обработке медиа-файла.</p>
                  </div>
                  <button 
                    onClick={() => setIsSubmitting(false)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl transition-all font-semibold"
                  >
                    Вернуться назад
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 w-full">
                  <div className="relative w-[160px] h-[220px] rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950/95 flex flex-col items-center justify-center p-4 shadow-2xl shadow-amber-500/10">
                    {/* Pulsing ambient gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-indigo-500/10 to-emerald-500/10 animate-pulse pointer-events-none" />

                    {/* Scanning laser line */}
                    <div className="scan-line z-20" />

                    {/* Background template media preview with blur and fallback */}
                    {template.type === 'website' ? (
                      <div className="absolute inset-0 scale-[0.35] origin-center opacity-25 pointer-events-none filter blur-[1px]">
                        <TemplatePreview 
                          template={template} 
                          formData={currentOrder.user_data || formData || {}} 
                          autoScrollOnHover={false} 
                        />
                      </div>
                    ) : template.media_url.endsWith('.mp4') ? (
                      <video 
                        src={getMediaUrl(template.media_url)} 
                        className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[1px]" 
                        muted 
                        autoPlay 
                        loop 
                        playsInline 
                      />
                    ) : (
                      <img 
                        src={getMediaUrl(template.media_url)} 
                        className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[1px]" 
                        alt=""
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    )}

                    {/* Central High-Tech Animated Loading Badge */}
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-400 backdrop-blur-md shadow-lg shadow-amber-500/20">
                        <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
                        <div className="absolute -inset-1 rounded-2xl border border-amber-400/30 animate-ping pointer-events-none" />
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-white/15 text-[10px] font-bold text-slate-200 font-mono tracking-wider shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>ОБРАБОТКА МАКЕТА</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold tracking-wide text-slate-200">
                      {currentOrder.id === 'draft' ? 'Подготовка макета...' : 
                       currentOrder.status === 'pending' ? 'Очередь рендеринга...' : 'Идет сборка приглашения...'}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      {template.type === 'virtual' && template.media_url.endsWith('.mp4') 
                        ? 'Мы рендерим видео через Fluent-FFmpeg на сервере. Это займет около 1 минуты.' 
                        : 'Выполняем наложение текста высокого разрешения через Sharp.'}
                    </p>
                  </div>

                  {/* Sequential checklist style indicators */}
                  <div className="w-full max-w-xs flex flex-col gap-2 border-t border-white/5 pt-4 text-left">
                    <div className="flex items-center gap-2.5 text-xs">
                      <div className="w-4 h-4 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-400 font-bold">✓</div>
                      <span className="text-slate-300 font-medium">Регистрация заказа в базе данных</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs">
                      {currentOrder.id !== 'draft' ? (
                        <div className="w-4 h-4 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-400 font-bold">✓</div>
                      ) : (
                        <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                      )}
                      <span className={currentOrder.id !== 'draft' ? 'text-slate-300 font-medium' : 'text-slate-500'}>Генерация SVG-слоев</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs">
                      {currentOrder.status === 'processing' ? (
                        <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/5 bg-white/5"></div>
                      )}
                      <span className={currentOrder.status === 'processing' ? 'text-slate-300 font-medium' : 'text-slate-500'}>Слияние медиа и сохранение файла</span>
                    </div>

                  </div>

                  <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-2">
                    СТАТУС: {currentOrder.status.toUpperCase()}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// Preview Engine Component
function TemplatePreview({ 
  template, 
  formData,
  autoScrollOnHover = false,
  isOpened = true,
  onToggleSection
}: { 
  template: Template; 
  formData: Record<string, any>; 
  autoScrollOnHover?: boolean;
  isOpened?: boolean;
  onToggleSection?: (sectionKey: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isVideo = template.media_url.endsWith('.mp4') || (template as any).isVideoBlob;
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!autoScrollOnHover || !scrollRef.current) return;
    const el = scrollRef.current;
    let animationFrameId: number;
    const scrollSpeed = 0.6;

    const animate = () => {
      if (isHovered) {
        if (el.scrollTop < el.scrollHeight - el.clientHeight) {
          el.scrollTop += scrollSpeed;
          animationFrameId = requestAnimationFrame(animate);
        }
      } else {
        if (el.scrollTop > 0) {
          el.scrollTop -= scrollSpeed * 4;
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, autoScrollOnHover]);

  useEffect(() => {
    if (!isVideo) return;
    const updateScale = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScale(rect.width / template.text_config.dimensions.width);
      }
    };
    
    const timeout = setTimeout(updateScale, 150);
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timeout);
    };
  }, [isVideo, template]);

  useEffect(() => {
    if (isVideo || template.type === 'website') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const mediaSrc = getMediaUrl(template.media_url);
    if (!mediaSrc.startsWith('blob:') && !mediaSrc.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.src = mediaSrc;

    img.onload = () => {
      const { width, height } = template.text_config.dimensions;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      template.text_config.fields.forEach(field => {
        let textValue = formData[field.id] || field.placeholder || '';
        if (field.id === 'phone') {
          textValue = formatPhoneNumber(textValue);
        }
        const x = field.x;
        const y = field.y;
        const size = field.fontSize;
        
        let family = field.fontFamily || 'sans-serif';
        if (family === 'Playfair Display') {
          family = "'Playfair Display', Georgia, serif";
        } else if (family === 'Montserrat') {
          family = "'Montserrat', Arial, sans-serif";
        }

        ctx.font = `500 ${size}px ${family}`;
        ctx.fillStyle = field.color || '#000000';
        ctx.textAlign = field.align || 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(textValue, x, y);
      });
    };
  }, [template, formData, isVideo]);

  if (template.type === 'website') {
    const activeFields = (formData._customFields as any) || template.text_config?.fields || [];
    const standardIds = ['groomName', 'brideName', 'date', 'time', 'venue', 'address', 'loveStory', 'phone'];
    const customDynamicFields = activeFields.filter((f: any) => !standardIds.includes(f.id));

    const previewData: Record<string, string> = { ...formData };
    if (template.text_config?.fields) {
      template.text_config.fields.forEach((f: any) => {
        if (!previewData[f.id] && f.placeholder) {
          previewData[f.id] = f.placeholder;
        }
      });
    }

    const previewTimeLeft = useCountdownTimer(previewData.date, previewData.time);

    return (
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative mx-auto border-[10px] border-slate-900 rounded-[2.5rem] h-[640px] w-[340px] shadow-2xl bg-slate-950 flex flex-col overflow-hidden ring-4 ring-slate-800/50"
      >
        {/* Phone Notch */}
        <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 flex justify-center items-center z-30 rounded-b-xl">
          <div className="w-16 h-1.5 bg-black rounded-full z-40"></div>
        </div>

        <div ref={scrollRef} className="w-full h-full overflow-y-auto pt-4 flex flex-col scrollbar-none">
          <WebsiteTemplateDispatcher 
            templateId={template.id}
            data={previewData}
            customFields={customDynamicFields}
            isPreview={true}
            isOpened={isOpened}
            onToggleSection={onToggleSection}
            timeLeft={previewTimeLeft}
          />
        </div>
      </div>
    );
  }

  if (isVideo) {
    const { width, height } = template.text_config.dimensions;
    return (
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden" 
        style={{ aspectRatio: `${width} / ${height}`, maxWidth: '400px' }}
      >
        <video 
          src={getMediaUrl(template.media_url)} 
          className="w-full h-full object-cover" 
          muted 
          autoPlay 
          loop 
          playsInline 
        />
        
        <div className="absolute inset-0 pointer-events-none origin-top-left" style={{ transform: `scale(${scale})`, width: `${width}px`, height: `${height}px` }}>
          {template.text_config.fields.map(field => {
            const val = formData[field.id] || field.placeholder || '';
            const alignStyles = 
              field.align === 'center' ? 'text-center -translate-x-1/2' :
              field.align === 'right' ? 'text-right -translate-x-full' : 'text-left';

            return (
              <div
                key={field.id}
                className={`absolute select-none font-medium ${alignStyles}`}
                style={{
                  left: `${field.x}px`,
                  top: `${field.y}px`,
                  fontSize: `${field.fontSize}px`,
                  color: field.color,
                  fontFamily: field.fontFamily.includes('Playfair') ? "'Playfair Display', Georgia, serif" : "'Montserrat', Arial, sans-serif",
                  lineHeight: '1',
                  transform: `${field.align === 'center' ? 'translate(-50%, -50%)' : field.align === 'right' ? 'translate(-100%, -50%)' : 'translate(0, -50%)'}`,
                  whiteSpace: 'nowrap'
                }}
              >
                {val}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-auto max-w-[400px] rounded-xl object-contain shadow-lg"
    />
  );
}

// ----------------- LOGIN PAGE -----------------
function LoginPage() {
  const { login, error, loading, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(redirect, { replace: true });
    } catch (err) {}
  };

  return (
    <div className="flex-1 flex items-center justify-center py-10">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl max-w-md w-full border border-white/5 flex flex-col gap-6 shadow-xl"
      >
        <div className="text-center flex flex-col gap-2 items-center">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/25 w-fit text-amber-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-wide">Вход в систему</h2>
          <p className="text-xs text-slate-400">Авторизуйтесь для управления заказами</p>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/25 p-3.5 rounded-xl text-xs text-rose-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Email-адрес</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input 
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/10 rounded-xl outline-none text-sm transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Пароль</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input 
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/10 rounded-xl outline-none text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/15 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Войти'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 mt-2 border-t border-white/5 pt-4">
          Нет аккаунта?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-amber-400 font-semibold hover:underline">
            Зарегистрироваться
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ----------------- REGISTER PAGE -----------------
function RegisterPage() {
  const { register, error, loading, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate(redirect, { replace: true });
    } catch (err) {}
  };

  return (
    <div className="flex-1 flex items-center justify-center py-10">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl max-w-md w-full border border-white/5 flex flex-col gap-6 shadow-xl"
      >
        <div className="text-center flex flex-col gap-2 items-center">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/25 w-fit text-amber-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-wide">Регистрация</h2>
          <p className="text-xs text-slate-400">Создайте личный профиль в один клик</p>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/25 p-3.5 rounded-xl text-xs text-rose-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Email-адрес</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input 
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/10 rounded-xl outline-none text-sm transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Пароль</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input 
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/10 rounded-xl outline-none text-sm transition-all"
                placeholder="минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/15 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 mt-2 border-t border-white/5 pt-4">
          Уже есть аккаунт?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-amber-400 font-semibold hover:underline">
            Войти
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ----------------- USER CABINET PAGE -----------------
function CabinetPage() {
  const { token, user } = useAuth();
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRsvpOrderId, setSelectedRsvpOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/orders/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrdersList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="flex flex-col gap-8 flex-1">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-wide flex items-center gap-2">
            <History className="w-6 h-6 text-amber-400" /> Личный кабинет
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Пользователь: <span className="font-semibold text-slate-300">{user?.email}</span>
          </p>
        </div>
        <div className="bg-white/5 px-4 py-2 border border-white/10 rounded-xl text-xs">
          Всего заказов: <span className="font-bold text-amber-400 font-mono">{ordersList.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : ordersList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ordersList.map(order => (
            <div key={order.id} className="glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-lg">
              {/* Media Preview (Left/Top) */}
              <div className="w-full md:w-36 aspect-[3/4] bg-slate-900/40 shrink-0 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
                {order.template.type === 'website' ? (
                  <div className="scale-[0.45] origin-center shrink-0">
                    <TemplatePreview template={order.template} formData={order.user_data || {}} autoScrollOnHover={true} />
                  </div>
                ) : order.template.media_url.endsWith('.mp4') ? (
                  <video 
                    src={getMediaUrl(order.template.media_url)} 
                    className="w-full h-full object-cover" 
                    muted 
                    loop 
                    playsInline 
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                ) : (
                  <img 
                    src={getMediaUrl(order.template.media_url)} 
                    className="w-full h-full object-cover" 
                    alt="" 
                  />
                )}
                
                <div className="absolute top-2 left-2 z-10">
                  {order.template.media_url.endsWith('.mp4') ? (
                    <span className="text-[9px] bg-indigo-500/90 text-indigo-950 font-bold px-2 py-0.5 rounded-full">Видео</span>
                  ) : order.template.type === 'website' ? (
                    <span className="text-[9px] bg-teal-500/90 text-teal-950 font-bold px-2 py-0.5 rounded-full">Сайт</span>
                  ) : (
                    <span className="text-[9px] bg-amber-500/90 text-amber-950 font-bold px-2 py-0.5 rounded-full">Фото</span>
                  )}
                </div>
              </div>

              {/* Order Info (Right/Bottom) */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-100">
                        {getTemplateName(order.template)}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {order.id.slice(0, 13)}...</p>
                    </div>

                    {/* Status Badge */}
                    {order.status === 'completed' && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold border border-emerald-400/10 shrink-0">Готов</span>
                    )}
                    {order.status === 'processing' && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-semibold border border-amber-400/10 flex items-center gap-1 shrink-0">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Рендер
                      </span>
                    )}
                    {order.status === 'pending' && (
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-semibold border border-blue-400/10 shrink-0">В очереди</span>
                    )}
                    {order.status === 'failed' && (
                      <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-semibold border border-rose-400/10 shrink-0">Ошибка</span>
                    )}
                  </div>

                  {/* Config texts preview */}
                  <div className="mt-3 bg-white/5 border border-white/5 rounded-lg p-2.5 text-[10px] text-slate-400 max-h-24 overflow-y-auto">
                    {Object.entries(order.user_data)
                      .filter(([k, v]) => k !== 'rsvps' && k !== '_customFields' && typeof v === 'string' && (v as string).trim() !== '')
                      .map(([k, v]) => {
                        const fieldLabels: Record<string, string> = {
                          groomName: 'Жених',
                          brideName: 'Невеста',
                          date: 'Дата',
                          time: 'Время',
                          venue: 'Зал',
                          address: 'Адрес',
                          loveStory: 'История',
                          phone: 'Телефон',
                          names: 'Имена',
                          title: 'Заголовок',
                          details: 'Детали',
                        };
                        return (
                          <div key={k} className="flex justify-between py-0.5 border-b border-white/5 last:border-0 gap-2">
                            <span className="text-slate-400 shrink-0 font-medium">{fieldLabels[k] || k}:</span>
                            <span className="text-slate-200 font-medium truncate max-w-[170px]">{String(v)}</span>
                          </div>
                        );
                      })}
                    {Array.isArray(order.user_data?._customFields) && order.user_data._customFields.map((cf: any) => {
                      const val = order.user_data[cf.id];
                      if (!val) return null;
                      return (
                        <div key={cf.id} className="flex justify-between py-0.5 border-b border-white/5 last:border-0 gap-2">
                          <span className="text-slate-400 shrink-0 font-medium">{cf.label}:</span>
                          <span className="text-slate-200 font-medium truncate max-w-[170px]">{String(val)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">{Number(order.total_price).toLocaleString('ru-RU')} сум</span>
                    {order.template.type === 'website' && (
                      <button
                        onClick={() => setSelectedRsvpOrderId(order.id)}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-[10px] font-semibold text-amber-400 transition-all"
                      >
                        Ответы гостей ({order.user_data?.rsvps?.length || 0})
                      </button>
                    )}
                  </div>

                  {order.final_asset_url ? (
                    order.template.type === 'website' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const fullUrl = `${window.location.origin}/invite/${order.id}`;
                            navigator.clipboard.writeText(fullUrl);
                            alert('Ссылка скопирована!');
                          }}
                          className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 py-1.5 rounded-lg text-xs font-semibold text-center transition-all"
                        >
                          Копировать ссылку
                        </button>
                        <a 
                          href={`/invite/${order.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/10 text-center flex items-center gap-1"
                        >
                          Открыть
                        </a>
                      </div>
                    ) : (
                      <a 
                        href={getMediaUrl(order.final_asset_url)} 
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1"
                      >
                        Скачать <Download className="w-3.5 h-3.5" />
                      </a>
                    )
                  ) : (
                    <span className="text-[10px] text-slate-600 text-center py-1.5">В процессе создания</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3">
          <p className="text-slate-400 text-sm">У вас пока нет оформленных приглашений</p>
          <Link to="/" className="text-xs bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg shadow-lg shadow-amber-500/10 mt-1">
            Выбрать первый шаблон
          </Link>
        </div>
      )}

      {/* RSVP Modal */}
      {selectedRsvpOrderId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-heavy p-6 rounded-3xl max-w-lg w-full border border-white/10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Ответы гостей</h3>
                <p className="text-xs text-slate-400">Список гостей и их пожелания</p>
              </div>
              <button 
                onClick={() => setSelectedRsvpOrderId(null)}
                className="p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {(() => {
                const o = ordersList.find(ord => ord.id === selectedRsvpOrderId);
                const rsvps = o?.user_data?.rsvps || [];
                if (rsvps.length === 0) {
                  return <p className="text-xs text-slate-500 text-center py-6">Никто еще не ответил на приглашение.</p>;
                }
                return rsvps.map((r: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-3.5 rounded-xl flex flex-col gap-1.5 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-200">{r.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${r.attending ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'}`}>
                        {r.attending ? 'Придет' : 'Не сможет прийти'}
                      </span>
                    </div>
                    {r.wishes && (
                      <p className="text-xs italic text-slate-400 font-serif border-t border-white/5 pt-1.5 mt-1">
                        "{r.wishes}"
                      </p>
                    )}
                    <span className="text-[9px] text-slate-600 text-right mt-1 block">{new Date(r.createdAt).toLocaleString('ru-RU')}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- ADMIN PAGE -----------------
function AdminPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'templates' | 'promocodes'>('orders');
  
  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Templates State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Promocodes State
  const [promocodes, setPromocodes] = useState<any[]>([]);
  const [loadingPromocodes, setLoadingPromocodes] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoValue, setNewPromoValue] = useState('15');
  const [newPromoMinOrder, setNewPromoMinOrder] = useState('0');
  const [newPromoMaxUses, setNewPromoMaxUses] = useState('100');
  const [newPromoPartner, setNewPromoPartner] = useState('');

  const refreshPromocodes = () => {
    setLoadingPromocodes(true);
    fetch(`${API_URL}/promocodes`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPromocodes(data);
        setLoadingPromocodes(false);
      })
      .catch(() => setLoadingPromocodes(false));
  };

  useEffect(() => {
    if (activeTab === 'promocodes') {
      refreshPromocodes();
    }
  }, [activeTab]);

  // Modal / Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Form Fields
  const [formType, setFormType] = useState<'virtual' | 'physical' | 'website'>('virtual');
  const [formMediaKind, setFormMediaKind] = useState<'photo' | 'video'>('photo');
  const [formCategory, setFormCategory] = useState('wedding');
  const [formPrice, setFormPrice] = useState('75000');
  const [formDiscountPrice, setFormDiscountPrice] = useState('');
  const [formMediaUrl, setFormMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Dimensions
  const [dimWidth, setDimWidth] = useState(1200);
  const [dimHeight, setDimHeight] = useState(1600);

  // Text Fields Config
  const [textFields, setTextFields] = useState<any[]>([]);

  // Local state or URL creator for preview file blob
  const [previewMediaUrl, setPreviewMediaUrl] = useState('');

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewMediaUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewMediaUrl(formMediaUrl);
    }
  }, [selectedFile, formMediaUrl]);

  const previewTemplate: Template = {
    id: editingTemplate ? editingTemplate.id : 0,
    type: formType,
    category: formCategory,
    media_url: previewMediaUrl,
    price: Number(formPrice) || 0,
    discount_price: formDiscountPrice ? Number(formDiscountPrice) : null,
    text_config: {
      dimensions: { width: Number(dimWidth), height: Number(dimHeight) },
      fields: textFields
    }
  } as any;

  const previewFormData: Record<string, string> = {};
  textFields.forEach(f => {
    previewFormData[f.id] = f.placeholder || '';
  });

  const refreshOrders = () => {
    setLoadingOrders(true);
    fetch(`${API_URL}/orders/admin/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setLoadingOrders(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingOrders(false);
      });
  };

  const refreshTemplates = () => {
    setLoadingTemplates(true);
    fetch(`${API_URL}/templates`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTemplates(data);
        }
        setLoadingTemplates(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingTemplates(false);
      });
  };

  useEffect(() => {
    refreshOrders();
    refreshTemplates();
  }, [token]);

  const openCreateForm = () => {
    setEditingTemplate(null);
    setFormType('virtual');
    setFormMediaKind('photo');
    setFormCategory('wedding');
    setFormPrice('75000');
    setFormDiscountPrice('');
    setFormMediaUrl('');
    setSelectedFile(null);
    setDimWidth(1200);
    setDimHeight(1600);
    setTextFields([
      {
        id: 'names',
        label: 'Имена',
        placeholder: 'Александр & София',
        fontFamily: 'Playfair Display',
        fontSize: 56,
        color: '#B8860B',
        x: 600,
        y: 750,
        align: 'center',
        maxLength: 40,
      }
    ]);
    setIsFormOpen(true);
  };

  const openEditForm = (t: Template) => {
    setEditingTemplate(t);
    setFormType(t.type);
    setFormMediaKind(t.media_url.endsWith('.mp4') ? 'video' : 'photo');
    setFormCategory(t.category);
    setFormPrice(String(t.price));
    setFormDiscountPrice(t.discount_price !== null && t.discount_price !== undefined ? String(t.discount_price) : '');
    setFormMediaUrl(t.media_url);
    setSelectedFile(null);
    setDimWidth(t.text_config.dimensions?.width || 1200);
    setDimHeight(t.text_config.dimensions?.height || 1600);
    setTextFields(t.text_config.fields || []);
    setIsFormOpen(true);
  };

  const handleAddField = () => {
    setTextFields(prev => [
      ...prev,
      {
        id: `field_${Date.now()}`,
        label: 'Новое поле',
        placeholder: 'Текст',
        fontFamily: 'Montserrat',
        fontSize: 32,
        color: '#333333',
        x: Math.round(dimWidth / 2),
        y: Math.round(dimHeight / 2),
        align: 'center',
        maxLength: 50,
      }
    ]);
  };

  const handleRemoveField = (index: number) => {
    setTextFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, fieldKey: string, val: any) => {
    setTextFields(prev => prev.map((f, i) => {
      if (i === index) {
        return { ...f, [fieldKey]: val };
      }
      return f;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalMediaUrl = formMediaUrl;

      // Handle media file upload if a new file is chosen
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('convertToVideo', String(formMediaKind === 'video'));

        const uploadRes = await fetch(`${API_URL}/templates/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error('Ошибка при загрузке медиафайла');
        }

        const uploadData = await uploadRes.json();
        finalMediaUrl = uploadData.url;
      }

      if (!finalMediaUrl) {
        throw new Error('Необходимо выбрать или загрузить медиафайл шаблона');
      }

      const payload = {
        type: formMediaKind === 'video' ? 'virtual' : formType,
        category: formCategory,
        media_url: finalMediaUrl,
        price: Number(formPrice) || 0,
        discount_price: formDiscountPrice ? Number(formDiscountPrice) : null,
        text_config: {
          dimensions: { width: Number(dimWidth), height: Number(dimHeight) },
          fields: textFields
        }
      };

      let saveRes;
      if (editingTemplate) {
        // Update existing template
        saveRes = await fetch(`${API_URL}/templates/${editingTemplate.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new template
        saveRes = await fetch(`${API_URL}/templates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!saveRes.ok) {
        const errData = await saveRes.json();
        throw new Error(errData.message || 'Ошибка сохранения шаблона');
      }

      setIsFormOpen(false);
      refreshTemplates();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот шаблон? Все связанные заказы будут удалены!')) return;

    try {
      const res = await fetch(`${API_URL}/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Не удалось удалить шаблон');
      }

      refreshTemplates();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreatePromocodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/promocodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newPromoCode,
          discount_type: newPromoType,
          discount_value: Number(newPromoValue),
          min_order_amount: Number(newPromoMinOrder) || 0,
          max_uses: Number(newPromoMaxUses) || 100,
          partner_name: newPromoPartner || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка создания промокода');

      setIsPromoModalOpen(false);
      setNewPromoCode('');
      setNewPromoPartner('');
      refreshPromocodes();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeletePromocode = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот промокод?')) return;
    try {
      await fetch(`${API_URL}/promocodes/${id}`, { method: 'DELETE' });
      refreshPromocodes();
    } catch (err) {}
  };

  const handleTogglePromocodeActive = async (id: number, currentActive: boolean) => {
    try {
      await fetch(`${API_URL}/promocodes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentActive }),
      });
      refreshPromocodes();
    } catch (err) {}
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
            <Shield className="w-5.5 h-5.5 text-amber-400" /> Панель Администратора
          </h2>
          <p className="text-xs text-slate-400 mt-1">Управление каталогом шаблонов, ценообразованием и промокодами</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Заказы
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${activeTab === 'templates' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Каталог шаблонов
          </button>
          <button
            onClick={() => setActiveTab('promocodes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${activeTab === 'promocodes' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Промокоды
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        // ORDERS TAB
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Список заказов</h3>
            <button 
              onClick={refreshOrders}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all text-slate-300"
            >
              {loadingOrders && <Loader2 className="w-3 h-3 animate-spin" />} Обновить
            </button>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs text-slate-400 tracking-wider uppercase font-semibold">
                    <th className="py-4 px-6 font-semibold">ID Заказа</th>
                    <th className="py-4 px-6 font-semibold">Пользователь</th>
                    <th className="py-4 px-6 font-semibold">Шаблон</th>
                    <th className="py-4 px-6 font-semibold">Цена заказа</th>
                    <th className="py-4 px-6 font-semibold">Данные полей</th>
                    <th className="py-4 px-6 font-semibold">Статус</th>
                    <th className="py-4 px-6 font-semibold">Файл</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOrders ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : orders.length > 0 ? (
                    orders.map(order => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-slate-400">
                          {order.id.slice(0, 8)}...
                        </td>
                        <td className="py-4 px-6 text-xs font-medium text-slate-300">
                          {order.user?.email || 'Гость / Аноним'}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-300">
                          {order.template ? getTemplateName(order.template) : 'Удаленный шаблон'}
                        </td>
                        <td className="py-4 px-6 text-xs font-bold text-amber-400 font-mono">
                          {Number(order.total_price || 0).toLocaleString('ru-RU')} сум
                        </td>
                        <td className="py-4 px-6 max-w-xs truncate text-xs text-slate-300">
                          {JSON.stringify(order.user_data)}
                        </td>
                        <td className="py-4 px-6">
                          {order.status === 'paid' && (
                            <span className="text-[11px] text-emerald-400 bg-emerald-500/15 border border-emerald-400/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Оплачено
                            </span>
                          )}
                          {order.status === 'completed' && (
                            <span className="text-[11px] text-emerald-400 bg-emerald-500/15 border border-emerald-400/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Готов
                            </span>
                          )}
                          {order.status === 'processing' && (
                            <span className="text-[11px] text-amber-400 bg-amber-500/15 border border-amber-400/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 w-fit">
                              <Loader2 className="w-3 h-3 animate-spin" /> Рендер
                            </span>
                          )}
                          {order.status === 'pending' && (
                            <span className="text-[11px] text-blue-400 bg-blue-500/15 border border-blue-400/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Очередь
                            </span>
                          )}
                          {order.status === 'failed' && (
                            <span className="text-[11px] text-rose-400 bg-rose-500/15 border border-rose-400/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1.5 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Ошибка
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {order.final_asset_url ? (
                            <div className="flex flex-col gap-1">
                              <a 
                                href={getMediaUrl(order.final_asset_url)} 
                                target="_blank"
                                rel="noreferrer"
                                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-all text-xs"
                              >
                                Скачать <Download className="w-3.5 h-3.5" />
                              </a>
                              {order.status !== 'paid' && (
                                <a 
                                  href={`https://my.click.uz/services/pay?service_id=108456&merchant_id=63342&amount=${order.total_price}&transaction_param=${order.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sky-400 hover:text-sky-300 text-[11px] font-bold underline"
                                >
                                  Оплатить Click
                                </a>
                              )}
                            </div>
                          ) : (
                            <a 
                              href={`https://my.click.uz/services/pay?service_id=108456&merchant_id=63342&amount=${order.total_price}&transaction_param=${order.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-400 hover:text-sky-300 text-xs font-bold underline"
                            >
                              Оплатить Click
                            </a>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 px-6 text-center text-slate-500">
                        Заказы отсутствуют
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        // TEMPLATES CATALOG TAB
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Шаблоны в базе данных</h3>
            <button 
              onClick={openCreateForm}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs tracking-wide flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/15"
            >
              <Plus className="w-4 h-4" /> Добавить макет
            </button>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs text-slate-400 tracking-wider uppercase font-semibold">
                    <th className="py-4 px-6 font-semibold w-16">ID</th>
                    <th className="py-4 px-6 font-semibold w-24">Медиа</th>
                    <th className="py-4 px-6 font-semibold">Название</th>
                    <th className="py-4 px-6 font-semibold">Категория / Тип</th>
                    <th className="py-4 px-6 font-semibold">Цена</th>
                    <th className="py-4 px-6 font-semibold">Скидка</th>
                    <th className="py-4 px-6 font-semibold text-center w-36">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTemplates ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : templates.length > 0 ? (
                    templates.map(tpl => (
                      <tr key={tpl.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-slate-400">
                          {tpl.id}
                        </td>
                        <td className="py-4 px-6">
                          <div className="w-12 h-16 bg-slate-950 rounded border border-white/10 overflow-hidden flex items-center justify-center">
                            {tpl.media_url.endsWith('.mp4') ? (
                              <video src={getMediaUrl(tpl.media_url)} className="w-full h-full object-cover" muted />
                            ) : (
                              <img src={getMediaUrl(tpl.media_url)} className="w-full h-full object-cover" alt="" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold text-slate-200">
                          {getTemplateName(tpl)}
                        </td>
                        <td className="py-4 px-6 text-xs">
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-400 capitalize">{tpl.category === 'wedding' ? 'Свадьба' : tpl.category === 'birthday' ? 'День рождения' : tpl.category}</span>
                            <span>
                              {tpl.media_url.endsWith('.mp4') ? (
                                <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded font-bold uppercase border border-indigo-400/20">Видео</span>
                              ) : tpl.type === 'website' ? (
                                <span className="text-[9px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded font-bold uppercase border border-teal-400/20">Сайт</span>
                              ) : tpl.type === 'physical' ? (
                                <span className="text-[9px] text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded font-bold uppercase border border-pink-400/20">Печать</span>
                              ) : (
                                <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold uppercase border border-amber-400/20">Фото</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs font-bold text-slate-300 font-mono">
                          {Number(tpl.price).toLocaleString('ru-RU')} сум
                        </td>
                        <td className="py-4 px-6 text-xs font-mono">
                          {tpl.discount_price !== null && tpl.discount_price !== undefined ? (
                            <span className="text-emerald-400 font-bold">{Number(tpl.discount_price).toLocaleString('ru-RU')} сум</span>
                          ) : (
                            <span className="text-slate-600">Нет скидки</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditForm(tpl)}
                              className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded text-slate-400 hover:text-amber-400 transition-colors"
                              title="Редактировать"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(tpl.id)}
                              className="p-1.5 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 rounded text-slate-400 hover:text-rose-400 transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 px-6 text-center text-slate-500">
                        Шаблоны отсутствуют
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'promocodes' && (
        // PROMOCODES TAB
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Маркетинговые Промокоды</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={refreshPromocodes}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                {loadingPromocodes && <Loader2 className="w-3 h-3 animate-spin" />} Обновить
              </button>
              <button 
                onClick={() => setIsPromoModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/15"
              >
                <Plus className="w-4 h-4" /> Создать промокод
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs text-slate-400 tracking-wider uppercase font-semibold">
                    <th className="py-4 px-6 font-semibold">Промокод</th>
                    <th className="py-4 px-6 font-semibold">Тип скидки</th>
                    <th className="py-4 px-6 font-semibold">Размер скидки</th>
                    <th className="py-4 px-6 font-semibold">Мин. чек</th>
                    <th className="py-4 px-6 font-semibold">Использования</th>
                    <th className="py-4 px-6 font-semibold">Партнер / Блогер</th>
                    <th className="py-4 px-6 font-semibold">Статус</th>
                    <th className="py-4 px-6 font-semibold text-center">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingPromocodes ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : promocodes.length > 0 ? (
                    promocodes.map(promo => (
                      <tr key={promo.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs font-bold text-amber-400">
                          {promo.code}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-300">
                          {promo.discount_type === 'percentage' ? 'Процентный (%)' : 'Фиксированный (сум)'}
                        </td>
                        <td className="py-4 px-6 text-xs font-bold text-emerald-400 font-mono">
                          {promo.discount_type === 'percentage' 
                            ? `${promo.discount_value}%` 
                            : `${Number(promo.discount_value).toLocaleString('ru-RU')} сум`}
                        </td>
                        <td className="py-4 px-6 text-xs font-mono text-slate-300">
                          {Number(promo.min_order_amount) > 0 
                            ? `${Number(promo.min_order_amount).toLocaleString('ru-RU')} сум` 
                            : 'Без лимита'}
                        </td>
                        <td className="py-4 px-6 text-xs font-mono text-slate-300">
                          <span className="font-bold text-slate-200">{promo.uses_count}</span> / {promo.max_uses}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400">
                          {promo.partner_name || '—'}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleTogglePromocodeActive(promo.id, promo.is_active)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                              promo.is_active 
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                                : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                            }`}
                          >
                            {promo.is_active ? 'Активен' : 'Отключен'}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleDeletePromocode(promo.id)}
                            className="p-1.5 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 rounded text-slate-400 hover:text-rose-400 transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 px-6 text-center text-slate-500">
                        Промокоды отсутствуют
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PROMOCODE FORM MODAL */}
      <AnimatePresence>
        {isPromoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.form
              onSubmit={handleCreatePromocodeSubmit}
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-panel-heavy p-6 md:p-8 rounded-3xl max-w-md w-full border border-white/10 flex flex-col gap-5 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="text-xl font-bold tracking-wide gold-gradient-text">Создание промокода</h3>
                <p className="text-xs text-slate-400 mt-1">Задайте условия маркетинговой скидки</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Код промокода</label>
                  <input
                    type="text"
                    required
                    placeholder="Например: WEDDING2026"
                    className="w-full bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl outline-none focus:border-amber-500 uppercase tracking-wider font-mono text-sm text-slate-100"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Тип скидки</label>
                    <select
                      className="w-full bg-slate-900 border border-white/10 px-3 py-2.5 rounded-xl outline-none focus:border-amber-500 text-xs text-slate-200"
                      value={newPromoType}
                      onChange={(e) => setNewPromoType(e.target.value as any)}
                    >
                      <option value="percentage">Процент (%)</option>
                      <option value="fixed">Сумма (сум)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Размер скидки</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl outline-none focus:border-amber-500 text-xs font-mono text-slate-100"
                      value={newPromoValue}
                      onChange={(e) => setNewPromoValue(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Мин. чек (сум)</label>
                    <input
                      type="number"
                      className="w-full bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl outline-none focus:border-amber-500 text-xs font-mono text-slate-100"
                      value={newPromoMinOrder}
                      onChange={(e) => setNewPromoMinOrder(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Лимит использований</label>
                    <input
                      type="number"
                      className="w-full bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl outline-none focus:border-amber-500 text-xs font-mono text-slate-100"
                      value={newPromoMaxUses}
                      onChange={(e) => setNewPromoMaxUses(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Партнер / Блогер (опционально)</label>
                  <input
                    type="text"
                    placeholder="Например: Event-агентство, Блогер Азиза"
                    className="w-full bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl outline-none focus:border-amber-500 text-xs text-slate-100"
                    value={newPromoPartner}
                    onChange={(e) => setNewPromoPartner(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-xs font-semibold text-slate-300 transition-all"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs shadow-lg shadow-amber-500/15 transition-all"
                >
                  Сохранить
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TEMPLATE FORM MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 md:p-6"
          >
            <motion.form
              onSubmit={handleSubmit}
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-panel-heavy p-6 md:p-8 rounded-3xl max-w-[1200px] w-full border border-white/10 flex flex-col gap-6 shadow-2xl relative my-8"
            >
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:border-white/20 transition-all text-slate-400 hover:text-slate-100"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="text-lg font-bold tracking-wide gold-gradient-text">
                  {editingTemplate ? 'Редактировать шаблон макета' : 'Добавить новый шаблон макета'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Настройте тип, цену, загрузите файл и добавьте динамические текстовые поля для пользователей
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-visible">
                {/* LEFT SIDE: Core Properties */}
                <div className="lg:col-span-4 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
                  {/* Type Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">Тип шаблона</label>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => { setFormType('virtual'); setFormMediaKind('photo'); }}
                        className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold border transition-all ${formType === 'virtual' && formMediaKind === 'photo' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'}`}
                      >
                        Фото (Virtual)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setFormType('virtual'); setFormMediaKind('video'); }}
                        className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold border transition-all ${formType === 'virtual' && formMediaKind === 'video' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300' : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'}`}
                      >
                        Видео (MP4)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setFormType('physical'); setFormMediaKind('photo'); }}
                        className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold border transition-all ${formType === 'physical' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'}`}
                      >
                        Печать (Physical)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setFormType('website'); setFormMediaKind('photo'); }}
                        className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold border transition-all ${formType === 'website' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'}`}
                      >
                        Сайт (Website)
                      </button>
                    </div>
                    {formMediaKind === 'video' && (
                      <p className="text-[10px] text-indigo-200/80 leading-relaxed">
                        Можно загрузить MP4 сразу или PNG/JPG: картинка автоматически станет коротким видео-шаблоном.
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">Категория</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/10 rounded-lg outline-none text-xs transition-all"
                    >
                      <option value="wedding" className="bg-slate-950">Свадьба (wedding)</option>
                      <option value="birthday" className="bg-slate-950">День рождения (birthday)</option>
                      <option value="party" className="bg-slate-950">Вечеринка (party)</option>
                      <option value="other" className="bg-slate-950">Другое (other)</option>
                    </select>
                  </div>

                  {/* Pricing (Base & Discount) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-300">Базовая цена (сум)</label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/10 rounded-lg outline-none text-xs transition-all font-mono"
                        placeholder="Напр. 75000"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-300">Скидка (сум, опционально)</label>
                      <input
                        type="number"
                        value={formDiscountPrice}
                        onChange={(e) => setFormDiscountPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/10 rounded-lg outline-none text-xs transition-all font-mono"
                        placeholder="Напр. 50000"
                      />
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">Файл макета (Изображение или Видео)</label>
                    
                    {/* Visual Media Picker Box */}
                    <div className="relative border border-dashed border-white/10 rounded-xl p-4 bg-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                      <Upload className="w-5 h-5 text-amber-500" />
                      <span className="text-[10px] text-slate-400 font-medium">
                        {selectedFile ? `Выбран: ${selectedFile.name}` : 'Выберите файл (PNG, JPG, MP4)'}
                      </span>
                    </div>

                    {formMediaUrl && !selectedFile && (
                      <div className="text-[10px] text-slate-400 truncate bg-white/5 border border-white/5 p-2 rounded">
                        Текущий URL: <span className="font-mono text-amber-400/90">{formMediaUrl}</span>
                      </div>
                    )}
                  </div>

                  {/* Template Canvas Resolution */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-300">Ширина макета (px)</label>
                      <input
                        type="number"
                        required
                        value={dimWidth}
                        onChange={(e) => setDimWidth(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/10 rounded-lg outline-none text-xs transition-all font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-300">Высота макета (px)</label>
                      <input
                        type="number"
                        required
                        value={dimHeight}
                        onChange={(e) => setDimHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 focus:border-amber-500 focus:bg-white/10 rounded-lg outline-none text-xs transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* MIDDLE SIDE: Dynamic Fields Constructor */}
                <div className="lg:col-span-4 flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-2 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
                  <div className="flex justify-between items-center sticky top-0 bg-slate-950/90 backdrop-blur py-1 z-10">
                    <label className="text-xs font-bold uppercase tracking-wider text-amber-400">Поля ввода ({textFields.length})</label>
                    <button
                      type="button"
                      onClick={handleAddField}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-bold text-amber-400 tracking-wide transition-all"
                    >
                      + Добавить
                    </button>
                  </div>

                  {textFields.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {textFields.map((field, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-3.5 relative hover:border-white/20 transition-all">
                          <button
                            type="button"
                            onClick={() => handleRemoveField(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded text-rose-400 transition-colors"
                            title="Удалить текстовое поле"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Row 1: ID, Label, Placeholder */}
                          <div className="grid grid-cols-3 gap-2 mt-1">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">ID</span>
                              <input
                                type="text"
                                required
                                value={field.id}
                                onChange={(e) => handleFieldChange(idx, 'id', e.target.value)}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] outline-none"
                                placeholder="names"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Название</span>
                              <input
                                type="text"
                                required
                                value={field.label}
                                onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] outline-none"
                                placeholder="Имена"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Подсказка</span>
                              <input
                                type="text"
                                value={field.placeholder}
                                onChange={(e) => handleFieldChange(idx, 'placeholder', e.target.value)}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] outline-none"
                                placeholder="Иван & Анна"
                              />
                            </div>
                          </div>

                          {/* Row 2: X, Y, FontSize */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">X (px)</span>
                              <input
                                type="number"
                                required
                                value={field.x}
                                onChange={(e) => handleFieldChange(idx, 'x', Number(e.target.value))}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] outline-none font-mono"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Y (px)</span>
                              <input
                                type="number"
                                required
                                value={field.y}
                                onChange={(e) => handleFieldChange(idx, 'y', Number(e.target.value))}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] outline-none font-mono"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Размер</span>
                              <input
                                type="number"
                                required
                                value={field.fontSize}
                                onChange={(e) => handleFieldChange(idx, 'fontSize', Number(e.target.value))}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] outline-none font-mono"
                              />
                            </div>
                          </div>

                          {/* Row 3: FontFamily, Color, Align, MaxLength */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Шрифт</span>
                              <select
                                value={field.fontFamily}
                                onChange={(e) => handleFieldChange(idx, 'fontFamily', e.target.value)}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] outline-none"
                              >
                                <option value="Playfair Display" className="bg-slate-950">Playfair</option>
                                <option value="Montserrat" className="bg-slate-950">Montserrat</option>
                                <option value="sans-serif" className="bg-slate-950">Sans-Serif</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Выравнивание</span>
                              <select
                                value={field.align}
                                onChange={(e) => handleFieldChange(idx, 'align', e.target.value)}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] outline-none"
                              >
                                <option value="left" className="bg-slate-950">Лево</option>
                                <option value="center" className="bg-slate-950">Центр</option>
                                <option value="right" className="bg-slate-950">Право</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Макс. длина</span>
                              <input
                                type="number"
                                value={field.maxLength || ''}
                                onChange={(e) => handleFieldChange(idx, 'maxLength', e.target.value ? Number(e.target.value) : undefined)}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] outline-none font-mono"
                                placeholder="Без лим."
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Цвет текста</span>
                              <div className="flex gap-1 items-center">
                                <input
                                  type="color"
                                  value={field.color}
                                  onChange={(e) => handleFieldChange(idx, 'color', e.target.value)}
                                  className="w-5 h-5 border-0 bg-transparent rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={field.color}
                                  onChange={(e) => handleFieldChange(idx, 'color', e.target.value)}
                                  className="w-full px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] outline-none font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10 text-xs text-slate-500">
                      Не добавлено ни одного текстового поля. Макет будет статичным.
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE: Live WYSIWYG Preview */}
                <div className="lg:col-span-4 flex flex-col gap-4 items-center">
                  <div className="sticky top-0 w-full flex flex-col gap-4 items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                    <div className="flex items-center gap-1.5 self-start">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                      <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Живой предпросмотр</span>
                    </div>

                    {previewTemplate.media_url ? (
                      <div className="relative rounded-xl overflow-hidden border border-white/10 w-full flex items-center justify-center p-2 bg-slate-950/80">
                        <TemplatePreview template={previewTemplate} formData={previewFormData} />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] w-full max-w-[240px] bg-slate-900/40 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 text-xs p-6 text-center">
                        <ImageIcon className="w-8 h-8 text-slate-600 mb-2" />
                        <span>Выберите файл или укажите URL макета</span>
                      </div>
                    )}
                    
                    <p className="text-[9px] text-slate-500 text-center leading-relaxed">
                      Изменяйте координаты X/Y, размер или цвет полей, чтобы мгновенно увидеть результат на холсте.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="border-t border-white/10 pt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-slate-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs tracking-wide transition-all shadow-lg shadow-amber-500/15 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Сохранение...
                    </>
                  ) : (
                    'Сохранить шаблон'
                  )}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------- STANDALONE WEBSITE INVITATION PAGE -----------------
export function InvitationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Interactive State
  const [isOpened, setIsOpened] = useState(false);
  const [lang] = useState<'ru' | 'uz'>('ru');
  const [isPlaying, setIsPlaying] = useState(false);

  // RSVP Form state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(null);
  const [rsvpWishes, setRsvpWishes] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false });

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchOrder = () => {
    fetch(`${API_URL}/orders/${id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!order) return;
    
    const targetDateStr = order.user_data.date;
    const targetTimeStr = order.user_data.time || "18:00";

    const updateTimer = () => {
      const targetDate = parseEventDateTime(targetDateStr, targetTimeStr);
      setTimeLeft(calculateTimeLeft(targetDate));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || rsvpAttending === null) return;

    setIsSubmittingRsvp(true);
    try {
      const res = await fetch(`${API_URL}/orders/${id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: rsvpName,
          attending: rsvpAttending,
          wishes: rsvpWishes,
        })
      });

      if (!res.ok) throw new Error();
      
      setRsvpSuccess(true);
      fetchOrder();
    } catch (err) {
      alert('Ошибка при отправке ответа. Попробуйте еще раз.');
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio autoplay bypass blocked:", err));
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log(err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-xs text-slate-400 mt-4 tracking-widest font-semibold uppercase">Загрузка приглашения...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-lg font-bold">Приглашение не найдено</h2>
        <p className="text-xs text-slate-400 mt-2">Ссылка недействительна или заказ был удален.</p>
        <Link to="/" className="mt-6 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/10">
          На главную
        </Link>
      </div>
    );
  }

  if (order.status !== 'paid' && Number(order.total_price || 0) > 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-6 text-center">
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-amber-500/30 flex flex-col items-center gap-6 shadow-2xl">
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
            <Lock className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">Приглашение не оплачено</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Доступ к веб-приглашению блокируется до подтверждения оплаты через Click.
            </p>
          </div>
          <div className="w-full">
            <ClickPayButtons orderId={order.id} amount={Number(order.total_price)} />
          </div>
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-400 mt-2">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  // Extract fields config
  const activeFields = (order.user_data._customFields as any) || order.template.text_config.fields || [];
  const standardIds = ['groomName', 'brideName', 'date', 'time', 'venue', 'address', 'loveStory', 'phone'];
  const customDynamicFields = activeFields.filter((f: any) => !standardIds.includes(f.id));

  const audioUrl = 'https://www.mfiles.co.uk/mp3-downloads/mendelssohn-wedding-march.mp3';

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop />
      <WebsiteTemplateDispatcher 
        templateId={order.template.id}
        data={order.user_data}
        customFields={customDynamicFields}
        lang={lang}
        isOpened={isOpened}
        onOpenEnvelope={handleOpenEnvelope}
        isPlaying={isPlaying}
        onToggleAudio={toggleAudio}
        timeLeft={timeLeft}
        rsvpState={{
          name: rsvpName,
          setName: setRsvpName,
          attending: rsvpAttending,
          setAttending: setRsvpAttending,
          wishes: rsvpWishes,
          setWishes: setRsvpWishes,
          isSubmitting: isSubmittingRsvp,
          isSuccess: rsvpSuccess,
          onSubmit: handleRsvpSubmit,
        }}
        isPreview={false}
      />
    </>
  );
}
