<template>
  <div class="main-box">
    <div style="background: #fff;padding: 20px" class="search-nav">
      <span>用户名：</span>
      <el-input v-model="search.username" placeholder="请输入用户名" />
      <span>手机号：</span>
      <el-input v-model="search.mobile" placeholder="请输入手机号" />
      <span>状态：</span>
      <el-select v-model="search.accountState" placeholder="请选择状态" style="width: 310px">
        <el-option label="正常" value="1" />
        <el-option label="锁定" value="2" />
      </el-select>
      <el-button type="primary" @click="getDataList">查询</el-button>
      <el-button @click="resSearch">重置</el-button>
    </div>
    <div style="background: #fff;padding: 20px">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="onClick_editUser()">新增</el-button>
      <el-table :data="list" style="width: 100%;margin-top: 20px" border>
        <el-table-column prop="name" label="序号" width="50">
          <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名" min-width="60" />
        <el-table-column prop="mobile" label="手机号" min-width="80" />
        <el-table-column prop="orgRoleList" label="角色" min-width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orgRoleList == null" disable-transitions style="margin: 0 10px 0 0;display:inline-block">超级管理员</el-tag>
            <div v-else>
              <el-tag v-for="(item, index) of scope.row.orgRoleList" :key="index" style="margin: 0 10px 0 0;display:inline-block">{{ item.roleName }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="accountState" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.accountState != 1 ? 'danger' : 'success'" disable-transitions>
              {{ scope.row.accountState == 1 ? '正常' : '锁定' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="100" />
        <el-table-column prop="userName" label="操作" width="250">
          <template slot-scope="scope">
            <span class="table-btn" @click="onClick_editUser(scope.row)">编辑</span>
            <span v-if='scope.row.is_signManage' class="table-btn" @click="onClick_signManage(scope.row.id)">签名管理</span>
            <span class="table-btn" @click="onClick_changePwd(scope.row)">重置密码</span>
            <span class="table-btn" @click="onClikc_delUser(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: center;margin-top: 20px">
        <el-pagination
          background
          center
          :page-size="search.size"
          layout="prev, pager, next, jumper"
          :current-page.sync="search.pageNum"
          :total="total"
          @current-change="changePage"
          @size-change="toPage"
        />
      </div>
    </div>
    <el-dialog :title="form.id ? '编辑' : '新增'" :visible.sync="addList" width="800px" :before-close="handleClose" :close-on-click-modal="false" class="show-form">
      <el-form ref="addUserForm" :model="form">
        <el-form-item label="用户名" prop="username" :rules="rules.username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="form.id ? true : false" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" :rules="rules.mobile">
          <el-input v-model="form.mobile" maxlength="11" placeholder="请输入手机号" :disabled="form.id ? true : false" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName" :rules="rules.realname">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender" :rules="{ required: true, message: '性别不能为空', trigger: 'blur' }">
          <div style="display: inline-block;width: 100%">
            <el-radio v-model="form.gender" label="1">男</el-radio>
            <el-radio v-model="form.gender" label="2">女</el-radio>
          </div>
        </el-form-item>
        <el-form-item v-if="!form.id" label="密码" prop="password" :rules="rules.password">
          <el-input v-model="form.password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-if="!form.id" label="确认密码" prop="psd" :rules="rules.psds">
          <el-input v-model="form.psd" show-password placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item label="角色" prop="orgRoleIdList">
          <div style="display: inline-block;width: 100%">
            <el-select v-model="form.orgRoleIdList" multiple placeholder=" ">
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="所属办证点" prop="orgRoleIdList">
          <div style="display: inline-block;width: 100%">
            <el-select v-model="form.orgOfficeId" placeholder="请选择办证点">
              <el-option
                v-for="(item, index) in orgList"
                :key="index"
                :label="item.officeName"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="accountState" :rules="{ required: true, message: '状态不能为空', trigger: 'blur' }">
          <div style="display: inline-block;width: 100%">
            <el-radio v-model="form.accountState" label="1">正常</el-radio>
            <el-radio v-model="form.accountState" label="2">锁定</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div class="confirm-btn">
        <el-button style="margin-left: auto" type="primary" @click="onClick_addUser">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="changePwd" width="680px" :before-close="handleClose" :close-on-click-modal="false" class="show-form">
      <el-form ref="pwdForm" :rules="rules" :model="pwdForm" style="display: flex;flex-wrap: wrap;justify-content: space-between;">
        <el-form-item label="密码" prop="password">
          <el-input v-model="pwdForm.password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="psd">
          <el-input v-model="pwdForm.psd" show-password placeholder="请再次输入密码" />
        </el-form-item>
      </el-form>
      <div class="confirm-btn">
        <el-button type="primary" @click="onClick_changePassWord">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="签名管理" width='350px' :visible.sync="signManage" class="sign-manage-popup">
      <div class="uploading-img-box">
        <el-upload class="avatar-uploader" :on-remove="handleRemove" action :show-file-list="false" :http-request="uploadSeal">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <div v-else class="avatar-uploader-hint">
            <div style="font-size:40px"><i class="el-icon-circle-plus"></i></div>
            <div style="color:#ccc">上传签名图片</div>
            </div>
        </el-upload>
      </div>
      <div class="confirm-btn">
        <el-button type="primary" @click="signPreview">签名预览</el-button>
        <el-button type="primary" @click="editSeal" :disabled='disabledSave'>保存</el-button>
      </div>
    </el-dialog>
    <el-dialog class="sign-preview-popup" width='400px' :show-close='false' :visible.sync="signPreviewShow" :center='true'> 
      <div>
        <div class="description">
            <i style="font-size:30px;color:#FAAD14;padding-right:10px" class="el-icon-warning"></i>
           <span>上传公证处印章后，才可使用签名预览功能，点击</span><router-link tag="span" class="skit" :to="{name:'notaryInfo'}">去上传</router-link>
           <span>。</span>
        </div>
        <div class="button-box">
          <el-button type="primary" @click="closePopup">好的</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {haveSeal,SealFileBase,previewSeal,editSealFile,uploadSealFile} from '../../api/setting'
export default {
  data() {
    var validateUserName = (rule, value, callback) => {
      const reg = /^[0-9a-zA-Z]{1,20}$/
      if (!value) {
        callback(new Error('不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入1-20位的字母、数字或其组合'))
      } else {
        callback()
      }
    }
    var validateRealName = (rule, value, callback) => {
      const reg = /^[A-Za-z\u4e00-\u9fa5\()（）·]{2,15}$/
      if (!value) {
        callback(new Error('不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('需输入2-15个字'))
      } else {
        callback()
      }
    }
    var validatePhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
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
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'))
      } else if (value !== this.form.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      signPreviewShow:false,
      imageUrl:'',
      list: [],
      form: {
        id: '',
        username: '',
        password: '',
        psd: '',
        accountState: '1',
        orgRoleIdList: [],
        mobile: '',
        phone: '',
        realName: '',
        gender: '1',
        isShowMobile: '1',
        orgOfficeId: ''
      },
      search: {
        pageNum: 1,
        username: '',
        mobile: '',
        accountState: '',
        pageSize: 10
      },
      roleList: [],
      orgList: [],
      total: 0,
      rules: {
        username: [{ required: true, validator: validateUserName, trigger: 'blur' }],
        realname: [{ required: true, validator: validateRealName, trigger: 'blur' }],
        mobile: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        psd: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        psds: [{ required: true, validator: validatePass3, trigger: 'blur' }]
      },
      signManage:false,
      addList: false,
      changePwd: false,
      pwdForm: {
        id: '',
        password: '',
        psd: '',
        mobile: ''
      },
      user_id:'',
      officialSealFile:'',
      disabledSave:true
    }
  },
  created() {
    this.getDataList()
    this.getRoleList()
  },
  watch: {
    officialSealFile:{
      handler: function(val) {
        if (val.length>0) {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    }
  },
  methods: {
    resSearch() {
      this.search = {
        pageNum: 1,
        username: '',
        mobile: '',
        accountState: '',
        pageSize: 10
      }
      this.getDataList()
    },
    getDataList() {
      this.$axios('org/org-user-page', this.search).then(res => {
        if (res.success) {
          let filter_list=JSON.parse(JSON.stringify(res.data.list))
          for(let i of filter_list){
            i.is_signManage=false
            if(i.orgRoleList!==null&&i.orgRoleList.length>0){
              for(let j of i.orgRoleList){
                if(j.roleType===3){
                  i.is_signManage=true
                }
              }
            }
          }
          this.list =filter_list
          this.total = res.data.total
        }
      })
    },
    getRoleList() {
      this.$axios('org/org-role-list', this.search).then(res => {
        if (res.success) {
          this.roleList = res.data
        }
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
    resForm() {
      this.form = {
        id: '',
        username: '',
        password: '',
        psd: '',
        accountState: '1',
        orgRoleIdList: [],
        mobile: '',
        phone: '',
        realName: '',
        gender: '1',
        isShowMobile: '1',
        orgOfficeId: ''
      }
      this.pwdForm = {
        id: '',
        password: '',
        username: '',
        psd: '',
        mobile: ''
      }
    },
    handleClose() {
      this.addList = false
      this.changePwd = false
      setTimeout(() => {
        this.resForm()
      }, 300)
    },
    changePage(e) {
      this.search.pageNum = parseInt(e)
      var url = `/#${this.$route.path}?page=${e}`
      history.pushState(null, null, url)
      this.getDataList()
    },
    toPage(e) {
      this.search.pageNum = JSON.parse(JSON.stringify(e))
      this.getDataList()
    },
    onClick_addUser() {
      this.$refs['addUserForm'].validate((e) => {
        if (e) {
          this.$axios(this.form.id ? 'org/edit-org-user-info' : 'org/save-org-user', this.form, { method: this.form.id ? 'PUT' : 'POST' }).then(res => {
            if (res.success) {
              this.$fun.msg(this.form.id ? '修改成功！' : '账号添加成功！', 'success')
              this.resForm()
              this.getDataList()
              this.addList = false
            } else {
              if (res.code === 50013) {
                this.$fun.msg('用户已注册', 'error')
              } else {
                this.$fun.msg(res.msg, 'error')
              }
            }
          })
        }
      })
    },
    onClick_changePassWord() {
      this.$refs['pwdForm'].validate(async(e) => {
        if (e && this.pwdForm.id) {
          const random = this.$fun.getUuid()
          const rasKey = await this.$axios(`rsa-public-key?random=${random}`)
          // this.pwdForm.password = this.$fun.rasEncrypt(this.pwdForm.password, rasKey.data)
          // this.pwdForm.psd = this.$fun.rasEncrypt(this.pwdForm.psd, rasKey.data)
          // this.pwdForm.random = random
          const val = {
            password: this.$fun.rasEncrypt(this.pwdForm.password, rasKey.data),
            psd: this.$fun.rasEncrypt(this.pwdForm.psd, rasKey.data),
            random: random,
            id: this.pwdForm.id,
            username: this.pwdForm.username,
            mobile: this.pwdForm.mobile
          }
          console.log(this.pwdForm, val)
          this.$axios('org/user-password', val, { method: 'PUT' }).then(res => {
            if (res.success) {
              this.$fun.msg('修改成功！', 'success')
              this.resForm()
              this.changePwd = false
            } else {
              this.$message.error('修改失败！')
            }
          })
        }
      })
    },
    onClikc_delUser(e) {
      this.$axios('org/org-user/' + e.id, {}, { method: 'delete' }).then(res => {
        if (res.success) {
          this.$fun.msg('删除成功！', 'success')
          this.getDataList()
        } else {
          this.$fun.msg(res.msg, 'error')
        }
      })
    },
    onClick_editUser(e) {
      this.addList = true
      if (e) {
        e = JSON.parse(JSON.stringify(e))
        e.gender = e.gender ? e.gender + '' : '1'
        e.accountState = e.accountState + ''
        const list = []
        if (e.orgRoleList) {
          for (const i of e.orgRoleList) {
            list.push(i.id)
          }
        }
        e['orgRoleIdList'] = list
        this.form = e
        this.$nextTick(() => {
          this.$refs['addUserForm'].clearValidate()
        })
      }
    },
    onClick_changePwd(e) {
      console.log(e)
      this.pwdForm.id = e.id
      this.pwdForm.username = e.username
      this.pwdForm.mobile = e.mobile
      this.changePwd = true
    },
    onClick_signManage(userId){
      SealFileBase({id:userId}).then(res=>{
        if(res.success&&res.data.success){
          this.imageUrl='data:image/jpeg;base64,'+res.data.data
        }else{
          this.imageUrl=''
        }
        this.user_id=userId
        this.signManage=true
      })
    },
    editSeal(){
      editSealFile({id:this.user_id,sealFile:this.officialSealFile}).then(res=>{
        if(res.success){
          this.$fun.msg('保存成功', 'success')
          this.signManage = false
          this.officialSealFile=''
        }
      })
    },
    //上传印章
    uploadSeal(e){
      const file = e.file
      const fileType = file.type // 文件类型
      const typeList = ['image/jpeg', 'image/jpg', 'image/png']
      const isImage = typeList.indexOf(fileType) !== -1 // 限制格式
      const isLt15M = file.size / 1024 / 1024 < 15 // 文件大小

      if (!isImage) {
        this.$message.error('请上传图片格式的文件!')
        return
      }

      if (!isLt15M) {
        this.$message.error('上传图片的大小应小于15M')
        return
      }
      const formData = new FormData()
      formData.append('file',file)
      uploadSealFile(formData).then(res=>{
        if(res.success){
          let _URL = window.URL || window.webkitURL
          this.imageUrl=_URL.createObjectURL(file)
          this.officialSealFile=JSON.stringify(res.data)
        }
      })
    },
    handleRemove(){
      console.log('111111111')
    },
    signPreview(){
      haveSeal({userId:this.user_id}).then(res=>{
        if(res.success){
          previewSeal({userId:this.user_id}).then(res=>{
            if(res){
              let binaryData = [];
              binaryData.push(res);
              let url =window.URL.createObjectURL(new Blob(binaryData, {type:"application/pdf"}));
              window.open(url)
            }
          })
        }else{
          this.signPreviewShow=true
        }
      })
    },
    closePopup(){
      this.signPreviewShow=false
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

    .search-nav {
      display: flex;
      align-items: center;
      white-space: nowrap;
      margin-bottom: 20px;
      .el-input,
      .el-select {
          width: 310px;
          margin-right: 30px;
        }
    }

    .data-main{
      padding: 0 50px 0;
      box-sizing: border-box;
    }

    .table-btn{
      cursor: pointer;
      color: #409EFF;
      margin-left: 20px;
      &:first-child{
        margin-left: 0;
      }
    }
    .show-form{
      .el-form{
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 50%;
          display: flex;
          /deep/ .el-form-item__label{
            width: 100px;
            text-align: left;
            margin-left: 20px;
          }
          /deep/ .el-form-item__content{
            flex: 1;
          }
          /deep/ .el-select{
            width: 100%;
          }
        }
      }
    }
    .confirm-btn{
      display: flex;
      justify-content: flex-end;
    }
    /deep/.sign-manage-popup .el-dialog__body{
      padding:10px 20px 30px 20px;
    }
    .uploading-img-box>.avatar-uploader{
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    /deep/.uploading-img-box .el-upload--text{
      width: 200px;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgb(236, 234, 234);
    }
    .sign-preview-popup{
      /deep/.el-dialog__header{
        padding:0 ;
      }
      .description{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        line-height: 30px;
        font-size: 14px;
        .skit{
          cursor: pointer;
          font-weight: 550;
          color: #409EFF;
        }
      }
      .button-box{
        display: flex;
        justify-content: flex-end;
      }
    }
</style>

<style lang="less">
    // .show-form /deep/ .el-form-item__content{
    //     width: 310px;
    // }
    // .show-form /deep/ .auto-item,.show-form /deep/ .auto-item .el-form-item__content{
    //     width: 100%
    // }
</style>
