<template>
  <div class="receiver-info-main">
    <div class="notary-file-receive">
      <h3>公证书领取信息</h3>

      <div class="info-list-box">
        <el-form label-position="right">
          <el-form-item v-if="basueData.businessType!==5" label="公证书份数：">
            <div>{{ receiverInfo.notaryNum || recipientsData.notaryNum }}份</div>
          </el-form-item>
          <el-form-item v-else label="保管函份数">
            <div>{{ recipientsData.notaryNum }}份</div>
          </el-form-item>
          <el-form-item v-if="basueData.businessType!==5" label="领取方式：">
            <div>
              {{
                parseInt(receiveData.obtainCertType) === 1
                  ? "邮寄送达"
                  : "线下领取"
              }}
              <el-link :underline="false" :disabled="basueData.orderStatus!==201?true:false" @click="editreceiverInfo"><i
                class="el-icon-edit"
              /></el-link>

            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="basueData.businessType!==5" class="info-list">
      <div class="info-title-btn">
        <span>领证人信息</span>
        <el-button
          v-if="basueData.orderStatus===201"
          type="primary"
          size="small"
          style="width: 80px"
          :disabled="jurisdiction"
          @click="modificationReceiverInfo"
        >编辑</el-button>
      </div>
      <div class="info-list-box">
        <el-form label-position="right">
          <el-form-item label="姓名：">
            <div>{{ receiverInfo.receiveName }}</div>
          </el-form-item>
          <el-form-item label="证件类型：">
            <div>{{ receiverInfo.cardType | filterCardType }}</div>
          </el-form-item>
          <el-form-item label="证件号码：">
            <div>{{ receiverInfo.cardNum }}</div>
          </el-form-item>
          <el-form-item label="手机号码：">
            <div>{{ receiverInfo.mobile }}</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--  -->
    <div v-if="parseInt(receiveData.obtainCertType) === 1" class="info-list">
      <div class="info-title-btn">
        <span>收件人信息</span>
        <el-button
          v-if="basueData.orderStatus===201"
          type="primary"
          size="small"
          style="width: 80px"
          :disabled="jurisdiction"
          @click="editRecipients"
        >编辑</el-button>
      </div>
      <div class="info-list-box">
        <el-form label-position="right">
          <el-form-item label="姓名：">
            <div>{{ recipientsData.receiveName }}</div>
          </el-form-item>
          <el-form-item label="手机号码：">
            <div>{{ recipientsData.receiveMobile }}</div>
          </el-form-item>
          <el-form-item label="固话号码：">
            <div>{{ recipientsData.receiveFixedLine }}</div>
          </el-form-item>
          <el-form-item label="公司名称：">
            <div>{{ recipientsData.receiveCompany }}</div>
          </el-form-item>
          <el-form-item label="地址：" class="recipient-item">
            <div>
              {{
                recipientsData.receiveProvince +
                  recipientsData.receiveCity +
                  recipientsData.receiveCounty +
                  recipientsData.receiveDetailAddress
              }}
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="basueData.orderStatus===305||(basueData.obtainCertType!==1&&basueData.orderStatus===306)" class="notary-file-receive" style="margin-top:40px">
      <h3>领证信息</h3>

      <div class="info-list-box">
        <el-form label-position="right" label-width="100px">
          <el-form-item label="领证号：">
            <div>{{ receiverInfo.receiveNumber }}</div>
          </el-form-item>
          <el-form-item label="领证时间：">
            <div>{{ receiverInfo.receiveTime }}</div>
          </el-form-item>
          <el-form-item label="领证地点：" style="width:100%">
            <div>{{ receiverInfo.receiveAddress }}</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="receiver-dialog-main">
      <el-dialog
        title="编辑领取方式"
        :visible.sync="receiverDialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-form
          ref="recipientsForm"
          label-position="right"
          :rules="recipientsRules"
          :model="wayData"
          :disabled="jurisdiction"
        >
          <el-form-item label="领取方式" class="way">
            <el-radio-group v-model="wayData.way">
              <el-radio :label="1">邮寄送达</el-radio>
              <el-radio :label="2">线下领取</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="parseInt(wayData.way) === 1">
            <div class="recipients-info-text">收件人信息</div>
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
                oninput="value=value.replace(/[^\d]/g,'')"
                maxlength="11"
              />
            </el-form-item>
            <el-form-item label="固话号码" prop="fixPhone" class="alternative">
              <el-input
                v-model="wayData.fixPhone"
                placeholder="请填写固话号码"
                size="medium"
                maxlength="17"
              />
            </el-form-item>
            <el-form-item label="公司名称" class="alternative">
              <el-input
                v-model="wayData.companyName"
                size="medium"
                placeholder="请填写公司名称"
                maxlength="36"
              />
            </el-form-item>
            <el-form-item label="省市区(县)" prop="city">
              <el-cascader
                ref="personageCascader"
                v-model="wayData.city"
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
                maxlength="120"
                oninput="value=value.replace(/[`~!@#$%^&*_\+=<>?:&quot;{}|,.\/;‘\\[\]·~！@#￥%……&*——\+={}|《》？：“”【】、；‘’，。、…… ]/g,&quot;&quot;);"
              />
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="receiverDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :disabled="jurisdiction"
            @click="submitWay"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="modification-receiverInfo-dialog">
      <el-dialog
        title="编辑领证人信息"
        :visible.sync="modificationReceiverInfodialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-form
          ref="licenseInformation"
          label-position="right"
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
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="modificationReceiverInfodialogVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="modificationReceiver"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="recipients-dialog">
      <el-dialog
        title="收件人信息"
        :visible.sync="recipientsDialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-form
          ref="recipientsForm"
          label-position="right"
          :rules="recipientsRules"
          :model="wayData"
        >
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="wayData.name"
              size="medium"
              placeholder="请填写收件人姓名"
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
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="recipientsDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitRecipientsInfo"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getEntryDateil,
  getReceiverInfo,
  getRecipientsInfo,
  getCityData,
  modificationOrderInfo,
  modificationReceiveInfo,
  modificationRecipientsInfo,
  addnRecipientsInfo
} from '../../api/cloudMail'
import { getReplaceJson, replaceVariable, orderLicense, updateOrderExpressSend } from "../../api/parkingSpace";
import { isvalidCard } from '../entryTab/verification'
import { filterCardType } from '@/filters/index'
export default {
  filters: {
    filterCardType
  },
  data() {
    var validFixPhone = (rule, value, callback) => {
      if (!this.wayData.fixPhone) {
        if (!this.wayData.phone) {
          callback(new Error('手机号码与固话号码必填一个'))
        } else {
          if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.wayData.phone)) {
            callback()
          } else {
            callback(new Error('请输入正确的固话号码'))
          }
        }
      } else {
        if (!/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/.test(this.wayData.fixPhone)) {
          callback(new Error('请输入正确的固话号码'))
        } else {
          callback()
        }
      }
    }
    var validPhone = (rule, value, callback) => {
      if (!this.wayData.phone) {
        if (!this.wayData.fixPhone) {
          callback(new Error('手机号码与固话号码必填一个'))
        } else {
          if (/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/.test(this.wayData.fixPhone)) {
            callback()
          } else {
            callback(new Error('请输入手机号'))
          }
        }
      } else {
        if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.wayData.phone)) {
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
      test: [{ passengerName: '测试1' }, { passengerName: '测试2' }, { passengerName: '测试3' }],
      basueData: {},
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
      receiveData: {},
      receiverInfo: {},
      recipientsData: {},
      receiverDialogVisible: false,
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      options: [],
      wayData: {
        way: '',
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
      modificationReceiverInfodialogVisible: false,
      data1: {
        name: '',
        cardType: '',
        cardNum: '',
        phone: ''
      },
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
      dialogStatu: true,
      recipientsDialogVisible: false,
      orderId: '',
      jurisdiction: false,
      orderNum: ''
    }
  },
  watch: {
    recipientsDialogVisible(val, newval) {
      if (!newval) {
        this.dialogStatu = true
      }
    },
    receiverDialogVisible(val, newval) {
      if (!newval) {
        this.dialogStatu = true
      }
    }
  },
  created() {
    this.jurisdiction = this.$parent.$parent.$parent.jurisdiction
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId
    } else {
      this.orderId = this.$store.state.app.orderId
      var url = `/#${this.$route.path}?orderId=${this.orderId}`
      history.pushState(null, null, url)
    }
    getEntryDateil({ orderId: this.orderId }).then((res) => {
      this.basueData = res.data
      if (res.success && res.data !== null) {
        this.receiveData = res.data
        this.orderNum = res.data.orderNum
        var data = { orderNum: res.data.orderNum }
        if (res.data.businessType !== 5) {
          getReceiverInfo(data).then((res) => {
            if (res.success && res.data !== null) {
              this.receiverInfo = res.data
              // if (parseInt(this.receiveData.obtainCertType) === 1) {
            }else{
              orderLicense(this.orderId).then((ret) => {
                this.receiverInfo = ret.data.orderCertifierDTO
                this.receiverInfo.receiveName = ret.data.orderCertifierDTO.name
                this.receiverInfo.cardNum = ret.data.orderCertifierDTO.cardNumber
              })
            }
          // }
          })
          getRecipientsInfo(data).then((res) => {
            // console.log(res,'8888888');
            if (res.success && res.data) {
              this.recipientsData = res.data
            }
          })
        } else {
          getRecipientsInfo(data).then((res) => {
            if (res.success) {
              this.recipientsData = res.data
            }
          })
        }
      }
    })
  },
  methods: {
    editreceiverInfo() {
      if (this.recipientsData !== null) {
        this.wayData.city = []
        this.wayData.name = this.recipientsData.receiveName
        this.wayData.phone = this.recipientsData.receiveMobile
        this.wayData.address = this.recipientsData.receiveDetailAddress
        this.wayData.city.push(this.recipientsData.receiveProvince)
        this.wayData.city.push(this.recipientsData.receiveCity)
        this.wayData.city.push(this.recipientsData.receiveCounty)
        this.wayData.fixPhone = this.recipientsData.receiveFixedLine
        this.wayData.companyName = this.recipientsData.receiveCompany
      }
      this.wayData.way = this.receiveData.obtainCertType
      getCityData().then((res) => {
        this.options = res.data[0].children
        if (this.dialogStatu) {
          this.receiverDialogVisible = true
          this.$nextTick(() => {
            this.$refs['recipientsForm'].resetFields()
          })
        } else {
          this.recipientsDialogVisible = true
          this.$nextTick(() => {
            this.$refs['recipientsForm'].resetFields()
          })
        }
      })
    },
    handleChangePersonageAddres() {
      if (this.recipientsData !== null) {
        this.recipientsData.receiveRegionCode = this.$refs.personageCascader.getCheckedNodes()[0].data.code
      } else {
        this.recipientsData = {}
        this.recipientsData.receiveRegionCode = this.$refs.personageCascader.getCheckedNodes()[0].data.code
      }
    },
    submitWay() {
      this.$refs['recipientsForm'].validate((valid, obj) => {
        if (valid) {
          this.receiveData.obtainCertType = this.wayData.way

          modificationOrderInfo(this.receiveData).then((res) => {
            if (this.basueData.businessType === 11) {   // 人防车位
              this.recipientsData.receiveName = this.wayData.name
              this.recipientsData.receiveMobile = this.wayData.phone
              this.recipientsData.receiveDetailAddress = this.wayData.address
              this.recipientsData.receiveAddress =this.wayData.city[0] +this.wayData.city[1] +this.wayData.city[2]
              this.recipientsData.receiveFixedLine = this.wayData.fixPhone
              this.recipientsData.receiveCompany = this.wayData.companyName
              this.recipientsData.orderNum = this.receiveData.orderNum

              updateOrderExpressSend(this.recipientsData).then(res => {
                if (res.success) {
                  this.paparkingSpaceReplaceVariable()
                }
              })
              return
            }

            if (res.success && parseInt(this.wayData.way) === 1) {
              getRecipientsInfo({ orderNum: this.receiveData.orderNum }).then(
                (res) => {
                  if (res.data === null) {  // 更改为邮寄
                    var data = {
                      prodName: this.receiveData.prodName,
                      orderNum: this.receiveData.orderNum,
                      dossierNum: this.receiveData.dossierNum,
                      applicantName: this.receiveData.applicantName,
                      notaryNum: this.receiveData.notaryNum,
                      orderSource: this.receiveData.orderSource,
                      receiveName: this.wayData.name,
                      receiveMobile: this.wayData.phone,
                      receiveFixedLine: this.wayData.fixPhone,
                      receiveCompany: this.wayData.companyName,
                      receiveAddress:
                        this.wayData.city[0] +
                        this.wayData.city[1] +
                        this.wayData.city[2],
                      receiveDetailAddress: this.wayData.address,
                      receiveRegionCode: this.recipientsData.receiveRegionCode
                    }
                    addnRecipientsInfo(data).then((res) => {
                      if (res.success) {
                        // if (this.basueData.businessType === 11) {	// 人防车位
                        //   this.paparkingSpaceReplaceVariable()
                        // } else {
                        this.$fun.replaceInstrument(this.orderId)
                        // }
                      }
                    })
                  } else {  // 更改为线下领取
                    this.recipientsData.receiveName = this.wayData.name
                    this.recipientsData.receiveMobile = this.wayData.phone
                    this.recipientsData.receiveDetailAddress = this.wayData.address
                    this.recipientsData.receiveAddress =
                      this.wayData.city[0] +
                      this.wayData.city[1] +
                      this.wayData.city[2]
                    this.recipientsData.receiveFixedLine = this.wayData.fixPhone
                    this.recipientsData.receiveCompany = this.wayData.companyName
                    modificationRecipientsInfo(this.recipientsData).then(
                      (res) => {
                        if (res.success) {
                          // if (this.basueData.businessType === 11) {	// 人防车位
                          //   this.paparkingSpaceReplaceVariable()
                          // } else {
                          this.$fun.replaceInstrument(this.orderId)
                          // }
                        }
                      }
                    )
                  }
                }
              )
            } else {
              if (res.success) {
                if (this.basueData.businessType === 11) {	// 人防车位
                  this.paparkingSpaceReplaceVariable()
                } else {
                  this.$fun.replaceInstrument(this.orderId)
                }
              }
            }
          })
        }
      })
    },
    async paparkingSpaceReplaceVariable() {
			let res = await getReplaceJson(this.orderId)
			if (res) {
				let variable = {
					orgId: this.basueData.orgId,
					proCode: "rfcw",
					orderId: this.orderId,
					templateType: 0,
					type: "",
					json: JSON.stringify(res),
					idDelete: 0
				}
				console.log(variable);

				let result = await replaceVariable(variable)
				console.log('替换结果', result);
				if (result.success) {
					setTimeout(() => {
            this.$router.go(0)
          }, 50);
				}
			}
		},
    modificationReceiverInfo() {
      this.data1.name = this.receiverInfo.receiveName
      this.data1.cardNum = this.receiverInfo.cardNum
      if (this.receiverInfo.cardType === null) {
        this.data1.cardType = ''
      } else {
        this.data1.cardType = this.receiverInfo.cardType.toString()
      }
      this.data1.phone = this.receiverInfo.mobile
      this.modificationReceiverInfodialogVisible = true
      this.$nextTick(() => {
        this.$refs['licenseInformation'].resetFields()
      })
    },
    modificationReceiver() {
      this.$refs['licenseInformation'].validate((valid, obj) => {
        if (valid) {
          this.receiverInfo.receiveName = this.data1.name
          this.receiverInfo.cardNum = this.data1.cardNum
          this.receiverInfo.cardType = parseInt(this.data1.cardType)
          this.receiverInfo.mobile = this.data1.phone
          this.receiverInfo.orderNum = this.basueData.orderNum
          modificationReceiveInfo(this.receiverInfo).then((res) => {
            if (res.success) {
              if (this.basueData.businessType === 11) {	// 人防车位
                this.paparkingSpaceReplaceVariable()
              } else {
                this.$fun.replaceInstrument(this.orderId)
              }
            }
          })
        }
      })
    },
    editRecipients() {
      this.dialogStatu = false
      this.editreceiverInfo()
    },
    submitRecipientsInfo() {
      this.$refs['recipientsForm'].validate((valid, obj) => {
        if (valid) {
          this.recipientsData.receiveName = this.wayData.name
          this.recipientsData.receiveMobile = this.wayData.phone
          this.recipientsData.receiveDetailAddress = this.wayData.address
          this.recipientsData.receiveAddress =
        this.wayData.city[0] + this.wayData.city[1] + this.wayData.city[2]
          this.recipientsData.receiveFixedLine = this.wayData.fixPhone
          this.recipientsData.receiveCompany = this.wayData.companyName
          modificationRecipientsInfo(this.recipientsData).then((res) => {
            if (res.success) {
              this.recipientsDialogVisible = false
              this.$router.go(0)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.receiver-info-main {
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
    margin-top: 30px;
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
  .info-list-box {
    .el-form {
      margin-left: 30px;
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        margin: 0;
        width: 33%;
        /deep/ label {
          color: #999;
        }
      }
    }
  }
  .receiver-dialog-main,
  .recipients-dialog {
    .el-form {
      min-height: 200px;
      /deep/ .el-cascader {
        width: 100%;
      }
      .way {
        margin-bottom: 0;
      }
      /deep/ label,
      .recipients-info-text {
        color: #999;
        text-align: left;
      }
      /deep/ label {
        font-weight: normal;
      }
      .recipients-info-text {
        padding: 10px 0;
        padding-bottom: 15px;
        font-size: 14px;
      }
      .alternative {
        /deep/ label:before {
          display: none !important;
        }
        /deep/ label {
          padding-left: 10px;
        }
      }
    }
    /deep/ .el-dialog__body {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    /deep/ .el-dialog__footer {
      padding-top: 20px;
    }
  }
  .modification-receiverInfo-dialog {
    .el-form {
      .el-form-item {
        display: flex;
        /deep/ .el-select {
          width: 100%;
        }
      }
      /deep/ label {
        color: #999;
        text-align: left;
      }
    }
  }
  /deep/ .el-form-item {
    display: flex;
  }
  /deep/ .el-form-item__content{
    flex: 1;
    & > div{
      word-wrap:break-word;
      word-break:break-all
    }
  }
  /deep/ .el-form-item__label{
    white-space: nowrap;
    display: block;
    width: 100px  !important;
  }
  .recipient-item{
    flex: 1;
  }
}
</style>
