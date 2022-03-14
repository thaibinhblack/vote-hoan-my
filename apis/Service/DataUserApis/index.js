//===========DataUserApis=============
import TaiKhoanService from "./TaiKhoan";
import NhanVienService from "./NhanVien";
import PhanQuyenService from "./PhanQuyen";
import PhanQuyenMenuService from "./PhanQuyenMenu";
import MenuService from "./Menu";
import DonViHanhChinhService from "./DonViHanhChinh";
import ChucDanhService from "./ChucDanh";
import ChucVuService from "./ChucVu";
import DuAnService from "./DuAn";
import Reports from "./Reports";
import PhanQuyenReport from "./PhanQuyenReport";
import PhongBan from "./PhongBan";
import TaiKhoanPhongBan from "./TaiKhoanPhongBan";
import Hospital from "./Hospital";
import TaiKhoanHospital from "./TaiKhoanHospital";
import ChucNang from "./ChucNang";
import PhanQuyenChucNang from "./PhanQuyenChucNang";
export default function makeServices(axios) {
  return {
    auth: TaiKhoanService(axios),
    nhanvien: NhanVienService(axios),
    phanquyen: PhanQuyenService(axios),
    phanquyenmenu: PhanQuyenMenuService(axios),
    menu: MenuService(axios),
    donvihanhchinh: DonViHanhChinhService(axios),
    chucdanh: ChucDanhService(axios),
    chucvu: ChucVuService(axios),
    duan: DuAnService(axios),
    report: Reports(axios),
    phanquyenreport: PhanQuyenReport(axios),
    phongban: PhongBan(axios),
    taikhoanphongban: TaiKhoanPhongBan(axios),
    hospital: Hospital(axios),
    taikhoanhospital: TaiKhoanHospital(axios),
    chucnang: ChucNang(axios),
    phanquyenchucnang: PhanQuyenChucNang(axios),

  };
}
