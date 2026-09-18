import { useState } from 'react';
import {
  ClipboardList, Plus, ChevronLeft, ChevronRight, Users,
  Clock, CheckCircle2, Circle, AlertCircle, Calendar
} from 'lucide-react';
import { workPlans, houses, workers, workTypes } from '../data/mockData';

const dates = ['2024-08-13', '2024-08-14', '2024-08-15', '2024-08-16', '2024-08-17'];
const dayLabels: Record<string, string> = {
  '2024-08-13': '8/13 (火)',
  '2024-08-14': '8/14 (水) 本日',
  '2024-08-15': '8/15 (木)',
  '2024-08-16': '8/16 (金)',
  '2024-08-17': '8/17 (土)',
};

const statusConfig: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  completed: { label: '完了', cls: 'badge-green', icon: CheckCircle2 },
  in_progress: { label: '作業中', cls: 'badge-blue', icon: Clock },
  planned: { label: '予定', cls: 'badge-gray', icon: Circle },
};

export default function WorkPlan() {
  const [selectedDate, setSelectedDate] = useState('2024-08-14');
  const [showModal, setShowModal] = useState(false);
  const [filterWorker, setFilterWorker] = useState<string>('all');

  const dateIndex = dates.indexOf(selectedDate);
  const dayPlans = workPlans.filter(p => p.date === selectedDate);
  const filteredPlans = filterWorker === 'all'
    ? dayPlans
    : dayPlans.filter(p => p.assignedWorkers.includes(filterWorker));

  // Worker assignment overview for selected date
  const workerCoverage = workers.filter(w => w.active).map(w => ({
    ...w,
    plans: dayPlans.filter(p => p.assignedWorkers.includes(w.id)),
    isAssigned: dayPlans.some(p => p.assignedWorkers.includes(w.id)),
  }));

  const completedCount = dayPlans.filter(p => p.status === 'completed').length;
  const inProgressCount = dayPlans.filter(p => p.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="text-farm-green" size={24} />
            作業計画・配員
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">日次の作業割り当てと進捗管理</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
          <Plus size={16} />
          作業計画を追加
        </button>
      </div>

      {/* Date selector */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedDate(dates[Math.max(0, dateIndex - 1)])}
            disabled={dateIndex === 0}
            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 flex gap-2 overflow-x-auto">
            {dates.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedDate === d
                    ? 'bg-farm-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dayLabels[d]}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedDate(dates[Math.min(dates.length - 1, dateIndex + 1)])}
            disabled={dateIndex === dates.length - 1}
            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plans */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '完了', count: completedCount, color: 'text-farm-green', bg: 'bg-farm-green-pale' },
              { label: '作業中', count: inProgressCount, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: '予定', count: dayPlans.filter(p=>p.status==='planned').length, color: 'text-gray-600', bg: 'bg-gray-100' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">絞り込み:</span>
            <button
              onClick={() => setFilterWorker('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filterWorker === 'all' ? 'bg-farm-green text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              全て
            </button>
            {workers.filter(w => w.active).slice(0, 6).map(w => (
              <button
                key={w.id}
                onClick={() => setFilterWorker(filterWorker === w.id ? 'all' : w.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filterWorker === w.id ? 'bg-farm-green text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {w.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Plan cards */}
          {filteredPlans.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">この日の作業計画はありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlans.map(plan => {
                const house = houses.find(h => h.id === plan.houseId);
                const wt = workTypes.find(w => w.id === plan.workTypeId);
                const assignedWorkerObjs = plan.assignedWorkers.map(id => workers.find(w => w.id === id)).filter(Boolean);
                const st = statusConfig[plan.status] ?? statusConfig.planned;
                const StatusIcon = st.icon;
                return (
                  <div key={plan.id} className={`card hover:shadow-md transition-all border-l-4 ${
                    plan.status === 'completed' ? 'border-l-farm-green' :
                    plan.status === 'in_progress' ? 'border-l-blue-500' : 'border-l-gray-200'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: `${wt?.color}20` }}>
                          {wt?.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-800">{house?.name}</p>
                            <span className={st.cls}>
                              <StatusIcon size={11} className="inline mr-1" />
                              {st.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{wt?.name}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1"><Clock size={11} />{plan.startTime}〜{plan.endTime}</span>
                            <span className="flex items-center gap-1"><Users size={11} />{plan.assignedWorkers.length}名</span>
                            {plan.note && <span className="text-orange-500">{plan.note}</span>}
                          </div>
                        </div>
                      </div>
                      {/* Assigned workers */}
                      <div className="flex -space-x-2 flex-shrink-0">
                        {assignedWorkerObjs.slice(0, 4).map((w, i) => w && (
                          <div
                            key={w.id}
                            title={w.name}
                            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: ['#2d6a4f','#0077b6','#f4a261','#9b5de5'][i % 4] }}
                          >
                            {w.name[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Worker status panel */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <Users size={16} />
              配員状況
            </h2>
            <div className="space-y-2">
              {workerCoverage.map(w => (
                <div key={w.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${w.isAssigned ? 'bg-farm-green-pale' : 'bg-gray-50'}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${w.isAssigned ? 'bg-farm-green' : 'bg-gray-300'}`}>
                    {w.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{w.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {w.isAssigned ? w.plans.map(p => houses.find(h=>h.id===p.houseId)?.name ?? '').join('・') : '未割当'}
                    </p>
                  </div>
                  {w.isAssigned
                    ? <CheckCircle2 size={16} className="text-farm-green flex-shrink-0" />
                    : <AlertCircle size={16} className="text-gray-300 flex-shrink-0" />
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Unassigned houses */}
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle size={15} className="text-orange-500" />
              未割当ハウス
            </h2>
            {(() => {
              const assignedHouses = new Set(dayPlans.map(p => p.houseId));
              const unassigned = houses.filter(h => h.status === 'active' && !assignedHouses.has(h.id));
              return unassigned.length === 0
                ? <p className="text-xs text-gray-400">全ハウスに割当済</p>
                : unassigned.map(h => (
                  <div key={h.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{h.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">{h.crop}</span>
                  </div>
                ));
            })()}
          </div>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">作業計画を追加</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">日付</label>
                <input type="date" defaultValue={selectedDate} className="input" />
              </div>
              <div>
                <label className="label">ハウス</label>
                <select className="input">
                  {houses.filter(h=>h.status==='active').map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.crop})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">作業種別</label>
                <select className="input">
                  {workTypes.map(w => (
                    <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">開始時刻</label>
                  <input type="time" defaultValue="08:00" className="input" />
                </div>
                <div>
                  <label className="label">終了時刻</label>
                  <input type="time" defaultValue="12:00" className="input" />
                </div>
              </div>
              <div>
                <label className="label">担当者</label>
                <div className="grid grid-cols-2 gap-2">
                  {workers.filter(w=>w.active).map(w => (
                    <label key={w.id} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded accent-farm-green" />
                      <span className="text-sm text-gray-700">{w.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">メモ</label>
                <input type="text" placeholder="メモ（任意）" className="input" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">キャンセル</button>
                <button onClick={() => setShowModal(false)} className="btn-primary flex-1">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
