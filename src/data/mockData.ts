// ============================================================
// Mock Data for Farm Management MVP
// ============================================================

export const workers = [
  { id: 'W001', name: '田中 太郎', nameKana: 'タナカ タロウ', role: '作業員', avatar: 'T', nationality: 'JP', active: true },
  { id: 'W002', name: 'グエン バン アン', nameKana: 'グエン バン アン', role: '作業員', avatar: 'G', nationality: 'VN', active: true },
  { id: 'W003', name: '山田 花子', nameKana: 'ヤマダ ハナコ', role: 'リーダー', avatar: 'Y', nationality: 'JP', active: true },
  { id: 'W004', name: 'リ シャオフェイ', nameKana: 'リ シャオフェイ', role: '作業員', avatar: 'L', nationality: 'CN', active: true },
  { id: 'W005', name: '佐藤 次郎', nameKana: 'サトウ ジロウ', role: '作業員', avatar: 'S', nationality: 'JP', active: true },
  { id: 'W006', name: 'キム ジウン', nameKana: 'キム ジウン', role: '作業員', avatar: 'K', nationality: 'KR', active: true },
  { id: 'W007', name: '鈴木 三郎', nameKana: 'スズキ サブロウ', role: '管理者', avatar: 'S2', nationality: 'JP', active: true },
  { id: 'W008', name: 'ファム ティ ラン', nameKana: 'ファム ティ ラン', role: '作業員', avatar: 'P', nationality: 'VN', active: false },
];

export const houses = [
  { id: 'H001', name: 'ハウス 1-A', block: 'ブロック1', crop: '大葉', area: 200, status: 'active' },
  { id: 'H002', name: 'ハウス 1-B', block: 'ブロック1', crop: '大葉', area: 200, status: 'active' },
  { id: 'H003', name: 'ハウス 2-A', block: 'ブロック2', crop: 'いちご', area: 300, status: 'active' },
  { id: 'H004', name: 'ハウス 2-B', block: 'ブロック2', crop: 'いちご', area: 300, status: 'active' },
  { id: 'H005', name: 'ハウス 3-A', block: 'ブロック3', crop: '大葉', area: 200, status: 'active' },
  { id: 'H006', name: 'ハウス 3-B', block: 'ブロック3', crop: 'いちご', area: 250, status: 'maintenance' },
  { id: 'H007', name: 'ハウス 4-A', block: 'ブロック4', crop: '大葉', area: 200, status: 'active' },
  { id: 'H008', name: 'ハウス 4-B', block: 'ブロック4', crop: 'いちご', area: 300, status: 'active' },
];

export const lots = [
  { id: 'L001', houseId: 'H001', lotNo: 'LOT-2024-001', crop: '大葉', plantDate: '2024-03-01', status: '栽培中' },
  { id: 'L002', houseId: 'H002', lotNo: 'LOT-2024-002', crop: '大葉', plantDate: '2024-03-15', status: '栽培中' },
  { id: 'L003', houseId: 'H003', lotNo: 'LOT-2024-003', crop: 'いちご', plantDate: '2024-02-01', status: '収穫中' },
  { id: 'L004', houseId: 'H004', lotNo: 'LOT-2024-004', crop: 'いちご', plantDate: '2024-02-10', status: '収穫中' },
  { id: 'L005', houseId: 'H005', lotNo: 'LOT-2024-005', crop: '大葉', plantDate: '2024-04-01', status: '育苗中' },
];

export const workTypes = [
  { id: 'WT01', name: '収穫', color: '#2d6a4f', icon: '🌿' },
  { id: 'WT02', name: '定植', color: '#52b788', icon: '🌱' },
  { id: 'WT03', name: '農薬散布', color: '#f4a261', icon: '💊' },
  { id: 'WT04', name: '施肥', color: '#6b4226', icon: '🪴' },
  { id: 'WT05', name: '摘葉', color: '#0077b6', icon: '✂️' },
  { id: 'WT06', name: '誘引', color: '#9b5de5', icon: '🔗' },
  { id: 'WT07', name: '灌水', color: '#00b4d8', icon: '💧' },
  { id: 'WT08', name: '環境点検', color: '#8d8d8d', icon: '🔍' },
];

