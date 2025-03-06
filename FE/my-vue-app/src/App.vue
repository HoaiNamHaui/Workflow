<script setup>
import { ref, onMounted } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import DropzoneBackground from './DropzoneBackground.vue'
import SaveRestoreControls from './Controls.vue'
import Sidebar from './Sidebar.vue'
import useDragAndDrop from './useDnD'
import PopupRun from './PopupRun.vue'
import PopupConfigNode from './PopupConfigNode.vue'
// import default controls styles
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/core/dist/style.css'
const { onConnect, addEdges, addNodes , setViewport, } = useVueFlow()

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()

const { onNodeClick, onEdgeClick } = useVueFlow();

const nodes = ref([])
const edges = ref([])

  onConnect(addEdges)

 onMounted(() => {
  // Lấy dữ liệu workflow từ localStorage 
  const savedData = localStorage.getItem('vue-flow--save-restore')
  if (savedData) {
    const { nodes: savedNodes, edges: savedEdges, viewport } = JSON.parse(savedData);

    // Cập nhật lại nodes và edges
    nodes.value = savedNodes
    edges.value = savedEdges

    // Thêm lại các node và edge vào Vue Flow
    addNodes(savedNodes)
    addEdges(savedEdges)

    // Cập nhật lại vị trí và zoom cho Vue Flow
    if (viewport) {
      setViewport(viewport)
    }
  }
})

// có đang mở popup run Không
const isPopupRunVisible = ref(false)
const isShowPopupConfig = ref(false)

// Mở popup run
function openPopupRun() {
  isPopupRunVisible.value = true
}

// đóng popup run
function closePopupRun() {
  isPopupRunVisible.value = false
}

// đóng popup config
function closePopupConfig() {
  isShowPopupConfig.value = false
}

// Node được chọn khi double-click
const selectedNode = ref(null)

let lastClickTime = 0;
// Hàm xử lý click vào node
onNodeClick(({ event, node }) => {
  const currentTime = new Date().getTime();

  if (currentTime - lastClickTime < 300) {
    // Nếu lần nhấp thứ hai xảy ra trong khoảng thời gian nhỏ (300ms), coi là nhấp đúp
    // node: thông tin node được click
    selectedNode.value = node
    isShowPopupConfig.value = true
  } else {
    // Xử lý sự kiện nhấp chuột đơn tạm thời không xử lý gì
  }
  lastClickTime = currentTime;  // Cập nhật thời gian nhấp chuột cuối cùng
});

</script>

<template>
  <div class="dnd-flow" @drop="onDrop">
    <VueFlow :nodes="nodes" @dragover="onDragOver" @dragleave="onDragLeave" @node-click="onNodeClick">
      <SaveRestoreControls />
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease',
        }"
      >
        <p v-if="isDragOver">Drop here</p>
      </DropzoneBackground>
      <Controls />
      <MiniMap pannable zoomable />
    </VueFlow>
    <!-- Popup hiển thị khi double-click vào node -->
    <PopupConfigNode
      v-if="isShowPopupConfig"
      @close-popup-config="closePopupConfig"
      :node-data="selectedNode"
      :nodes="nodes"
      :edges="edges"
      class="popup-config-node"
    />
    <PopupRun v-if="isPopupRunVisible" class="popup-run" @close-popup-run="closePopupRun"/>
    <Sidebar @open-popup-run="openPopupRun"/>
  </div>
</template>

<style lang="css" scoped>
  .dnd-flow {
    position: relative;
  }

  .popup-run{
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(0, -50%);
    background-color: #fefefe;
    width: 800px;
    height: 600px;
    z-index: 1000;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 8px;
  }
  .popup-config-node{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fefefe;
    width: 400px;
    height: 600px;
    z-index: 1000;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 8px;
  }

</style>
