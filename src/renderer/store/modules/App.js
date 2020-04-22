export default {
  state: {
    isLogined: false,
    username: '',
    uid: 0,
    roomId: 0,
    face: '',
    currentUser: null,
    waitingUserList: []
  },
  mutations: {
    syncUserInfo (state, { username, uid, roomId, face }) {
      state.isLogined = true
      state.username = username
      state.uid = uid
      state.roomId = roomId
      state.face = face
    },
    setCurrentUser (state, currentUser) {
      state.currentUser = currentUser
    }
  }
}
