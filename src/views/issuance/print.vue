<template>
  <div id="print">
    <div id="printContent">
      <img
        :src="url"
        style="width: 600px;height: 800px;"
      >
      <span style="text-align: center;">
        <el-button
          id="button"
          type="primary"
          @click="print"
        >打印</el-button>
      </span>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      url: '',
      printButton: true
    }
  },

  created() {
    this.url = this.$route.query.url
    console.log(this.url)
  },

  methods: {
    print() {
      document.getElementById('button').remove()
      var jubuData = document.getElementById('print').innerHTML
      console.log(jubuData)
      window.document.body.innerHTML = jubuData
      window.print()
    }
  }
}
</script>

<style lang="less" scoped>
#printContent {
  margin-top: 50px;
  margin-left: 50px;
}
</style>
