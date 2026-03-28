export type Status = 'Selesai' | 'Dalam Proses' | 'Belum Ditindaklanjuti' | 'Tidak Dapat Ditindaklanjuti';

export interface Temuan {
  id: string;
  noLhp: string;
  tanggal: string;
  opd: string;
  nama: string;
  uraian: string;
  nilaiKerugian: number;
  status: Status;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'opd';
  opd?: string;
}
