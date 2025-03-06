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
                <div style="margin: 10px 0;">
                    Number1: <input v-model="number1" class="styled-number" type="number" placeholder="Vui lòng nhập" required />
                </div>
                <div>
                    Number2: <input v-model="number2" class="styled-number" type="number" placeholder="Vui lòng nhập" required />
                </div>
                
                <input type="button" class="btn-start-run" value="Bắt đầu chạy" @click="startRun" />
                </div>

                <div v-else>
                <h3>Kết quả:</h3>
                <p>Số thứ nhất: {{ number1 }}</p>
                <p>Số thứ 2: {{ number2 }}</p>
                <p>Tổng hai số: {{ sum }}</p>
                </div>
            </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['close-popup-run'])

/**
 * đóng popup run
 */
function closePopupRun() {
  emit('close-popup-run')
}

const activeTab = ref('input') // Mặc định là tab nhập liệu
const number1 = ref('')      // Dữ liệu nhập vào
const number2 = ref('')      // Dữ liệu nhập vào
const sum = ref('')      // Tổng 2 số nhập vào

/**
 * Bắt đầu chạy workflow: lấy input , workflow gọi api để chạy
 */
function startRun() {
    // gọi api để chạy kết nối SSE

    // Update trạng thái từng node

    // Lỗi ở đâu show lỗi ở node đó

    // không lỗi có kết quả thì mở sang tab kết quả
    sum.value = number1.value + number2.value
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