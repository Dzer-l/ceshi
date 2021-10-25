<template>
  <div class="new-relational-person-main">
    <el-form ref="newRelationalruleForm" :model="ruleForm" :rules="rules" label-position="left" label-width="100px" class="demo-ruleForm" size="medium">
      <el-form-item label="当事人角色" prop="character">
        <el-select v-model="ruleForm.character" placeholder="请选择当事人角色">
          <el-option label="买方" value="msr" />
          <el-option label="卖方" value="cmr" />
        </el-select>
      </el-form-item>
      <el-form-item label="当事人类型" class="indentation-item">
        <el-radio-group v-model="ruleForm.type" @change="changeType">
          <el-radio label="0">个人</el-radio>
          <el-radio label="1">企业</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="ruleForm.type==='1'" class="enterprise-information-form">
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="ruleForm.companyName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="证件类型" prop="companyCardType">
          <el-select v-model="ruleForm.companyCardType" placeholder="请选择证件类型">
            <el-option v-for="(item,index) in enterpriseType" :key="index" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="companyCardNum">
          <el-input v-model="ruleForm.companyCardNum" placeholder="请输入证件号码" maxlength="18" />
        </el-form-item>
        <el-form-item label="联系电话" prop="companyPhone">
          <el-input v-model="ruleForm.companyPhone" placeholder="请输入联系电话" maxlength="11" />
        </el-form-item>
        <el-form-item label="所在地区" class="indentation-item">
          <el-cascader v-model="ruleForm.companyCity" placeholder="请选择省/市/区(县)" :options="cityArr" :props="{value: 'name',label: 'name',children: 'children',}" @change="handleChange" />
        </el-form-item>
        <el-form-item label="详细地址" prop="companyAddress" class="indentation-item">
          <el-input v-model="ruleForm.companyAddress" placeholder="请输入详细地址" />
        </el-form-item>
        <el-divider />
      </div>
      <el-form-item :label="ruleForm.type==='0'?'姓名':'法定代表人'" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="ruleForm.type==='0'?'请输入姓名':'请输入法人代表姓名'" />
      </el-form-item>
      <el-form-item label="证件类型" prop="cardType">
        <el-select v-model="ruleForm.cardType" placeholder="请选择证件类型">
          <el-option v-for="(item,index) in personalType" :key="index" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码" prop="cardNum">
        <el-input v-model="ruleForm.cardNum" placeholder="请输入证件号码" />
      </el-form-item>
      <el-form-item label="性别" class="indentation-item">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" class="indentation-item">
        <el-date-picker v-model="ruleForm.birth" type="date" placeholder="请选择出生日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="证件有效期" class="indentation-item">
        <el-date-picker v-model="ruleForm.validityPeriod" type="date" placeholder="选择证件有效期至" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="请输入手机号码" maxlength="11" />
      </el-form-item>
      <el-form-item label="所在地区" class="indentation-item">
        <el-cascader v-model="ruleForm.city" placeholder="请选择省/市/区(县)" :options="cityArr" :props="{value: 'name',label: 'name',children: 'children',}" @change="handleChange" />
      </el-form-item>
      <el-form-item label="详细地址" class="indentation-item">
        <el-input v-model="ruleForm.address" placeholder="请输入详细地址" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import * as newHouse from '../../api/newhouse'
