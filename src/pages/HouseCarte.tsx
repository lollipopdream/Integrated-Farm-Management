import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Home, Wheat, FlaskConical, ShieldCheck, Image, ClipboardList,
  Calendar, AlertCircle, CheckCircle2, Wrench
} from 'lucide-react';
import {
  houses, lots, workLogs, pesticideHistory, qualityIssues,
  workers, workTypes
} from '../data/mockData';

const houseHarvestByDay = (houseId: string) => {
  const dates = ['08/08', '08/09', '08/10', '08/11', '08/12', '08/13', '08/14'];
  return dates.map(d => ({
    date: d,
    kg: workLogs
      .filter(l => l.houseId === houseId && l.date.endsWith(d.replace('/', '-')))
      .reduce((s, l) => s + l.harvestKg, 0),
  }));
};

const statusIcon = (s: string) => {
  if (s === 'active') return <CheckCircle2 size={14} className="text-farm-green" />;
  if (s === 'maintenance') return <Wrench size={14} className="text-orange-500" />;
  return <AlertCircle size={14} className="text-gray-400" />;
};

const statusLabel = (s: string) => ({
  active: { label: '稼働中', cls: 'badge-green' },
  maintenance: { label: 'メンテ中', cls: 'badge-yellow' },
  inactive: { label: '停止中', cls: 'badge-gray' },
})[s] ?? { label: s, cls: 'badge-gray' };

