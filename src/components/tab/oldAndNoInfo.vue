<template>
  <div class="main">
    <div class="old-content" style="border: #d7d7d7 solid 1px;">
      <ul>
        <li class="content-title">原公众号信息</li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>原公众号名称：</span>
              <span>{{ data.originalOfficialAccountName }}</span>
            </div>
            <div class="image">
              <span>公众号原始id：</span>
              <span>{{ data.originalOfficialAccountId }}</span>
            </div>
          </div>
        </li>
        <li v-if="Object.keys(administratorData).length > 0">
          <div class="basic-information">
            <div class="image">
              <span>账号扫码者姓名：</span>
              <span>{{ administratorData.realName }}</span>
            </div>
            <div class="image">
              <span>账号管理者身份证号：</span>
              <span>{{ administratorData.cardNum }}</span>
            </div>
          </div>
        </li>
        <li v-if="Object.keys(administratorData).length > 0">
          <div class="basic-information">
            <div class="image">
              <span>部门与职位：</span>
              <span>{{ administratorData.companyRelation }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="basic-information">
              <div class="image" style="display: flex;flex-flow: column;">
                <span style="padding-bottom: 10px;">原公众号后台主体信息页面：</span>
                <el-image :src="data.url" style="height: 108px;width: 192px;cursor: zoom-in;" @click="preview(data)" />
              </div>
              <div v-if="Object.keys(administratorData).length > 0" class="image" style="display: flex;flex-flow: column;">
                <span style="padding-bottom: 10px;">扫码管理者身份证照片：</span>
                <span style="display: flex;">
                  <div v-for="(item,index) in administratorData.orderProposerMaterialList" :key="index">
                    <el-image v-if="parseInt(item.materialCode)===1001" :src="item.url" style="cursor: zoom-in;height: 108px;width: 192px;margin-right: 10px;" @click="preview(item)" />
                    <el-image v-if="parseInt(item.materialCode)===1000" :src="item.url" style="cursor: zoom-in;height: 108px;width: 192px;margin-right: 10px;" @click="preview(item)" />
                  </div>
                </span>
              </div>
              <div v-if="Object.keys(administratorData).length==0&&parseInt(subjectData.organizationType) !== 0" class="image" style="display: flex;flex-flow: column;">
                <span style="padding-bottom: 10px;">公众号转让证明：</span>
                <span style="display: flex;">
                  <div v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index">
                    <el-image v-if="parseInt(item.materialCode)===1022" :src="item.url" style="cursor: zoom-in;height: 108px;width: 192px;margin-right: 10px;" @click="preview(item)" />
                  </div>
                </span>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div v-if="Object.keys(administratorData).length>0&&parseInt(subjectData.organizationType) !== 0" class="image" style="display: flex;flex-flow: column;">
            <span style="padding-bottom: 10px;">公众号转让证明：</span>
            <span style="display: flex;">
              <div v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index">
                <el-image v-if="parseInt(item.materialCode)===1022" :src="item.url" style="cursor: zoom-in;height: 108px;width: 192px;margin-right: 10px;" @click="preview(item)" />
              </div>
            </span>
          </div>
        </li>
      </ul>
      <!-- 当subjectData.organizationType为0时，申请人类型是个人，主体信息显示个人信息 -->
      <ul v-if="parseInt(subjectData.organizationType) === 0 || subjectData.organizationType == null">
        <li class="content-title">主体信息</li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>申请人类型：</span>
              <span>{{ subjectData.organizationType | transfereeType }}</span>
            </div>
            <div class="image">
              <span>姓名：</span>
              <span>{{ subjectData.realName }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>身份证号：</span>
              <span>{{ subjectData.cardNum }}</span>
            </div>
            <div class="image">
              <span>手机号：</span>
              <span>{{ subjectData.mobile }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>联系地址：</span>
              <span>{{ subjectData.detailAddress }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>CA证书序列号：</span>
              <span>{{ subjectData.caCode }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image"><span>身份证照片：</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index+36">
              <el-image v-if="parseInt(item.materialCode)===1012||parseInt(item.materialCode)===1001||parseInt(item.materialCode)===1010" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
              <el-image v-if="parseInt(item.materialCode)===1000||parseInt(item.materialCode)===1013||parseInt(item.materialCode)===1011" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
            </span>
          </div>
        </li>
      </ul>
      <!-- 当subjectData.organizationType为1时，申请人类型为内地企业，主体信息显示为内地企业信息 -->
      <ul v-if="parseInt(subjectData.organizationType) === 1">
        <li class="content-title">主体信息</li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>申请人类型：</span>
              <span>{{ subjectData.organizationType | transfereeType }}</span>
            </div>
            <div class="image">
              <span>企业名称：</span>
              <span>{{ subjectData.organizationName }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>企业联系方式：</span>
              <span>{{ subjectData.organizationPhone }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>统一社会信用代码：</span>
              <span>{{ subjectData.organizationCardNum }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>企业地址：</span>
              <span>{{ subjectData.organizationAddress }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image"><span>营业执照照片：</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <span v-for="(item, index) in subjectData.orderProposerMaterialList" :key="index">
              <el-image
                v-if="parseInt(item.materialCode) === 1016"
                :src="item.url"
                style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;"
                @click="preview(item)"
              />
            </span>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>法定代表人姓名：</span>
              <span>{{ subjectData.realName }}</span>
            </div>
            <div class="image">
              <span>身份证号：</span>
              <span>{{ subjectData.cardNum }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>法定代表人联系方式：</span>
              <span>{{ subjectData.mobile }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>CA证书序列号：</span>
              <span>{{ subjectData.caCode }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image"><span>身份证照片：</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index+13">
              <el-image v-if="parseInt(item.materialCode)===1012||parseInt(item.materialCode)===1001||parseInt(item.materialCode)===1010" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
              <el-image v-if="parseInt(item.materialCode)===1000||parseInt(item.materialCode)===1013||parseInt(item.materialCode)===1011" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
            </span>
          </div>
        </li>
      </ul>

      <!-- 当subjectData.organizationType为2时，申请人类型为香港企业，主体信息显示为香港企业信息 -->
      <ul v-if="parseInt(subjectData.organizationType) === 2">
        <li class="content-title">主体信息</li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>申请人类型：</span>
              <span>{{ subjectData.organizationType | transfereeType }}</span>
            </div>
            <div class="image">
              <span>企业名称：</span>
              <span>{{ subjectData.organizationName }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>企业注册编码：</span>
              <span>{{ subjectData.organizationCardNum }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>企业联系方式：</span>
              <span>{{ subjectData.organizationPhone }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>企业地址：</span>
              <span>{{ subjectData.organizationAddress }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>董事姓名：</span>
              <span>{{ subjectData.realName }}</span>
            </div>
            <div class="image">
              <span>董事联系方式：</span>
              <span>{{ subjectData.mobile }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>证件类型：</span>
              <span>{{ subjectData.cardType | cardNumType }}</span>
            </div>
            <div class="image">
              <span>证件号码：</span>
              <span>{{ subjectData.cardNum }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>CA证书序列号：</span>
              <span>{{ subjectData.caCode }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image"><span>身份证照片：</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index+39">
              <el-image v-if="parseInt(item.materialCode)===1012||parseInt(item.materialCode)===1001||parseInt(item.materialCode)===1010" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
            </span>
            <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index+59">
              <el-image v-if="parseInt(item.materialCode)===1000||parseInt(item.materialCode)===1013||parseInt(item.materialCode)===1011" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
            </span>
          </div>
        </li>
      </ul>

      <!-- <ul>
        <li class="content-title">主体信息</li>
        <li>
          <div class="basic-information">
            <div class="image"><span>申请人类型：</span><span>{{ subjectData.organizationType|transfereeType }}</span></div>
            <div v-if="subjectData.organizationType==0" class="image">
              <span>姓名：</span>
              <span>{{ subjectData.realName }}</span>
            </div>
            <div v-if="subjectData.organizationType==1||subjectData.organizationType==2" class="image">
              <span>企业名称：</span>
              <span>{{ subjectData.organizationName }}</span>
            </div>
          </div>
        </li>
        <li v-if="subjectData.organizationType==0||subjectData.organizationType==null||subjectData.organizationType==''">
          <div class="basic-information">
            <div class="image"><span>身份证号：</span><span>{{ subjectData.cardNum }}</span></div>
            <div class="image"><span>手机号：</span><span>{{ subjectData.mobile }}</span></div>
          </div>
        </li>
        <li v-if="subjectData.organizationType==0||subjectData.organizationType==null||subjectData.organizationType==''">
          <div class="basic-information">
            <div class="image"><span>联系地址：</span><span>{{ subjectData.detailAddress }}</span></div>
          </div>
        </li>
        <li v-if="subjectData.organizationType==1||subjectData.organizationType==2">
          <div class="basic-information">
            <div v-if="subjectData.organizationType==1" class="image"><span>统一社会信用代码：</span><span>{{ subjectData.organizationCardNum }}</span></div>
            <div v-if="subjectData.organizationType==2" class="image"><span>企业注册编码：</span><span>{{ subjectData.organizationCardNum }}</span></div>
          </div>
        </li>
        <li v-if="subjectData.organizationType==1||subjectData.organizationType==2">
          <div class="basic-information">
            <div class="image"><span>企业联系方式：</span><span>{{ subjectData.organizationPhone }}</span></div>
            <div class="image">
              <span>企业地址：</span>
              <span>{{ subjectData.organizationAddress }}</span>
            </div>
          </div>
        </li>
        <li v-if="subjectData.organizationType==1" style="display: flex;flex-flow: column;">
          <span>营业执照照片：</span>
          <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index">
            <el-image v-if="parseInt(item.materialCode)===1016" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
          </span>
        </li>
        <li v-if="subjectData.organizationType==2">
          <div class="basic-information">
            <div class="image"><span>懂事姓名：</span><span>{{ subjectData.realName }}</span></div>
            <div class="image"><span>懂事联系方式：</span><span>{{ subjectData.mobile }}</span></div>
          </div>
        </li>
        <li v-if="subjectData.organizationType==2">
          <div class="basic-information">
            <div class="image"><span>证件类型：</span><span>{{ subjectData.cardType|cardNumType }}</span></div>
          </div>
        </li>
        <li v-if="subjectData.organizationType==2">
          <div class="basic-information">
            <div class="image"><span>证件号码：</span><span>{{ subjectData.cardNum }}</span></div>
          </div>
        </li>
        <li v-if="subjectData.organizationType==1">
          <div class="basic-information">
            <div class="image"><span>法定代表人姓名：</span><span>{{ subjectData.realName }}</span></div>
            <div class="image"><span>身份证号：</span><span>{{ subjectData.cardNum }}</span></div>
          </div>
        </li>
        <li v-if="subjectData.organizationType==1">
          <div class="basic-information">
            <div class="image"><span>法定代表人联系方式：</span><span>{{ subjectData.mobile }}</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image"><span>CA证书序列号：</span><span>{{ subjectData.caCode }}</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image"><span>身份证照片：</span></div>
          </div>
        </li>
        <li>
          <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index">
            <el-image v-if="parseInt(item.materialCode)===1000||parseInt(src.materialCode)===1012||parseInt(src.materialCode)===1013||parseInt(item.materialCode)===1001||parseInt(src.materialCode)===1010||parseInt(src.materialCode)===1011" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
          </span>

        </li>
      </ul> -->

      <ul v-if="Object.keys(authorizationData).length > 0">
        <li class="content-title">授权信息</li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>受托人姓名：</span>
              <span>{{ authorizationData.realName }}</span>
            </div>
            <div class="image">
              <span>受托人身份证号：</span>
              <span>{{ authorizationData.cardNum }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>受托人联系方式：</span>
              <span>{{ authorizationData.mobile }}</span>
            </div>
            <div class="image">
              <span>CA证书序列号：</span>
              <span>{{ authorizationData.caCode }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image" style="display: flex;flex-flow: column;">
              <span style="padding-bottom: 10px;">授权书：</span>
              <span>
                <span v-for="(item, index) in authorizationData.orderProposerMaterialList" :key="index + 10">
                  <el-image
                    v-if="parseInt(item.materialCode) === 1020"
                    :src="item.url"
                    style="height: 108px;width: 192px;margin-right: 10px;cursor: zoom-in; "
                    @click="preview(item)"
                  />
                </span>
              </span>
            </div>
            <div class="image" style="display: flex;flex-flow: column;">
              <span style="padding-bottom: 10px;">身份证照片：</span>
              <span>
                <span v-for="(item,index) in authorizationData.orderProposerMaterialList" :key="index+10">
                  <el-image v-if="parseInt(item.materialCode)===1001" :src="item.url" style="cursor: zoom-in; height: 108px;width: 192px;margin-right: 10px;" @click="preview(item)" />
                  <el-image v-if="parseInt(item.materialCode)===1000" :src="item.url" style="cursor: zoom-in; height: 108px;width: 192px;margin-right: 10px;" @click="preview(item)" />
                </span>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getOldAndNo, previewMaterials } from '../../api/details.js'
export default {
  filters: {
    // 企业类型过滤器
    transfereeType(val) {
      var str = ''
      if (val === null || val === '' || val === 0) {
        str = '个人'
      } else if (val === 1) {
        str = '内地企业'
      } else if (val === 2) {
        str = '香港企业'
      }
      return str
    },
    // 证件类型过滤器
    cardNumType(val) {
      var str = ''
      if (parseInt(val) === 116) {
        str = '香港居民居住证'
      } else if (parseInt(val) === 118) {
        str = '港澳居民通行证'
      }
      return str
    }
  },
  data() {
    return {
      orderId: null,
      data: '',
      // 主体信息
      subjectData: {},
      // 授权信息
      authorizationData: {},
      // 管理员信息
      administratorData: {}
    }
  },
  created() {
    this.orderId = this.$route.query.orderId
    getOldAndNo({ orderId: this.orderId }).then(async res => {
      console.log(res, '原公众号数据')
      for (let i = 0; i < res.data.orderProposerReDTOList.length; i++) {
        // orderProposerReDTOList数组中的proposerType值为3时,该条数据为主体信息
        if (parseInt(res.data.orderProposerReDTOList[i].proposerType) === 3 || parseInt(res.data.orderProposerReDTOList[i].proposerType) === 4) {
          this.subjectData = res.data.orderProposerReDTOList[i]
          // orderProposerReDTOList数组中的proposerType值为6时,该条数据为管理员信息
        }
        if (parseInt(res.data.orderProposerReDTOList[i].proposerType) === 6) {
          this.administratorData = res.data.orderProposerReDTOList[i]
          // orderProposerReDTOList数组中的proposerType值为8时候,该条数据为授权信息
        }
        if (parseInt(res.data.orderProposerReDTOList[i].proposerType) === 8) {
          this.authorizationData = res.data.orderProposerReDTOList[i]
        }
      }
      this.data = res.data
      this.data.url = ''
      // 获取原公众号后台主体信息页面的图片的url
      const urlObj = await previewMaterials({ id: res.data.officialAccountMaterial })
      // previewMaterials({ id: res.data.officialAccountMaterial }).then(res => {
      this.data.url = 'data:image/png;base64,' + urlObj.data
      // })
      // 循环获取主体信息中材料集合中图片的url
      for (let i = 0; i < this.subjectData.orderProposerMaterialList.length; i++) {
        const imgObj = await previewMaterials({ id: this.subjectData.orderProposerMaterialList[i].id })
        // .then(res => {
        this.subjectData.orderProposerMaterialList[i].url = 'data:image/png;base64,' + imgObj.data
        // })
      }
      // 判断是否存在管理员信息
      if (Object.keys(this.administratorData).length > 0) {
        // 循环获取管理员信息材料集合中图片的url
        for (let i = 0; i < this.administratorData.orderProposerMaterialList.length; i++) {
          // previewMaterials({ id: this.administratorData.orderProposerMaterialList[i].id }).then(res => {
          const urlObj = await previewMaterials({ id: this.administratorData.orderProposerMaterialList[i].id })
          this.administratorData.orderProposerMaterialList[i].url = 'data:image/png;base64,' + urlObj.data
          // })
        }
      }
      // 判断是否存在授权信息
      if (Object.keys(this.authorizationData).length > 0) {
        // 存在授权信息时,循环获取授权信息材料集合中图片的url
        let urlObj = ''
        for (let i = 0; i < this.authorizationData.orderProposerMaterialList.length; i++) {
          // previewMaterials({ id: this.authorizationData.orderProposerMaterialList[i].id }).then(res => {
          //   this.authorizationData.orderProposerMaterialList[i].url = 'data:image/png;base64,' + res.data
          // })
          urlObj = await previewMaterials({ id: this.authorizationData.orderProposerMaterialList[i].id })
          this.authorizationData.orderProposerMaterialList[i].url = 'data:image/png;base64,' + urlObj.data
        }
      }
      console.log(this.subjectData, '主体信息', this.administratorData, '管理员信息', this.authorizationData, '授权信息')
    })
  },
  methods: {
    // 点击图片后预览图片
    preview(e) {
      var list = []
      list.push(e.url)
      this.$store.commit('app/CHANGE_IMAGE', list)
    }
  }
}
</script>

<style lang="less" scoped>
ul,
li,
p {
  margin: 0;
  padding: 0;
}
span {
  color: #333;
  font-size: 14px;
}
li {
  list-style: none;
}
/deep/ .el-image__inner{
    height: 128px;
    width: 192px;
    object-fit: contain;

    // background: #eee;
   }
   .el-image{
     border: solid #eee 1px;
   }
.main{
  margin-bottom: 50px;
  .old-content{

    &>ul{
      margin-bottom: 30px;
      .content-title {
        padding: 15px 20px;
        background: #e6f6fe;
        font-weight: bold;
        color: #666;
      }
      li {
        padding-top: 10px;
        padding-left: 20px;
        .basic-information {
          display: flex;
          flex-wrap: wrap;
          & .image {
            min-width: 300px;
          }
        }
      }
    }
  }
}
</style>
