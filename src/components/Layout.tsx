import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Smartphone, Wheat, Home, BarChart2,
  ClipboardList, ShieldCheck, FlaskConical, Package,
  Menu, X, Bell, ChevronRight, Leaf
} from 'lucide-react';
import { alerts } from '../data/mockData';

const navItems = [
  { path: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  { path: '/mobile', label: 'モバイル作業', icon: Smartphone },
  { path: '/harvest', label: '収穫管理', icon: Wheat },
  { path: '/house-carte', label: 'ハウスカルテ', icon: Home },
  { path: '/productivity', label: '生産性分析', icon: BarChart2 },
  { path: '/work-plan', label: '作業計画・配員', icon: ClipboardList },
  { path: '/quality', label: '品質・トレーサビリティ', icon: ShieldCheck },
  { path: '/pesticide', label: '農薬・肥料履歴', icon: FlaskConical },
  { path: '/inventory', label: '月次棚卸', icon: Package },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const highAlerts = alerts.filter(a => a.severity === 'high').length;

  const currentPage = navItems.find(n =>
    n.path === '/' ? location.pathname === '/' : location.pathname.startsWith(n.path)
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        flex flex-col bg-farm-green text-white transition-all duration-300 flex-shrink-0
        ${sidebarOpen ? 'w-64' : 'w-16'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-green-700">
          <div className="w-8 h-8 bg-farm-green-light rounded-lg flex items-center justify-center flex-shrink-0">
            <Leaf size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-bold text-sm leading-tight">ファーム統合管理</div>
              <div className="text-xs text-green-300">Farm Manager</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium
                transition-colors duration-150 group
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'text-green-200 hover:bg-white/10 hover:text-white'}
              `}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center p-4 border-t border-green-700 hover:bg-white/10 transition-colors"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-800 text-base">
              {currentPage?.label ?? 'ページ'}
            </span>
            <ChevronRight size={14} />
            <span>2024年8月14日（水）</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Bell size={20} className="text-gray-600" />
                {highAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-farm-red text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {highAlerts}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm">通知・アラート</div>
                  {alerts.map(a => (
                    <div key={a.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          a.severity === 'high' ? 'bg-farm-red' :
                          a.severity === 'medium' ? 'bg-farm-yellow' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">{a.message}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
              <div className="w-8 h-8 bg-farm-green rounded-full flex items-center justify-center text-white text-sm font-bold">
                管
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-800">鈴木 三郎</div>
                <div className="text-xs text-gray-400">管理者</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for notifications on mobile */}
      {notifOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
      )}
    </div>
  );
}
