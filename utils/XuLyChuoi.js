export default function funcXuLyChuoi() {
  return {
    TryPartInt(x) {
      var parsed = parseInt(x, 10);
      if (isNaN(parsed)) {
        return null;
      }
      return parsed;
    },
    /**
     *
     * @param {chuỗi cần xử lý} chuoi
     */
    removeEmpty(chuoi) {
      const removeEmpty = (obj) => {
        Object.keys(obj).forEach(k =>
          (obj[k] && typeof obj[k] === 'object') && removeEmpty(obj[k]) ||
          (!obj[k] && obj[k] !== undefined) && delete obj[k]
        );
        return obj;
      };

      return removeEmpty(chuoi);

    },
    TaoMaHoaChuoi(chuoi) {
      var secreckey = "p@ssw0rdhmdl";
      var crypto = require("crypto-js");

      // Mã hóa
      var message = crypto.HmacSHA256(chuoi, secreckey).toString();
      // Xem chuỗi đã mã hóa

      return message;
    },
    GiaiMaHoaChuoi(chuoi) {
      var secreckey = "p@ssw0rdhmdl";
      var crypto = require("crypto-js");

      // Mã hóa
      var message = crypto.HmacSHA256.decrypt(chuoi, secreckey).toString();
      // Xem chuỗi đã mã hóa

      return message;
    },
    ClearNoNum(inputStr) {
      inputStr = inputStr + "";
      inputStr = inputStr.replace(/[^\d.]/g, "");
      inputStr = inputStr.replace(/\.{2,}/g, ".");
      inputStr = inputStr
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      inputStr = inputStr.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
      if (inputStr.indexOf(".") == 0 && inputStr != "") {
        inputStr = "";
        return inputStr;
      }
      if (inputStr.indexOf(".") < 0 && inputStr != "") {
        inputStr = parseFloat((inputStr + "").substring(0, 9));
        return inputStr;
      }
      if (inputStr.indexOf(".") > 0 && inputStr != "") {
        let num = inputStr.indexOf(".");
        if (num > 9) {
          num = 9;
        }
        inputStr =
          inputStr.substring(0, num) + inputStr.substring(inputStr.indexOf("."));
        return inputStr;
      }
    },
  }
}


export function getQuarter(e) {
  switch (e) {
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
  }
}
