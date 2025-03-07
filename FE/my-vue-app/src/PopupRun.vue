<template>
    <div>
        <span class="close" @click="closePopupRun">&times;</span>
        <div class="popup-content">
            <h2>TEST RUN</h2>
            <!-- Tabs -->
            <div class="tabs">
                <button :class="{ active: activeTab === 'input' }" @click="activeTab = 'input'">NHẬP</button>
                <button :class="{ active: activeTab === 'result' }" @click="activeTab = 'result'">KẾT QUẢ</button>
            </div>

            <!-- Nội dung tab -->
            <div class="tab-content">
                <div v-if="activeTab === 'input'">
                <label>Nhập dữ liệu:</label> <br>
                <div style="margin: 10px 0;" v-for="(variable, index) in variables" :key="index">
                    <label>{{ variable.variable }}:</label>
                    <input class="styled-number" :type="variable.type" :name="variable.variable"  placeholder="Vui lòng nhập" required />
                </div>
                
                <button @click="startRun" class="btn btn-primary mt-2">Bắt đầu chạy</button>
                </div>

                <div v-else>
                <h3>Kết quả:</h3>
                </div>
            </div>
      </div>
    </div>
</template>

<script setup>
import { ref, defineProps, onBeforeMount } from "vue";
import * as Vue from 'vue' // in Vue 3
import axios from 'axios'
import VueAxios from 'vue-axios'
const emit = defineEmits(['close-popup-run'])

// Định nghĩa props
const props = defineProps({
  nodes: {
    type: Array,
    required: true,
  },
  edges: {
    type: Array,
    required: true,
  },
});

let nodeStart = ref({});
let variables = ref([]);

onBeforeMount(() => {
  nodeStart.value = props.nodes.find((node) => node.type === 'start');
  variables.value = nodeStart.value.data.variables;
})


/**
 * đóng popup run
 */
function closePopupRun() {
  emit('close-popup-run')
}

const activeTab = ref('input') // Mặc định là tab nhập liệu

/**
 * Bắt đầu chạy workflow: lấy input , workflow gọi api để chạy
 */
function startRun() {

  // Lưu workflow để lấy ID 
  let workflowID = "";

  let inputs = {};

  if(variables.value.length > 0){
    variables.value.forEach((variable) => {
      inputs[variable.variable] = document.getElementsByName(variable.variable)[0].value;
    });
  }
  


  // Kết nối SSE
  // const eventSource = new EventSource('http://localhost:5000/api/sse/stream');
  //   eventSource.onmessage = (event) => {
  //     this.messages.push(event.data); 
  //   };
  //   eventSource.onerror = (error) => {
  //     console.error('SSE error:', error);
  //     eventSource.close(); 
  //   };
    activeTab.value = 'result';
}
</script>

<style lang="css" scoped>
    .close{
    position: absolute;
    top: 12px;
    right: 24px;
    transform: scale(2);
    cursor: pointer;
  }

  /* Tabs */
.tabs {
  display: flex;
  margin-bottom: 10px;
}

.tabs button {
  cursor: pointer;
  border: none;
  background-color: white;
  font-weight: 600;
  padding: 5px 0;
  margin-right: 15px;
}
.popup-content{
    padding: 12px 24px;
}
.tabs button.active {
    border-bottom: 2px solid rgb(21 94 239/ 1) !important;
}

.tab-content {
  text-align: left;
}

.styled-number {
  width: 120px;
  padding: 8px;
  font-size: 16px;
  outline: none;
  border: 1px solid #ccc;
  width: 300px;
  border-radius: 8px; /* Bo góc */
  outline: none;
  transition: all 0.3s ease-in-out;
  background-color: white;
}

/* Khi focus vào input */
.styled-number:focus {
  border-color: #5CAFE2; /* Xanh dương đậm hơn một chút */
  box-shadow: 0 0 8px rgba(135, 206, 250, 0.6);
}

.btn-start-run{
    margin-top: 10px;
    background-color: #0be881;
    color: white;
    padding: 5px 10px;
    border-radius: 6px;
    border: 2px solid;
    cursor: pointer;
}
.btn-start-run:hover {
  background-color: #0be881;
  opacity: 0.8;
}
</style>