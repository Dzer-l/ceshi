<template>
  <div id="monitorOffice" />
</template>
<script>
import { handleDocType } from '../common/utils'
export default {
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      doctype: ''
    }
  },
  watch: {
    option: {
      handler: function(n, o) {
        this.setEditor(n)
        this.doctype = handleDocType(n.fileType)
      },
      deep: true
    }
  },
  mounted() {
    if (this.option.url) { this.setEditor(this.option) }
  },
  methods: {
    setEditor(option) {
      this.doctype = handleDocType(option.fileType)
      // office配置参数
      const config = {
        document: {
          fileType: 'docx',
          key: 'asdfghjkla',
          title: 'Example Document Title.docx',
          url: 'https://test.api.lvzhengyun.cn/file/onlyofficeTest/entrust.docx'
        },
        documentType: 'text',
        editorConfig: {
          callbackUrl: 'http://127.0.0.1:8011/OnlineEditorsExampleJava_war/CallBackServlet?' + 'fileName=aaa.docx'
        },
        width: '70%',
        height: '100%'
      }
      const docEditor = new DocsAPI.DocEditor('monitorOffice', config)
    }
  }
}
</script>
