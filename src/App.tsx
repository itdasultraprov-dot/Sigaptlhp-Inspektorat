import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DataFindings from './components/DataFindings';
import OPDMonitoring from './components/OPDMonitoring';
import Reports from './components/Reports';
import Login from './components/Login';
import { User, Temuan } from './types';
import { OPDS } from './constants';

// Mock Initial Data
const MOCK_TEMUAN: Temuan[] = [
  {
    id: '1',
    noLhp: 'LHP/001/2024',
    tanggal: '2024-01-15',
    opd: 'Dinas Pendidikan Dan Kebudayaan',
    nama: 'Kelebihan Bayar Honorarium',
    uraian: 'Terdapat kelebihan pembayaran honorarium pada kegiatan pembinaan guru.',
    nilaiKerugian: 25000000,
    status: 'Dalam Proses'
  },
  {
    id: '2',
    noLhp: 'LHP/002/2024',
    tanggal: '2024-02-10',
    opd: 'Dinas Kesehatan',
    nama: 'Pengadaan Alkes Tidak Sesuai Spek',
    uraian: 'Pengadaan alat kesehatan pada RSUD Bahteramas tidak sesuai spesifikasi kontrak.',
    nilaiKerugian: 150000000,
    status: 'Belum Ditindaklanjuti'
  },
  {
    id: '3',
    noLhp: 'LHP/003/2024',
    tanggal: '2024-03-05',
    opd: 'Bapenda',
    nama: 'Kekurangan Setoran Pajak',
    uraian: 'Kekurangan setoran pajak daerah dari sektor galian C.',
    nilaiKerugian: 45000000,
    status: 'Selesai'
  }
];

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sigap_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [temuan, setTemuan] = useState<Temuan[]>(() => {
    const saved = localStorage.getItem('sigap_temuan');
    return saved ? JSON.parse(saved) : MOCK_TEMUAN;
  });

  useEffect(() => {
    localStorage.setItem('sigap_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sigap_temuan', JSON.stringify(temuan));
  }, [temuan]);

  const handleLogin = (username: string) => {
    // Mock login logic
    const newUser: User = {
      id: 'admin-1',
      username: username,
      role: 'admin'
    };
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sigap_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard temuan={temuan} />} />
          <Route path="/data" element={<DataFindings temuan={temuan} setTemuan={setTemuan} />} />
          <Route path="/monitoring" element={<OPDMonitoring temuan={temuan} />} />
          <Route path="/reports" element={<Reports temuan={temuan} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
