<template>
    <div class="edit-module-box">
        <div class="title">
            <h2>编辑模块</h2>
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
.edit-module-box{
    padding: 20px;
    background-color: #fff;
    min-height: calc(100vh - 90px)
}
</style>