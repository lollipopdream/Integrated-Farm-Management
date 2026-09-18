import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Wheat, TrendingUp, Download, Search } from 'lucide-react';
import { weeklyHarvestChart, monthlyHarvestChart, houses, workers, workLogs } from '../data/mockData';

const cropColors: Record<string, string> = {
  '大葉': '#2d6a4f',
  'いちご': '#f4a261',
};

const houseHarvestSummary = houses.filter(h => h.status === 'active').map(h => {
  const logs = workLogs.filter(l => l.houseId === h.id && l.harvestKg > 0);
  const total = logs.reduce((s, l) => s + l.harvestKg, 0);
  return { ...h, totalKg: total, sessions: logs.length };
});

const recentLogs = workLogs
  .filter(l => l.harvestKg > 0)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(l => ({
    ...l,
    houseName: houses.find(h => h.id === l.houseId)?.name ?? '-',
    crop: houses.find(h => h.id === l.houseId)?.crop ?? '-',
    workerName: workers.find(w => w.id === l.workerId)?.name ?? '-',
    kgPerHour: l.durationMin > 0 ? (l.harvestKg / (l.durationMin / 60)).toFixed(2) : '-',
  }));

export default function HarvestManagement() {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [cropFilter, setCropFilter] = useState<'all' | '大葉' | 'いちご'>('all');
  const [searchText, setSearchText] = useState('');

  const chartData = (viewMode === 'weekly' ? weeklyHarvestChart : monthlyHarvestChart) as Array<{[key: string]: string | number}>;
  const xKey = viewMode === 'weekly' ? 'day' : 'month';

  const filteredLogs = recentLogs.filter(l => {
    if (cropFilter !== 'all' && l.crop !== cropFilter) return false;
    if (searchText && !l.houseName.includes(searchText) && !l.workerName.includes(searchText)) return false;
    return true;
  });

  const totalToday = recentLogs.filter(l => l.date === '2024-08-14').reduce((s, l) => s + l.harvestKg, 0);
  const totalWeek = recentLogs.reduce((s, l) => s + l.harvestKg, 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Wheat className="text-farm-green" size={24} />
            収穫管理
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">大葉・いちごの収穫量記録と分析</p>
        </div>
        <button className="btn-secondary text-sm">
          <Download size={16} />
          CSV出力
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '本日の収穫量', value: totalToday.toFixed(1), unit: 'kg', color: 'bg-farm-green' },
          { label: '今週累計', value: totalWeek.toFixed(1), unit: 'kg', color: 'bg-farm-sky' },
          { label: '大葉 本日', value: recentLogs.filter(l=>l.date==='2024-08-14'&&l.crop==='大葉').reduce((s,l)=>s+l.harvestKg,0).toFixed(1), unit: 'kg', color: 'bg-green-600' },
          { label: 'いちご 本日', value: recentLogs.filter(l=>l.date==='2024-08-14'&&l.crop==='いちご').reduce((s,l)=>s+l.harvestKg,0).toFixed(1), unit: 'kg', color: 'bg-orange-500' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
              <Wheat size={16} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}<span className="text-sm font-normal text-gray-400 ml-1">{s.unit}</span></p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="section-title flex items-center gap-2">
            <TrendingUp size={18} className="text-farm-green" />
            収穫量推移
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-xl p-1">
              {(['weekly', 'monthly'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === v ? 'bg-white text-farm-green shadow-sm' : 'text-gray-500'}`}
                >
                  {v === 'weekly' ? '週次' : '月次'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="kg" />
            <Tooltip
              formatter={(v, name) => [`${v} kg`, name === 'shiso' ? '大葉' : 'いちご']}
            />
            <Legend formatter={v => v === 'shiso' ? '大葉' : 'いちご'} />
            <Bar dataKey="shiso" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
            <Bar dataKey="strawberry" fill="#f4a261" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* House summary */}
      <div className="card">
        <h2 className="section-title mb-4">ハウス別収穫サマリー</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {houseHarvestSummary.map(h => (
            <div key={h.id} className="bg-gray-50 rounded-xl p-4 hover:bg-farm-green-pale transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">{h.name}</span>
                <span
                  className="badge text-xs"
                  style={{ background: `${cropColors[h.crop]}20`, color: cropColors[h.crop] }}
                >
                  {h.crop}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-800">{h.totalKg.toFixed(1)}<span className="text-xs font-normal text-gray-400 ml-1">kg</span></p>
              <p className="text-xs text-gray-400 mt-1">{h.sessions}回収穫</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="rounded-full h-1.5"
                  style={{
                    width: `${Math.min(100, (h.totalKg / 50) * 100)}%`,
                    background: cropColors[h.crop]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="section-title">収穫記録一覧</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="ハウス・作業者名で検索"
                className="input pl-8 text-sm w-48"
              />
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              {(['all', '大葉', 'いちご'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setCropFilter(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${cropFilter === v ? 'bg-white text-farm-green shadow-sm' : 'text-gray-500'}`}
                >
                  {v === 'all' ? '全て' : v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-xl">日付</th>
                <th className="text-left px-4 py-3">ハウス</th>
                <th className="text-left px-4 py-3">作物</th>
                <th className="text-left px-4 py-3">作業者</th>
                <th className="text-right px-4 py-3">収穫量</th>
                <th className="text-right px-4 py-3">作業時間</th>
                <th className="text-right px-4 py-3 rounded-r-xl">生産性</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map(l => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{l.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{l.houseName}</td>
                  <td className="px-4 py-3">
                    <span
                      className="badge text-xs px-2.5 py-1"
                      style={{ background: `${cropColors[l.crop]}20`, color: cropColors[l.crop] }}
                    >
                      {l.crop}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{l.workerName}</td>
                  <td className="px-4 py-3 text-right font-bold text-farm-green">{l.harvestKg.toFixed(1)} kg</td>
                  <td className="px-4 py-3 text-right text-gray-500">{Math.floor(l.durationMin / 60)}h{l.durationMin % 60}m</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-700">{l.kgPerHour} kg/h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
