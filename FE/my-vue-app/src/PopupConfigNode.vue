<template>
  <div class="popup-config-container">
    <span class="close" @click="closePopupConfig">&times;</span>
    <div class="popup-config-content">
      <!-- Phần UI thiết lập node start  -->
      <div v-if="nodeSelectedData.type === 'start'">
        <div class="title-node-config">Bắt đầu</div>
        <div class="d-flex justify-content-between">
          <div>BIẾN ĐẦU VÀO</div>
          <div
            style="cursor: pointer; font-size: 20px"
            @click="addInputVariable(nodeSelectedData)"
          >
            +
          </div>
        </div>
        <div class="variable-input">
          <div
            v-for="(variable, index) in nodeSelectedData.data.variables"
            class="d-flex justify-content-between align-items-center mb-2"
          >
            <input
              type="text"
              v-model="nodeSelectedData.data.variables[index].variable"
              placeholder="Tên biến"
              :key="index"
              class="w80"
            />
            <select
              placeholder="Kiểu dữ liệu"
              :key="index"
              v-model="nodeSelectedData.data.variables[index].type"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
            <input
              type="button"
              value="Xóa"
              @click="deleteInputVariable(nodeSelectedData, index)"
              class="btn btn-danger"
              :key="index"
            />
          </div>
        </div>
      </div>
      <!-- Phần UI thiết lập node code  -->
      <div v-if="nodeSelectedData.type === 'code'">
        <div class="title-node-config">Code {/}</div>
        <div class="d-flex justify-content-between">
          <div>BIẾN ĐẦU VÀO</div>
          <div
            style="cursor: pointer; font-size: 20px"
            @click="addInputVariable(nodeSelectedData)"
          >
            +
          </div>
        </div>

        <div class="variable-input">
          <div
            v-for="(variable, index) in nodeSelectedData.data.variables"
            class="d-flex justify-content-between align-items-center mb-2"
          >
            <input
              type="text"
              v-model="variable.variable"
              placeholder="Tên biến"
              :key="index"
              class="w80"
            />
            <select
              placeholder="Đặt giá trị biến"
              :key="index"
              class="w120"
              v-model="nodeSelectedData.data.variables[index].valueSelector"
              @change="rebindValue($event, index)"
            >
              <option
                v-for="(variable, index) in comboSourceVariable"
                :value="variable.valueSelector"
              >
                {{ variable.valueSelector[1] }}
              </option>
            </select>
            <input
              type="button"
              value="Xóa"
              class="btn btn-danger"
              @click="deleteInputVariable(nodeSelectedData, index)"
              :key="index"
            />
          </div>
        </div>

        <div class="lang-js">JavaScript:</div>
        <v-ace-editor
          v-model:value="nodeSelectedData.data.code"
          lang="json"
          theme="dracula"
          @blur="formatCode"
          style="height: 200px"
        />
        <div class="d-flex justify-content-between mt-2">
          <div>BIẾN ĐẦU RA</div>
          <div
            style="cursor: pointer; font-size: 20px"
            @click="addOutputVariable(nodeSelectedData)"
          >
            +
          </div>
        </div>
        <div class="variable-output">
          <div
            v-for="(variable, index) in nodeSelectedData.data.outputs"
            class="d-flex justify-content-between align-items-center mb-2"
          >
            <input
              type="text"
              v-model="nodeSelectedData.data.outputs[index].variable"
              placeholder="Vui lòng nhập"
              :key="index"
              class="w120"
            />
            <select
              placeholder="Kiểu dữ liệu"
              :key="index"
              v-model="nodeSelectedData.data.outputs[index].type"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
            <input
              type="button"
              value="Xóa"
              class="btn btn-danger"
              @click="deleteOutputVariable(nodeSelectedData, index)"
              :key="index"
            />
          </div>
        </div>
      </div>
      <!-- Phần UI thiết lập node end  -->
      <div v-if="nodeSelectedData.type === 'end'">
        <div class="title-node-config">Kết thúc</div>
        <div class="d-flex justify-content-between mt-2">
          <div>BIẾN ĐẦU RA</div>
          <div
            style="cursor: pointer; font-size: 20px"
            @click="addOutputVariable(nodeSelectedData)"
          >
            +
          </div>
        </div>
        <div class="variable-output">
          <div
            v-for="(variable, index) in nodeSelectedData.data.outputs"
            class="d-flex justify-content-between align-items-center mb-2"
          >
            <input
              type="text"
              v-model="nodeSelectedData.data.outputs[index].variable"
              placeholder="Vui lòng nhập"
              :key="index"
              class="w120"
            />
            <select
              placeholder="Đặt giá trị biến"
              :key="index"
              class="w120"
              v-model="nodeSelectedData.data.outputs[index].valueSelector"
            >
              <option
                v-for="(item, index) in comboSourceVariable"
                :key="index"
                :value="item.valueSelector"
              >
                {{ item.valueSelector[1] }}
              </option>
            </select>
            <input
              type="button"
              value="Xóa"
              class="btn btn-danger"
              @click="deleteOutputVariable(nodeSelectedData, index)"
              :key="index"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onBeforeMount } from "vue";
