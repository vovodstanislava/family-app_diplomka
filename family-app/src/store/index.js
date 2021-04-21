import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    setUserInfo(state, payload) {
      state.userInfo = payload;
    }
  },
  actions: {
    setUserInfo({ commit }, payload) {
      commit("setUserInfo", payload);
    }
  },
  getters: {
    userInfo: state => state.userInfo
  },
  modules: {}
});
