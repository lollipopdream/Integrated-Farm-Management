import { useState } from 'react';
import { FlaskConical, Plus, Search, Download, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { pesticideHistory, houses, workers } from '../data/mockData';

const TODAY = '2024-08-14';

function isClearancePassed(clearDate: string): boolean {
  if (clearDate === '-') return true;
  return clearDate <= TODAY;
}

export default function PesticideHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pesticide' | 'fertilizer'>('all');
  const [showModal, setShowModal] = useState(false);

  const enriched = pesticideHistory.map(p => ({
    ...p,
    houseName: houses.find(h => h.id === p.houseId)?.name ?? '-',
    workerName: workers.find(w => w.id === p.workerId)?.name ?? '-',
    cleared: isClearancePassed(p.clearDate),
  }));

  const filtered = enriched.filter(p => {
    if (typeFilter === 'pesticide' && p.category === '肥料') return false;
    if (typeFilter === 'fertilizer' && p.category !== '肥料') return false;
    if (search && !p.chemical.includes(search) && !p.houseName.includes(search)) return false;
    return true;
  });

  // Clearance calendar items
  const pendingClearance = enriched.filter(p => !p.cleared);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FlaskConical className="text-farm-green" size={24} />
            農薬・肥料使用履歴
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">使用記録・使用前日数管理・トレーサビリティ</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm">
            <Download size={16} />
            CSV出力
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
            <Plus size={16} />
            記録を追加
          </button>
        </div>
      </div>

      {/* Clearance alert */}
      {pendingClearance.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-yellow-600" />
            <p className="font-semibold text-yellow-800 text-sm">使用前日数 未経過のハウス ({pendingClearance.length}件)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pendingClearance.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 text-sm">
                <div>
                  <span className="font-medium text-gray-800">{p.houseName}</span>
                  <span className="text-gray-500 ml-2">{p.chemical}</span>
                </div>
                <span className="text-yellow-700 font-medium">解禁: {p.clearDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-gray-800">{pesticideHistory.length}</p>
          <p className="text-sm text-gray-500">今月の使用記録</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-orange-500">{pendingClearance.length}</p>
          <p className="text-sm text-gray-500">使用前日数未経過</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-farm-green">{enriched.filter(p=>p.cleared).length}</p>
          <p className="text-sm text-gray-500">使用解禁済み</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-blue-600">
            {[...new Set(pesticideHistory.map(p => p.chemical))].length}
          </p>
          <p className="text-sm text-gray-500">使用資材種類</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="農薬名・ハウス名で検索"
            className="input pl-8 text-sm w-56"
          />
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          {([
            { key: 'all', label: '全て' },
            { key: 'pesticide', label: '農薬のみ' },
            { key: 'fertilizer', label: '肥料のみ' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${typeFilter === key ? 'bg-white text-farm-green shadow-sm' : 'text-gray-500'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-xl">散布日</th>
                <th className="text-left px-4 py-3">ハウス</th>
                <th className="text-left px-4 py-3">農薬・資材名</th>
                <th className="text-left px-4 py-3">目的</th>
                <th className="text-center px-4 py-3">希釈倍率</th>
                <th className="text-right px-4 py-3">使用量</th>
                <th className="text-center px-4 py-3">前日数</th>
                <th className="text-center px-4 py-3">解禁日</th>
                <th className="text-center px-4 py-3 rounded-r-xl">状態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{p.houseName}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{p.chemical}</p>
                      <p className="text-xs text-gray-400">{p.workerName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.purpose}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{p.dilution}</td>
                  <td className="px-4 py-3 text-right font-medium">{p.amount}{p.unit}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`badge text-xs ${p.preClearDays === 0 ? 'badge-green' : p.preClearDays <= 7 ? 'badge-yellow' : 'badge-red'}`}>
                      {p.preClearDays === 0 ? '制限なし' : `${p.preClearDays}日前`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{p.clearDate}</td>
                  <td className="px-4 py-3 text-center">
                    {p.cleared ? (
                      <span className="flex items-center justify-center gap-1 text-farm-green text-xs font-medium">
                        <CheckCircle2 size={13} /> 解禁
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 text-orange-500 text-xs font-medium">
                        <AlertTriangle size={13} /> 待機中
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">農薬・肥料使用を記録</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">散布日</label>
                <input type="date" defaultValue={TODAY} className="input" />
              </div>
              <div>
                <label className="label">ハウス</label>
                <select className="input">
                  {houses.filter(h=>h.status==='active').map(h => <option key={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">農薬・資材名</label>
                <input type="text" placeholder="例: アグロスリン乳剤" className="input" />
              </div>
              <div>
                <label className="label">使用目的</label>
                <input type="text" placeholder="例: アブラムシ防除" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">希釈倍率</label>
                  <input type="text" placeholder="例: 1000倍" className="input" />
                </div>
                <div>
                  <label className="label">使用量</label>
                  <input type="number" placeholder="0" className="input" />
                </div>
              </div>
              <div>
                <label className="label">単位</label>
                <select className="input">
                  <option>L</option><option>mL</option><option>g</option><option>kg</option>
                </select>
              </div>
              <div>
                <label className="label">収穫前使用日数（日）</label>
                <input type="number" defaultValue="7" className="input" />
              </div>
              <div>
                <label className="label">散布担当者</label>
                <select className="input">
                  {workers.filter(w=>w.active).map(w => <option key={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-700">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                登録後、収穫前使用日数に基づいて使用解禁日が自動計算されます。
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">キャンセル</button>
                <button onClick={() => setShowModal(false)} className="btn-primary flex-1">登録</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
