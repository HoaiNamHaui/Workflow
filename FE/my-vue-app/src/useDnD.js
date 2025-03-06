import { useVueFlow } from "@vue-flow/core";
import { ref, watch } from "vue";

let id = 0;

/**
 * @returns {string} - A unique id.
 */
function getId() {
  return `dndnode_${id++}`;
}

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
  /**
   * loại node được kéo
   */
  draggedType: ref(null),
  isDragOver: ref(false),
  isDragging: ref(false),
};

export default function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging } = state;

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } =
    useVueFlow();

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? "none" : "";
  });

  function onDragStart(event, type) {
    if (event.dataTransfer) {
      event.dataTransfer.setData("application/vueflow", type);
      event.dataTransfer.effectAllowed = "move";
    }

    draggedType.value = type;
    isDragging.value = true;

    document.addEventListener("drop", onDragEnd);
  }

  /**
   * Xử lý kéo
   *
   * @param {DragEvent} event
   */
  function onDragOver(event) {
    event.preventDefault();

    if (draggedType.value) {
      isDragOver.value = true;

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
  }

  function onDragLeave() {
    isDragOver.value = false;
  }

  function onDragEnd() {
    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;
    document.removeEventListener("drop", onDragEnd);
  }

  /**
   * xử lý thả
   *
   * @param {DragEvent} event
   */
  function onDrop(event) {
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    });
    const nodeId = getId();

    // Ánh xạ tên node theo type
    const nodeNames = {
      start: "Bắt đầu",
      code: "Code {/}",
      end: "Kết thúc",
    };

    // Lấy tên từ ánh xạ dựa trên type của node
    const nodeName = nodeNames[draggedType.value] || "";

    let label = nodeName ? nodeName : nodeId;
    let newNode = {
      id: nodeId,
      type: draggedType.value,
      position,
      data: { label: label },
    };

    addSpecialAttrToNode(newNode);

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: {
          x: node.position.x - node.dimensions.width / 2,
          y: node.position.y - node.dimensions.height / 2,
        },
      }));

      off();
    });

    addNodes(newNode);
  }

  function addSpecialAttrToNode(node) {
    switch (node.type) {
      case "start":
        node.data = {
          ...node.data,
          variables: [],
        };
        break;
      case "end":
        node.data = {
          ...node.data,
          outputs: [],
        };
        break;
      case "code":
        node.data = {
          ...node.data,
          code: `
function main({arg1, arg2}) 
{
  return 
  {
    result: arg1 + arg2
  }
}`,
          code_language: "javascript",
          outputs: [
            {
              variable: "result",
              type: "number",
              valueSelector: [],
            },
          ],
          variables: [
            { variable: "arg1", valueSelector: [] },
            { variable: "arg2", valueSelector: [] },
          ],
        };
        break;
      default:
        break;
    }
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  };
}
