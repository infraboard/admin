import { login, logout, refreshAccessToken } from '@/api/keyauth/token'
import { getProfile } from '@/api/keyauth/profile'
import { getAccessToken, setAccessToken, removeAccessToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  account: '',
  name: '',
  avatar: '',
  introduction: '',
  isInitialized: true,
  needReset: false,
  resetReason: '',
  roles: []
}

const mutations = {
  SET_ACCESS_TOKEN: (state, token) => {
    state.accessToken = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_IS_INITIALIZED: (state, init) => {
    state.isInitialized = init
  },
  SET_NEED_RESET: (state, reset) => {
    state.needReset = reset
  },
  SET_RESET_REASON: (state, reason) => {
    state.resetReason = reason
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, loginForm) {
    return new Promise((resolve, reject) => {
      login(loginForm).then(response => {
        const { data } = response
        commit('SET_ACCOUNT', loginForm.username)
        commit('SET_ACCESS_TOKEN', data.access_token)
        commit('SET_REFRESH_TOKEN', data.refresh_token)
        setAccessToken(data.access_token)
        setRefreshToken(data.refresh_token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfile().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // roles must be a non-empty array
        if (!data.type) {
          reject('getInfo: roles must be a empty!')
        }

        data.roles = [data.type.toLocaleLowerCase()]

        commit('SET_ROLES', data.roles)
        commit('SET_NAME', (data.profile.realname) ? data.profile.realname : data.account)
        commit('SET_AVATAR', data.profile.avatar)
        commit('SET_IS_INITIALIZED', data.is_initialized)
        commit('SET_INTRODUCTION', '')
        commit('SET_NEED_RESET', data.password.need_reset)
        commit('SET_RESET_REASON', data.password.reset_reason)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_ROLES', [])
        removeAccessToken()
        removeRefreshToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ACCESS_TOKEN', '')
      commit('SET_ROLES', [])
      removeAccessToken()
      resolve()
    })
  },

  // refresh token
  refreshToken({ commit, state, dispatch }) {
    var req = {
      grant_type: 'refresh',
      access_token: getAccessToken(),
      refresh_token: getRefreshToken()
    }
    return new Promise((resolve, reject) => {
      refreshAccessToken(req).then(response => {
        const { data } = response
        commit('SET_ACCESS_TOKEN', data.access_token)
        commit('SET_REFRESH_TOKEN', data.refresh_token)
        setAccessToken(data.access_token)
        setRefreshToken(data.refresh_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_ACCESS_TOKEN', token)
    setAccessToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
