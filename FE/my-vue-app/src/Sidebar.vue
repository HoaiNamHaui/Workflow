<script setup>
import useDragAndDrop from './useDnD'

const { onDragStart } = useDragAndDrop()

const emit = defineEmits(['open-popup-run'])

function openPopupRun() {
  emit('open-popup-run')
}

</script>

<template>
    
  <aside>
    <dev class="run">
        <button class="btn btn-primary" @click="openPopupRun">Run workflow</button>
    </dev>

    <br><br>

    <div class="nodes">
      <div class="vue-flow__node-input" :draggable="true" @dragstart="onDragStart($event, 'start')">Bắt đầu</div>

      <div class="vue-flow__node-default" :draggable="true" @dragstart="onDragStart($event, 'code')">Code {/}</div>

      <div class="vue-flow__node-output" :draggable="true" @dragstart="onDragStart($event, 'end')">Kết thúc</div>
    </div>
  </aside>
</template>

<style lang="css" scoped>

.button_slide {
  background-color: #0be881;
  font-size: 20px;
  width: 100px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 2px solid ;
  cursor: pointer;
}
.button_slide:hover {
  background-color: #0be881;
  opacity: 0.8;
}
</style>
