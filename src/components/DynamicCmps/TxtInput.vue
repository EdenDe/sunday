<template>
  <section class="task-txt">
    <span
      contenteditable
      @focusout="onFocusout($event.target.innerText)"
      :style="{ fontSize: '14px' }"
      v-tooltip="txt"
      >{{ txt }}
    </span>
    <div class="default-txt" v-if="!txt.length">
      <div class="icon-wrapper add-icon-wrapper">
        <PlusIcon class="add-icon" />
      </div>
      <div class="icon-wrapper">
        <TextIcon />
      </div>
    </div>
  </section>
</template>

<script>
import TextIcon from '../../assets/icons/Text.svg'
import PlusIcon from '../../assets/icons/Add.svg'
export default {
  name: 'TextInput',
  props: {
    info: String || null,
  },
  emits: ['updateProp'],
  data() {
    return {
      txt: this.info,
    }
  },
  watch: {
    info() {
      this.txt = this.info
    },
  },
  methods: {
    onFocusout(txt) {
      this.txt = txt
      this.$emit('updateProp', 'text', txt)
    },
  },
  components: {
    PlusIcon,
    TextIcon,
  },
}
</script>
