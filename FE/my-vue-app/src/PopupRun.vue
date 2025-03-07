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

                <div v-else style="overflow: auto;height: 470px;width: 751px;">
                  <div>
                    <h4>STATUS: {{ statusWorkflow }}</h4>
                  </div>
    
                  <div v-for="(testRunResultItem, index) in testRunResultArray" :key="index">
                      
                    <h4>Bước {{index + 1 }}: </h4>
                    <v-ace-editor v-if="testRunResultItem.Success"
                      :value="JSON.stringify(testRunResultItem.Message, null, 2)"
                      lang="json"
                      theme="dracula"
                      style="height: 100px"
                       :options="{ readOnly: true }"
                    />
                    <div v-else  style="color:red;">
                      {{ testRunResultItem.Message }}
                    </div>
                  </div>
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
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/theme-dracula"; // Import theme Dracula
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
let testRunResult = ref(""); 
const testRunResultArray = ref([]);
let statusWorkflow = ref("")

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
async function startRun() {

  // Lưu workflow để lấy ID 
  let workflowID = "";
  // Lấy dữ liệu workflow từ localStorage 
  let savedData = localStorage.getItem('vue-flow--save-restore')
  var workflow = {
    Name : "Test",
    GraphString : savedData
  };

  await axios.post
  ('http://localhost:5270/workflow/api/draft',workflow, {
    headers: { "Content-Type": "application/json" }
}).then((response) => {
    workflowID = response.data;
  }).catch((error) => {
    console.log(error);
  });

  let inputs = {};

  if(variables.value.length > 0){
    variables.value.forEach((variable) => {
      inputs[variable.variable] = document.getElementsByName(variable.variable)[0].value;
    });
  }

  testRunResultArray.value = [];

    var nodes = document.querySelectorAll([`.vue-flow__node`]);
    nodes.forEach((node) => {
      node.classList.remove('executing');
      node.classList.remove('executed');
      node.classList.remove('executedError');
    });

  //Kết nối SSE
  const eventSource = new EventSource(`http://localhost:5270/workflow/api/sse/${workflowID}`);
  eventSource.onmessage = (event) => {
    // this.messages.push(event.data); 
    var result = JSON.parse(event.data);
    if(result.eventName == "node_started"){
      debugger
      document.querySelector([`[data-id=${result.node.id}]`]).classList.add('executing');
    }
    else if(result.eventName == "node_finished"){
      debugger
      document.querySelector([`[data-id=${result.node.id}]`]).classList.remove('executing');
      document.querySelector([`[data-id=${result.node.id}]`]).classList.add('executed');
      testRunResultArray.value.push({Message: result.result.Data, Success: result.result.Success});
    }
    else if(result.eventName == "error"){
      document.querySelector([`[data-id=${result.node.id}]`]).classList.remove('executing');
      document.querySelector([`[data-id=${result.node.id}]`]).classList.add('executedError');
      testRunResultArray.value.push({Message: result.result.Error, Success: result.result.Success});
      statusWorkflow.value = "FAIL";
    }
    else if(result.eventName == "workflow_finished"){
      statusWorkflow.value = "SUCCESS";
    }
    activeTab.value = 'result';
  };
  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    eventSource.close(); 
  };

  var runWorkflowParameter = {
    WorkflowID : workflowID,
    InputsString : JSON.stringify(inputs)
  };

  await axios.post
  ('http://localhost:5270/workflow/api/draft/runv2',runWorkflowParameter, {
    headers: { "Content-Type": "application/json" }
  })



    
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