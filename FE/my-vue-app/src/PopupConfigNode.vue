<template>
  <div>
    <span class="close" @click="closePopupConfig">&times;</span>
    <div class="popup-config-content">
      <!-- Phần UI thiết lập node start  -->
      <div v-if="nodeData.type === 'start'"></div>
        <!-- Phần UI thiết lập node code  -->
      <div v-if="nodeData.type === 'code'">
        <div class="title-node-config">Code {/}</div>
        <div class="d-flex justify-content-between">
          <div>BIẾN ĐẦU VÀO</div>
          <div style="cursor: pointer; font-size: 20px">+</div>
        </div>

        <div class="variable-input">
            <div v-for="(variable, index) in nodeData.data.variables" class="d-flex justify-content-between align-items-center mb-2">
                <input type="text" :value="variable.name" placeholder="Tên biến" :key="index" class="w80"/>
                <select placeholder="Đặt giá trị biến" :key="index">
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                </select>
                <input type="button" value="Xóa" class="btn btn-danger" :key="index" />
            </div>
        </div>

        <div class="lang-js">JavaScript:</div>
        <v-ace-editor
          v-model:value="content"
          lang="json"
          theme="dracula"
          @blur="formatCode"
          style="height: 200px"
        />
        <div class="d-flex justify-content-between mt-2">
          <div>BIẾN ĐẦU RA</div>
          <div style="cursor: pointer; font-size: 20px">+</div>
        </div>
        <div class="variable-output">
            <div v-for="(variable, index) in nodeData.data.outputs" class="d-flex justify-content-between align-items-center mb-2">
                <input type="text" :value="variable.name" placeholder="Vui lòng nhập" :key="index" class="w80"/>
                <select placeholder="Kiểu dữ liệu" :key="index">
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                </select>
                <input type="button" value="Xóa" class="btn btn-danger" :key="index" />
            </div>
      </div>
      <!-- Phần UI thiết lập node end  -->
      <div v-if="nodeData.type === 'end'"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/theme-dracula"; // Import theme Dracula
const emit = defineEmits(["close-popup-config"]);
const content = ref(`
function main({arg1, arg2}) 
{
    return 
    {
        result: arg1 + arg2
    }
}
`);

const formatCode = () => {
  const editor = ace.edit("editor"); // Truy cập vào editor
  editor.getSession().setMode("ace/mode/javascript"); // Đặt mode cho editor (ví dụ: javascript)
  editor
    .getSession()
    .getDocument()
    .setValue(editor.getSession().getDocument().getValue()); // Re-set value để định dạng lại
};

// Định nghĩa props
const props = defineProps({
  nodeData: {
    type: Object,
    required: true,
  },
});

/**
 * đóng popup config node
 */
function closePopupConfig() {
  emit("close-popup-config");
}
</script>

<style lang="css" scoped>
.w100{
    width: 100px;
}

.w80{
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
  overflow: auto;
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
