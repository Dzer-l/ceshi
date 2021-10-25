<template>
  <div class="will-pay-certificate-main">
    <div class="notary-file-receive">
      <h3>公证书领取信息</h3>

      <div class="info-list-box">
        <el-form label-position="right" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="公证书份数：">
                <div>{{ notarNum }}份</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="领取方式：">
                <div>
                  {{ collectionMethod===1?'邮寄送达':'线下领取' }}
                  <el-link :underline="false" :disabled="basicData.orderStatus!==201?true:false" @click="editreceiverInfo(1)"><i class="el-icon-edit" /></el-link>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="info-list">
        <div class="info-title-btn">
          <span style="line-height:32px">领证人信息</span>
          <el-button
            v-if="basicData.orderStatus===201"
            type="primary"
            size="small"
            style="width: 80px"
            :disabled="jurisdiction"
            @click="editorSInformation"
          >编辑</el-button>
        </div>
        <div class="info-list-box">
          <el-form label-position="right" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名：">
                  <div>{{ license.name }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="证件类型：">
                  <div>{{ license.cardType|filterCardType }}</div>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="证件号码：">
                  <div>{{ license.cardNumber }}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="手机号码：">
                  <div>{{ license.mobile }}</div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <div v-if="collectionMethod===1" class="info-list" style="margin-top:30px">
        <div class="info-title-btn">
          <span>收件人信息</span>
          <el-button
            v-if="basicData.orderStatus===201"
            type="primary"
            size="small"
            style="width: 80px"
            :disabled="jurisdiction"
            @click="editreceiverInfo(2)"
          >编辑</el-button>
        </div>
        <div class="info-list-box">
          <el-form label-position="right" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名：">
                  <div>{{ recipientInfo.receiveName }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号码：">
                  <div>{{ recipientInfo.receiveMobile===null?'':recipientInfo.receiveMobile }}</div>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="固话号码：">
                  <div>{{ recipientInfo.receiveFixedLine===null?'':recipientInfo.receiveFixedLine }}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="公司名称：">
                  <div>{{ recipientInfo.receiveCompany===null?'':recipientInfo.receiveCompany }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="地址：">
                  <div>{{ recipientInfo.receiveAddress+recipientInfo.receiveDetailAddress }}</div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogVisibleText"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <div class="edit-form">
        <el-form ref="recipientsForm" :rules="recipientsRules" :model="wayData" label-position="left" label-width="100px">
          <el-form-item v-if="editType" label="领取方式">
            <el-radio-group v-model="wayData.way">
              <el-radio label="1">邮寄送达</el-radio>
              <el-radio label="2">线下领取</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="wayData.way==='1'">
            <div v-if="editType" style="margin-bottom:30px">收件人信息</div>
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="wayData.name"
                size="medium"
                placeholder="请填写姓名"
                maxlength="15"
              />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone" class="alternative">
              <el-input
                v-model="wayData.phone"
                size="medium"
                placeholder="请填写手机号码"
                maxlength="11"
              />
            </el-form-item>
            <el-form-item label="固话号码" prop="fixPhone" class="alternative">
              <el-input
                v-model="wayData.fixPhone"
                placeholder="请填写固话号码"
                maxlength="16"
                size="medium"
              />
            </el-form-item>
            <el-form-item label="公司名称" class="alternative">
              <el-input
                v-model="wayData.companyName"
                size="medium"
                placeholder="请填写公司名称(选填)"
                maxlength="35"
              />
            </el-form-item>
            <el-form-item label="省市区(县)" prop="city">
              <el-cascader
                ref="personageCascader"
                v-model="wayData.city"
                style="width:100%"
                placeholder="请选择省市区(县)"
                size="medium"
                :options="options"
                :props="{
                  value: 'name',
                  label: 'name',
                  children: 'children',
                }"
                @change="handleChangePersonageAddres"
              />
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input
                v-model="wayData.address"
                size="medium"
                placeholder="请填写详细地址"
                oninput="value=value.replace(/[`~!@#$%^&*_\+=<>?:&quot;{}|,.\/;‘\\[\]·~！@#￥%……&*——\+={}|《》？：“”【】、；‘’，。、…… ]/g,&quot;&quot;);"
                maxlength="120"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmationOfModification">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑领证人信息"
      :visible.sync="proveDialogVisible"
      width="600px"
    >
      <div class="edit-form">
        <el-form
          ref="licenseInformation"
          label-position="right"
          label-width="100px"
          :model="data1"
          :rules="data1Rulse"
        >
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="data1.name"
              size="medium"
              placeholder="请输入你的真实姓名"
              maxlength="15"
            />
          </el-form-item>
          <el-form-item label="证件类型" prop="cardType">
            <el-select
              ref="cardType"
              v-model="data1.cardType"
              size="medium"
              placeholder="请选择证件类型"
              style="width:100%"
            >
              <el-option
                v-for="(item, index) in cardType"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码" prop="cardNum">
            <el-input
              v-model="data1.cardNum"
              maxlength="18"
              size="medium"
              placeholder="请填写证件号码"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="data1.phone"
              size="medium"
              placeholder="请填写手机号码"
              maxlength="11"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="proveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTheRevisedInformation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { isvalidCard } from '../entryTab/verification'
import { filterCardType } from '@/filters/index'
export default {
  filters: {
    filterCardType
  },
  data() {
    var validFixPhone = (rule, value, callback) => {
      if (this.wayData.phone === '' && value === '') {
        callback(new Error('手机号码与固话号码必填一个'))
      } else if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.wayData.phone) && value === '') {
        callback()
      } else {
        if (!value) {
          callback(new Error('请输入固话号码'))
        } else if (!/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/.test(value)) {
          callback(new Error('请输入正确的固话号码'))
        } else {
          callback()
        }
      }
    }
    var validPhone = (rule, value, callback) => {
      if (this.wayData.fixPhone === '' && value === '') {
        callback(new Error('手机号码与固话号码必填一个'))
      } else if (/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/.test(this.wayData.fixPhone) && value === '') {
        callback()
      } else {
        if (!value) {
          callback(new Error('请输入手机号'))
        } else if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    }
    var validLicePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var validIdcard = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入证件号'))
      } else {
        if (this.data1.cardType === '111') {
          if (!isvalidCard(value)) {
            callback(new Error('请输入正确的证件号'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    return {
      basicData: {},
      collectionMethod: 1,
      jurisdiction: false,
      license: {},
      notarNum: 2,
      dialogVisible: false,
      proveDialogVisible: false,
      dialogVisibleText: '编辑领取方式',
      editType: true,
      options: [],
      cardType: [
        { value: '111', label: '居民身份证' },
        { value: '112', label: '临时居民身份证' },
        { value: '113', label: '户口簿' },
        { value: '114', label: '中国人民解放军军官证' },
        { value: '132', label: '普通护照（中国）' },
        { value: '133', label: '外国护照' },
        { value: '116', label: '香港居民居住证' },
        { value: '117', label: '澳门居民居住证' },
        { value: '118', label: '港澳居民通行证' },
        { value: '119', label: '台湾居民通行证' },
        { value: '123', label: '士兵证' },
        { value: '124', label: '台湾居民居住证' },
        { value: '125', label: '律师证' },
        { value: '128', label: '驾驶证' },
        { value: '129', label: '回乡证' },
        { value: '000', label: '其他' }
      ],
      wayData: {
        way: '1',
        name: '',
        phone: '',
        fixPhone: '',
        companyName: '',
        city: [],
        address: ''
      },
      recipientsRules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字',
            trigger: 'blur'
          }
        ],
        phone: [{ required: true, validator: validPhone, trigger: 'blur' }],
        fixPhone: [
          { required: true, validator: validFixPhone, trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          {
            min: 5,
            max: 120,
            message: '长度在 5 到 120 个字',
            trigger: 'blur'
          }
        ]
      },
      recipientInfo: {},
      data1Rulse: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字',
            trigger: 'blur'
          }
        ],
        cardType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        cardNum: [{ required: true, validator: validIdcard, trigger: 'blur' }],
        phone: [{ required: true, validator: validLicePhone, trigger: 'blur' }]
      },
      data1: {
        name: '',
        cardType: '',
        cardNum: '',
        phone: ''
      }
    }
  },
  created() {
    this.basicData = this.$parent.$parent.$parent.basicData
    this.jurisdiction = this.$parent.$parent.$parent.jurisdiction
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId
    } else {
      this.orderId = this.$store.state.app.orderId
      var url = `/#${this.$route.path}?orderId=${this.orderId}`
      history.pushState(null, null, url)
    }
    this.getTheLicenseInfo()
  },
  methods: {
    getTheLicenseInfo() {
      this.$axios(`org/order-license?orderId=${this.orderId}`).then(async res => {
        this.collectionMethod = parseInt(res.data.orderDTO.obtainCertType)
        this.wayData.way = parseInt(res.data.orderDTO.obtainCertType) === 1 ? '1' : '2'
        this.notarNum = res.data.orderExpressSendDTO === null ? res.data.orderOfflineReceiveDTO.notaryNum : (res.data.orderExpressSendDTO.notaryNum === null ? res.data.orderOfflineReceiveDTO.notaryNum : res.data.orderExpressSendDTO.notaryNum)
        this.license = res.data.orderCertifierDTO === null ? {} : res.data.orderCertifierDTO
        this.recipientInfo = res.data.orderExpressSendDTO === null ? null : res.data.orderExpressSendDTO
        const cityData = await this.$axios(`org/region-tree`)
        this.options = cityData.data[0].children
      })
    },
    editreceiverInfo(val) {
      this.dialogVisibleText = val === 1 ? '编辑领取方式' : '编辑收件人信息'
      this.editType = val === 1
      if (this.recipientInfo !== null) {
        const city = this.recipientInfo.receiveRegionCode !== null ? this.findAnArrayOfCities(this.options, this.recipientInfo.receiveRegionCode) : []
        this.wayData.name = this.recipientInfo.receiveName
        this.wayData.phone = this.recipientInfo.receiveMobile !== null ? this.recipientInfo.receiveMobile : ''
        this.wayData.fixPhone = this.recipientInfo.receiveFixedLine !== null ? this.recipientInfo.receiveFixedLine : ''
        this.wayData.companyName = this.recipientInfo.receiveCompany !== null ? this.recipientInfo.receiveCompany : ''
        this.wayData.address = this.recipientInfo.receiveDetailAddress
        if (city.length > 0) {
          this.wayData.city = city.length === 2 ? [city[city.length - 1].name, city[city.length - 2].name] : [city[city.length - 1].name, city[city.length - 2].name, city[city.length - 3].name]
        }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['recipientsForm'].clearValidate()
      })
    },
    findAnArrayOfCities(arr1, code) {
      const temp = []
      var forFn = function(arr, code) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i]
          if (item.code === code) {
            temp.push(item)
            break
          } else {
            if (item.children) {
              forFn(item.children, code)
            }
          }
        }
      }
      forFn(arr1, code)
      const name = []
      var forName = function(arrar, id) {
        for (var i = 0; i < arrar.length; i++) {
          var item = arrar[i]
          if (item.id === id) {
            name.push(item)
            forName(arr1, item.parentId)
          } else {
            if (item.children) {
              forName(item.children, id)
            }
          }
        }
      }
      forName(arr1, temp[0].id)
      return name
    },
    editorSInformation() {
      this.data1.name = this.license.name
      this.data1.cardType = this.license.cardType.toString()
      this.data1.cardNum = this.license.cardNumber
      this.data1.phone = this.license.mobile
      this.proveDialogVisible = true
    },
    confirmationOfModification() {
      this.$refs['recipientsForm'].validate((valid, obj) => {
        if (valid) {
          const t = JSON.parse(JSON.stringify(this.basicData))
          t.obtainCertType = this.wayData.way
          if (this.editType) {
            this.$axios(`org/update-order-info`, t, { method: 'POST' }).then(res => {
              if (this.wayData.way === '1') {
                this.modifyTheRecipientInformation()
              } else {
                this.$axios(`org/offline-receive`, { orderId: this.orderId }, { method: 'POST' }).then(val => {
                  this.$fun.replaceInstrument(this.orderId)
                })
              }
            })
          } else {
            this.modifyTheRecipientInformation()
          }
        }
      })
    },
    modifyTheRecipientInformation() {
      const data = {
        id: this.basicData.id,
        orderNum: this.basicData.orderNum,
        receiveName: this.wayData.name,
        receiveMobile: this.wayData.phone,
        receiveFixedLine: this.wayData.fixPhone,
        receiveCompany: this.wayData.companyName,
        receiveDetailAddress: this.wayData.address,
        receiveRegionCode: this.getCode(this.wayData.city),
        receiveAddress: this.wayData.city.length === 2 ? this.wayData.city[0] + this.wayData.city[1] : this.wayData.city[0] + this.wayData.city[1] + this.wayData.city[2]
      }
      this.$axios(`org/update-order-express-send2`, data, { method: 'POST' }).then(res => {
        if (res.success) {
          this.$fun.replaceInstrument(this.orderId)
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    confirmTheRevisedInformation() {
      this.$refs['licenseInformation'].validate((valid, obj) => {
        if (valid) {
          const data = {
            orderId: this.orderId,
            name: this.data1.name,
            cardType: this.data1.cardType,
            mobile: this.data1.phone,
            cardNumber: this.data1.cardNum
          }
          this.$axios(`org/update-order-license`, data, { method: 'PUT' }).then(res => {
            this.$fun.replaceInstrument(this.orderId)
          })
        }
      })
    },
    getCode(array) {
      for (let index = 0; index < this.options.length; index++) {
        if (this.options[index].name === array[0]) {
          for (let i = 0; i < this.options[index].children.length; i++) {
            if (this.options[index].children[i].name === array[1]) {
              if (array[2]) {
                for (let j = 0; j < this.options[index].children[i].children.length; j++) {
                  if (this.options[index].children[i].children[j].name === array[2]) {
                    return this.options[index].children[i].children[j].code
                  }
                }
              } else {
                return this.options[index].children[i].code
              }
            }
          }
        }
      }
    },
    handleChangePersonageAddres() {}
  }
}
</script>

<style lang="less" scoped>
.will-pay-certificate-main {
  .notary-file-receive {
    h3 {
      position: relative;
      padding-left: 10px;
    }
    h3::before {
      content: "";
      width: 3px;
      height: 19px;
      background: #1989fa;
      position: absolute;
      left: 2px;
    }
    ul {
      margin: 0;
      padding: 0;
      display: flex;
      li {
        list-style: none;
        width: 30%;
      }
    }
  }
  .info-list {
    border: solid 1px #d7d7d7;
    .info-title-btn {
      background: #e6f6fe;
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 10px 20px;
    }
    .info-list-box {
      padding: 20px 0;
    }
  }
  // .info-list-box {
  //   .el-form {
  //     margin-left: 30px;
  //     display: flex;
  //     flex-wrap: wrap;
  //     .el-form-item {
  //       margin: 0;
  //       width: 33%;
  //       /deep/ label {
  //         color: #999;
  //       }
  //     }
  //   }
  // }
  // .receiver-dialog-main,
  // .recipients-dialog {
  //   .el-form {
  //     min-height: 200px;
  //     /deep/ .el-cascader {
  //       width: 100%;
  //     }
  //     .way {
  //       margin-bottom: 0;
  //     }
  //     /deep/ label,
  //     .recipients-info-text {
  //       color: #999;
  //       text-align: left;
  //     }
  //     /deep/ label {
  //       font-weight: normal;
  //     }
  //     .recipients-info-text {
  //       padding: 10px 0;
  //       padding-bottom: 15px;
  //       font-size: 14px;
  //     }
      .alternative {
        /deep/ label:before {
          display: none !important;
        }
        /deep/ label {
          padding-left: 10px;
        }
      }
      /deep/ .el-form-item__label{
        color: #999;
      }
  //   }
  //   /deep/ .el-dialog__body {
  //     padding-top: 10px;
  //     padding-bottom: 10px;
  //   }
  //   /deep/ .el-dialog__footer {
  //     padding-top: 20px;
  //   }
  // }
  // .modification-receiverInfo-dialog {
  //   .el-form {
  //     .el-form-item {
  //       display: flex;
  //       /deep/ .el-select {
  //         width: 100%;
  //       }
  //     }
  //     /deep/ label {
  //       color: #999;
  //       text-align: left;
  //     }
  //   }
  // }
  // /deep/ .el-form-item {
  //   display: flex;
  // }
  // /deep/ .el-form-item__content{
  //   flex: 1;
  //   & > div{
  //     word-wrap:break-word;
  //     word-break:break-all
  //   }
  // }
  // /deep/ .el-form-item__label{
  //   white-space: nowrap;
  //   display: block;
  //   width: 100px  !important;
  // }
  // .recipient-item{
  //   flex: 1;
  // }
}
</style>
