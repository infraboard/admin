import { login, logout, refreshAccessToken } from '@/api/keyauth/token'
import { getProfile } from '@/api/keyauth/profile'
import { getAccessToken, setAccessToken, removeAccessToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_ACCESS_TOKEN: (state, token) => {
    state.accessToken = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
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
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    var req = {
      grant_type: 'password',
      username: username.trim(),
      password: password.trim()
    }
    return new Promise((resolve, reject) => {
      login(req).then(response => {
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

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfile().then(response => {
        const { data } = response

        data.roles = ['admin']
        data.avatar = 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLwp1gIfBxH4dibZZTBrzAWAQN2jeSvp0WGWiaQSvUrbDCqqWIPWNQcbtTsbrGBsZVoicPic4ywibrIzCA/132'
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
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
      grant_type: 'refresh_token',
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
