import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Home, Users, Wheat, AlertTriangle, TrendingUp,
  Clock, CheckCircle2, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { weeklyHarvestChart, workLogs, workPlans, houses, workers, alerts, productivityData } from '../data/mockData';

const todayPlans = workPlans.filter(p => p.date === '2024-08-14');
const completedPlans = todayPlans.filter(p => p.status === 'completed').length;
const inProgressPlans = todayPlans.filter(p => p.status === 'in_progress').length;
const todayHarvest = workLogs
  .filter(l => l.date === '2024-08-14')
  .reduce((sum, l) => sum + l.harvestKg, 0);

const StatCard = ({
  title, value, unit, icon: Icon, color, trend, trendVal
}: {
  title: string; value: string | number; unit?: string;
  icon: React.ElementType; color: string; trend?: 'up' | 'down'; trendVal?: string;
}) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendVal}
        </span>
      )}
    </div>
    <div className="mt-3">
      <p className="text-2xl font-bold text-gray-800">
        {value}<span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
      </p>
      <p className="text-sm text-gray-500 mt-0.5">{title}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-600">{p.name === 'shiso' ? '大葉' : 'いちご'}: </span>
            <span className="font-medium">{p.value} kg</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const activeWorkers = workers.filter(w => w.active).length;
  const activeHouses = houses.filter(h => h.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.filter(a => a.severity === 'high').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-farm-red flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-800 text-sm">要対応アラート</p>
            <div className="mt-1 space-y-1">
              {alerts.filter(a => a.severity === 'high').map(a => (
                <p key={a.id} className="text-sm text-red-700">・{a.message}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="稼働中ハウス" value={activeHouses} unit="棟" icon={Home} color="bg-farm-green" trend="up" trendVal="+2" />
        <StatCard title="本日稼働人数" value={activeWorkers} unit="名" icon={Users} color="bg-farm-sky" />
        <StatCard title="本日収穫量" value={todayHarvest.toFixed(1)} unit="kg" icon={Wheat} color="bg-farm-yellow" trend="up" trendVal="+8.2%" />
        <StatCard title="本日作業完了" value={`${completedPlans}/${todayPlans.length}`} unit="件" icon={CheckCircle2} color="bg-purple-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly harvest chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">今週の収穫量推移</h2>
            <span className="badge-green">大葉・いちご</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyHarvestChart} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="shiso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="strawberry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f4a261" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f4a261" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="kg" />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => v === 'shiso' ? '大葉' : 'いちご'} />
              <Area type="monotone" dataKey="shiso" stroke="#2d6a4f" strokeWidth={2} fill="url(#shiso)" />
              <Area type="monotone" dataKey="strawberry" stroke="#f4a261" strokeWidth={2} fill="url(#strawberry)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Today's work status */}
        <div className="card">
          <h2 className="section-title mb-4">本日の作業状況</h2>
          <div className="space-y-3">
            {todayPlans.map(plan => {
              const house = houses.find(h => h.id === plan.houseId);
              const workerCount = plan.assignedWorkers.length;
              const statusMap: Record<string, { label: string; cls: string }> = {
                completed: { label: '完了', cls: 'badge-green' },
                in_progress: { label: '作業中', cls: 'badge-blue' },
                planned: { label: '予定', cls: 'badge-gray' },
              };
              const st = statusMap[plan.status] ?? { label: plan.status, cls: 'badge-gray' };
              return (
                <div key={plan.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{house?.name}</p>
                    <p className="text-xs text-gray-400">{plan.startTime}〜{plan.endTime} · {workerCount}名</p>
                  </div>
                  <span className={st.cls}>{st.label}</span>
                </div>
              );
            })}
          </div>
          {/* Summary */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-farm-green-pale rounded-xl p-2">
              <p className="text-lg font-bold text-farm-green">{completedPlans}</p>
              <p className="text-xs text-gray-500">完了</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-2">
              <p className="text-lg font-bold text-blue-600">{inProgressPlans}</p>
              <p className="text-xs text-gray-500">作業中</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-2">
              <p className="text-lg font-bold text-gray-600">{todayPlans.filter(p=>p.status==='planned').length}</p>
              <p className="text-xs text-gray-500">予定</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top productivity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">今月の生産性ランキング</h2>
            <span className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp size={12} />kg/時間</span>
          </div>
          <div className="space-y-3">
            {productivityData.sort((a,b) => b.thisMonth - a.thisMonth).slice(0, 5).map((w, i) => (
              <div key={w.workerId} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-400 text-white' :
                  i === 1 ? 'bg-gray-300 text-gray-700' :
                  i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800 truncate">{w.name}</span>
                    <span className="text-sm font-bold text-farm-green ml-2">{w.thisMonth} kg/h</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-farm-green rounded-full h-1.5"
                      style={{ width: `${(w.thisMonth / 6) * 100}%` }}
                    />
                  </div>
                </div>
                <span className={`text-xs font-medium ${w.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {w.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Recent activity */}
        <div className="card">
          <h2 className="section-title mb-4">アラート・通知</h2>
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl ${
                a.severity === 'high' ? 'bg-red-50' :
                a.severity === 'medium' ? 'bg-yellow-50' : 'bg-gray-50'
              }`}>
                <Activity size={16} className={`mt-0.5 flex-shrink-0 ${
                  a.severity === 'high' ? 'text-farm-red' :
                  a.severity === 'medium' ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{a.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={11} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{a.time}</span>
                    <span className={`badge text-xs ${
                      a.type === 'quality' ? 'bg-red-100 text-red-700' :
                      a.type === 'inventory' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {a.type === 'quality' ? '品質' : a.type === 'inventory' ? '在庫' : '作業'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