export const workLogs = [
  { id: 'WL001', workerId: 'W001', houseId: 'H001', lotId: 'L001', workTypeId: 'WT01', date: '2024-08-14', startTime: '08:00', endTime: '11:30', durationMin: 210, harvestKg: 18.5, note: '', status: 'completed' },
  { id: 'WL002', workerId: 'W002', houseId: 'H003', lotId: 'L003', workTypeId: 'WT01', date: '2024-08-14', startTime: '08:00', endTime: '12:00', durationMin: 240, harvestKg: 22.3, note: '', status: 'completed' },
  { id: 'WL003', workerId: 'W003', houseId: 'H002', lotId: 'L002', workTypeId: 'WT05', date: '2024-08-14', startTime: '09:00', endTime: '11:00', durationMin: 120, harvestKg: 0, note: '', status: 'completed' },
  { id: 'WL004', workerId: 'W004', houseId: 'H004', lotId: 'L004', workTypeId: 'WT01', date: '2024-08-14', startTime: '08:30', endTime: '12:30', durationMin: 240, harvestKg: 20.1, note: '', status: 'in_progress' },
  { id: 'WL005', workerId: 'W005', houseId: 'H005', lotId: 'L005', workTypeId: 'WT02', date: '2024-08-13', startTime: '08:00', endTime: '13:00', durationMin: 300, harvestKg: 0, note: '', status: 'completed' },
  { id: 'WL006', workerId: 'W001', houseId: 'H007', lotId: 'L001', workTypeId: 'WT01', date: '2024-08-13', startTime: '13:30', endTime: '16:30', durationMin: 180, harvestKg: 15.2, note: '', status: 'completed' },
  { id: 'WL007', workerId: 'W002', houseId: 'H003', lotId: 'L003', workTypeId: 'WT01', date: '2024-08-13', startTime: '08:00', endTime: '12:00', durationMin: 240, harvestKg: 21.8, note: '', status: 'completed' },
  { id: 'WL008', workerId: 'W006', houseId: 'H008', lotId: 'L004', workTypeId: 'WT01', date: '2024-08-13', startTime: '08:30', endTime: '11:00', durationMin: 150, harvestKg: 12.4, note: '', status: 'completed' },
];

export const harvestData = [
  { date: '2024-08-08', house: 'H001', crop: '大葉', kg: 16.2 },
  { date: '2024-08-08', house: 'H003', crop: 'いちご', kg: 20.5 },
  { date: '2024-08-09', house: 'H001', crop: '大葉', kg: 17.8 },
  { date: '2024-08-09', house: 'H003', crop: 'いちご', kg: 22.1 },
  { date: '2024-08-10', house: 'H001', crop: '大葉', kg: 15.9 },
  { date: '2024-08-10', house: 'H003', crop: 'いちご', kg: 19.4 },
  { date: '2024-08-11', house: 'H001', crop: '大葉', kg: 18.3 },
  { date: '2024-08-11', house: 'H003', crop: 'いちご', kg: 23.6 },
  { date: '2024-08-12', house: 'H001', crop: '大葉', kg: 17.1 },
  { date: '2024-08-12', house: 'H003', crop: 'いちご', kg: 21.3 },
  { date: '2024-08-13', house: 'H001', crop: '大葉', kg: 15.2 },
  { date: '2024-08-13', house: 'H003', crop: 'いちご', kg: 22.4 },
  { date: '2024-08-14', house: 'H001', crop: '大葉', kg: 18.5 },
  { date: '2024-08-14', house: 'H003', crop: 'いちご', kg: 22.3 },
];

export const weeklyHarvestChart = [
  { day: '月', shiso: 48, strawberry: 64 },
  { day: '火', shiso: 52, strawberry: 68 },
  { day: '水', shiso: 45, strawberry: 59 },
  { day: '木', shiso: 55, strawberry: 72 },
  { day: '金', shiso: 51, strawberry: 65 },
  { day: '土', shiso: 33, strawberry: 41 },
  { day: '日', shiso: 20, strawberry: 28 },
];

