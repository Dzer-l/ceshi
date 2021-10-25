<template>
    <iframe :src="url"></iframe>
</template>

<script>
export default {
  name: 'OpenUrl',
  data() {
    return {
      url: ''
    }
  },
  created() {
    console.log(this.$route)
    this.url = this.$route.params.url
  }
}
</script>

<style lang="less" scoped>
    iframe{
        width: 100%;
        display: block;
        height: calc(100vh - 50px);
        border: none
    }
</style>
