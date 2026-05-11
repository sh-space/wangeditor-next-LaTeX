<template>
  <el-dialog append-to-body title="latex公式" v-model="dialogVisible" width="60vw" @close="closeDialog">
    <el-form :model="form" label-width="60px" :rules="rules" ref="latexForm">
      <el-form-item label="公式" prop="latex">
        <el-input v-model="form.latex" type="textarea" />
      </el-form-item>
      <el-form-item label="">
         <DocItemPreview v-if="form.content && form.latex" :isShowStyle="true" :mdContent="form.content"></DocItemPreview>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClick">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts" name="latex-dialog">
import { IDomEditor, SlateTransforms } from '@wangeditor-next/editor';
import { ref, watch, defineAsyncComponent } from 'vue';
//@ts-ignore
const DocItemPreview = defineAsyncComponent(() => import('./doc-item-preview.vue'));

const dialogVisible = ref(false);
const rules = {
  latex: [
    { required: true, message: '请输入公式', trigger: 'blur' },
  ],
}
const form = ref({
  latex: '',
  content: '',
});
watch(
  () => form.value.latex,
  (val) => {
    if (val.includes('$')) {
      val = val.replaceAll('$', '');
      form.value.latex = val
    } 
    form.value.content = `<span data-w-e-type=\"formula\" data-w-e-is-void data-w-e-is-inline data-value="${val}"></span>`
  }
);

let editorRef = null as unknown as IDomEditor;
const initLatex = ref('')
const openDialog = (editor: IDomEditor) => {
  const fragment = editor.getFragment() as any;  
  if (fragment[0]?.type === 'table' && fragment[0]?.children[0]?.type === 'table-row' && fragment[0]?.children[0]?.children[0]?.type === 'table-cell' && fragment[0]?.children[0]?.children[0]?.children[0]?.type === 'formula') {
    form.value.latex = fragment[0]?.children[0]?.children[0]?.children[0]?.value
  }else {
    form.value.latex = fragment.length && fragment[0] &&  fragment[0]!.children[0]?.value || ''
  }
  form.value.latex = form.value.latex.replace(/\s/g, "");
  initLatex.value = form.value.latex
  editorRef = editor;
  dialogVisible.value = true;
};

const latexForm = ref()
const handleClick = async() => {
  await latexForm.value.validate()
  editorRef.focus()
  if (initLatex.value) {
    SlateTransforms.delete(editorRef, {unit: 'word'})
  }
  const latex = form.value.latex.replace(/\s/g, "");
  const formulaNode = `&nbsp;<span class="latex" data-w-e-type=\"formula\" data-w-e-is-void data-w-e-is-inline data-value="${latex}"></span>&nbsp;`
  editorRef.dangerouslyInsertHtml(formulaNode)
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
