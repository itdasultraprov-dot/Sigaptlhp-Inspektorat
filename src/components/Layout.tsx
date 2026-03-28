import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export default function Layout({ children, user, onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Data Temuan', path: '/data', icon: FileText },
    { name: 'Monitoring OPD', path: '/monitoring', icon: BarChart3 },
    { name: 'Laporan', path: '/reports', icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-blue-950 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="bg-white/10 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          {isSidebarOpen && (
            <div className="font-bold text-lg tracking-tight">
              SIGAP <span className="text-blue-400">TLHP</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-blue-700 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg text-white/60 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <header className="bg-white border-b border-[#E4E3E0] h-16 flex items-center justify-between px-8 sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#F5F5F4] rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-[#141414] uppercase tracking-wider">{user.username}</div>
              <div className="text-xs text-[#141414]/50 italic serif">Inspektorat Provinsi Sulawesi Tenggara</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
