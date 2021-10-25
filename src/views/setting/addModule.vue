<template>
    <div class="add-module-box">
        <div class="title">
            <h2>新增模块</h2>
        </div>
        <moduleOperation />
    </div>
</template>
<script>
import moduleOperation from '../../components/setting/moduleOperation'
export default {
    components: {moduleOperation},
    data () {
        return {
            
        }
    },
    methods: {

    },
}
</script>
<style lang='less' scoped>
.add-module-box{
    padding: 20px;
    background-color: #fff;
    min-height: calc(100vh - 90px)
}
</style>