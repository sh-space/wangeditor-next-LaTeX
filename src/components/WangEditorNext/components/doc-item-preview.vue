<template v-if="props.isShow">
  <!-- <template > -->
  <div class="preview-md" @click="itemClick" @dblclick="itemDblClick" v-if="isShowStyle" v-html="parseMarkLateX(props.mdContent)" v-lazy-img></div>
  <span v-else @click="itemClick" @dblclick="itemDblClick">
    {{ getPlainTextContent(props.mdContent) }}
  </span>
  <!-- </template> -->
</template>

<script setup lang="ts">
import { configureMathJax } from '../../../utils/mathjax'
import { nextTick } from 'vue';

configureMathJax()
const props = withDefaults(
  defineProps<{
    mdContent?: string
    isShow?: boolean
    isShowStyle?: boolean
  }>(),
  {
    mdContent: ''
  }
)

const emits = defineEmits<{
  (e: 'item-click', mdContent: string): void
  (e: 'item-dbl-click', mdContent: string): void
}>()

const itemDblClick = () => {
  emits('item-dbl-click', props.mdContent)
}

const itemClick = () => {
  emits('item-click', props.mdContent)
}

// 获取纯文本内容，去除所有格式标记
const getPlainTextContent = (text: string) => {
  if (!text) return ''

  // 处理Markdown格式
  let plainText = text

  // 处理标题
  plainText = plainText.replace(/^(#{1,6})\s+(.*?)$/gm, '$2')

  // 处理加粗和斜体
  plainText = plainText.replace(/\*\*(.*?)\*\*/g, '$1')
  plainText = plainText.replace(/\*(.*?)\*/g, '$1')
  plainText = plainText.replace(/__(.*?)__/g, '$1')
  plainText = plainText.replace(/_(.*?)_/g, '$1')

  // 处理链接 [文本](链接)
  plainText = plainText.replace(/\[(.*?)\]\(.*?\)/g, '$1')

  // 处理图片 ![alt](src)
  plainText = plainText.replace(/!\[(.*?)\]\(.*?\)/g, '$1')

  // 处理代码块和行内代码
  plainText = plainText.replace(/```[\s\S]*?```/g, '')
  plainText = plainText.replace(/`(.*?)`/g, '$1')

  // 处理列表
  plainText = plainText.replace(/^[\s]*[-*+][\s]+(.*?)$/gm, '$1')
  plainText = plainText.replace(/^[\s]*\d+\.[\s]+(.*?)$/gm, '$1')

  // 处理引用
  plainText = plainText.replace(/^[\s]*>[\s]+(.*?)$/gm, '$1')

  // 处理HTML标签 (包括h1-h6等富文本标签)
  plainText = plainText.replace(/<[^>]*>/g, '')

  return plainText.trim()
}

const parseMarkLateX = (str: string) => {
  if (!str) {
    return ''
  }
  let convertStr = str
  // 处理公式：将 wangeditor 的 formula span 转为 MathJax 可识别的 $...$ 格式
  if (convertStr.includes('data-w-e-type="formula"')) {
    convertStr = convertStr.replace(/<span[^>]*data-w-e-type="formula"[^>]*data-value="([^"]*)"[^>]*><\/span>/g, (match, p1) => {
      try {
        if (p1.includes('raisebox')) p1 = p1.replaceAll('raisebox', 'raise')
        return `<span>$${p1}$</span>`
      } catch (error) {
        return match
      }
    })
    nextTick(() => {
      const mathJax = (window as any).MathJax
      if (!mathJax) return
      mathJax.Hub.Queue(['Typeset', mathJax.Hub, convertStr])
    })
  }
  return convertStr
}
</script>

<style>
.preview-md {
  line-height: 23.4pt;
  font-size: 12pt;
  color: #606266;

  a {
    color: #409eff;
    text-decoration: underline;
  }

  ul,
  ol {
    display: block;
    padding-left: 20px;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.17em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.83em;
  }

  h6 {
    font-size: 0.75em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 10px 0;
  }

  p {
    white-space: normal;
  }

  table {
    width: 100% !important;
    border-collapse: collapse;

    th,
    td {
      padding: 8px 12px;
      text-align: left;
      border: 1px solid #ccc;
      min-height: 24px;
      /* 保证行高最小为 24px */
      word-wrap: break-word;
      /* 让长文本自动换行 */
      word-break: break-word;
      /* 也可以使用 word-break 来防止文本溢出 */
      white-space: normal;
    }
  }
}

:deep(.MathJax_Display) {
  display: inline-block !important;
  text-align: left !important;
}
</style>
