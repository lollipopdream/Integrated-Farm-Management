import { useState } from 'react';
import {
  QrCode, Play, Square, Camera, Package, CheckCircle2,
  ChevronRight, User, Home, Leaf, Scan, ArrowLeft,
  Plus, Minus, Upload
} from 'lucide-react';
import { workers, houses, workTypes, lots } from '../data/mockData';

type Step = 'select_worker' | 'qr_scan' | 'confirm' | 'working' | 'harvest_input' | 'complete';

const mockScannedHouse = houses[0];
const mockScannedLot = lots[0];
const mockAssignedWork = workTypes[0];

export default function MobileWork() {
  const [step, setStep] = useState<Step>('select_worker');
  const [selectedWorker, setSelectedWorker] = useState(workers[0]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [harvestKg, setHarvestKg] = useState(0.0);
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setInterval> | null>(null);
  const [startTime] = useState('08:00');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [note, setNote] = useState('');

  const startWork = () => {
    const ref = setInterval(() => setElapsedSec(s => s + 1), 1000);
    setTimerRef(ref);
    setStep('working');
  };

  const stopWork = () => {
    if (timerRef) clearInterval(timerRef);
    setStep('harvest_input');
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const adjustKg = (delta: number) => {
    setHarvestKg(prev => Math.max(0, parseFloat((prev + delta).toFixed(1))));
  };

  return (
    <div className="max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="bg-gray-800 rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden" style={{ minHeight: 680 }}>
          {/* Status bar */}
          <div className="bg-farm-green px-6 pt-3 pb-2 flex items-center justify-between">
            <span className="text-white text-xs font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3/4 h-full bg-white rounded-sm" />
              </div>
            </div>
          </div>

          {/* App header */}
          <div className="bg-farm-green px-5 pb-4">
            <div className="flex items-center justify-between">
              {step !== 'select_worker' && step !== 'complete' && (
                <button onClick={() => setStep('select_worker')} className="text-white/80 hover:text-white">
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className={step === 'select_worker' || step === 'complete' ? 'flex-1' : 'flex-1 ml-2'}>
                <p className="text-white/70 text-xs">ファーム統合管理</p>
                <p className="text-white font-bold text-lg">現場作業</p>
              </div>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {selectedWorker.avatar[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 py-5 space-y-4">

            {/* STEP 1: Select Worker */}
            {step === 'select_worker' && (
              <>
                <div>
                  <p className="text-gray-500 text-xs mb-3 font-medium uppercase tracking-wide">作業者を選択</p>
                  <div className="space-y-2">
                    {workers.filter(w => w.active).slice(0, 5).map(w => (
                      <button
                        key={w.id}
                        onClick={() => { setSelectedWorker(w); setStep('qr_scan'); }}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${
                          selectedWorker.id === w.id
                            ? 'border-farm-green bg-farm-green-pale'
                            : 'border-gray-100 hover:border-farm-green-light bg-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${
                          ['bg-farm-green', 'bg-farm-sky', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][workers.indexOf(w) % 5]
                        }`}>
                          {w.name[0]}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{w.name}</p>
                          <p className="text-xs text-gray-400">{w.role} · {w.id}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 pt-2">
                  または QRコードで認証
                </p>
              </>
            )}

            {/* STEP 2: QR Scan */}
            {step === 'qr_scan' && (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-farm-green-pale rounded-full flex items-center justify-center mx-auto mb-2">
                    <User size={24} className="text-farm-green" />
                  </div>
                  <p className="font-bold text-gray-800">{selectedWorker.name}</p>
                  <p className="text-xs text-gray-400">{selectedWorker.role}</p>
                </div>

                <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
                  {/* QR Viewfinder */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                  <div className="relative w-48 h-48">
                    {/* Corner markers */}
                    {[['top-0 left-0', 'border-t-4 border-l-4'],
                      ['top-0 right-0', 'border-t-4 border-r-4'],
                      ['bottom-0 left-0', 'border-b-4 border-l-4'],
                      ['bottom-0 right-0', 'border-b-4 border-r-4']
                    ].map(([pos, border], i) => (
                      <div key={i} className={`absolute ${pos} w-8 h-8 ${border} border-farm-green-light rounded-sm`} />
                    ))}
                    {/* Scan line */}
                    <div className="absolute inset-x-0 h-0.5 bg-farm-green-light/80 shadow-lg top-1/2 scan-line" />
                    <div className="flex items-center justify-center h-full">
                      <Scan size={32} className="text-white/40" />
                    </div>
                  </div>
                  <p className="absolute bottom-4 text-white/60 text-xs">ハウスQRをスキャン</p>
                </div>

                <button
                  onClick={() => setStep('confirm')}
                  className="w-full btn-primary text-base py-4 rounded-2xl"
                >
                  <QrCode size={20} />
                  スキャン（デモ）
                </button>

                <p className="text-center text-xs text-gray-400">
                  QRがない場合は手動でハウスを選択できます
                </p>
              </>
            )}

            {/* STEP 3: Confirm */}
            {step === 'confirm' && (
              <>
                <div className="bg-farm-green-pale rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-farm-green uppercase tracking-wide">スキャン結果</p>
                  <div className="space-y-2">
                    {[
                      { icon: Home, label: 'ハウス', value: mockScannedHouse.name },
                      { icon: Leaf, label: '作物', value: mockScannedLot.crop },
                      { icon: Package, label: 'ロット', value: mockScannedLot.lotNo },
                      { icon: CheckCircle2, label: '作業', value: mockAssignedWork.name },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3 bg-white rounded-xl p-3">
                        <Icon size={16} className="text-farm-green flex-shrink-0" />
                        <span className="text-xs text-gray-500 w-14 flex-shrink-0">{label}</span>
                        <span className="text-sm font-semibold text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                  <User size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">{selectedWorker.name}</span>
                  <span className="text-xs text-blue-400 ml-auto">{new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <button
                  onClick={startWork}
                  className="w-full bg-farm-green text-white font-bold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-green-800 transition-colors active:scale-95"
                >
                  <Play size={24} fill="white" />
                  作業開始
                </button>
              </>
            )}

            {/* STEP 4: Working */}
            {step === 'working' && (
              <>
                <div className="text-center py-4">
                  <div className="w-20 h-20 bg-farm-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                  </div>
                  <p className="text-3xl font-mono font-bold text-gray-800">{formatTime(elapsedSec)}</p>
                  <p className="text-gray-400 text-sm mt-1">作業中</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">ハウス</span><span className="font-medium">{mockScannedHouse.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">作業</span><span className="font-medium">{mockAssignedWork.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">開始時刻</span><span className="font-medium">{startTime}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">作業者</span><span className="font-medium">{selectedWorker.name}</span></div>
                </div>

                <button
                  onClick={() => setPhotoTaken(true)}
                  className={`w-full font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                    photoTaken ? 'bg-green-50 text-farm-green border-2 border-farm-green' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Camera size={18} />
                  {photoTaken ? '写真撮影済み ✓' : '作業写真を撮る'}
                </button>

                <button
                  onClick={stopWork}
                  className="w-full bg-farm-red text-white font-bold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-red-700 transition-colors active:scale-95"
                >
                  <Square size={24} fill="white" />
                  作業終了
                </button>
              </>
            )}

            {/* STEP 5: Harvest Input */}
            {step === 'harvest_input' && (
              <>
                <div className="text-center mb-2">
                  <p className="font-bold text-gray-800 text-lg">収穫量入力</p>
                  <p className="text-sm text-gray-400">作業時間: {formatTime(elapsedSec)}</p>
                </div>

                <div className="bg-farm-green-pale rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-500 mb-3">収穫量 (kg)</p>
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => adjustKg(-0.5)}
                      className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                    >
                      <Minus size={24} className="text-farm-green" />
                    </button>
                    <div className="text-center">
                      <span className="text-4xl font-bold text-farm-green">{harvestKg.toFixed(1)}</span>
                      <span className="text-lg text-gray-400 ml-1">kg</span>
                    </div>
                    <button
                      onClick={() => adjustKg(0.5)}
                      className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                    >
                      <Plus size={24} className="text-farm-green" />
                    </button>
                  </div>
                  <div className="flex justify-center gap-2 mt-3">
                    {[5, 10, 15, 20].map(v => (
                      <button
                        key={v}
                        onClick={() => setHarvestKg(v)}
                        className="px-3 py-1.5 bg-white rounded-xl text-xs font-medium text-farm-green hover:bg-farm-green hover:text-white transition-colors"
                      >
                        {v}kg
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="メモ（任意）"
                  rows={2}
                  className="input text-sm resize-none"
                />

                <button
                  onClick={() => setStep('complete')}
                  className="w-full btn-primary text-base py-4 rounded-2xl"
                >
                  <Upload size={20} />
                  記録を送信
                </button>
              </>
            )}

            {/* STEP 6: Complete */}
            {step === 'complete' && (
              <>
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-farm-green-pale rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-farm-green" />
                  </div>
                  <p className="text-xl font-bold text-gray-800">記録完了</p>
                  <p className="text-gray-400 text-sm mt-1">お疲れ様でした！</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-sm">
                  {[
                    { label: '作業者', value: selectedWorker.name },
                    { label: 'ハウス', value: mockScannedHouse.name },
                    { label: '作業', value: mockAssignedWork.name },
                    { label: '作業時間', value: formatTime(elapsedSec) },
                    { label: '収穫量', value: `${harvestKg.toFixed(1)} kg` },
                    { label: '生産性', value: `${elapsedSec > 0 ? (harvestKg / (elapsedSec / 3600)).toFixed(2) : '—'} kg/h` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setStep('select_worker'); setElapsedSec(0); setHarvestKg(0); setPhotoTaken(false); setNote(''); }}
                  className="w-full btn-primary text-base py-4 rounded-2xl"
                >
                  次の作業へ
                </button>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Desktop note */}
      <p className="text-center text-xs text-gray-400 mt-4">
        ※ 実際の使用はスマートフォン（iOS / Android）を想定しています
      </p>
    </div>
  );
}
