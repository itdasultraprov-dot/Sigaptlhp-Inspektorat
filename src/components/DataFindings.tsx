import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Calendar, 
  Building2, 
  FileText, 
  Wallet, 
  CheckCircle2
} from 'lucide-react';
import { Temuan, Status } from '../types';
import { OPDS, STATUS_OPTIONS, STATUS_COLORS } from '../constants';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface DataFindingsProps {
  temuan: Temuan[];
  setTemuan: React.Dispatch<React.SetStateAction<Temuan[]>>;
}

export default function DataFindings({ temuan, setTemuan }: DataFindingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterOPD, setFilterOPD] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingTemuan, setEditingTemuan] = useState<Temuan | null>(null);
  const itemsPerPage = 10;

  // Form State
  const [formData, setFormData] = useState<Partial<Temuan>>({
    noLhp: '',
    tanggal: new Date().toISOString().split('T')[0],
    opd: OPDS[0],
    nama: '',
    uraian: '',
    nilaiKerugian: 0,
    status: 'Belum Ditindaklanjuti'
  });

  const filteredData = useMemo(() => {
    return temuan.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.noLhp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.uraian.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'Semua' || item.status === filterStatus;
      const matchesOPD = filterOPD === 'Semua' || item.opd === filterOPD;
      return matchesSearch && matchesStatus && matchesOPD;
    });
  }, [temuan, searchTerm, filterStatus, filterOPD]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenModal = (item?: Temuan) => {
    if (item) {
      setEditingTemuan(item);
      setFormData(item);
    } else {
      setEditingTemuan(null);
      setFormData({
        noLhp: '',
        tanggal: new Date().toISOString().split('T')[0],
        opd: OPDS[0],
        nama: '',
        uraian: '',
        nilaiKerugian: 0,
        status: 'Belum Ditindaklanjuti'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemuan) {
      setTemuan(prev => prev.map(t => t.id === editingTemuan.id ? { ...t, ...formData } as Temuan : t));
    } else {
      const newTemuan: Temuan = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Temuan;
      setTemuan(prev => [newTemuan, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setTemuan(prev => prev.filter(t => t.id !== deleteTargetId));
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#141414] tracking-tight">Data Temuan</h1>
          <p className="text-[#141414]/50 italic serif mt-1">Manajemen data temuan hasil pemeriksaan</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
          >
            <Plus className="w-5 h-5" />
            Tambah Temuan
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border border-[#E4E3E0] p-6 rounded-2xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
            <input 
              type="text" 
              placeholder="Cari No LHP, Nama, atau Uraian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all appearance-none"
            >
              <option value="Semua">Semua Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
            <select 
              value={filterOPD}
              onChange={(e) => setFilterOPD(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all appearance-none"
            >
              <option value="Semua">Semua OPD</option>
              {OPDS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E4E3E0] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F5F4] border-bottom border-[#E4E3E0]">
                <th className="p-4 text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest">No LHP / Tanggal</th>
                <th className="p-4 text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest">OPD</th>
                <th className="p-4 text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest">Nama</th>
                <th className="p-4 text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest">Nilai Kerugian</th>
                <th className="p-4 text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E3E0]">
              {paginatedData.length > 0 ? paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F5F4]/50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-[#141414]">{item.noLhp}</div>
                    <div className="text-xs text-[#141414]/50 italic serif">{item.tanggal}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-[#141414] truncate max-w-[200px]">{item.opd}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-[#141414]">{item.nama}</div>
                    <div className="text-xs text-[#141414]/60 line-clamp-1 italic serif">{item.uraian}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-[#141414]">{formatCurrency(item.nilaiKerugian)}</div>
                  </td>
                  <td className="p-4">
                    <span 
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ 
                        backgroundColor: `${STATUS_COLORS[item.status]}15`, 
                        color: STATUS_COLORS[item.status] 
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-[#141414]/40 hover:text-blue-900 hover:bg-blue-900/10 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-[#141414]/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#141414]/40 italic serif">
                    Tidak ada data temuan yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#F5F5F4] border-t border-[#E4E3E0] flex items-center justify-between">
            <div className="text-xs text-[#141414]/50 font-medium">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data
            </div>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-sm font-bold px-4">Halaman {currentPage} dari {totalPages}</div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#141414]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-blue-900 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-800 p-2 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">
                    {editingTemuan ? 'Edit Data Temuan' : 'Tambah Data Temuan'}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#141414] uppercase tracking-wider">No LHP</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
                      <input 
                        type="text" 
                        required
                        value={formData.noLhp}
                        onChange={(e) => setFormData(prev => ({ ...prev, noLhp: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                        placeholder="Contoh: LHP/001/2024"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#141414] uppercase tracking-wider">Tanggal</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
                      <input 
                        type="date" 
                        required
                        value={formData.tanggal}
                        onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#141414] uppercase tracking-wider">OPD (Organisasi Perangkat Daerah)</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
                    <select 
                      required
                      value={formData.opd}
                      onChange={(e) => setFormData(prev => ({ ...prev, opd: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all appearance-none"
                    >
                      {OPDS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#141414] uppercase tracking-wider">Nama</label>
                  <input 
                    type="text" 
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                    placeholder="Masukkan judul temuan"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#141414] uppercase tracking-wider">Uraian Temuan</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.uraian}
                    onChange={(e) => setFormData(prev => ({ ...prev, uraian: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all resize-none"
                    placeholder="Jelaskan detail temuan hasil pemeriksaan..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#141414] uppercase tracking-wider">Nilai Kerugian (IDR)</label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
                      <input 
                        type="number" 
                        required
                        value={formData.nilaiKerugian}
                        onChange={(e) => setFormData(prev => ({ ...prev, nilaiKerugian: Number(e.target.value) }))}
                        className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#141414] uppercase tracking-wider">Status</label>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/30" />
                      <select 
                        required
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Status }))}
                        className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#E4E3E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all appearance-none"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-[#F5F5F4] text-[#141414] rounded-xl font-bold hover:bg-[#E4E3E0] transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                  >
                    Simpan Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-[#141414]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#141414] mb-2">Konfirmasi Hapus</h2>
              <p className="text-[#141414]/60 italic serif mb-8">
                Apakah Anda yakin ingin menghapus data temuan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-[#F5F5F4] text-[#141414] rounded-xl font-bold hover:bg-[#E4E3E0] transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Hapus Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
