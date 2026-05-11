<template>
  <div>
    <section v-if="!props.disabled && props.disabledShowToolbar" ref="componentRef" @contextmenu.prevent.stop @wheel.stop class="relative z-[1001]" :style="{height: containerHeight}">
      <div class="flex flex-col border border-br relative z-[1]" v-loading="loading" style="height: 100%;" >
        <Toolbar class="border-b border-br" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor style="height: 70%; min-height: 200px;" class="flex-1" v-model="valueHtml" :defaultConfig="editorConfig" mode="default"
          @onCreated="handleCreated" @onChange="handleChange" :class="disabled ? 'disabled-table' : ''" />
      </div>
      <FormulaDialog ref="formulaDialog" />
      <LatexDialog ref="latexDialog" />
    </section>
    <DocPreview v-else :mdContent="valueHtml" />
  </div>
</template>

<script setup lang="ts" name="WangEditorNext">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import '@wangeditor-next/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor'
import { nextTick } from 'vue'
const formulaDialog = ref();
const latexDialog = ref();
const FormulaDialog = defineAsyncComponent(() => import('./components/formula-dialog.vue'));
const LatexDialog = defineAsyncComponent(() => import('./components/latex-dialog.vue'));

const props = withDefaults(defineProps<{
  value: string,
  /** 
   * 暂时只支持oss文件上传，sys-file文件上传暂时不支持
   */
  disabled?: boolean,
  placeholder?: string,
  mode?: 'default' | 'simple',
  // 双向绑定，用于获取 editor.getHtml()
  getHtml?: string,
  // 双向绑定，用于获取 editor.getText()
  getText?: string,
  height?: string,
  width?: string,
  /** 条目id */
  docId?: string;
  /** 文档id */
  rootDocId?: string;
  appendToBodyFlag?: boolean;
  editUploadType?: string;
  editorUploadPath?: string;
  containerHeight?: string; // 使用自定义高度或者继承父元素高度
  parentCode?: string;
  /**
   * 禁用状态下是否显示工具栏，默认true
   */ 
  disabledShowToolbar?: boolean;
}>(), {
  value: '',
  disabled: false,
  placeholder: '请输入内容...',
  mode: 'simple',
  height: '310',
  width: 'auto',
  docId: '',
  rootDocId: '',
  appendToBodyFlag: false,
  editUploadType: '', // 默认oss
  editorUploadPath: '',
  containerHeight: '300px',
  parentCode: '',
  disabledShowToolbar: true,
})

interface UploadEmits {
  (e: 'update:getHtml', value: string): void;
  (e: 'update:getText', value: string): void;
  (e: 'blur'): void;
  (e: 'update:content', value: string): void;
	(e: 'loadFinished'): void;
	(e: 'blurFinished'): void;
	(e: 'uploadFile', files: any[]): void;
	(e: 'changeEditor'): void;
}
const emit = defineEmits<UploadEmits>();


const editorRef = shallowRef()
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    "headerSelect", // 标题
    {
      "key": "group-image",
      "title": "插入更多",
      "iconSvg": '<svg t="1755841954866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9694" width="200" height="200"><path d="M675.04 483.264l-127.04 0 0-127.264c0-20.064-16.288-36.32-36.32-36.32-20.064 0-36.32 16.192-36.32 36.32l0 127.232-127.072 0c-20.064 0-36.352 16.32-36.352 36.352 0 20.064 16.224 36.352 36.352 36.352l127.072 0 0 127.232c0 20 16.256 36.384 36.32 36.384 20.032 0 36.32-16.256 36.32-36.384l0-127.136 127.04 0c19.968 0 36.352-16.256 36.352-36.384C711.36 499.552 695.136 483.264 675.04 483.264L675.04 483.264zM511.328 65.44c-250.24 0-453.952 203.616-453.952 453.952 0 250.336 203.712 453.952 453.952 453.952 250.336 0 453.984-203.584 453.984-453.952C965.312 269.056 761.696 65.44 511.328 65.44L511.328 65.44zM511.328 916.576c-219.04 0-397.184-178.176-397.184-397.152 0-219.104 178.144-397.216 397.184-397.216s397.216 178.112 397.216 397.216C908.576 738.368 730.368 916.576 511.328 916.576L511.328 916.576zM511.328 916.576" fill="#272636" p-id="9695"></path></svg>',
      "menuKeys": [
        "insertLink",
        // "insertImage",
        "uploadImage",
        'MyKityFormulaMenu',
		    'latexFormula',
        "codeBlock",
        "divider",
        "blockquote",
       
      ]
    },
    {
      "key": "group-more-style",
      "title": "更多",
      "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>",
      "menuKeys": [
        "fontSize",
        "fontFamily",
        "lineHeight",
        "bulletedList",
        "numberedList",
        "code",
        "through",
        "sup",
        "sub",
        "todo",
        "clearStyle",
        
      ]
    },
    "insertTable",
    "bold",
    "underline",
    "italic",
    "color",
    "bgColor",
    {
      "key": "group-justify",
      "title": "对齐",
      "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
      "menuKeys": [
        "justifyLeft",
        "justifyRight",
        "justifyCenter",
        "justifyJustify"
      ]
    },
    {
      "key": "group-indent",
      "title": "缩进",
      "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
      "menuKeys": [
        "indent",
        "delIndent"
      ]
    },
    
    "undo",
    "redo",
    "formatPainter",
    "fullScreen"
  ]
}
const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  MENU_CONF: {
    uploadImage: {
      // 自定义上传图片的方法
      async customUpload(file: File, insertFn: any) {
        // 判断上传类型 oss 和 sysFile
        if (props.editUploadType === editUploadTypeMap.oss) {
          try {
            const md5 = await uploadActionHandle(file, props.editorUploadPath)
            // 使用insertFn插入图片
            insertFn(`/api/pjm/pjmFile/oss/file?md5=${md5}`, file.name)
          } catch (error) {
              console.error('图片上传失败:', error)
          }
        }else {
          let formData = new FormData();
          formData.append('file', file);
          const { data } = await request({
            url: props.editorUploadPath || '/admin/sys-file/upload',
            method: 'post',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: formData,
          });
          insertFn(import.meta.env.VITE_API_URL + data.url, '', '')
        }
      },
      base64LimitSize: 0,
      server: '',
      metaWithUrl: false,
      onSuccess: (): void => {
        throw new Error('Function not implemented.')
      },
      onFailed: (): void => {
        throw new Error('Function not implemented.')
      },
      onError: (): void => {
        throw new Error('Function not implemented.')
      }
    },
  },
  readOnly: props.disabled,
  hoverbarKeys: {
		formula: {
			menuKeys: ['MyKityFormulaMenu', 'latexFormula'],
		},
		text: {
			// 文本选中时显示的菜单
			menuKeys: ['formatPainter', 'bulletedList', '|', 'bold', 'through', 'bgColor', 'color'], // 使用 plugin.ts 中定义的菜单 key
		},
		table: {
			menuKeys: [
				'MyKityFormulaMenu',
				'latexFormula',
				'enter',
				'tableHeader',
				'tableFullWidth',
				'insertTableRow',
				'deleteTableRow',
				'insertTableCol',
				'deleteTableCol',
				'deleteTable',
				'mergeTableCell',
				'splitTableCell',
				'setTableProperty',
				'setTableCellProperty',
			],
		},
	},
} as any;

