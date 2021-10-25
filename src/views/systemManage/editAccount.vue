<template>
  <section id="editAccount">
    <div class="app-container">
      <div class="main-box">
        <el-form ref="editAccountform" :model="accountInfoForm" :rules="rules" label-width="100px">
          <h3>基本信息</h3>
          <el-form-item label="用户名:" prop="userName" required>
            <el-input v-model="accountInfoForm.userName" maxlength="10" disabled placeholder="请设置用户名" />
          </el-form-item>
          <el-form-item label="手机号:" prop="phone" required>
            <el-input v-model="accountInfoForm.phone" disabled placeholder="请输入手机号(用于登录)" />
          </el-form-item>
          <el-form-item label="角色:" prop="role">
            <el-select v-model="accountInfoForm.role" multiple placeholder="请选择角色" @change="roleChange()">
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
          <h3>个人信息</h3>
          <el-form-item label="真实姓名:" prop="realName">
            <el-input v-model="accountInfoForm.realName" placeholder="请输入真实姓名" maxlength="15" />
          </el-form-item>
          <el-form-item label="性别:" required>
            <el-radio-group v-model="accountInfoForm.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="save-btn" size="medium" @click="save()">保存</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getRoleList,
  updateUserInfo
} from '@/api/userManage'
export default {
  data() {
    var validateRealName = (rule, value, callback) => {
      const reg = /^[A-Za-z\u2E80-\u9FFF\(\)\.\（\）]+$/
      if (value === '') {
        callback(new Error('不能为空'))
      } else if (!reg.test(value) || (value.length < 2 || value.length > 15)) {
        callback(new Error('需输入2-15个字'))
      } else {
        callback()
      }
    }
    return {
      accountInfoForm: {
        userName: '',
        phone: '',
        role: [],
        realName: '',
        gender: 1 // 1为男,2为女,默认为男
      },
      rules: { // 表单校验
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        realName: [{ required: true, validator: validateRealName, trigger: 'blur' }]
      },
      roleOptions: [], // 存放角色信息
      userId: ''
    }
  },
  created() {
    this.getRole()
    const temp = this.$route.params.row
    console.log(temp)
    this.accountInfoForm.userName = temp.username
    this.accountInfoForm.phone = temp.mobile
    this.accountInfoForm.role = temp.roleIdArr
    this.accountInfoForm.realName = temp.realName
    this.accountInfoForm.gender = Number(temp.gender)
    this.userId = temp.id
  },
  methods: {
    // 获取角色列表
    getRole() {
      getRoleList().then(res => {
        const roleArr = res.data; const optionList = []
        roleArr.forEach(item => {
          optionList.push({
            value: item.id,
            label: item.roleName
          })
        })
        this.roleOptions = optionList
      })
    },
    roleChange() {
      console.log(this.accountInfoForm.role)
    },
    // 保存
    save() {
      this.$refs['editAccountform'].validate((valid) => {
        if (valid) {
          const param = {
            userId: this.userId,
            realName: this.accountInfoForm.realName,
            gender: this.accountInfoForm.gender,
            ruleIds: this.accountInfoForm.role.join(',')
          }
          console.log(param)
          updateUserInfo(param).then(res => {
            if (res.success) {
              this.$fun.msg('账号编辑成功', 'success')
              this.$router.push({ path: '/systemManage/accountManage' })
            } else {
              this.$fun.msg(res.msg, 'error')
            }
          })
        } else {
          console.log('error submit')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
    #editAccount {
        .app-container {
            background: #f5f5f5;
            min-height: calc(100vh - 50px);
        }

        .main-box {
            background: #fff;
            margin-bottom: 20px;
            padding: 50px;
            min-height: calc(100vh - 100px);
        }

        .el-input {
            width: 400px;
        }

        .el-form-item {
            margin-left: 20px;
        }

        .save-btn {
            margin-top: 30px;
            margin-left: 120px;
        }
    }
</style>
