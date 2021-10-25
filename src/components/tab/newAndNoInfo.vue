<template>
  <div class="main">
    <div class="old-content" style="border: #d7d7d7 solid 1px;">
      <ul>
        <li class="content-title">目标公众号信息</li>
        <li>
          <div class="basic-information">
            <div class="image">
              <span>目标公众号名称：</span>
              <span>{{ data.targetOfficialAccountName }}</span>
            </div>
            <div class="image">
              <span>公众号原始id：</span>
              <span>{{ data.targetOfficialAccountId }}</span>
            </div>
          </div>
        </li>
        <!-- 判断管理员信息是否为空，为空时，不展示管理员信息 -->
        <li v-if="Object.keys(administratorData).length > 0">
          <div class="basic-information">
            <div class="image">
              <span>账号扫码管理者姓名：</span>
              <span>{{ administratorData.realName }}</span>
            </div>
            <div class="image">
              <span>账号管理者身份证号码：</span>
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
            <div class="image" style="display: flex;flex-flow: column;">
              <span style="padding-bottom: 10px;">目标公众号后台主体信息页面：</span>
              <el-image :src="data.url" style="height: 108px;width: 192px;cursor: zoom-in; " @click="preview(data)" />
            </div>
            <div class="image" style="display: flex;flex-flow: column;">
              <span style="padding-bottom: 10px;">管理者身份证照片：</span>
              <span style="display: flex;">
                <div v-for="(item,index) in administratorData.orderProposerMaterialList" :key="index+6">
                  <el-image v-if="parseInt(item.materialCode)===1001" :src="item.url" style="cursor: zoom-in;height: 108px;width: 192px;margin-right: 10px;" @click="preview(item)" />
                </div>
                <div v-for="(item,index) in administratorData.orderProposerMaterialList" :key="index+12">
                  <el-image v-if="parseInt(item.materialCode)===1000" :src="item.url" style="cursor: zoom-in;height: 108px;width: 192px;margin-right: 10px;" @click="preview(item)" />
                </div>
              </span>
            </div>
          </div>
        </li>
      </ul>

      <!-- organizationType为0或为null时，申请人类型为个人，主体信息展示位个人信息 -->
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
            <div class="image" style="max-width: 600px;">
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
            <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index">
              <el-image v-if="parseInt(item.materialCode)===1012||parseInt(item.materialCode)===1001||parseInt(item.materialCode)===1010" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
            </span>
            <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index+3">
              <el-image v-if="parseInt(item.materialCode)===1000||parseInt(item.materialCode)===1013||parseInt(item.materialCode)===1011" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
            </span>
          </div>
        </li>
      </ul>

      <!-- organizationType为1时，申请人类型为内地企业，主体信息展示内地企业信息 -->
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
            <div class="image" style="max-width: 600px;">
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
            <div class="image" style="max-width:600px;">
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
            <span v-for="(item, index) in subjectData.orderProposerMaterialList" :key="index">
              <el-image
                v-if="
                  parseInt(item.materialCode) === 1000 ||
                    parseInt(item.materialCode) === 1012 ||
                    parseInt(item.materialCode) === 1013 ||
                    parseInt(item.materialCode) === 1001 ||
                    parseInt(item.materialCode) === 1010 ||
                    parseInt(item.materialCode) === 1011
                "
                :src="item.url"
                style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;"
                @click="preview(item)"
              />
            </span>
          </div>
        </li>
      </ul>

      <!-- organizationType的值为2时，申请人类型为香港企业，主体信息显示香港企业信息 -->
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
            <div class="image" style="max-width: 600px;">
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
            <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index">
              <el-image v-if="parseInt(item.materialCode)===1012||parseInt(item.materialCode)===1001||parseInt(item.materialCode)===1010" :src="item.url" style="cursor: zoom-in;height: 108px;margin-right: 10px; width: 192px;" @click="preview(item)" />
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
            <div class="image"><span>企业名称：</span><span>{{ subjectData.organizationName }}</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image"><span>统一社会信用代码：</span><span>{{ subjectData.organizationCardNum }}</span></div>
            <div class="image"><span>企业联系电话：</span><span>{{ subjectData.organizationPhone }}</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image" style="max-width: 600px;">
              <span v-if="subjectData.organizationType==null||subjectData.organizationType==''||subjectData.organizationType==0">联系地址：{{ subjectData.detailAddress }}</span>
              <span v-else>联系地址：{{ subjectData.organizationAddress }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image"><span>姓名：</span><span>{{ subjectData.realName }}</span></div>
            <div class="image"><span>身份证号：</span><span>{{ subjectData.cardNum }}</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image"><span>手机号：</span><span>{{ subjectData.mobile }}</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image" style="min-width: 600px;"><span>CA证书序列号：</span><span>{{ subjectData.caCode }}</span></div>
          </div>
        </li>
        <li>
          <div class="basic-information">
            <div class="image" style="display: flex;flex-flow: column;">
              <span style="padding-bottom: 10px;">营业执照：</span>
              <span>
                <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index+10" style="display: flex;">
                  <el-image v-if="parseInt(item.materialCode)===1016" :src="item.url" style="height: 108px;width: 192px;cursor: zoom-in; " @click="preview(item)" />
                </span>
              </span>
            </div>
            <div class="image" style="display: flex;flex-flow: column;">
              <span style="padding-bottom: 10px;">身份证照片：</span>
              <span>
                <span v-for="(item,index) in subjectData.orderProposerMaterialList" :key="index+10">
                  <el-image v-if="parseInt(item.materialCode)===1000||parseInt(item.materialCode)===1001||parseInt(item.materialCode)===1010||parseInt(item.materialCode)===1011" style="height: 108px;width: 192px;margin-right: 10px;cursor: zoom-in; " :src="item.url" @click="preview(item)" />
                </span>
              </span>
            </div>
          </div>
        </li>
      </ul> -->

      <!-- 判断授权信息是否为空,授权信息为空时,不加载授权信息 -->
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
            <div style="display: flex;flex-flow: column;" class="image">
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
            <div style="display: flex;flex-flow: column;max-width: 600px;" class="image">
              <span style="padding-bottom: 10px;">身份证照片：</span>
              <span>
                <span v-for="(item,index) in authorizationData.orderProposerMaterialList" :key="index+10">
                  <el-image v-if="parseInt(item.materialCode)===1001" :src="item.url" style="cursor: zoom-in; height: 108px;width: 192px;margin-right: 10px;" @click="preview(item)" />
                </span>
                <span v-for="(item,index) in authorizationData.orderProposerMaterialList" :key="index+16">
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
import { getNewAndNo, previewMaterials } from '../../api/details.js'
export default {
  filters: {
    // 申请人类型过滤器
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
    // 申请人类型过滤器
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
      // 订单id
      orderId: null,
      // 主体信息数据
      subjectData: {},
      // 管理员信息数据
      administratorData: {},
      // 授权信息数据
      authorizationData: {},
      data: {}
    }
  },
  created() {
    // 获取路由中的订单id
    this.orderId = this.$route.query.orderId
    // 获取目标目标公众号信息
    getNewAndNo({ orderId: this.orderId }).then(async res => {
      console.log(res, '目标公众号信息')
      this.data = res.data
      // 遍历关系人数组(orderProposerReDTOList)
      for (let i = 0; i < res.data.orderProposerReDTOList.length; i++) {
        // proposerType的为5时,该条数据是主体信息数据
        if (parseInt(res.data.orderProposerReDTOList[i].proposerType) === 5) {
          this.subjectData = res.data.orderProposerReDTOList[i]
          // proposerType的值为7时,该条数据是管理员信息数据
        }
        if (parseInt(res.data.orderProposerReDTOList[i].proposerType) === 7) {
          this.administratorData = res.data.orderProposerReDTOList[i]
          // proposerType的值为9时,该条数据是授权信息数据
        }
        if (parseInt(res.data.orderProposerReDTOList[i].proposerType) === 9) {
          this.authorizationData = res.data.orderProposerReDTOList[i]
        }
      }
      this.data = res.data
      this.data.url = ''
      // 获取目标公众号信息中原公众号后台主体信息页面图片的url
      const a = await previewMaterials({ id: res.data.officialAccountMaterial })
      // previewMaterials({ id: res.data.officialAccountMaterial }).then(res => {
      this.data.url = 'data:image/png;base64,' + a.data
      // console.log(res, '图片地址')
      // })
      // 循环主体信息中材料信息集合orderProposerMaterialList,获取材料集合中图片的url
      for (let i = 0; i < this.subjectData.orderProposerMaterialList.length; i++) {
        const obj = await previewMaterials({ id: this.subjectData.orderProposerMaterialList[i].id })
        // previewMaterials({ id: this.subjectData.orderProposerMaterialList[i].id }).then(res => {
        this.subjectData.orderProposerMaterialList[i].url = 'data:image/png;base64,' + obj.data
        // })
      }
      // 判断管理员信息数据是否为空
      if (Object.keys(this.administratorData).length > 0) {
        // 管理员信息数据不为空时,获取管理员信息中材料集合的图片的url
        for (let i = 0; i < this.administratorData.orderProposerMaterialList.length; i++) {
          const u = await previewMaterials({ id: this.administratorData.orderProposerMaterialList[i].id })
          // previewMaterials({ id: this.administratorData.orderProposerMaterialList[i].id }).then(res => {
          this.administratorData.orderProposerMaterialList[i].url = 'data:image/png;base64,' + u.data
          // })
        }
      }
      // 判断授权信息数据是否为空
      if (Object.keys(this.authorizationData).length > 0) {
        // 授权信息不为空时,获取授权信息中材料集合中图片的url
        for (let i = 0; i < this.authorizationData.orderProposerMaterialList.length; i++) {
          const y = await previewMaterials({ id: this.authorizationData.orderProposerMaterialList[i].id })
          // previewMaterials({ id: this.authorizationData.orderProposerMaterialList[i].id }).then(res => {
          this.authorizationData.orderProposerMaterialList[i].url = 'data:image/png;base64,' + y.data
          // })
        }
      }
      console.log(this.subjectData, '主体信息', this.administratorData, '管理员信息', this.authorizationData, '授权信息')
    })
  },
  methods: {
    // 点击图片预览
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
    border: solid #eee 1px;
    // background: #eee;
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
        color: #333;
      }
      li {
        padding-top: 10px;
        padding-left: 20px;
        .basic-information {
          display: flex;
          & .image {
            min-width: 400px;
            max-width: 400px;
            // overflow: hidden;  /*超出部分隐藏*/
            white-space: nowrap;  /*禁止换行*/
            // text-overflow: ellipsis; /*省略号*/
            & span{
              // font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
