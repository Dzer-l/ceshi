<template>
  <div v-if="manInfo">
    <div v-for="(item, index) in manInfo.entrustList" :key="'entrust' + index">
      <el-form
        :ref="'shippingForm' + index"
        :model="manInfo.entrustList[index]"
      >
        <div class="form-tit">
          <span>申请人{{
            item.roleCode == 'dlrs'
              ? "大陆人士"
              : item.roleCode == 'gatrs'
                ? "港澳台人士"
                : "华侨/外籍人士"
          }}</span>
          <nav>
            <el-button type="primary" @click="onClick_edit(index)">{{
              item.edit ? "保存" : "修改"
            }}</el-button>
            <el-button
              v-if="item.edit"
              type="primary"
              style="margin-left: 20px"
              @click="onClick_edit(index, 'none')"
            >取消</el-button>
          </nav>
        </div>
        <div class="form-item-main">
          <section>
            <el-form-item label="姓名：" :prop="'realName'" :rules="rules.name">
              <el-input
                v-model="item.realName"
                :disabled="!item.edit"
                placeholder="请输入申请人姓名"
              />
            </el-form-item>
            <el-form-item label="性别：">
              <div style="display: inline-block;width: 310px">
                <el-radio
                  v-model="item.gender"
                  :disabled="!item.edit|| parseInt(item.cardType)===111"
                  label="1"
                >男</el-radio>
                <el-radio
                  v-model="item.gender"
                  :disabled="!item.edit|| parseInt(item.cardType)===111"
                  label="2"
                >女</el-radio>
              </div>
            </el-form-item>
            <el-form-item v-if="item.roleCode =='gatrs'|| item.roleCode==='dlrs'" :prop="'cardNum'" :rules="rules.cardNum">
              <span slot="label">{{ cardList[item.cardType] }}</span>
              <el-select v-if="item.roleCode==='gatrs'" v-model="item.cardType" placeholder="请选择" :disabled="!item.edit" style="margin-right: 10px" class="no-border">
                <el-option v-for="(items, indexs) in CardTypeList" :key="indexs" :label="items.label" :value="items.value" />
              </el-select>
              <el-input
                v-model="item.cardNum"
                :disabled="!item.edit"
                maxlength="18"
                placeholder="请输入申请人身份证号码"
                @blur="go(item.cardNum.length,item.cardNum,index)"
              />
            </el-form-item>
            <el-form-item v-if="item.roleCode =='hqwjrs'">
              <span slot="label">{{ cardList[item.cardType] }}</span>
              <el-select v-model="item.cardType" placeholder="请选择" :disabled="!item.edit&&!item.now_add" style="margin-right: 10px" class="no-border">
                <el-option v-for="(items, indexs) in fCardTypeList" :key="indexs" :label="items.label" :value="items.value" />
              </el-select>
              <el-input
                v-model="item.cardNum"
                :disabled="!item.edit"
                maxlength="18"
                placeholder="请输入申请人身份证号码"
                @blur="go(item.cardNum.length,item.cardNum,index)"
              />
            </el-form-item>
            <el-form-item
              label="出生日期："
              :prop="'birthday'"
              :rules="rules.date"
            >
              <el-date-picker
                v-model="item.birthday"
                type="date"
                :disabled="!item.edit|| parseInt(item.cardType)===111"
                :picker-options="dataRules"
                placeholder="请选择出生日期"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item
              v-if="parseInt(item.cardType) == 132 || parseInt(item.cardType) == 119||parseInt(item.cardType)===118"
              :prop="'expiryDate'"
              :rules="rules.expiryDate"
            >
              <span slot="label">{{ item.cardType == 118 || item.cardType == 119 ? "通行证有效期至：" : "护照有效期至：" }}</span>
              <el-date-picker
                v-model="item.expiryDate"
                type="date"
                :disabled="!item.edit"
                placeholder="请选择证件有效期："
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item v-if="index === 0" label="房产详细地址：">
              <el-input
                v-model="manInfo.detailAddress"
                :disabled="!item.edit"
                placeholder="请输入详细的房产地址"
              />
            </el-form-item>
            <el-form-item
              label="申请人手机号（省略国家区号）："
              :prop="'mobile'"
              :rules="rules.mobile"
            >
              <el-input
                v-model="item.mobile"
                :disabled="!item.edit"
                placeholder="请输入与申请人微信绑定的手机号"
              />
            </el-form-item>
          </section>
          <section style="justify-content: start;">
            <div v-for="(img, ind) in item.materialList" :key="'img' + ind">
              <div class="img-box">
                <img v-if="img.url" width="136" height="136" :src="img.url">
                <div
                  v-if="!img.url && item.edit"
                  style="width: 136px;height: 136px;background-color: #f5f5f5;color: #666;line-height: 136px;font-size: 14px"
                >
                  {{img.url==''?'上传':'加载中...'}}
                </div>
                <span v-if="img.url || item.edit">{{
                  img.materialName ? img.materialName : img.originFileName
                }}</span>
                <div v-if="img.url || item.edit" class="mode">
                  <span v-if="img.url!=''"
                    @click="$store.commit('app/CHANGE_IMAGE', [img.url])"
                  >查看</span>
                  <el-upload
                    v-if="item.edit"
                    style="display: inline-block;"
                    action
                    :show-file-list="false"
                    :multiple="true"
                    :http-request="uploadImg"
                    :data="{
                      type: img.materialCode,
                      index: ind,
                      listIndex: index
                    }"
                  >
                    <span>{{img.url==''?'上传':'修改'}}</span>
                  </el-upload>
                </div>
              </div>
            </div>
          </section>
        </div>
      </el-form>
    </div>
    <div>
      <div class="form-tit">
        <span class="text">上传当事人材料</span>
      </div>
      <div class="form-item-main file-box">
        <el-button
          v-if="!enterustEdit"
          @click="downAllFile(2)"
        >一键下载</el-button>
        <el-upload
          :class="[
            { 'upload-demo': !enterustEdit },
            { 'upload-demo-edit': enterustEdit }
          ]"
          action
          :limit="20"
          :multiple="false"
          :file-list="flieList"
        >
          <el-button
            v-if="enterustEdit"
            icon="el-icon-upload2"
          >上传文件</el-button>
          <div slot="tip" class="el-upload__tip">
            支持扩展名：.pdf .doc .png .jpg .docx
          </div>
        </el-upload>
      </div>
    </div>
    <el-dialog
      title="新增申请人"
      :visible.sync="dialogVisible"
      width="500">
      <div>
        <span>申请人属于：</span>
        <el-radio-group v-model="roleCategory">
          <el-radio label="dlrs">大陆人士</el-radio>
          <el-radio label="gatrs">港澳台人士</el-radio>
          <el-radio label="hqwjrs">华侨/外籍人士</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="affirmAddProposer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'
