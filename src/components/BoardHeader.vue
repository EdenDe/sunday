<template>
  <section class="board-header flex-col align-start">
    <div class="board-header-wrapper flex-col align-start">
      <div class="board-header-top-wrapper flex align-center">
        <h2
          v-tooltip="'Click to Edit'"
          contenteditable
          class="board-title"
          @focusout="onChangeTitle($event.target.innerText)"
        >
          {{ currBoard.title }}
        </h2>
        <div class="btn btn-container" v-tooltip="'Show board description'">
          <InfoIcon class="info-icon icon" />
        </div>
        <div class="btn btn-container" v-tooltip="'Add to favorite'">
          <StarIcon class="star-icon icon" />
        </div>

        <div class="btn-action-wrapper flex">
          <RouterLink
            :to="'/board/' + currBoard._id + '/main-table/pulse'"
            class="btn btn-activity flex"
          >
            Activity
            <div class="person-picker-wrapper flex">
              <PersonPicker :info="currBoard.members" :maxDisplay="3" />
            </div>
          </RouterLink>

          <button class="btn flex invite" @click="toggleInviteModal">
            <div class="svg-wrapper flex align-items justify-center">
              <AddPersonIcon class="icon icon-add-person" />
            </div>
            <p>Invite / {{ numOfMembers }}</p>
          </button>
        </div>
      </div>
      <Invite
        v-clickOutside="toggleInviteModal"
        v-if="isInviteModalOpen"
        @toggleInviteModal="toggleInviteModal"
        @updateBoard="
          (props, toUpdate) => $emit('updateBoard', props, toUpdate)
        "
      />

      <div class="desc-wrapper" v-tooltip="currBoard.description">
        <span
          class="desc"
          contenteditable
          @focusout="onChangeDesc($event.target.innerText)"
        >
          {{ currBoard.description }}
        </span>
      </div>
      <nav class="nav-bar flex align-start">
        <RouterLink :to="'/board/' + currBoard._id + '/main-table'">
          <div class="btn btn-container grid grid-col" v-tooltip="'Main Table'">
            <div class="icon-container">
              <HomeIcon class="home-icon icon" />
            </div>
            <span>Main Table</span>
          </div>
        </RouterLink>
        <RouterLink
          :to="'/board/' + currBoard._id + '/kanban'"
          class="kanban-active"
        >
          <div class="btn btn-container grid grid-col" v-tooltip="'Kanban'">
            <span>Kanban</span>
          </div>
        </RouterLink>
        <RouterLink :to="'/board/' + currBoard._id + '/dashboard'">
          <div class="btn btn-container grid grid-col" v-tooltip="'Dashboard'">
            <span>Dashboard</span>
          </div>
        </RouterLink>
      </nav>
    </div>
    <div class="seconde-row-container grid grid-col">
      <div class="btn-container btn-add-task grid grid-col aling-center">
        <button @click="addTask" class="btn btn-blue">New Task</button>
        <button @click="addTask" class="btn btn-blue mobile">+</button>
        <span class="btn btn-blue task-filter-icon">
          <ArrowDownIcon class="arrow-down-icon icon" />
        </span>
      </div>
      <SelectViewMobile />
      <TaskFilter @setFilter="(filterBy) => $emit('setFilter', filterBy)" />
    </div>
  </section>
</template>

<script>
import { boardService } from '../services/board.service.js'
import TaskFilter from './TaskFilter.vue'
import InfoIcon from '../assets/icons/Info.svg'
import StarIcon from '../assets/icons/Favorite.svg'
import FilterIcon from '../assets/icons/Filter.svg'
import HomeIcon from '../assets/icons/Home.svg'
import ArrowDownIcon from '../assets/icons/ArrowDown.svg'
import PersonPicker from './dynamicCmps/PersonPicker.vue'
import AddPersonIcon from '../assets/icons/AddToTeam.svg'
import Invite from '../components/Invite.vue'
import SelectViewMobile from './SelectViewMobile.vue'

export default {
  name: 'BoardHeader',
  data() {
    return {
      isInviteModalOpen: false,
    }
  },
  computed: {
    currBoard() {
      return { ...this.$store.getters.currBoard }
    },
    numOfMembers() {
      return this.$store.getters.currBoard.members?.length
    },
  },
  methods: {
    addTask() {
      let currGroup = JSON.parse(
        JSON.stringify(this.$store.getters.currBoard.groups[0])
      )
      let newTask = boardService.getEmptyTask()
      newTask.taskTitle = 'New Task'
      currGroup.tasks.unshift(newTask)
      this.$emit('updateBoard', 'tasks', currGroup.tasks, currGroup.id)
    },
    onChangeTitle(txt) {
      this.$emit('updateBoard', 'title', txt)
    },
    onChangeDesc(desc) {
      this.$emit('updateBoard', 'description', desc)
    },
    toggleInviteModal() {
      this.isInviteModalOpen = !this.isInviteModalOpen
    },
  },
  components: {
    TaskFilter,
    InfoIcon,
    StarIcon,
    FilterIcon,
    HomeIcon,
    ArrowDownIcon,
    PersonPicker,
    Invite,
    AddPersonIcon,
    SelectViewMobile,
  },
}
</script>