export const monthlyHarvestChart = [
  { month: '3月', shiso: 480, strawberry: 0 },
  { month: '4月', shiso: 620, strawberry: 120 },
  { month: '5月', shiso: 710, strawberry: 580 },
  { month: '6月', shiso: 680, strawberry: 720 },
  { month: '7月', shiso: 740, strawberry: 690 },
  { month: '8月', shiso: 520, strawberry: 510 },
];

export const productivityData = [
  { workerId: 'W001', name: '田中 太郎', thisMonth: 5.28, lastMonth: 4.92, farmAvg: 5.01, trend: '+7.3%', rank: 1 },
  { workerId: 'W002', name: 'グエン バン アン', thisMonth: 5.57, lastMonth: 5.21, farmAvg: 5.01, trend: '+6.9%', rank: 2 },
  { workerId: 'W003', name: '山田 花子', thisMonth: 4.85, lastMonth: 4.95, farmAvg: 5.01, trend: '-2.0%', rank: 4 },
  { workerId: 'W004', name: 'リ シャオフェイ', thisMonth: 5.02, lastMonth: 4.80, farmAvg: 5.01, trend: '+4.6%', rank: 3 },
  { workerId: 'W005', name: '佐藤 次郎', thisMonth: 4.62, lastMonth: 4.71, farmAvg: 5.01, trend: '-1.9%', rank: 5 },
  { workerId: 'W006', name: 'キム ジウン', thisMonth: 4.95, lastMonth: 4.65, farmAvg: 5.01, trend: '+6.5%', rank: 4 },
];

export const productivityTrendChart = [
  { month: '3月', W001: 4.51, W002: 4.88, W003: 4.92, farmAvg: 4.77 },
  { month: '4月', W001: 4.68, W002: 5.01, W003: 4.85, farmAvg: 4.85 },
  { month: '5月', W001: 4.82, W002: 5.12, W003: 4.90, farmAvg: 4.95 },
  { month: '6月', W001: 4.92, W002: 5.21, W003: 4.95, farmAvg: 5.03 },
  { month: '7月', W001: 4.92, W002: 5.21, W003: 4.95, farmAvg: 4.98 },
  { month: '8月', W001: 5.28, W002: 5.57, W003: 4.85, farmAvg: 5.01 },
];

export const qualityIssues = [
  { id: 'Q001', date: '2024-08-12', houseId: 'H003', workerId: 'W002', lotId: 'L003', type: '形状不良', severity: 'low', description: '規格外サイズが散見された', status: 'resolved', photo: true },
  { id: 'Q002', date: '2024-08-10', houseId: 'H001', workerId: 'W001', lotId: 'L001', type: '病害疑い', severity: 'high', description: '葉に白斑が確認された。農薬散布対応済み', status: 'resolved', photo: true },
  { id: 'Q003', date: '2024-08-08', houseId: 'H004', workerId: 'W004', lotId: 'L004', type: '着色不良', severity: 'medium', description: 'いちごの色づきにムラあり', status: 'investigating', photo: false },
  { id: 'Q004', date: '2024-08-14', houseId: 'H002', workerId: 'W003', lotId: 'L002', type: '異物混入疑い', severity: 'high', description: '収穫コンテナに虫が混入', status: 'open', photo: true },
];

export const pesticideHistory = [
  { id: 'P001', category: '農薬', date: '2024-08-10', houseId: 'H001', lotId: 'L001', workerId: 'W003', chemical: 'アグロスリン乳剤', dilution: '1000倍', amount: 10, unit: 'L', purpose: 'アブラムシ防除', preClearDays: 7, clearDate: '2024-08-17' },
  { id: 'P002', category: '農薬', date: '2024-08-08', houseId: 'H003', lotId: 'L003', workerId: 'W003', chemical: 'スミチオン乳剤', dilution: '1000倍', amount: 15, unit: 'L', purpose: '害虫防除', preClearDays: 14, clearDate: '2024-08-22' },
  { id: 'P003', category: '農薬', date: '2024-08-05', houseId: 'H004', lotId: 'L004', workerId: 'W007', chemical: 'ベンレート水和剤', dilution: '2000倍', amount: 8, unit: 'L', purpose: 'うどんこ病防除', preClearDays: 3, clearDate: '2024-08-08' },
  { id: 'P004', category: '肥料', date: '2024-08-01', houseId: 'H002', lotId: 'L002', workerId: 'W007', chemical: '液体肥料 S-1', dilution: '500倍', amount: 20, unit: 'L', purpose: '追肥', preClearDays: 0, clearDate: '-' },
];