// 添加配置以允许自定义 span 和 data- 属性
if (editorConfig) {
	(editorConfig as any).hoverbarKeys = {
		formula: {
			menuKeys: ['MyKityFormulaMenu', 'latexFormula'],
		},
		text: {
			menuKeys: ['formatPainter', 'bulletedList', '|', 'bold', 'through', 'bgColor', 'color'],
		},
		table: {
			menuKeys: [
				'MyKityFormulaMenu',
				'latexFormula',
				'markDict',
				'aiTools',
				'enter',
				'tableHeader',
				'tableFullWidth',
				'insertTableRow',
				'deleteTableRow',
				'insertTableCol',
				'deleteTableCol',
				'deleteTable',
				'mergeTableCell',
				'splitTableCell',
				'setTableProperty',
				'setTableCellProperty',
			],
		},
	};
}
// const valueHtml = defineModel<string>('valueHtml')
const valueHtml = ref('')

// 编辑器内容改变时
const handleChange = (editor: IDomEditor) => {
  emit('update:getHtml', editor.getHtml());
  emit('update:getText', editor.getText());
};

// 监听 props.value 的变化，更新 valueHtml
watch(() => props.value, (newValue) => {
  if (newValue !== valueHtml.value) {
    // valueHtml.value = newValue
    nextTick(() => {
      // valueHtml.value = storesMdRender.parseMarkdown(newValue);
    })
  }
}, { immediate: true })

watch(() => props.disabled, (newValue) => {
  if (newValue) {
    editorRef.value?.disable()
  } else {
    editorRef.value?.enable()
  }
}, { immediate: true })

const loading = ref(false)
const uploadActionHandle = async () => {
  
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()

  // 清除全局回调
  ;(window as any).__aiPolishDoneCallback = undefined
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  nextTick(() => {
		editor.on('edit-formula-click', (editor: IDomEditor) => {
			formulaDialog.value.openDialog(editor);
		});
		editor.on('latex-formula-click', (editor: IDomEditor) => {
			latexDialog.value.openDialog(editor);
		});
		editor.blur()
	});
}

const dialogVisible = ref(false);

const componentRef = ref<any>(null);
const clickOutside = (event: any) => {
	if (dialogVisible.value) {
		return; // 如果 DictDialog 可见，不触发失焦事件
	}
	if (formulaDialog.value?.dialogVisible) {
		return; // 如果 formulaDialog 可见，不触发失焦事件 ,公式弹窗
	}
	if (latexDialog.value?.dialogVisible) {
		return; // 如果 formulaDialog 可见，不触发失焦事件 ,latex公式编辑弹窗
	}
	
	if (componentRef.value && !componentRef.value.contains(event.target)) {
		// console.log('组件外部点击', editorRef.value?.getHtml())
		emit('update:content', editorRef.value?.getHtml() as any);
		emit('blurFinished');
	}
};

onMounted(() => {
	document.addEventListener('mousedown', clickOutside);

});

defineExpose({
	getHtml: () => editorRef.value?.getHtml(),
	getText: () => editorRef.value?.getText(),
});

</script>
<style scoped>
.disabled-table {
  :deep(.table-container) {
    .table {
      width: 100% !important;
    }
  }
}
:deep(.w-e-bar-item-menus-container) {
  max-height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
}
:deep(.ai-polish-origin) {
  transition: color 0.2s ease;
}

:deep(.ai-polish-origin--compare) {
  color: #99a1ad;
  text-decoration-line: line-through;
  text-decoration-thickness: 1px;
}

:deep(.ai-polish-origin--hidden) {
  display: none;
}

:deep(.ai-polish-result) {
  background-color: rgba(123, 92, 255, 0.12);
  border-radius: 2px;
}
</style>