export default function HouseCarte() {
  const [selectedHouseId, setSelectedHouseId] = useState(houses[0].id);
  const [activeTab, setActiveTab] = useState<'harvest' | 'work' | 'pesticide' | 'quality' | 'photos'>('harvest');

  const house = houses.find(h => h.id === selectedHouseId)!;
  const lot = lots.find(l => l.houseId === selectedHouseId);
  const harvestChart = houseHarvestByDay(selectedHouseId);
  const houseLogs = workLogs.filter(l => l.houseId === selectedHouseId);
  const housePesticide = pesticideHistory.filter(p => p.houseId === selectedHouseId);
  const houseQuality = qualityIssues.filter(q => q.houseId === selectedHouseId);
  const totalHarvest = houseLogs.reduce((s, l) => s + l.harvestKg, 0);

  const tabs = [
    { key: 'harvest', label: '収穫', icon: Wheat },
    { key: 'work', label: '作業履歴', icon: ClipboardList },
    { key: 'pesticide', label: '農薬・肥料', icon: FlaskConical },
    { key: 'quality', label: '品質', icon: ShieldCheck },
    { key: 'photos', label: '写真', icon: Image },
  ] as const;

  const sl = statusLabel(house.status);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Home className="text-farm-green" size={24} />
            ハウスカルテ
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">ハウスごとの全データを一元管理</p>
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* House selector */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ハウス一覧</p>
            </div>
            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
              {houses.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHouseId(h.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${selectedHouseId === h.id ? 'bg-farm-green-pale border-r-2 border-farm-green' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    h.crop === '大葉' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    <Wheat size={14} className={h.crop === '大葉' ? 'text-farm-green' : 'text-orange-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{h.name}</p>
                    <p className="text-xs text-gray-400">{h.block} · {h.crop}</p>
                  </div>
                  {statusIcon(h.status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main carte */}
        <div className="flex-1 space-y-4">
          {/* House header */}
          <div className="card">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{house.name}</h2>
                  <span className={sl.cls}>{sl.label}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Home size={13} />{house.block}</span>
                  <span className="flex items-center gap-1.5"><Wheat size={13} />{house.crop}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} />面積: {house.area}㎡</span>
                  {lot && <span className="flex items-center gap-1.5">🌱 {lot.lotNo} ({lot.status})</span>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-farm-green-pale rounded-xl px-4 py-3">
                  <p className="text-xl font-bold text-farm-green">{totalHarvest.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">累計収穫(kg)</p>
                </div>
                <div className="bg-blue-50 rounded-xl px-4 py-3">
                  <p className="text-xl font-bold text-blue-600">{houseLogs.length}</p>
                  <p className="text-xs text-gray-500">作業回数</p>
                </div>
                <div className={`rounded-xl px-4 py-3 ${houseQuality.some(q=>q.status==='open'||q.status==='investigating') ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <p className={`text-xl font-bold ${houseQuality.some(q=>q.status==='open'||q.status==='investigating') ? 'text-farm-red' : 'text-gray-600'}`}>
                    {houseQuality.length}
                  </p>
                  <p className="text-xs text-gray-500">品質記録</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex-1 justify-center ${
                  activeTab === key ? 'bg-white text-farm-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'harvest' && (
            <div className="card">
              <h3 className="section-title mb-4">収穫量推移（直近7日）</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={harvestChart} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit="kg" />
                  <Tooltip formatter={(v) => [`${v} kg`, '収穫量']} />
                  <Bar dataKey="kg" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="font-bold text-gray-800">{Math.max(...harvestChart.map(d=>d.kg)).toFixed(1)} kg</p>
                  <p className="text-xs text-gray-400">最高日収穫</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="font-bold text-gray-800">{(harvestChart.reduce((s,d)=>s+d.kg,0)/harvestChart.filter(d=>d.kg>0).length||0).toFixed(1)} kg</p>
                  <p className="text-xs text-gray-400">日平均収穫</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="font-bold text-gray-800">{harvestChart.reduce((s,d)=>s+d.kg,0).toFixed(1)} kg</p>
                  <p className="text-xs text-gray-400">7日累計</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'work' && (
            <div className="card">
              <h3 className="section-title mb-4">作業履歴</h3>
              {houseLogs.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">記録がありません</p>
              ) : (
                <div className="space-y-3">
                  {houseLogs.map(l => {
                    const worker = workers.find(w => w.id === l.workerId);
                    const wt = workTypes.find(w => w.id === l.workTypeId);
                    return (
                      <div key={l.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: `${wt?.color}20` }}>
                          {wt?.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{wt?.name} — {worker?.name}</p>
                          <p className="text-xs text-gray-400">{l.date} {l.startTime}〜{l.endTime}</p>
                        </div>
                        {l.harvestKg > 0 && (
                          <span className="text-sm font-bold text-farm-green">{l.harvestKg} kg</span>
                        )}
                        <span className={`badge text-xs ${l.status === 'completed' ? 'badge-green' : 'badge-blue'}`}>
                          {l.status === 'completed' ? '完了' : '作業中'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pesticide' && (
            <div className="card">
              <h3 className="section-title mb-4">農薬・肥料使用履歴</h3>
              {housePesticide.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">記録がありません</p>
              ) : (
                <div className="space-y-3">
                  {housePesticide.map(p => {
                    const w = workers.find(w => w.id === p.workerId);
                    const isCleared = p.clearDate === '-' || new Date(p.clearDate) <= new Date('2024-08-14');
                    return (
                      <div key={p.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-800 text-sm">{p.chemical}</p>
                          <span className={`badge text-xs ${isCleared ? 'badge-green' : 'badge-yellow'}`}>
                            {isCleared ? '使用解禁' : `解禁: ${p.clearDate}`}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <span>目的: {p.purpose}</span>
                          <span>希釈: {p.dilution}</span>
                          <span>使用量: {p.amount}{p.unit}</span>
                          <span>散布者: {w?.name}</span>
                          <span>散布日: {p.date}</span>
                          <span>前日数: {p.preClearDays}日</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="card">
              <h3 className="section-title mb-4">品質記録</h3>
              {houseQuality.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">品質問題の記録はありません</p>
              ) : (
                <div className="space-y-3">
                  {houseQuality.map(q => {
                    const statusMap: Record<string, { label: string; cls: string }> = {
                      open: { label: '対応中', cls: 'badge-red' },
                      investigating: { label: '調査中', cls: 'badge-yellow' },
                      resolved: { label: '解決済', cls: 'badge-green' },
                    };
                    const st = statusMap[q.status] ?? { label: q.status, cls: 'badge-gray' };
                    const w = workers.find(w => w.id === q.workerId);
                    return (
                      <div key={q.id} className={`p-4 rounded-xl border ${
                        q.severity === 'high' ? 'border-red-200 bg-red-50' :
                        q.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-800 text-sm">{q.type}</p>
                          <span className={st.cls}>{st.label}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{q.description}</p>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>{q.date}</span>
                          <span>報告者: {w?.name}</span>
                          {q.photo && <span className="flex items-center gap-1"><Image size={11} />写真あり</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="card">
              <h3 className="section-title mb-4">作業写真</h3>
              <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                    <Image size={28} />
                    <p className="text-xs mt-1">08/{8+i}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">実際の環境ではGoogle Drive / Cloud Storageから写真が表示されます</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
