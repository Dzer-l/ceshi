<template>
  <section id="templateConfig">
    <div class="app-container">
      <div class="notary-info-box">
        <div class="title">公证处信息</div>
        <el-form ref="notaryInfoForm.orginfo"
                 :model="notaryInfoForm.orginfo"
                 label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="公证处名称:"
                            prop="orgName"
                            :rules="[{ required: true, message: '公证处名称不能为空', trigger: 'blur' }]">
                <el-input v-model="notaryInfoForm.orginfo.orgName"
                          size="medium"
                          maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8"
                    :offset="2">
              <el-form-item label="办证区域:"
                            prop="regionCode"
                            :rules="[{ required: true, message: '办证区域不能为空', trigger: 'blur' }]">
                <el-cascader v-model="notaryInfoForm.orginfo.regionCode"
                             :options="regionOptions"
                             :props="{ checkStrictly: true }"
                             :show-all-levels="false" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="办公地点:"
                            prop="orgAddr"
                            :rules="[{ required: true, message: '办公地点不能为空', trigger: 'blur' }]">
                <el-input v-model="notaryInfoForm.orginfo.orgAddr"
                          size="medium"
                          maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8"
                    :offset="2">
              <el-form-item label="办公时间:"
                            prop="workingTime"
                            :rules="[{ required: true, message: '办公时间不能为空', trigger: 'blur' }]">
                <el-input v-model="notaryInfoForm.orginfo.workingTime"
                          size="medium"
                          maxlength="100" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系电话:"
                            prop="phone"
                            :rules="[{ required: true, validator: validatePhone, trigger: 'blur' }]">
                <el-input v-model="notaryInfoForm.orginfo.phone"
                          oninput="value=value.replace(/[^\d]/g,'')"
                          size="medium"
                          maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8"
                    :offset="2">
              <el-form-item label="副本费起算份数"
                            prop="copyCostNumber">
                <el-input-number v-model="notaryInfoForm.orginfo.copyCostNumber"
                                 size="medium"
                                 :min="2"
                                 :max="10" />
              </el-form-item>
              <!-- <el-form-item label="副本费起算份数:" prop="copyCostNumber">
                <el-input v-model="notaryInfoForm.orginfo.copyCostNumber" oninput="value=value.replace(/[^\d]/g,'')" size="medium" maxlength="10" />
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="图标:"
                            prop="desc">
                <el-upload class="avatar-uploader"
                           action
                           :show-file-list="false"
                           :http-request="uploadImg">
                  <img v-if="notaryLogoUrl"
                       :src="notaryLogoUrl"
                       class="avatar">
                  <!-- <i v-else class="el-icon-plus avatar-uploader-icon" /> -->
                  <img v-else
                       src="../../assets/defaul_images/default_org.png"
                       style="width:240px;height:180px;border:1px solid #eee;display:block;">
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8"
            :offset="2">
              <el-form-item label="印章:" prop="desc" class="uploading-img-box">
                <el-upload class="avatar-uploader" action  :show-file-list="false" :http-request="uploadSeal">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <div v-else class="avatar-uploader-hint">
                    <div style="font-size:40px"><i class="el-icon-circle-plus"></i></div>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="certificate-box">
        <div class="title">
          办证点管理
          <el-button type="primary"
                     size="medium"
                     class="add-btn"
                     @click="addNewOffice()">新增办证点</el-button>
        </div>
        <div v-if="notaryInfoForm.orgOfficeList.length>0">
          <div v-for="(list,index) in notaryInfoForm.orgOfficeList"
               :key="index"
               class="place-item">
            <el-form :ref="'listRef'+index"
                     :model="list"
                     label-width="120px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="办证点名称:"
                                prop="officeName"
                                :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                    <el-input v-model="list.officeName"
                              size="medium"
                              maxlength="100" />
                  </el-form-item>
                </el-col>
                <el-col :span="8"
                        :offset="3">
                  <el-form-item label="办证点电话:"
                                prop="phone"
                                :rules="[{ required: true, validator: validatePhone, trigger: 'blur' }]">
                    <el-input v-model="list.phone"
                              size="medium"
                              maxlength="100" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="公证处地址:"
                                prop="orgAddress"
                                :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                    <el-input v-model="list.orgAddress"
                              size="medium"
                              maxlength="100" />
                  </el-form-item>
                </el-col>
                <el-col :span="8"
                        :offset="3">
                  <el-form-item label="办公时间:"
                                prop="workingTime"
                                :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                    <el-input v-model="list.workingTime"
                              size="medium"
                              maxlength="100" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="经度和纬度:"
                                prop="trapeze"
                                :rules="[{ required: true, validator: validateLocate, trigger: 'blur' }]">
                    <el-input v-model="list.trapeze"
                              size="medium"
                              maxlength="100" />
                    <a href="http://api.map.baidu.com/lbsapi/getpoint/"
                       class="locate-link"
                       target="_blank">获取经纬度坐标</a>
                  </el-form-item>

                </el-col>
              </el-row>
              <el-button type="primary"
                         size="medium"
                         class="add-btn"
                         @click="showDeleteDialog(index)">删除</el-button>
            </el-form>
          </div>
        </div>
        <div v-else
             class="office-tips">暂无办证点</div>
      </div>
      <div class="save-box">
        <el-button type="primary"
                   size="medium"
                   @click="doSubmit()">保存</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import { getNotaryInfo, getRegionList, uploadFile, deleteNotaryOffice, updateNotaryInfo,uploadSealFile,SealFileBase } from '@/api/notaryInfo'

