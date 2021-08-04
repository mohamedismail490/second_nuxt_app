export const state = () => ({
  redirect: ''
});

export const getters = {
  redirect(state) {
    return state.redirect;
  }
};

export const mutations = {
  SET_REDIRECT(state, redirect) {
    state.redirect = redirect;
  }
};

export const actions = {
  setRedirect({commit}, redirect) {
    commit("SET_REDIRECT", redirect);
  },
  clearRedirect({commit}) {
    commit("SET_REDIRECT", '');
  }
}