export const workPlans = [
  { id: 'WP001', date: '2024-08-14', houseId: 'H001', workTypeId: 'WT01', assignedWorkers: ['W001', 'W005'], startTime: '08:00', endTime: '12:00', status: 'completed', note: '' },
  { id: 'WP002', date: '2024-08-14', houseId: 'H003', workTypeId: 'WT01', assignedWorkers: ['W002'], startTime: '08:00', endTime: '12:00', status: 'in_progress', note: '' },
  { id: 'WP003', date: '2024-08-14', houseId: 'H002', workTypeId: 'WT05', assignedWorkers: ['W003'], startTime: '09:00', endTime: '11:00', status: 'completed', note: '' },
  { id: 'WP004', date: '2024-08-14', houseId: 'H004', workTypeId: 'WT01', assignedWorkers: ['W004', 'W006'], startTime: '08:30', endTime: '12:30', status: 'in_progress', note: '' },
  { id: 'WP005', date: '2024-08-14', houseId: 'H007', workTypeId: 'WT03', assignedWorkers: ['W007'], startTime: '13:00', endTime: '15:00', status: 'planned', note: '農薬: アグロスリン' },
  { id: 'WP006', date: '2024-08-15', houseId: 'H001', workTypeId: 'WT01', assignedWorkers: ['W001', 'W002'], startTime: '08:00', endTime: '12:00', status: 'planned', note: '' },
  { id: 'WP007', date: '2024-08-15', houseId: 'H005', workTypeId: 'WT07', assignedWorkers: ['W005'], startTime: '07:00', endTime: '08:00', status: 'planned', note: '' },
];

export const inventoryItems = [
  { id: 'INV001', category: '農薬', name: 'アグロスリン乳剤', unit: 'L', currentStock: 24, minStock: 10, lastUpdated: '2024-08-10' },
  { id: 'INV002', category: '農薬', name: 'スミチオン乳剤', unit: 'L', currentStock: 8, minStock: 10, lastUpdated: '2024-08-08' },
  { id: 'INV003', category: '肥料', name: '液体肥料 S-1', unit: 'L', currentStock: 120, minStock: 50, lastUpdated: '2024-08-01' },
  { id: 'INV004', category: '肥料', name: '苦土石灰', unit: 'kg', currentStock: 200, minStock: 100, lastUpdated: '2024-07-20' },
  { id: 'INV005', category: '資材', name: '収穫コンテナ', unit: '個', currentStock: 85, minStock: 30, lastUpdated: '2024-08-14' },
  { id: 'INV006', category: '資材', name: 'マルチシート', unit: '枚', currentStock: 12, minStock: 20, lastUpdated: '2024-08-05' },
  { id: 'INV007', category: '資材', name: '育苗トレー', unit: '枚', currentStock: 45, minStock: 30, lastUpdated: '2024-08-01' },
  { id: 'INV008', category: '農薬', name: 'ベンレート水和剤', unit: 'g', currentStock: 500, minStock: 200, lastUpdated: '2024-08-05' },
];

export const alerts = [
  { id: 'A001', type: 'quality', severity: 'high', message: 'ハウス2-Bで異物混入疑い報告', time: '30分前', houseId: 'H002' },
  { id: 'A002', type: 'inventory', severity: 'medium', message: 'スミチオン乳剤 在庫が最低水準を下回りました', time: '2時間前', houseId: null },
  { id: 'A003', type: 'inventory', severity: 'medium', message: 'マルチシート 在庫が最低水準を下回りました', time: '1日前', houseId: null },
  { id: 'A004', type: 'work', severity: 'low', message: 'ハウス3-Aで本日作業が未割当です', time: '本日', houseId: 'H005' },
];
