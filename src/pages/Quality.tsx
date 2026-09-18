import { useState } from 'react';
import { ShieldCheck, Plus, Search, Image, AlertTriangle, CheckCircle2, Clock, Eye } from 'lucide-react';
import { qualityIssues, houses, workers, lots } from '../data/mockData';

const severityConfig: Record<string, { label: string; cls: string; dot: string }> = {
  high: { label: '重大', cls: 'badge-red', dot: 'bg-farm-red' },
  medium: { label: '中程度', cls: 'badge-yellow', dot: 'bg-orange-400' },
  low: { label: '軽微', cls: 'badge-gray', dot: 'bg-gray-400' },
};
const statusConfig: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  open: { label: '対応中', cls: 'badge-red', icon: AlertTriangle },
  investigating: { label: '調査中', cls: 'badge-yellow', icon: Clock },
  resolved: { label: '解決済', cls: 'badge-green', icon: CheckCircle2 },
};

const issueTypes = ['形状不良', '病害疑い', '着色不良', '異物混入疑い', '腐敗', 'その他'];

export default function Quality() {
  const [filter, setFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<typeof qualityIssues[0] | null>(null);

  const filtered = qualityIssues
    .filter(q => filter === 'all' || q.status === filter)
    .filter(q => {
      if (!search) return true;
      const h = houses.find(h => h.id === q.houseId);
      return h?.name.includes(search) || q.type.includes(search);
    });

  const openCount = qualityIssues.filter(q => q.status === 'open').length;
  const investigatingCount = qualityIssues.filter(q => q.status === 'investigating').length;
  const resolvedCount = qualityIssues.filter(q => q.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-farm-green" size={24} />
            品質・トレーサビリティ
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">品質問題の記録・追跡・分析</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
          <Plus size={16} />
          品質問題を登録
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card border-l-4 border-l-farm-red">
          <p className="text-2xl font-bold text-farm-red">{openCount}</p>
          <p className="text-sm text-gray-500">対応中</p>
        </div>
        <div className="stat-card border-l-4 border-l-orange-400">
          <p className="text-2xl font-bold text-orange-500">{investigatingCount}</p>
          <p className="text-sm text-gray-500">調査中</p>
        </div>
        <div className="stat-card border-l-4 border-l-farm-green">
          <p className="text-2xl font-bold text-farm-green">{resolvedCount}</p>
          <p className="text-sm text-gray-500">解決済</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ハウス・問題種別で検索"
            className="input pl-8 text-sm w-56"
          />
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(['all', 'open', 'investigating', 'resolved'] as const).map(v => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === v ? 'bg-white text-farm-green shadow-sm' : 'text-gray-500'}`}
            >
              {{ all: '全て', open: '対応中', investigating: '調査中', resolved: '解決済' }[v]}
            </button>
          ))}
        </div>
      </div>

      {/* Issue list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card text-center py-12">
            <ShieldCheck size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">該当する品質記録はありません</p>
          </div>
        )}
        {filtered.map(q => {
          const house = houses.find(h => h.id === q.houseId);
          const worker = workers.find(w => w.id === q.workerId);
          const lot = lots.find(l => l.id === q.lotId);
          const sv = severityConfig[q.severity] ?? severityConfig.low;
          const st = statusConfig[q.status] ?? statusConfig.open;
          const StatusIcon = st.icon;

          return (
            <div
              key={q.id}
              className={`card hover:shadow-md transition-all cursor-pointer border-l-4 ${
                q.severity === 'high' ? 'border-l-farm-red' :
                q.severity === 'medium' ? 'border-l-orange-400' : 'border-l-gray-300'
              }`}
              onClick={() => setSelectedIssue(q)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  q.severity === 'high' ? 'bg-red-100' :
                  q.severity === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <ShieldCheck size={18} className={
                    q.severity === 'high' ? 'text-farm-red' :
                    q.severity === 'medium' ? 'text-orange-500' : 'text-gray-400'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-800">{q.type}</p>
                    <span className={sv.cls}>{sv.label}</span>
                    <span className={st.cls}>
                      <StatusIcon size={11} className="inline mr-1" />
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{q.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span>📅 {q.date}</span>
                    <span>🏠 {house?.name}</span>
                    <span>👤 {worker?.name}</span>
                    {lot && <span>🌱 {lot.lotNo}</span>}
                    {q.photo && (
                      <span className="flex items-center gap-1 text-blue-500">
                        <Image size={11} />写真あり
                      </span>
                    )}
                  </div>
                </div>
                <button className="p-2 rounded-xl hover:bg-gray-100 flex-shrink-0">
                  <Eye size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">品質問題の詳細</h3>
              <button onClick={() => setSelectedIssue(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className={severityConfig[selectedIssue.severity]?.cls}>{severityConfig[selectedIssue.severity]?.label}</span>
                <span className={statusConfig[selectedIssue.status]?.cls}>{statusConfig[selectedIssue.status]?.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: '問題種別', value: selectedIssue.type },
                  { label: '発生日', value: selectedIssue.date },
                  { label: 'ハウス', value: houses.find(h=>h.id===selectedIssue.houseId)?.name ?? '-' },
                  { label: '報告者', value: workers.find(w=>w.id===selectedIssue.workerId)?.name ?? '-' },
                  { label: 'ロット', value: lots.find(l=>l.id===selectedIssue.lotId)?.lotNo ?? '-' },
                  { label: '写真', value: selectedIssue.photo ? 'あり' : 'なし' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="font-medium text-gray-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">詳細説明</p>
                <p className="text-sm text-gray-800">{selectedIssue.description}</p>
              </div>
              {selectedIssue.photo && (
                <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center text-gray-300">
                  <div className="text-center">
                    <Image size={28} />
                    <p className="text-xs mt-1">写真プレビュー</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setSelectedIssue(null)} className="btn-secondary flex-1 text-sm">閉じる</button>
                <button className="btn-primary flex-1 text-sm">ステータス更新</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">品質問題を登録</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">発生日</label>
                <input type="date" defaultValue="2024-08-14" className="input" />
              </div>
              <div>
                <label className="label">ハウス</label>
                <select className="input">
                  {houses.filter(h=>h.status==='active').map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">問題種別</label>
                <select className="input">
                  {issueTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">重大度</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map(s => (
                    <label key={s} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium ${severityConfig[s].cls}`}>
                      <input type="radio" name="severity" value={s} className="hidden" />
                      {severityConfig[s].label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">詳細説明</label>
                <textarea placeholder="問題の詳細を記述してください" rows={3} className="input resize-none" />
              </div>
              <div>
                <label className="label">報告者</label>
                <select className="input">
                  {workers.filter(w=>w.active).map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">写真添付</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-farm-green-light transition-colors">
                  <Image size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">タップして写真を選択</p>
                </div>
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
