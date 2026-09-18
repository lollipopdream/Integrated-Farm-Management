import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { BarChart2, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { productivityData, productivityTrendChart } from '../data/mockData';

const FARM_AVG = 5.01;
const colors = ['#2d6a4f', '#0077b6', '#f4a261', '#9b5de5', '#e63946', '#f4a261'];

const radarData = [
  { metric: '収穫速度', W001: 88, W002: 95, W003: 82 },
  { metric: '作業時間', W001: 90, W002: 88, W003: 93 },
  { metric: '品質', W001: 85, W002: 90, W003: 95 },
  { metric: '安定性', W001: 82, W002: 85, W003: 88 },
  { metric: '報告精度', W001: 95, W002: 80, W003: 92 },
];

export default function Productivity() {
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart' | 'radar'>('table');

  const sorted = [...productivityData].sort((a, b) => b.thisMonth - a.thisMonth);
  const farmAvg = productivityData.reduce((s, w) => s + w.thisMonth, 0) / productivityData.length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart2 className="text-farm-green" size={24} />
            個人生産性分析
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">作業者ごとの収穫効率・推移・比較</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(['table', 'chart', 'radar'] as const).map(v => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === v ? 'bg-white text-farm-green shadow-sm' : 'text-gray-500'}`}
            >
              {{ table: '一覧', chart: '推移', radar: '評価' }[v]}
            </button>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 rounded-2xl p-4 text-sm">
        <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-blue-700">
          生産性指標（kg/時間）は、単純ランキングではなく「評価・教育・作業改善」のための参考データです。
          前月比・農場平均との比較で個人の成長・支援が必要な方を把握します。
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-farm-green">{farmAvg.toFixed(2)}<span className="text-sm font-normal text-gray-400 ml-1">kg/h</span></p>
          <p className="text-sm text-gray-500 mt-0.5">農場平均（今月）</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-gray-800">{sorted[0]?.thisMonth}<span className="text-sm font-normal text-gray-400 ml-1">kg/h</span></p>
          <p className="text-sm text-gray-500 mt-0.5">最高値: {sorted[0]?.name}</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-orange-500">{sorted[sorted.length - 1]?.thisMonth}<span className="text-sm font-normal text-gray-400 ml-1">kg/h</span></p>
          <p className="text-sm text-gray-500 mt-0.5">要サポート: {sorted[sorted.length - 1]?.name}</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-gray-800">{productivityData.filter(w => w.trend.startsWith('+')).length}<span className="text-sm font-normal text-gray-400 ml-1">名</span></p>
          <p className="text-sm text-gray-500 mt-0.5">前月比改善</p>
        </div>
      </div>

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="card">
          <h2 className="section-title mb-4">今月の生産性一覧</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-4 py-3 rounded-l-xl">順位</th>
                  <th className="text-left px-4 py-3">氏名</th>
                  <th className="text-right px-4 py-3">今月 (kg/h)</th>
                  <th className="text-right px-4 py-3">前月 (kg/h)</th>
                  <th className="text-right px-4 py-3">農場平均</th>
                  <th className="text-right px-4 py-3">前月比</th>
                  <th className="text-right px-4 py-3 rounded-r-xl">vs 農場平均</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((w, i) => {
                  const vsAvg = w.thisMonth - FARM_AVG;
                  const isUp = w.trend.startsWith('+');
                  return (
                    <tr
                      key={w.workerId}
                      onClick={() => setSelectedWorker(selectedWorker === w.workerId ? null : w.workerId)}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedWorker === w.workerId ? 'bg-farm-green-pale' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-yellow-400 text-white' :
                          i === 1 ? 'bg-gray-300 text-gray-700' :
                          i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>{i + 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: colors[i % colors.length] }}>
                            {w.name[0]}
                          </div>
                          <span className="font-medium text-gray-800">{w.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-farm-green">{w.thisMonth}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{w.lastMonth}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{FARM_AVG}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`flex items-center justify-end gap-0.5 font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {w.trend}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${vsAvg >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                          {vsAvg >= 0 ? '+' : ''}{vsAvg.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Worker detail bar chart */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">今月 vs 前月 比較</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={productivityData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={n => n.split(' ')[0]} />
                <YAxis domain={[4, 6]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit="kg/h" />
                <Tooltip formatter={(v, n) => [`${v} kg/h`, n === 'thisMonth' ? '今月' : '前月']} />
                <ReferenceLine y={FARM_AVG} stroke="#f4a261" strokeDasharray="4 4" label={{ value: '農場平均', position: 'right', fontSize: 10 }} />
                <Bar dataKey="lastMonth" fill="#d1fae5" radius={[4, 4, 0, 0]} name="前月" />
                <Bar dataKey="thisMonth" fill="#2d6a4f" radius={[4, 4, 0, 0]} name="今月" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Trend chart */}
      {viewMode === 'chart' && (
        <div className="card">
          <h2 className="section-title mb-4">月次推移（個人 vs 農場平均）</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={productivityTrendChart} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[4.2, 5.8]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="kg/h" />
              <Tooltip formatter={(v, n) => [`${v} kg/h`, n === 'farmAvg' ? '農場平均' : n]} />
              <Legend />
              <ReferenceLine y={FARM_AVG} stroke="#f4a261" strokeDasharray="4 4" />
              {(['W001', 'W002', 'W003'] as const).map((k, i) => (
                <Line key={k} type="monotone" dataKey={k} stroke={colors[i]} strokeWidth={2}
                  dot={{ r: 4, fill: colors[i] }}
                  name={productivityData.find(w => w.workerId === k)?.name ?? k} />
              ))}
              <Line type="monotone" dataKey="farmAvg" stroke="#f4a261" strokeWidth={2} strokeDasharray="6 3"
                dot={false} name="農場平均" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {productivityData.slice(0, 3).map(w => (
              <div key={w.workerId} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">{w.name}</p>
                <p className="font-bold text-farm-green mt-1">{w.thisMonth} kg/h</p>
                <p className={`text-xs font-medium mt-0.5 ${w.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{w.trend}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Radar chart */}
      {viewMode === 'radar' && (
        <div className="card">
          <h2 className="section-title mb-2">多面評価チャート</h2>
          <p className="text-xs text-gray-400 mb-4">各作業者のスキル・特性を多角的に評価（100点満点）</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
              {['W001', 'W002', 'W003'].map((k, i) => (
                <Radar key={k} name={productivityData.find(w => w.workerId === k)?.name ?? k}
                  dataKey={k} stroke={colors[i]} fill={colors[i]} fillOpacity={0.15} />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-4 bg-yellow-50 rounded-xl p-3 text-sm text-yellow-800 flex items-start gap-2">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <p>多面評価は管理者が個別の育成計画・改善指導に活用するためのものです。数値のみによる一方的な評価には使用しません。</p>
          </div>
        </div>
      )}
    </div>
  );
}
