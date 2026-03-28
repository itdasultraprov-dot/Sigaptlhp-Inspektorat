import React, { useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Table, 
  BarChart3, 
  ShieldCheck,
  Info
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Temuan } from '../types';
import { OPDS } from '../constants';
import { motion } from 'motion/react';

interface ReportsProps {
  temuan: Temuan[];
}

export default function Reports({ temuan }: ReportsProps) {
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
    }).sort((a, b) => b.total - a.total);
  }, [temuan]);

  const exportDetailTemuan = () => {
    const exportData = temuan.map(item => ({
      'No LHP': item.noLhp,
      'Tanggal': item.tanggal,
      'OPD': item.opd,
      'Nama': item.nama,
      'Uraian Temuan': item.uraian,
      'Nilai Kerugian (IDR)': item.nilaiKerugian,
      'Status': item.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detail Temuan");
    XLSX.writeFile(workbook, `SIGAP_TLHP_Detail_Temuan_Full_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportRekapOPD = () => {
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
    XLSX.writeFile(workbook, `SIGAP_TLHP_Rekap_Kepatuhan_OPD_Full_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Laporan Sistem</h1>
        <p className="text-[#141414]/50 italic serif mt-1">Pusat pengunduhan laporan dan rekapitulasi data</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Detail Temuan Report */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E4E3E0] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
        >
          <div className="p-8 flex-1">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Table className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-[#141414] mb-2">Detail Temuan (Raw Data)</h2>
            <p className="text-[#141414]/60 text-sm leading-relaxed mb-6">
              Laporan lengkap berisi seluruh data temuan yang tercatat dalam sistem, termasuk No LHP, Tanggal, OPD terkait, uraian temuan, nilai kerugian, dan status tindak lanjut saat ini.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-[#141414]/40 uppercase tracking-widest bg-[#F5F5F4] p-3 rounded-xl">
              <Info className="w-4 h-4" />
              Format: Microsoft Excel (.xlsx)
            </div>
          </div>
          <div className="p-8 bg-[#F5F5F4] border-t border-[#E4E3E0]">
            <button 
              onClick={exportDetailTemuan}
              className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/5"
            >
              <Download className="w-5 h-5" />
              Unduh Detail Temuan
            </button>
          </div>
        </motion.div>

        {/* Rekap Kepatuhan Report */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#E4E3E0] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
        >
          <div className="p-8 flex-1">
            <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-[#141414] mb-2">Rekap Kepatuhan OPD</h2>
            <p className="text-[#141414]/60 text-sm leading-relaxed mb-6">
              Laporan statistik ringkasan kinerja penyelesaian tindak lanjut per instansi. Mencakup total temuan per OPD, distribusi status (Selesai, Proses, dll), dan persentase progres kepatuhan.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-[#141414]/40 uppercase tracking-widest bg-[#F5F5F4] p-3 rounded-xl">
              <Info className="w-4 h-4" />
              Format: Microsoft Excel (.xlsx)
            </div>
          </div>
          <div className="p-8 bg-[#F5F5F4] border-t border-[#E4E3E0]">
            <button 
              onClick={exportRekapOPD}
              className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/5"
            >
              <Download className="w-5 h-5" />
              Unduh Rekap Kepatuhan
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="bg-blue-900/5 border border-blue-900/20 p-6 rounded-2xl flex gap-4 items-start">
        <ShieldCheck className="w-6 h-6 text-blue-900 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-[#141414]">Informasi Keamanan Laporan</h3>
          <p className="text-sm text-[#141414]/60 mt-1">
            Seluruh laporan yang diunduh bersifat rahasia dan hanya untuk kepentingan internal Inspektorat Provinsi Sulawesi Tenggara. Pastikan data digunakan sesuai dengan regulasi yang berlaku.
          </p>
        </div>
      </div>
    </div>
  );
}
