<template>
  <div class="applicant_main">
    <div style="padding-bottom: 20px;">
      <div class="title">
        <p style="font-weight: bolder;color: #333;font-size: 14px;">领证信息</p>
        <el-button v-if="editor===1&&status!=306" type="primary" size="small" style="margin-right: 30px;" @click="editorText()">编辑</el-button>
        <div v-if="status!=306&&editor!=1">
          <el-button type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="primary" size="small" style="margin-right: 30px;" @click="cancel">取消</el-button>
        </div>
      </div>
      <div class="cont_list">
        <div>
          <ul>
            <li>
              <el-form ref="ruleForm" :model="ruleForm" label-position="left" :rules="rules" label-width="100px" class="demo-ruleForm">
                <div>
                  <div>
                    <span>
                      <el-form-item label="领证人：" prop="licenseName" class="bold"><el-input v-model="ruleForm.licenseName" style="width: 70%;" size="medium" :disabled="inputSta" /></el-form-item>
                    </span>
                  </div>
                  <div v-if="status==303||status==305||status==306">
                    <el-form-item label="领证时间：" prop="licenseTime" class="bold">
                      <el-date-picker
                        v-model="ruleForm.licenseTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        style="width: 70%;"
                        size="medium"
                        prefix-icon="el-icon-date"
                        :disabled="inputSta"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                      />
                    </el-form-item>
                  </div>
                  <div>
                    <span>

                      <el-form-item label="公证书和文书材料份数：" class="documents bold"><span style="color: red;">{{ ruleForm.fileNum }}份</span></el-form-item>
                    </span>
                  </div>
                </div>
                <div>
                  <div>
                    <el-form-item label="手机：" prop="licensePhone" class="bold">
                      <el-input v-model="ruleForm.licensePhone" size="medium" style="width: 70%;" :disabled="inputSta" />
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item v-if="status==303||status==305||status==306" label="领证地点：" prop="licensePlace" class="bold">
                      <el-select v-model="ruleForm.licensePlace" size="medium" :disabled="inputSta" style="width: 70%;" placeholder="请选择">
                        <el-option
                          v-for="item in selectAddresData"
                          :key="item.id"
                          :label="item.officeName"
                          :value="item.officeName"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div>
                  <div>
                    <el-form-item label="身份证号码：" prop="idCard" class="bold">
                      <el-input v-model="ruleForm.idCard" size="medium" style="width: 70%;" :disabled="inputSta" />
                    </el-form-item>
                  </div>
                  <div v-if="status==303||status==305||status==306">
                    <el-form-item label="领证号：" prop="licenseNum" class="bold">
                      <el-input v-model="ruleForm.licenseNum" size="medium" style="width: 70%;" :disabled="inputSta" oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'');if(value.length>20)value=value.slice(0,15)" />
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { isvalidPhone, isvalidCard } from './verify.js'
import { getLicenseInfo, getAllAddress, offlineReceive } from '../../api/details.js'
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
var isIdcard = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入身份证号'))
  } else if (!isvalidCard(value)) {
    callback(new Error('请输入正确的身份证号'))
  } else {
    callback()
  }
}
export default {
  props: ['statu'],
  data() {
    return {
      status: this.statu,
      orderNum: null,
      inputSta: true,
      editor: 1,
      selectAddresData: [],
      ruleForm: {
        // 领证时间
        licenseTime: '',
        // 领证号
        licenseNum: '',
        // 领证人名字
        licenseName: '',
        // 领证地点
        licensePlace: '',
        // 手机号码
        licensePhone: '',
        // 身份证号码
        idCard: '',
        // 公证书和文书材料份数
        fileNum: ''
      },
      rules: {
        licenseNum: [
          { required: true, message: '请填写领证号' },
          { min: 2, max: 15, message: '请填写 2 到 15 个字' }
        ],
        licenseName: [
          { required: true, message: '请填写领证人姓名' },
          { min: 2, max: 15, message: '请填写 2 到 15 个字' }
        ],
        licensePlace: [
          { required: true, message: '请填写领证地点' },
          { min: 2, max: 15, message: '请填写 2 到 15 个字' }
        ],
        licensePhone: [
          { required: true, validator: validPhone, max: 11 }
        ],
        idCard: [
          { required: true, validator: isIdcard }
        ],
        fileNum: [
          { required: true, message: '请填写信息' }
        ],
        licenseTime: [
          { type: 'string', required: true, message: '请选择时间' }
        ]
      }
    }
  },
  watch: {
    ruleForm: {
      handler(newVal) {
        this.$parent.ruleForm = newVal
      },
      deep: true
    },
    inputSta: {
      handler(newval) {
        this.$parent.inputSta = newval
        if (newval === true) {
          this.$parent.$parent.$parent.submitStatu = true
        } else {
          this.$parent.$parent.$parent.submitStatu = false
        }
      },
      deep: true
    }

  },
  created() {
    this.orderNum = this.$route.query.orderNum || sessionStorage.getItem("detailsOrderNum")
    this.getData()
  },
  methods: {
    getData() {
      var data = { orderNum: this.orderNum }
      getAllAddress().then((res) => {
        this.selectAddresData = res.data
        console.log(this.selectAddresData, '领取地址数据')
        getLicenseInfo(data).then((res) => {
          console.log(res, '领证信息数据')
          if (res.data != null) {
            this.ruleForm.licenseNum = res.data.receiveNumber
            this.ruleForm.licenseName = res.data.receiveName
            this.ruleForm.licensePlace = res.data.receivePointName
            this.ruleForm.licensePhone = res.data.mobile
            this.ruleForm.idCard = res.data.cardNum
            this.ruleForm.fileNum = res.data.notaryNum
            this.ruleForm.licenseTime = res.data.receiveTime
            this.ruleForm.licenseAddress = res.data.receiveAddress
            console.log(this.ruleForm, '000000')
          }
          this.$emit('func', this.ruleForm)
          if (this.$parent.inputSta !== undefined) {
            this.inputSta = this.$parent.inputSta
            if (this.$parent.inputSta === false) {
              this.editor = 2
            } else {
              this.editor = 1
            }
          }
          if (this.$parent.ruleForm) {
            this.ruleForm = this.$parent.ruleForm
          }
        })
      })
    },
    cancel() {
      this.getData()
      var data = { orderNum: this.orderNum }
      getAllAddress().then((res) => {
        this.selectAddresData = res.data
        // console.log(this.selectAddresData, '领取地址数据')
        getLicenseInfo(data).then((res) => {
          console.log(res, '领证信息数据')
          if (res.data !== null) {
            this.ruleForm.licenseNum = res.data.receiveNumber
            this.ruleForm.licenseName = res.data.receiveName
            this.ruleForm.licensePlace = res.data.receivePointName
            this.ruleForm.licensePhone = res.data.mobile
            this.ruleForm.idCard = res.data.cardNum
            this.ruleForm.fileNum = res.data.notaryNum
            this.ruleForm.licenseTime = res.data.receiveTime
            this.ruleForm.licenseAddress = res.data.receiveAddress
          }
          this.inputSta = true
          this.editor = 1
          this.$emit('func', this.ruleForm)
          // if (this.$parent.inputSta !== undefined) {
          // this.inputSta = this.$parent.inputSta
          //   this.editor = 2
          // }
        })
      })
      // this.inputSta = true
    },
    submitForm(formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editor = 1
          var addres = ''
          for (let i = 0; i < this.selectAddresData.length; i++) {
            if (this.selectAddresData[i].officeName === this.ruleForm.licensePlace) {
              addres = this.selectAddresData[i].orgAddress
            }
          }
          var data = { orderNum: this.orderNum, mobile: this.ruleForm.licensePhone,
            receiveTime: this.ruleForm.licenseTime, receiveAddress: addres, receivePointName: this.ruleForm.licensePlace,
            receiveNumber: this.ruleForm.licenseNum, cardNum: this.ruleForm.idCard, receiveName: this.ruleForm.licenseName }
          this.$confirm('确定保存信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            offlineReceive(data).then((res) => {
              // console.log(res, '领证信息修改')
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.inputSta = true
              } else {
                this.$message.error('保存失败')
              }
            })
          }).catch(() => {
            this.getData()
            this.inputSta = true
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
          })
        } else {
          return false
        }
      })
    },
    editorText() {
      this.inputSta = false
      this.editor = 2
    }
  }
}
</script>

<style lang="less" scoped>
  p,ul{
    padding: 0;
    margin: 0;
    color: #333;
    font-size: 14px;
  }
  li{
    list-style: none;
  }
  /deep/ .el-form-item__label{
    color: #666 !important;
  }
  .applicant_main{
    border: 1px solid #D7D7D7;
    margin: 10px 30px;
    .title{
      background-color: #e6f6fe;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p{
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bolder;
        line-height: 21px;
        color: #333333;
        padding-left: 20px;
      }
    }
    .cont_list{
      padding: 0 20px;
      & ul{
        & li{
          display: flex;
          margin: 15px 0;
          &>div{
            margin-right: 20px;
            flex: 1;
          }
          .id_card_image{
            height: 108px;
            width: 192px;
            border: dashed #d7d7d7 1px;
          }
        }
      }
    }
    .el-form{
      display: flex;
      width: 100%;
      &>div{
        flex: 1;
      }
      .documents{
        /deep/ label{
          width: 170px !important;
        }
        /deep/ .el-form-item__error{
          left:80px;
        }
      }
      /deep/ .bold label::before{
        display: none;
      }
    }
  }
</style>
