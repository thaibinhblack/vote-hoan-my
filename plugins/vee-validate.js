import Vue from "vue";
import {extend, localize, ValidationObserver, ValidationProvider} from "vee-validate";
import vi from "vee-validate/dist/locale/vi.json";
import * as rules from "vee-validate/dist/rules";

// install rules and localization
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

localize("en", vi);

// Install components globally
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
