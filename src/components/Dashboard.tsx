import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Wallet 
} from 'lucide-react';
import { Temuan } from '../types';
import { STATUS_COLORS, STATUS_OPTIONS } from '../constants';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';

interface DashboardProps {
  temuan: Temuan[];
}

export default function Dashboard({ temuan }: DashboardProps) {
  const stats = STATUS_OPTIONS.map(status => ({
    name: status,
    value: temuan.filter(t => t.status === status).length,
    color: STATUS_COLORS[status]
  }));

  const totalTemuan = temuan.length;
  const totalSelesai = temuan.filter(t => t.status === 'Selesai').length;
  const totalProses = temuan.filter(t => t.status === 'Dalam Proses').length;
  const totalBelum = temuan.filter(t => t.status === 'Belum Ditindaklanjuti').length;
  const totalTidakDapat = temuan.filter(t => t.status === 'Tidak Dapat Ditindaklanjuti').length;
  
  const totalKerugian = temuan.reduce((acc, curr) => acc + curr.nilaiKerugian, 0);
  const penyelesaianPersen = totalTemuan > 0 ? (totalSelesai / totalTemuan) * 100 : 0;

  const cards = [
    { label: 'Total Temuan', value: totalTemuan, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Selesai', value: totalSelesai, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Dalam Proses', value: totalProses, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Belum Ditindaklanjuti', value: totalBelum, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Tidak Dapat Ditindaklanjuti', value: totalTidakDapat, icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-50' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Dashboard Ringkasan</h1>
          <p className="text-[#141414]/50 italic serif mt-1">Gambaran umum penyelesaian tindak lanjut hasil pemeriksaan</p>
        </div>
        <div className="bg-white border border-[#E4E3E0] p-4 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="bg-blue-900/10 p-2 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-900" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest">Total Nilai Kerugian</div>
            <div className="text-xl font-bold text-[#141414]">{formatCurrency(totalKerugian)}</div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-[#E4E3E0] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", card.bg)}>
              <card.icon className={cn("w-6 h-6", card.color)} />
            </div>
            <div className="text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest mb-1">{card.label}</div>
            <div className="text-3xl font-bold text-[#141414]">{card.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pie Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E4E3E0] p-8 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-[#141414] uppercase tracking-wider">Distribusi Status Temuan</h2>
            <div className="text-xs text-[#141414]/50 italic serif">Berdasarkan jumlah temuan</div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }} 
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Progress */}
        <div className="bg-blue-950 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-8">Persentase Penyelesaian Global</h2>
            <div className="text-7xl font-bold tracking-tighter mb-4">
              {penyelesaianPersen.toFixed(1)}<span className="text-blue-400">%</span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-6">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${penyelesaianPersen}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-blue-500"
              />
            </div>
            <p className="text-white/60 text-sm italic serif">
              Dari total {totalTemuan} temuan yang tercatat dalam sistem, {totalSelesai} di antaranya telah dinyatakan selesai ditindaklanjuti.
            </p>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
