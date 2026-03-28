import React, { useMemo, useState } from 'react';
import { 
  Building2, 
  Search, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle,
  Download
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Temuan } from '../types';
import { OPDS, STATUS_COLORS } from '../constants';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface OPDMonitoringProps {
  temuan: Temuan[];
}

export default function OPDMonitoring({ temuan }: OPDMonitoringProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const opdStats = useMemo(() => {
    return OPDS.map(opdName => {
      const opdTemuan = temuan.filter(t => t.opd === opdName);
      const total = opdTemuan.length;
      const selesai = opdTemuan.filter(t => t.status === 'Selesai').length;
      const proses = opdTemuan.filter(t => t.status === 'Dalam Proses').length;
      const belum = opdTemuan.filter(t => t.status === 'Belum Ditindaklanjuti').length;
      const tidakDapat = opdTemuan.filter(t => t.status === 'Tidak Dapat Ditindaklanjuti').length;
      
      const progress = total > 0 ? (selesai / total) * 100 : 0;
      
      return {
        name: opdName,
        total,
        selesai,
        proses,
        belum,
        tidakDapat,
        progress
      };
    }).sort((a, b) => b.total - a.total); // Sort by total findings
  }, [temuan]);

  const filteredStats = opdStats.filter(stat => 
    stat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const exportData = opdStats.map(stat => ({
      'Nama OPD': stat.name,
      'Total Temuan': stat.total,
      'Selesai': stat.selesai,
      'Dalam Proses': stat.proses,
      'Belum Ditindaklanjuti': stat.belum,
      'Tidak Dapat Ditindaklanjuti': stat.tidakDapat,
      'Progress (%)': stat.progress.toFixed(2)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Kepatuhan OPD");
    XLSX.writeFile(workbook, `SIGAP_TLHP_Rekap_Kepatuhan_OPD_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Monitoring OPD</h1>
          <p className="text-[#141414]/50 italic serif mt-1">Pemantauan kinerja penyelesaian tindak lanjut per instansi</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
            <input 
              type="text" 
              placeholder="Cari OPD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={exportToExcel}
            className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
          >
            <Download className="w-5 h-5" />
            Ekspor Rekap
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {filteredStats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-[#E4E3E0] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4 min-w-[300px]">
                <div className="bg-[#F5F5F4] p-3 rounded-xl group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#141414] text-lg leading-tight">{stat.name}</h3>
                  <div className="text-xs text-[#141414]/50 font-bold uppercase tracking-widest mt-1">
                    Total {stat.total} Temuan
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#141414]/50 uppercase tracking-widest">Progress Penyelesaian</span>
                  <span className="text-sm font-bold text-blue-900">{stat.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#F5F5F4] h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-[10px] font-bold text-[#141414]/40 uppercase tracking-widest">Selesai</div>
                    <div className="text-sm font-bold text-[#141414]">{stat.selesai}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-[10px] font-bold text-[#141414]/40 uppercase tracking-widest">Proses</div>
                    <div className="text-sm font-bold text-[#141414]">{stat.proses}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <div>
                    <div className="text-[10px] font-bold text-[#141414]/40 uppercase tracking-widest">Belum</div>
                    <div className="text-sm font-bold text-[#141414]">{stat.belum}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-[10px] font-bold text-[#141414]/40 uppercase tracking-widest">TDP</div>
                    <div className="text-sm font-bold text-[#141414]">{stat.tidakDapat}</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <button className="p-2 text-[#141414]/20 hover:text-blue-900 transition-colors">
                  <ArrowUpRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredStats.length === 0 && (
        <div className="p-20 text-center bg-white border border-[#E4E3E0] rounded-3xl shadow-sm">
          <Building2 className="w-12 h-12 text-[#141414]/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#141414]">OPD Tidak Ditemukan</h3>
          <p className="text-[#141414]/50 italic serif mt-1">Coba gunakan kata kunci pencarian lain.</p>
        </div>
      )}
    </div>
  );
}