import { defineEmits } from "vue";
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/theme-dracula"; // Import theme Dracula
import { require } from "ace-builds";
const emit = defineEmits(["close-popup-config"]);

const formatCode = () => {
  const editor = ace.edit("editor"); // Truy cập vào editor
  editor.getSession().setMode("ace/mode/javascript"); // Đặt mode cho editor (ví dụ: javascript)
  editor
    .getSession()
    .getDocument()
    .setValue(editor.getSession().getDocument().getValue()); // Re-set value để định dạng lại
};

let nodeSelectedData = ref({});
let comboSourceVariable = ref([]);

onBeforeMount(() => {
  nodeSelectedData.value = props.nodeData;
  let nodeId = nodeSelectedData.value.id;
  comboSourceVariable.value = getVariables(nodeId, props.nodes, props.edges);
});

/**
 * Lấy ra các input, output của node trước
 */
function getVariables(nodeId, nodes, edges) {
  let variables = [];
  let edgeSearch = edges.filter((edge) => edge.target === nodeId);
  let nodeSearch = [];
  edgeSearch.forEach((edge) => {
    nodeSearch.push(nodes.find((node) => node.id === edge.source));
  });

  nodeSearch.forEach((node) => {
    let newVariable = {
      variable: "",
      type: "",
      valueSelector: [],
    };
    debugger
    if (
      node &&
      node.data &&
      node.data.variables &&
      node.data.variables.length > 0
    ) {
      node.data.variables.forEach((variable) => {
        newVariable = {
          type: variable.type,
          valueSelector: [node.id, variable.variable],
        };
        variables.push(newVariable);
      });
    }

    let newOutput = {
      variable: "",
      type: "",
      valueSelector: [],
    };
    if (
      node &&
      node.data &&
      node.data.outputs &&
      node.data.outputs.length > 0
    ) {
      node.data.outputs.forEach((output) => {
        newOutput = {
          type: output.type,
          valueSelector: [node.id, output.variable],
        };
        variables.push(newOutput);
      });
    }
  });
  return variables;
}

// Định nghĩa props
const props = defineProps({
  nodeData: {
    type: Object,
    required: true,
  },
  nodes: {
    type: Array,
    required: true,
  },
  edges: {
    type: Array,
    required: true,
  },
});

/**
 * đóng popup config node
 */
function closePopupConfig() {
  emit("close-popup-config");
}

/**
 * Thêm input variable
 */
function addInputVariable(nodeData) {
  switch (nodeData.type) {
    case "start":
      nodeData.data.variables.push({ variable: "", label: "", type: "", required: true });
      break;
    case "code":
      nodeData.data.variables.push({ variable: "", label: "", type: "", required: true });
      break;
  }
}

/**
 * Thêm output variable
 */
function addOutputVariable(nodeData) {
  switch (nodeData.type) {
    case "end":
      nodeData.data.outputs.push({ variable: "", type: "" });
      break;
    case "code":
      nodeData.data.outputs.push({ variable: "", type: "" });
      break;
  }
}

/**
 * Xóa 1 biến đầu vào
 */
function deleteInputVariable(nodeData, index) {
  nodeData.data.variables.splice(index, 1);
}
/**
 * Xóa 1 biến đầu ra
 */
function deleteOutputVariable(nodeData, index) {
  nodeData.data.outputs.splice(index, 1);
}
</script>

<style lang="css" scoped>
.w100 {
  width: 100px;
}
.w120 {
  width: 120px;
}

.w80 {
  width: 80px;
}
.close {
  position: absolute;
  top: 12px;
  right: 24px;
  transform: scale(2);
  cursor: pointer;
}

.popup-config-content {
  padding: 12px 24px;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.popup-config-container {
  width: 100%;
  height: 100%;
}
.title-node-config {
  background-color: #3498db;
  color: white;
  padding: 5px 10px;
  width: max-content;
  border-radius: 15px;
}
.lang-js {
  color: #f39c12;
  margin: 10px 0px;
}
</style>