import { isvalidCard } from '../../components/entryTab/verification'
export default {
  props: ['cityArr', 'partiesInfo', 'type'],
  data() {
    const validCard = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入证件号码'))
      } else {
        if (this.ruleForm.cardType === '111') {
          if (!isvalidCard(value)) {
            callback(new Error('请输入正确的证件号码'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      options: [],
      personalType: [
        { id: '111', value: '居民身份证' },
        { id: '112', value: '临时居民身份证' },
        { id: '113', value: '户口簿' },
        { id: '114', value: '中国人民解放军军官证' },
        { id: '116', value: '香港居民身份证' },
        { id: '117', value: '澳门居民身份证' },
        { id: '118', value: '港澳居民来往内地通行证' },
        { id: '119', value: '台湾居民来往内地通行证' },
        { id: '123', value: '士兵证' },
        { id: '124', value: '台湾居民身份证' },
        { id: '125', value: '律师证' },
        { id: '128', value: '驾驶证' },
        { id: '130', value: '港澳居民居住证' },
        { id: '131', value: '台湾居民居住证' },
        { id: '132', value: '普通护照（中国）' },
        { id: '133', value: '外国护照' }
      ],
      enterpriseType: [
        { id: '121', value: '营业执照注册号' },
        { id: '122', value: '机构组织代码' },
        { id: '126', value: '统一社会信用代码' },
        { id: '127', value: '企业注册编码' }
      ],
      ruleForm: {
        character: this.type === 'add' ? '' : this.partiesInfo.roleCode,
        type: this.type === 'add' ? '0' : (this.partiesInfo.organizationType === 0 ? '0' : '1'),
        name: this.type === 'add' ? '' : this.partiesInfo.realName,
        cardType: this.type === 'add' ? '' : this.partiesInfo.cardType,
        cardNum: this.type === 'add' ? '' : this.partiesInfo.cardNum,
        gender: this.type === 'add' ? '' : (this.partiesInfo.gender ? this.partiesInfo.gender : ''),
        birth: this.type === 'add' ? '' : (this.partiesInfo.birthday ? this.partiesInfo.birthday : ''),
        validityPeriod: this.type === 'add' ? '' : (this.partiesInfo.expiryDate ? this.partiesInfo.expiryDate : ''),
        phone: this.type === 'add' ? '' : this.partiesInfo.mobile,
        city: this.type === 'add' ? [] : this.partiesInfo.modeAddress,
        address: this.type === 'add' ? '' : (this.partiesInfo.detailAddress ? this.partiesInfo.detailAddress : ''),
        companyName: this.type === 'add' ? '' : (this.partiesInfo.organizationName ? this.partiesInfo.organizationName : ''),
        companyCardType: this.type === 'add' ? '' : (this.partiesInfo.organizationCardType ? this.partiesInfo.organizationCardType : ''),
        companyCardNum: this.type === 'add' ? '' : (this.partiesInfo.organizationCardNum ? this.partiesInfo.organizationCardNum : ''),
        companyPhone: this.type === 'add' ? '' : (this.partiesInfo.organizationPhone ? this.partiesInfo.organizationPhone : ''),
        companyCity: this.type === 'add' ? '' : this.partiesInfo.enterpriseModelAddres,
        companyAddress: this.type === 'add' ? '' : (this.partiesInfo.organizationDetailAddress ? this.partiesInfo.organizationDetailAddress : '')
      },
      rules: {
        character: [{ required: true, message: '请选择当事人角色', trigger: 'change' }],
        name: [
          { required: true, message: '请输入当事人姓名', trigger: 'blur' }
        ],
        cardType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        cardNum: [{ required: true, validator: validCard, trigger: 'blur' }],
        phone: [{ required: true, validator: validPhone, trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        companyCardNum: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
        companyPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        companyCardType: [{ required: true, message: '请选择证件类型', trigger: 'change' }]
      }
    }
  },
  created() {
    console.log(this.type)
  },
  mounted() {
    if (this.type === 'add') {
      // debugger
      // this.$nextTick(() => {
      this.resetForm()
      this.$refs['newRelationalruleForm'].clearValidate()
      // })
    }
  },
  methods: {
    handleChange() {},
    resetForm() {
      for (const key in this.ruleForm) {
        if (key === 'type') {
          this.ruleForm[key] = '0'
        } else {
          this.ruleForm[key] = ''
        }
      }
    },
    verifyForm() {
      this.$refs['newRelationalruleForm'].validate((valid, obj) => {
        if (valid) {
          const data = {
            orderId: this.$parent.$parent.orderId,
            realName: this.ruleForm.name,
            cardType: this.ruleForm.cardType,
            cardNum: this.ruleForm.cardNum,
            mobile: this.ruleForm.phone,
            detailAddress: this.ruleForm.city.length === 0 ? '' : this.ruleForm.city.join('') + this.ruleForm.address,
            proposerType: '0', // 当事人类型 ("0", "申请人"),
            organizationName: this.ruleForm.type === '1' ? this.ruleForm.companyName : '',
            organizationType: this.ruleForm.type,
            organizationCardType: this.ruleForm.type === '1' ? this.ruleForm.companyCardType : '',
            organizationAddress: this.ruleForm.type === '1' ? (this.ruleForm.companyCity.length === 0 ? '' : this.ruleForm.companyCity.join('') + this.ruleForm.companyAddress) : '',
            organizationCardNum: this.ruleForm.companyCardNum,
            corporateCertificateIssuingDate: '', //	企业证明资料出具日期或委托人出生日期
            birthday: this.ruleForm.birth,
            entrustType: 1, // 委托人类型
            transfereeType: '', // 受让人类型
            organizationPhone: this.ruleForm.companyPhone,
            companyRelation: '', // 与机构的关系
            gender: this.ruleForm.gender,
            expiryDate: this.ruleForm.validityPeriod,
            roleCode: this.ruleForm.character// 产品角色编码
          }
          if (this.type === 'add') {
            newHouse.addARelational(data).then(res => {
              if (res.success) {
                this.$message({ type: 'success', message: '添加订单关系人成功' })
                this.$fun.replaceInstrument(this.$parent.$parent.orderId)
              } else {
                this.$message.error('添加订单关系人失败 ')
              }
            })
          } else {
            this.partiesInfo.realName = this.ruleForm.name
            this.partiesInfo.cardType = this.ruleForm.cardType
            this.partiesInfo.cardNum = this.ruleForm.cardNum
            this.partiesInfo.mobile = this.ruleForm.phone
            this.partiesInfo.organizationName = this.ruleForm.companyName
            this.partiesInfo.organizationType = this.ruleForm.type
            this.partiesInfo.birthday = this.ruleForm.birth
            this.partiesInfo.gender = this.ruleForm.gender
            this.partiesInfo.organizationPhone = this.ruleForm.companyPhone
            this.partiesInfo.organizationCardType = this.ruleForm.companyCardType
            this.partiesInfo.expiryDate = this.ruleForm.validityPeriod
            this.partiesInfo.roleCode = this.ruleForm.character
            this.partiesInfo.detailAddress = this.ruleForm.city.length === 0 ? '' : this.ruleForm.city.join('') + this.ruleForm.address
            this.partiesInfo.organizationAddress = this.ruleForm.type === '1' ? this.ruleForm.companyCity.join('') + this.ruleForm.companyAddress : ''
            this.partiesInfo.organizationCardNum = this.ruleForm.companyCardNum,
            console.log(data)
            newHouse.modificationPartiesInfo(this.partiesInfo).then(res => {
              if (res.success) {
                this.$fun.replaceInstrument(this.$parent.$parent.orderId)
              }
            })
          }
        }
      })
    },
    changeType() {
      this.$nextTick(() => {
        this.$refs['newRelationalruleForm'].clearValidate()
      })
    }
  }
}
</script>

<style lang="less" scoped>

.new-relational-person-main{
  width: 100%;
}
.el-form-item{
  width: 500px;
  margin: auto auto 22px auto;
}
.indentation-item{
  /deep/ .el-form-item__label{
    padding-left: 10px;
  }
}
.enterprise-information-form{

}
</style>
