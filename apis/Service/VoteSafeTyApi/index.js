
import PhienBanKhaoSat from './PhienBanKhaoSat'
import NhanVien from './NhanVien'
import NhanVienKhaoSat from './NhanVienKhaoSat'
import PhanCauHoi from './PhanCauHoi'
import CauHoi from './CauHoi'
import DapAn from './DapAn'


export default function VoteSafeServices (axios) {
  return {
    phienban: PhienBanKhaoSat(axios),
    nhanvien: NhanVien(axios),
    nhanvienks: NhanVienKhaoSat(axios),
    phancauhoi: PhanCauHoi(axios),
    cauhoi: CauHoi(axios),
    dapan: DapAn(axios)
  }
}