<template>
  <div class="main-box">
    <div style="background: #fff;padding: 20px">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="onClick_showDialog">新增</el-button>
      <el-table :data="list" style="width: 100%;margin-top: 20px" border>
        <el-table-column prop="userName" label="序号" min-width="120" />
        <el-table-column prop="userName" label="名称" min-width="120" />
        <el-table-column prop="userName" label="jdbcUrl" min-width="120" />
        <el-table-column prop="userName" label="用户名" min-width="120" />
        <el-table-column prop="userName" label="密码" min-width="120" />
        <el-table-column prop="userName" label="创建时间" min-width="120" />
        <el-table-column prop="userName" label="更新时间" min-width="120" />
        <el-table-column prop="userName" label="操作" min-width="120" />
      </el-table>
    </div>
    <el-dialog title="新增" :visible.sync="addList" width="440px" :before-close="handleClose">
      <el-form>
        <el-form-item label="类型" label-width="80px">
          <el-input v-model="form.type" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="描述" label-width="80px">
          <el-input v-model="form.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="字典类型" label-width="80px">
          <el-select v-model="form.system" placeholder="请选择">
            <el-option
              v-for="(item, index) in dictList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" label-width="80px">
          <el-input v-model="form.remarks" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="onClick_addDict">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { userName: '1231231' }
      ],
      form: {
        type: '',
        description: '',
        system: '',
        remarks: ''
      },
      dictList: [
        { value: 13, label: '系统类' },
        { value: 12, label: '业务类' }
      ],
      search: {
        pageNum: 1,
        pageSize: 10
      },
      addList: false
    }
  },
  created() {
    // this.getDataList()
  },
  methods: {
    getDataList() {
      this.$axios('org/sys-auth-client-List', this.search).then(res => {
        console.log(res)
      })
    },
    onClick_showDialog() {
      this.addList = true
    },
    handleClose() {
      this.addList = false
    },
    onClick_addDict() {
      console.log(this.form)
      this.$axios('org/insert-sys-dict', this.form, { method: 'POST' }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .main-box {
        width: 100%;
        padding: 20px 20px;
        box-sizing: border-box;
        min-height: calc(100vh - 50px);
        background-color: #f5f5f5;
    }
    .data-main{
        padding: 0 50px 0;
        box-sizing: border-box;
    }
    .el-dialog{
        .el-input,
        .el-select {
            width: 310px;
            margin-right: 30px;
        }
    }
</style>
