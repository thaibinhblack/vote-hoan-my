import viMessages from "devextreme/localization/messages/vi.json";
import {locale, loadMessages} from "devextreme/localization";

export default {
  created() {
    loadMessages(viMessages);
    if (process.browser) {
      locale(navigator.language);
    }
  }
}
