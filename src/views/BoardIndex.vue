<template>
  <section class="board-index main-layout">
    <AppSideNav />
    <WorkspaceSideNav @addBoard="addBoard" @setBoard="loadBoard" @copyBoard="copyBoard" @removeBoard="removeBoard" />
    <div class="board-container board-layout">
      <BoardHeader @updateBoard="updateBoard" @setFilter="setFilter" />
      <RouterView v-if="currBoardId" />
      <Loader v-else />
    </div>
  </section>
</template>

<script>
import AppSideNav from '@/components/AppSidenav.vue'
import WorkspaceSideNav from '@/components/WorkspaceSidenav.vue'
import BoardHeader from '../components/BoardHeader.vue'
import Loader from '../components/Loader.vue'
import { boardService } from '../services/board.service.js'
import {
  socketService,
  SOCKET_EVENT_UPDATE_BOARD,
  SOCKET_EMIT_SET_BOARD_TOPIC,
} from '../services/socket.service.js'
export default {
  created() {
    socketService.on(SOCKET_EVENT_UPDATE_BOARD, this.updateBoardFromSocket)
  },
  watch: {
    currBoardId: {
      handler() {
        if (!this.currBoardId) return
        this.$router.push({ params: { boardId: this.currBoardId } })
        socketService.emit(SOCKET_EMIT_SET_BOARD_TOPIC, this.currBoardId)
      },
      immediate: true,
    },
  },
  computed: {
    currBoardId() {
      return this.$store.getters.currBoard._id
    },
  },
  methods: {
    addBoard() {
      const newBoard = boardService.getEmptyBoard()
      this.$store.dispatch({
        type: 'saveBoard',
        board: newBoard,
      })
    },
    async loadBoard(boardId) {
      await this.$store.dispatch({ type: 'loadBoard', boardId })
    },
    updateBoard(prop, toUpdate, groupId = null) {
      this.$store.dispatch({
        type: 'updateCurrBoard',
        groupId,
        taskId: null,
        prop,
        toUpdate,
      })
    },
    updateBoardFromSocket(board) {
      this.$store.commit({ type: 'updateBoard', board })
    },
    removeBoard(boardId) {
      this.$store.dispatch({ type: 'remove', boardId })
    },
    async copyBoard(boardId) {
      let newBoard = await boardService.getById(boardId)
      delete newBoard._id
      this.$store.dispatch({ type: 'saveBoard', board: newBoard })
    },
    setFilter(filterBy) {
      this.$store.dispatch({ type: 'setFilter', filterBy: filterBy })
    },
  },
  created() {
    socketService.on(SOCKET_EVENT_UPDATE_BOARD, this.updateBoardFromSocket)
  },
  unmounted() {
    socketService.off(SOCKET_EVENT_UPDATE_BOARD, this.board)
  },
  mounted() {
    this.$store.commit({ type: 'setPageLoading', isLoading: false })
  },
  components: {
    AppSideNav,
    WorkspaceSideNav,
    BoardHeader,
    Loader,
  },
}
</script>