export default {
  data () {
    return {
      imageUrl:'',
      notaryInfoForm: {
        orginfo: {
          name: '',
          desc: '',
          locate: '',
          time: '',
          phone: '',
          copies: ''
        },
        orgOfficeList: []
      },
      addRules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      notaryLogoUrl: null,
      validatePhone: null,
      validateLocate: null,
      regionOptions: [], // 保存办公区域数组
      notarySealUrl:null,
      officialSealFile:''
    }
  },
  created () {
    this.getNotaryInfo()
    this.getRegionList()
    this.validatePhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8|9][0-9]{9}$/
      const reg2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
      const flag = reg.test(value) || reg2.test(value)
      if (value === '') {
        callback(new Error('请输入联系电话'))
      } else if (!flag) {
        callback(new Error('请输入正确的联系电话'))
      } else {
        callback()
      }
    }
    this.validateLocate = (rule, value, callback) => {
      let flag
      if (!value || value.indexOf(',') === -1) {
        flag = false
      } else {
        const Long = value.split(',')[0]; const La = value.split(',')[1]
        const reg = /^(([1-9]\d?)|(1[0-7]\d))(\.\d{1,6})|180|0(\.\d{1,6})?/
        if (reg.test(Long) && reg.test(La)) {
          flag = true
        } else {
          flag = false
        }
      }
      console.log(flag)
      if (!flag) {
        callback(new Error('请输入正确的经纬度'))
      } else {
        callback()
      }
    }
  },
  methods: {
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
    // 获取公证处信息
    getNotaryInfo () {
      getNotaryInfo().then(res => {
        if (res.success) {
          const temp = res.data
          if (temp.orgOfficeList.length > 0) {
            temp.orgOfficeList.forEach(item => {
              item.trapeze = item.longitude + ',' + item.latitude
            })
          }
          this.notaryInfoForm = temp
        }
        if (res.data.logoBase64) {
          this.notaryLogoUrl ='data:image/jpeg;base64,'+res.data.logoBase64
        }
        SealFileBase({id:this.notaryInfoForm.orginfo.id}).then(res=>{
          if(res.success&&res.data.success){
            this.imageUrl='data:image/jpeg;base64,'+res.data.data
          }
        })
        console.log(this.notaryInfoForm)
      })
    },
    // 获取地区列表
    getRegionList () {
      getRegionList().then(res => {
        const list = []
        if (res.success) {
          this.regionTrans(res.data, list)
        }
        this.regionOptions = list
      })
    },
    // 递归转换所需地区列表
    regionTrans (oriArr, transArr) {
      oriArr.forEach((item, index) => {
        transArr.push({
          value: item.code,
          id: item.id,
          label: item.name,
          children: []
        })
        if (item.children) {
          this.regionTrans(item.children, transArr[index].children)
        }
      })
    },
    // 上传图片
    uploadImg (e) {
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
      formData.append('file', file)
      formData.append('fileStorageEnum', 'org-image-file') // 文件流
      uploadFile(formData).then(res => {
        if (res.success) {
          let _URL = window.URL || window.webkitURL
          this.notaryLogoUrl=_URL.createObjectURL(file)
          // this.notaryLogoUrl = res.data.url
          this.notaryInfoForm.orginfo.url = res.data.url
          this.notaryInfoForm.orginfo.bucketName = res.data.bucketName
          this.notaryInfoForm.orginfo.objectName = res.data.objectName
          this.notaryInfoForm.orginfo.originalFilename = res.data.originalFilename
          this.notaryInfoForm.orginfo.rename = res.data.rename
        }
      })
    },
    // 保存
    doSubmit () {
      const newArr = []; const _self = this
      // 校验办证点信息
      this.notaryInfoForm.orgOfficeList.forEach((item, index) => {
        checkForm('listRef' + index)
      })
      // 根据form表单的ref,动态生成promise
      function checkForm (arrName) {
        var result = new Promise(function (resolve, reject) {
          _self.$refs[arrName][0].validate((valid) => {
            if (valid) {
              resolve()
            } else {
              reject()
            }
          })
        })
        newArr.push(result)
      }
      // 校验公证处信息
      var orginfoResult = new Promise(function (resolve, reject) {
        _self.$refs['notaryInfoForm.orginfo'].validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      newArr.push(orginfoResult)
      if(typeof this.notaryInfoForm.orginfo.regionCode==='object'){
        let aeeayLength=this.notaryInfoForm.orginfo.regionCode.length
        this.notaryInfoForm.orginfo.regionCode=this.notaryInfoForm.orginfo.regionCode[aeeayLength-1]
      }
      console.log(newArr)
      const param = {
        orgName: this.notaryInfoForm.orginfo.orgName,
        regionCode: this.notaryInfoForm.orginfo.regionCode,
        workingTime: this.notaryInfoForm.orginfo.workingTime,
        orgAddr: this.notaryInfoForm.orginfo.orgAddr,
        phone: this.notaryInfoForm.orginfo.phone,
        copyCostNumber: this.notaryInfoForm.orginfo.copyCostNumber,
        url: this.notaryLogoUrl,
        bucketName: this.notaryInfoForm.orginfo.bucketName,
        objectName: this.notaryInfoForm.orginfo.objectName,
        originalFilename: this.notaryInfoForm.orginfo.originalFilename,
        rename: this.notaryInfoForm.orginfo.rename,
        orgOfficeDTOList: this.notaryInfoForm.orgOfficeList,
        officialSealFile:this.officialSealFile
      }
      Promise.all(newArr).then(function () {
        setTimeout(function () {
          updateNotaryInfo(param).then(res => {
            if (res.success) {
              _self.getNotaryInfo()
              _self.getRegionList()
              _self.$fun.msg('保存成功', 'success')
            } else {
              _self.$fun.msg(res.msg, 'error')
            }
          })
        }, 1000)
      }).catch(function () {
        _self.$fun.msg('请填写必填项', 'error')
      })
    },
    // 新增办证点
    addNewOffice () {
      console.log(this.notaryInfoForm)
      if (this.notaryInfoForm.orgOfficeList.length < 20) {
        this.notaryInfoForm.orgOfficeList.push({
          id: null,
          officeName: '',
          phone: '',
          orgAddress: '',
          workingTime: '',
          locate: ''
        })
      } else {
        this.$fun.msg('新增办证点失败', 'error')
      }
    },
    // 确定删除框
    showDeleteDialog (index) {
      this.$confirm('确定删除办证点?', '删除办证点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 前端添加未保存的没有id,直接前端删除,有id调用数据库删除
        if (this.notaryInfoForm.orgOfficeList[index].id) {
          const param = {
            orgOfficeId: this.notaryInfoForm.orgOfficeList[index].id
          }
          deleteNotaryOffice(param).then(res => {
            if (res.success) {
              this.$fun.msg('快递点删除成功', 'success')
              this.getNotaryInfo()
            }
          })
        } else {
          this.notaryInfoForm.orgOfficeList.splice(index, 1)
          this.$fun.msg('快递点删除成功', 'success')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss">
#templateConfig {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
    label {
      font-weight: normal;
    }
    .notary-info-box,
    .certificate-box {
      background: #fff;
      padding: 20px;
      margin-bottom: 20px;
      position: relative;
      .title {
        padding: 10px 20px;
        font-weight: bold;
        font-size: 15px;
        border-bottom: 1px solid #ccc;
      }
      .el-form {
        margin-top: 30px;
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 176px;
        height: 176px;
        line-height: 176px;
        text-align: center;
      }
      .avatar {
        width: 240px;
        height: 180px;
        display: block;
        object-fit: fill;
      }
      .add-btn {
        position: absolute;
        right: 40px;
        top: 10px;
      }
      .place-item {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 20px;
        position: relative;
        .locate-link {
          position: absolute;
          right: -105px;
          top: 10px;
          color: #409eff;
        }
      }
    }
    .save-box {
      text-align: center;
    }
    .office-tips {
      padding: 100px;
      text-align: center;
      background-color: #fff;
      color: #999;
    }
    .el-cascader {
      width: 100%;
    }
    .el-button--primary:focus {
      background-color: #409eff;
      border-color: #409eff;
    }
    .el-form-item__content {
      line-height: 20px;
    }
  }
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
.uploading-img-box .el-upload--text{
  width: 240px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
