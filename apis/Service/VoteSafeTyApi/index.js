
import PhienBanKhaoSat from './PhienBanKhaoSat'
import NhanVien from './NhanVien'
import NhanVienKhaoSat from './NhanVienKhaoSat'
import PhanCauHoi from './PhanCauHoi'

export default function VoteSafeServices (axios) {
  return {
    phienban: PhienBanKhaoSat(axios),
    nhanvien: NhanVien(axios),
    nhanvienks: NhanVienKhaoSat(axios),
    phancauhoi: PhanCauHoi(axios)
  }
}