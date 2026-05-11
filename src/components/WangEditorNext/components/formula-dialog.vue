<template>
  <el-dialog append-to-body title="公式编辑" v-model="dialogVisible" width="60vw" @close="closeDialog">
    <div>
      <iframe :id="inputIFrameId" class="iframe" height="300px" width="100%" frameborder="0" scrolling="no"	:src="src">
      </iframe>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :id="btnOkId" type="primary" ref="btn" @click="handleClick">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { IDomEditor, SlateTransforms} from '@wangeditor-next/editor';
// SlateDescendant

const inputIFrameId = "kityformula_" + Math.ceil(Math.random() * 10);
const btnOkId = "kityformula-btn" + Math.ceil(Math.random() * 10);
const dialogVisible = ref(false);

let editorRef = null as unknown as IDomEditor;
const btn = ref()
const src = ref()
const initLatex = ref('')
const openDialog = (editor: IDomEditor) => {
  const fragment = editor.getFragment() as any
		if (fragment[0]?.type === 'table' && fragment[0]?.children[0]?.type === 'table-row' && fragment[0]?.children[0]?.children[0]?.type === 'table-cell' && fragment[0]?.children[0]?.children[0]?.children[0]?.type === 'formula') {
      initLatex.value = fragment[0]?.children[0]?.children[0]?.children[0]?.value
		}else {
      initLatex.value = fragment.length && fragment[0] &&  fragment[0]!.children[0]?.value || ''
    }
  editorRef = editor;
  src.value = initLatex.value
    ? `/cdn/kityformula/kityformula/index.html?latex=${encodeURIComponent(initLatex.value)}`
    : '/cdn/kityformula/kityformula/index.html';
  dialogVisible.value = true;
};

const handleClick = () => {
  const node = document.getElementById(inputIFrameId) as HTMLIFrameElement;
  const kfe =( node?.contentWindow as any).kfe;
  let latex = kfe.execCommand("get.source");
  latex = latex.replace(/\s/g, "");
  if (initLatex.value) {
    SlateTransforms.delete(editorRef, {unit: 'word'})
  }
  const formulaNode = `&nbsp;<span class="latex" data-w-e-type=\"formula\" data-w-e-is-void data-w-e-is-inline data-value="${latex}"></span>&nbsp;`
  editorRef.dangerouslyInsertHtml(formulaNode)
  editorRef.focus()
  dialogVisible.value = false;
};

const closeDialog = () => {
  dialogVisible.value = false;
};
defineExpose({
  openDialog,
  closeDialog,
  dialogVisible
});
</script>
