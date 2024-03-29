<template>
  <section class="kanban-layout grid grid-col">
    <div class="kanban flex">
      <Container class="kanban-container" orientation="horizontal" @drop="onDropColumn" :drop-placeholder="{
        className: 'drop-placeholder',
        animationDuration: '200',
        showOnTop: true,
      }">
        <component :is="dragCmp" class="label-col" v-for="(label, index) in labels" :key="index">
          <div class="label-col-title" :style="{ backgroundColor: label.color }">
            <div v-if="index === labels.length - 1">Blank</div>
            {{ label.title }}
          </div>
          <div class="kanban-tasks">
            <KanbanCards :cmpsToDisplay="cmpsToDisplay" :tasks="tasks(label.title)" />
          </div>
        </component>
      </Container>
    </div>
    <KanbanFilter @changeLabel="onChangeLabel" @setFilterCmp="setFilterCmp" />
  </section>
</template>
<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import KanbanCards from '../../src/components/kanban/KanbanCards.vue'
import KanbanFilter from '../../src/components/kanban/KanbanFilter.vue'
export default {
  name: 'Kanban',
  data() {
    return {
      labelsOrder: [],
      currLabel: 'statusOrderKanban',
      cmpsToDisplay: ['taskTitle', 'date', 'person'],
    }
  },
  created() {
    this.labelsOrder = JSON.parse(
      JSON.stringify(this.$store.getters.currBoard[this.currLabel])
    )
  },
  methods: {
    onDropColumn({ addedIndex, removedIndex }) {
      this.labelsOrder.splice(
        addedIndex,
        0,
        this.labelsOrder.splice(removedIndex, 1)[0]
      )
      this.$store.dispatch({
        type: 'updateCurrBoard',
        groupId: null,
        taskId: null,
        prop: this.currLabel,
        toUpdate: this.labelsOrder,
      })
    },
    onChangeLabel(value) {
      this.currLabel =
        value === 'Priority' ? 'priorityOrderKanban' : 'statusOrderKanban'
      this.labelsOrder = JSON.parse(
        JSON.stringify(this.$store.getters.currBoard[this.currLabel])
      )
    },
    setFilterCmp(cmps) {
      this.cmpsToDisplay = ['taskTitle']
      this.cmpsToDisplay.push(...cmps)
    },
  },
  computed: {
    labels() {
      return this.labelsOrder
    },
    tasks() {
      return (currLabel) => {
        let taskPerLabel = {}
        const groups = this.$store.getters.groups
        const orderFilter =
          this.currLabel === 'priorityOrderKanban' ? 'priority' : 'status'
        groups.forEach((group) => {
          taskPerLabel = group.tasks.reduce((label, task) => {
            if (!label[task[orderFilter]]) label[task[orderFilter]] = []
            label[task[orderFilter]].push(task)
            return label
          }, taskPerLabel)
        })
        return taskPerLabel[currLabel]
      }
    },
    dragCmp() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return 'div'
      } else {
        return 'Draggable'
      }
    },
  },
  components: {
    Container,
    Draggable,
    KanbanCards,
    KanbanFilter,
  },
}
</script>
