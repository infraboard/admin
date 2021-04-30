<template>
  <div id="container" style="height:90vh;border: 1px solid #2c2c2c26;" />
</template>
<script>

import * as monaco from 'monaco-editor'
export default {
  name: 'JsonEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ignoreEvent: false,
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
        overviewRulerBorder: false, // 不要滚动条的边框
        tabSize: 2, // tab 缩进长度
        theme: 'vs', // 官方自带三种主题vs, hc-black, or vs-dark
        minimap: {
          enabled: false // 不要小地图
        }
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
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #F08047;
}
</style>