import * as de from '@/api/delegate'
const Numreg = /^[0-9]*$/
const idCard = /^[\u4E00-\u9FA5]+$/
const cnIdCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
export default {
  props: {
    orderId: {
      type: String,
      required: true
    },
    orderNum: {
      type: String,
      required: true
    },
    flieList: {
      type: Array,
      required: true
    }
  },
  data() {
    const validateAdd = (rule, value, callback) => {
      console.log(value)
      const add = this.manInfo.detailAddress

      if (!add) {
        callback(new Error('联系地址不能为空'))
      } else if (add.length < 2 || add.length > 120) {
        callback(new Error('联系地址需输入5-120个字'))
      } else {
        callback()
      }
    }

    var cardVerified = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写证件号码'))
      } else {
        if (this.manInfo.entrustList[this.editIndex].cardType === '111') {
          if (!cnIdCard.test(value)) {
            callback(new Error('请填写有效证件号码'))
          } else {
            // this.go(value.length, value)
            callback()
          }
        } else {
          if (idCard.test(value)) {
            callback(new Error('请填写有效证件号码'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      dataRules: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      baseInfo: { sex: '', birthday: '', age: '', birthplace: '' },
      url: this.$cfg.http,
      enterustEdit: false,
      options: regionData, // 城市选择码
      rules: {
        name: [
          {
            required: true,
            message: '请填写姓名',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请填写2-30个字符',
            min: 2,
            max: 30,
            trigger: 'blur'
          }
        ],
        date: [
          {
            required: true,
            message: '请选择出生日期',
            trigger: 'blur'
          }
        ],
        expiryDate: [
          {
            required: true,
            message: '请选择证件有效期',
            trigger: 'blur'
          }
        ],
        cardNum: [
          {
            required: true,
            message: '请填写证件号',
            max: 18,
            trigger: 'blur'
          },
          {
            validator: cardVerified,
            trigger: 'blur'
          }
        ],
        address: [
          {
            type: 'array',
            required: true,
            message: '请选择房产所处地区',
            trigger: 'change'
          }
        ],
        detailAddress: [{ validator: validateAdd, trigger: 'blur' }],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            max: 20,
            trigger: 'blur'
          },
          {
            pattern: Numreg,
            message: '仅允许输入数字'
          }
        ]
      },
      manInfo: null,
      entrustInfo: null,
      editIndex: null,
      cardList: {
        '111': '居民身份证：',
        '112': '临时居民身份证：',
        '113': '户口簿：',
        '114': '中国人民解放军军官证：',
        '116': '香港居民身份证：',
        '117': '澳门居民身份证：',
        '118': '港澳居民通行证：',
        '119': '台湾居民通行证：',
        '123': '士兵证：',
        '124': '台湾居民身份证：',
        '125': '律师证：',
        '128': '驾驶证：',
        '130': '港澳居民居住证：',
        '131': '台湾居民居住证：',
        '132': '中国护照：',
        '133': '外国护照：'
      },
      CardTypeList: [
        { value: '116', label: '香港居民居住证' },
        { value: '117', label: '澳门居民居住证' },
        { value: '118', label: '港澳居民来往内地通行证' },
        { value: '119', label: '台湾居民来往内地通行证' },
        { value: '131', label: '台湾居民居住证' },
        { value: '130', label: '港澳居民居住证' },
        { value: '124', label: '台湾居民身份证' }
      ],
      fCardTypeList: [
        { value: '132', label: '中国护照' },
        { value: '133', label: '外国护照' }
      ],
      dialogVisible:false,
      roleCategory:'dlrs'
    }
  },

  created() {
    // Loading.service();
    // this.manInfo = JSON.parse(JSON.stringify(this.entrustInfo));
  },

  mounted() {
    // this.manInfo = JSON.parse(JSON.stringify(this.entrustInfo));
    this.getEntrustInfos()
    this.getCardType()
  },

  methods: {
    categorySelect(){
      this.dialogVisible=true
    },
    affirmAddProposer(){
      this.dialogVisible=false
      let materialsObj
      if(this.roleCategory=='dlrs'){
        materialsObj=[{materialName:'身份证正面照',materialCode:'1001',url:''},
        {materialName:'身份证反面照',materialCode:'1000',url:''}]
      }else if(this.roleCategory=='gatrs'){
        materialsObj=[
          {materialName:'身份证正面照',materialCode:'1001',url:''},
          {materialName:'身份证反面照',materialCode:'1000',url:''},
          {materialName:'通行证（正面照+反面照）',materialCode:'1006',url:''},
          {materialName:'通行证（正面照+反面照）',materialCode:'1006',url:''}]
      }else{
        materialsObj=[{materialName:'护照',materialCode:'1007',url:''}]
      }
      let proposerInfo={
        now_add:true,
        birthday:'',
        cardNum:'',
        edit:true,
        cardType:this.roleCategory=='dlrs'?'111':this.roleCategory=='gatrs'?'130':'132',
        gender: "1",
        mobile: "",
        orderId: this.manInfo.id,
        realName: "",
        materialList:materialsObj,
        roleCode: this.roleCategory,
      }
      this.manInfo.entrustList.push(proposerInfo)
    },
    getCardType() {
      this.$axios('org/card-type-enum').then((res) => {
        const list = []
        Object.keys(res.data).forEach(function(key) {
          list.push({ value: key, label: res.data[key] })
        })
        this.CardTypeList = list
      })
    },
    async getEntrustInfos() {
      de.getEntrustInfo({ orderId: this.orderId }).then(async res => {
        if (res.success) {
          for (const j of res.data.entrustList) {
            j.edit = false
            j.gender = j.gender + ''
            this.entrustInfo = res.data
            this.manInfo = JSON.parse(JSON.stringify(this.entrustInfo))
            for (const i of j.materialList) {
              if (i.id) {
                i.url = await this.getImg(i.id)
              }else{
                i.url = ''
              }
              this.entrustInfo = res.data
              this.manInfo = JSON.parse(JSON.stringify(this.entrustInfo))
            }
          }
          for(const t of this.manInfo.entrustList){
            t.now_add=false
          }
        }
      })
    },

    async getImg(id) {
      return await this.$axios(`org/order-proposer-material-preview-img?id=${id}`).then(async res => {
        if (res.success) {
          return 'data:image/png;base64,' + res.data
        }
      })
    },

    // 编辑
    onClick_edit(e, type) {
      const data = this.manInfo.entrustList[e]
      const oldData = this.entrustInfo.entrustList[e]
      if (type === 'none') {
        if(data.now_add){
          this.$confirm('此次填写的信息将被清空，是否继续？','提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.manInfo.entrustList.splice(e, 1)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }else{
          this.manInfo.entrustList[e].edit = !data.edit
          this.$refs[`shippingForm${e}`][0].clearValidate()
          Object.keys(data).forEach(function(key) {
            if (key !== 'eidt') {
              if (data[key] !== oldData[key]) {
                data[key] = oldData[key]
              }
            }
          })
          this.getEntrustInfos()
        }
        return
      }

      if (data.edit === true) {
        this.submit(e)
      } else {
        this.manInfo.entrustList[e].edit = true
        this.editIndex = e
      }
    },
    go(val, value, index) {
      // console.log(this.baseInfo)
      const iden = value
      var sex = null
      var birth = null
      const myDate = new Date()
      const month = myDate.getMonth() + 1
      const day = myDate.getDate()
      var age = 0
      this.editIndex=index
      if (val === 18) {
        age = myDate.getFullYear() - iden.substring(6, 10) - 1
        sex = iden.substring(16, 17)
        birth = iden.substring(6, 10) + '-' + iden.substring(10, 12) + '-' + iden.substring(12, 14)
        if (iden.substring(10, 12) < month || iden.substring(10, 12) === month && iden.substring(12, 14) <= day) age++
      }
      if (val === 15) {
        age = myDate.getFullYear() - iden.substring(6, 8) - 1901
        sex = iden.substring(13, 14)
        birth = '19' + iden.substring(6, 8) + '-' + iden.substring(8, 10) + '-' + iden.substring(10, 12)
        if (iden.substring(8, 10) < month || iden.substring(8, 10) === month && iden.substring(10, 12) <= day) age++
      }

      if (sex % 2 === 0) { sex = '2' } else { sex = '1' }
      this.baseInfo.sex = sex
      this.baseInfo.age = age
      this.baseInfo.birthday = birth
      // this.baseInfo.birthplace = this.area[iden.substring(0, 2)]
      console.log(this.baseInfo, this.manInfo, index)
      if (val === 18 || val === 15) {
        this.manInfo.entrustList[index].gender = sex
        this.manInfo.entrustList[index].birthday = birth
      }
    },
    // 下载当事人材料
    downAllFile(e) {
      this.$axios('org/zip-order-annex', { orderId: this.entrustInfo.id }, { responseType: 'blob' }).then(blob => {
        this.$fun.blobFile(blob, `${this.orderNum}.zip`)
      })
    },
    uploadImg(e) {
      const file = e.file
      const fileType = file.type // 文件类型
      const typeList = ['image/jpeg', 'image/jpg', 'image/png']
      const isImage = typeList.indexOf(fileType) !== -1 // 限制格式
      const isLt15M = file.size / 1024 / 1024 < 15 // 文件大小
      const dataIndex = e.data.listIndex // 图片index
      const dataImg =e.data.index // 联系人index
      if (!isImage) {
        this.$message.error('请上传jpg、jpeg、png格式的文件!')
        return
      }

      if (!isLt15M) {
        this.$message.error('上传图片的大小应小于15M')
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('orderId', this.manInfo.id)
      formData.append('fileType', 'order-material') // 文件流

      const URL = window.URL || window.webkitURL
      const imgURL = URL.createObjectURL(file) // 本地url
      const changeList = this.manInfo.entrustList[dataIndex].materialList
      this.$axios('org/single-file-upload', formData, { method: 'post' }).then(
        res => {
          if (res.success) {
            if(!this.manInfo.entrustList[dataIndex].now_add){
              changeList[dataImg].materialFile = JSON.stringify(res.data)
              changeList[dataImg].originFileName = res.data.originalFilename
              changeList[dataImg].url = imgURL
            }else{
              changeList[dataImg]['materialFile']=JSON.stringify(res.data)
              changeList[dataImg]['url']=imgURL
              changeList[dataImg]['fileType']=fileType
              if(this.manInfo.entrustList[dataIndex].roleCode=='hqwjrs'){
                changeList.push({materialName:'护照',materialCode:'1007',url:''})
              }
            }
            console.log(changeList[dataImg])
          }
        }
      )
    },
    // 保存
     async submit(i) {
      this.$refs[`shippingForm${i}`][0].validate(valid => {
        let is_imgVerify=true
        if(this.manInfo.entrustList[i].now_add){
          for(let y=0;y<this.manInfo.entrustList[i].materialList.length;y++){
            // if(this.manInfo.entrustList[i].materialList[y].url==''){
            //   if((this.manInfo.entrustList[i].roleCode=='hqwjrs'&&y==0)||this.manInfo.entrustList[i].roleCode!='hqwjrs'){
            //     this.$message.error('必填项图片为空，请上传图片')
            //     is_imgVerify=false
            //     return
            //   }
            // }
          }
        }
        if (valid&&is_imgVerify) {
          const itemInfo = this.manInfo.entrustList[i]
          const data = {
            houseEntrustDTO: {},
            proposerReDTO: {},
            proposerMaterialList: {}
          }
          data.proposerReDTO = {
            orderId: itemInfo.orderId,
            cardType: itemInfo.cardType,
            realName: itemInfo.realName,
            mobile: itemInfo.mobile,
            cardNum: itemInfo.cardNum,
            birthday: itemInfo.birthday,
            gender: itemInfo.gender,
            expiryDate: itemInfo.expiryDate
          }
          data.proposerMaterialList = JSON.parse(
            JSON.stringify(itemInfo.materialList)
          )
          if (i === 0) {
            data.houseEntrustDTO.id = this.manInfo.entrustId
            data.houseEntrustDTO.orderId = this.manInfo.id
            data.houseEntrustDTO.detailAddress = this.manInfo.detailAddress
          } else {
            delete data.houseEntrustDTO
          }
          data.proposerMaterialList=data.proposerMaterialList.filter((item)=>{
            return item.url!=''
          })
          if(itemInfo.now_add){
          data.proposerReDTO['roleCode']=itemInfo.roleCode
            for(let a of data.proposerMaterialList){
              if(a.fileType){
                a['originFileName']=itemInfo.realName+'-'+a.materialName+'.'+a.fileType.substring((a.fileType.indexOf('/')+1))
                a['orderId']=itemInfo.orderId
              }
            }
            this.$axios('org/save-order-proposer',data,{method:'post'}).then(res=>{
              if(res.success){
                this.getEntrustInfos()
                this.$fun.msg('申请人添加成功', 'success')
              }else{
                this.$fun.msg('申请人添加失败', 'error')
              }
            })
          }else{
            data.proposerReDTO['id']=itemInfo.id
            this.$axios('org/update-order-proposer', data, { method: 'put' }).then(
              res => {
                if (res.success) {
                  this.$fun.msg('联系人修改成功', 'success')
                  this.manInfo.entrustList[i].edit = false
                  this.entrustInfo.entrustList[i] = JSON.parse(
                    JSON.stringify(this.manInfo.entrustList[i])
                  )
                  this.$parent.getEInfo()
                } else {
                  this.$fun.msg('联系人修改失败', 'error')
                }
              }
            )
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form-tit {
  width: 100%;
  height: 60px;
  padding: 0 34px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid #e9e9e9;
  & > span {
    line-height: 60px;
    font-weight: bold;
    font-size: 20px;
  }
}

.form-item-main {
  padding: 30px;
  font-size: 16px;
  box-sizing: border-box;
  section {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    .el-form-item {
      flex: 0 1 310px;
      margin-left: 12px;
      margin-right: 12px;
    }
    .el-cascader {
      width: 310px;
    }
  }
}

.img-box {
  position: relative;
  text-align: center;
  margin: 0 10px;
  img {
    display: block;
    object-fit: cover;
    position: relative;
    border-radius: 4px;
  }
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 30px;
  }
  .mode {
    top: 0;
    left: 0;
    opacity: 0;
    width: 136px;
    height: 136px;
    border-radius: 4px;
    position: absolute;
    line-height: 136px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    transition: 0.5s;
    span {
      margin: 0 5px;
      line-height: 136px;
      cursor: pointer;
    }
  }
  &:hover .mode {
    opacity: 1;
  }
}

.no-border {
  width: 150px;
  & /deep/ .el-input__inner {
    border: none;
    background-color: rgba(64, 158, 255, 0.75);
    color: #fff;
    height: 25px;
  }
  & /deep/ .el-select__caret {
    color: #fff;
  }
}
/deep/.el-dialog__footer {
  text-align: center;
}
/deep/.el-dialog{
  width:500px;
}
</style>
