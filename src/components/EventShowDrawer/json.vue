<template>
  <div id="container" :style="`height:${height}px;width:${width}px`" />
</template>
<script>

import * as monaco from 'monaco-editor'
export default {
  name: 'JsonEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 795
    }
  },
  data() {
    return {
      editor: null
    }
  },
  watch: {
    value(value) {
      const editorValue = this.editor.getValue()
      if (value !== editorValue) {
        this.editor.setValue(this.value)
      }
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initEditor() {
      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById('container'), {
        readOnly: true,
        value: this.value, // 编辑器初始显示文字
        language: 'json', // 语言支持自行查阅demo
        automaticLayout: true, // 自动布局
        theme: 'vs' // 官方自带三种主题vs, hc-black, or vs-dark
      })
      // 编辑器内容发生改变时触发
      this.editor.onDidChangeModelContent(() => {
        this.$emit('change', this.editor.getValue())
        this.editorValue = this.editor.getValue()
      })
    },
    getValue() {
      this.editor.getValue() // 获取编辑器中的文本
    }
  }
}
</script>
<style scoped>
.json-editor{
  font-size: 12px;
  height: 100%;
  position: relative;
}
.json-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
  line-height: 150%;
}
.json-editor >>> .CodeMirror-scroll{
  min-height: 300px;
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #F08047;
}
</style>
