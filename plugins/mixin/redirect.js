import Vue from 'vue';
import {mapGetters} from 'vuex';

const Redirect = {
  install(Vue /* , options */) {
    Vue.mixin({
      computed: {
        ...mapGetters({
          backRoute: "redirect/redirect"
        })
      }
    });
  }
};

Vue.use(Redirect);
