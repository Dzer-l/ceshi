<template>
  <section id="userInfo">
    <div class="app-container">
      <div class="main-box">
        <el-tabs v-model="key" tab-position="left" style="height: 350px;">
          <el-tab-pane key="1" label="个人信息" name="1">
            <div class="form-box">
              <div class="row">
                <div class="item-left">手机号码:</div>
                <div class="item-right">{{ userInfo.mobile }}</div>
              </div>
              <div class="row">
                <div class="item-left">角色:</div>
                <div class="item-right">
                  <span v-for="(item,index) of userRole" :key="index">{{ index != 0 ? '，' : '' }}{{ item.roleName }}</span>
                </div>
              </div>
              <div class="row">
                <div class="item-left">真实姓名:</div>
                <div class="item-right">{{ userInfo.realName }}</div>
              </div>
              <div class="row" style="margin-bottom:22px">
                <div class="item-left">所在办证点:</div>
                <div class="item-right" style="padding:0px">
                  <el-select v-model="userInfo.orgOfficeId" placeholder="请选择所在的办证点">
                    <el-option
                      v-for="(item, index) in orgList"
                      :key="index"
                      :label="item.officeName"
                      :value="item.id"
                    />
                  </el-select>
                </div>
              </div>
              <el-button type="primary" size="medium" class="save-btn" @click="save()">保存</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane key="2" label="修改密码" name="2">
            <el-form
              ref="accountPasswordForm"
              :rules="rules"
              :model="accountPasswordForm"
              label-position="left"
              label-width="120px"
            >
              <el-form-item label="原密码:" prop="password">
                <el-input
                  v-model="accountPasswordForm.password"
                  show-password
                  placeholder="请输入原密码"
                  maxlength="16"
                />
              </el-form-item>
              <el-form-item label="设置新密码:" prop="newPassword">
                <el-input
                  v-model="accountPasswordForm.newPassword"
                  show-password
                  placeholder="请设置8-16位包含数字、大小写字母"
                  maxlength="16"
                />
              </el-form-item>
              <el-form-item label="确定密码:" prop="confirmPass">
                <el-input
                  v-model="accountPasswordForm.confirmPass"
                  show-password
                  placeholder="请再次输入新密码"
                  maxlength="16"
                />
              </el-form-item>
              <el-button type="primary" size="medium" class="save-btn" @click="confirmUpdatePassword()">确认</el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import { logout } from '@/api/user'

export default {
  data() {
    // 表单校验
    var validatePass = (rule, value, callback) => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/
      if (value === '') {
        callback(new Error('请设置密码'))
      } else if (!reg.test(value)) {
        callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'))
      } else if (value !== this.accountPasswordForm.newPassword) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      locateOptions: [],
      userInfo: {},
      userRole: [],
      orgList: [],
      selectedLocate: '', // 保存所在办证点
      accountPasswordForm: {
        password: '',
        newPassword: '',
        confirmPass: ''
      },
      rules: {
        password: [{ required: true, message: '不能为空', trigger: 'blur' }],
        newPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
        confirmPass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      },
      key: '1' // 标记1为个人信息,2为修改密码
    }
  },
  created() {
    this.getInfo()
    if (this.$route.query.key) {
      this.key = String(this.$route.query.key)
      console.log(this.key)
    } else {
      this.key = '1'
    }
  },
  methods: {
    getInfo() {
      this.$axios('org/org-user').then(res => {
        this.userInfo = res.data.orgUser
        this.userInfo.orgOfficeId = this.userInfo.orgOfficeId ? this.userInfo.orgOfficeId + '' : ''
        this.userRole = res.data.orgRoleList
      })
      this.$axios('org/org-office-by-orgId', this.search).then(res => {
        if (res.success) {
          for (let index = 0; index < res.data.length; index++) {
            res.data[index].id = res.data[index].id.toString()
          }
          this.orgList = res.data
          console.log(this.orgList)
        }
      })
    },
    confirmUpdatePassword() {
      // 修改密码
      this.$refs['accountPasswordForm'].validate(async(valid) => {
        if (valid) {
          const random = this.$fun.getUuid()
          const rasKey = await this.$axios(`rsa-public-key?random=${random}`)
          const param = {
            password: this.$fun.rasEncrypt(this.accountPasswordForm.password, rasKey.data),
            newPassword: this.$fun.rasEncrypt(this.accountPasswordForm.newPassword, rasKey.data),
            random
          }
          this.$axios('org/user-password-by-user', param, { method: 'PUT' }).then(res => {
            if (res.success) {
              this.$fun.msg('重置密码成功！', 'success')
              logout().then(async res => {
                await this.$store.dispatch('user/logout')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              })
            } else {
              this.$fun.msg(res.msg, 'error')
            }
          })
        }
      })
    },
    save() { // 修改办证地点
      if (!this.userInfo.orgOfficeId) {
        this.$fun.msg('请选择办证地点', 'error')
        return
      }
      this.$axios('org/edit-org-user-info', { id: this.userInfo.id, orgOfficeId: this.userInfo.orgOfficeId }, { method: 'put' }).then(res => {
        console.log(res)
        if (res.success) {
          this.$fun.msg('保存办证点成功', 'success')
        } else {
          this.$fun.msg(res.msg, 'error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
#userInfo {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
    padding: 10px;
  }
  .main-box {
    background: #fff;
    padding: 30px;
    min-height: calc(100vh - 100px);
  }
  .form-box {
    padding: 30px;
    .row {
      display: flex;
      .item-left {
        width: 120px;
        padding-right: 12px;
        text-align: left;
        font-size: 14px;
        color: #606266;
        font-weight: 700;
        line-height: 40px;
        vertical-align: middle;
      }
      .item-right {
        width: 400px;
        padding: 10px 0;
      }
    }
  }
  .save-btn {
    margin-top: 30px;
    margin-left: 120px;
  }
  .el-form {
    margin: 30px;
  }
  .el-form-item__content,
  .el-input--suffix .el-input__inner{
    width: 400px;
  }
  .el-dialog {
    width: 500px;
  }
  .el-select {
    width: 100%;
  }
  .el-dialog__title, .el-tabs__item{
    font-size: 14px;
    font-weight: normal;
  }
}
</style>
