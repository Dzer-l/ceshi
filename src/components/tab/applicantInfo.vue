<template>
  <div class="applicant_main">
    <div style="padding-bottom: 20px;">
      <div class="title">
        <p class="font-title">申请人信息</p>
      </div>
      <div class="cont_list">
        <div>

          <!-- 当organizationType=0时，显示的为个人的信息 -->
          <ul v-if="proposerInfo.organizationType==0">
            <li>
              <div style="min-width: 400px;">
                <p style="margin-bottom: 15px;"><span>申请人类型：</span><span>{{ proposerInfo.organizationType|type }}</span></p>
                <p><span>身份证号：</span><span>{{ proposerInfo.cardNum }}</span></p>
              </div>
              <div style="min-width: 400px;">
                <p style="margin-bottom: 15px;"><span>姓名：</span><span>{{ proposerInfo.realName }}</span></p>
                <p><span>手机号：</span><span>{{ proposerInfo.mobile }}</span></p>
              </div>
            </li>
            <li>
              <p><span>联系地址：</span><span>{{ proposerInfo.detailAddress }}</span></p>
            </li>
            <li>
              <p style="max-width: 600px;"><span>CA证书序列号：</span><span>{{ proposerInfo.caCode }}</span></p>
            </li>
            <li>身份证照片：</li>
            <li>
              <div class="basic-information">
                <div
                  v-for="(src,index) in proposerInfo.orderProposerMaterialList"
                  :key="index"
                >
                  <el-image
                    v-if="parseInt(src.materialCode)===1001"
                    :src="src.url"
                    style="margin-right: 10px;cursor: zoom-in;"
                    @click="preview(src)"
                  />
                </div>
                <div
                  v-for="(src,index) in proposerInfo.orderProposerMaterialList"
                  :key="index+3"
                >
                  <el-image
                    v-if="parseInt(src.materialCode)===1000"
                    :src="src.url"
                    style="margin-right: 10px;cursor: zoom-in;"
                    @click="preview(src)"
                  />
                </div>
              </div>
            </li>
          </ul>

          <!-- 当organizationType=1时，显示的为内地企业的信息数据 -->
          <ul v-if="proposerInfo.organizationType==1">
            <li>
              <div class="basic-information">
                <div class="image"><span>申请人类型：</span><span>{{ proposerInfo.organizationType|type }}</span></div>
                <div class="image"><span>企业名称：</span><span>{{ proposerInfo.organizationName }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>统一社会信用代码：</span><span>{{ proposerInfo.organizationCardNum }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>企业联系方式：</span><span>{{ proposerInfo.organizationPhone }}</span></div>
                <div
                  class="image"
                  style="max-width: 600px;display: flex;"
                ><span style="white-space: nowrap;">企业地址 ：</span><span>{{ proposerInfo.organizationAddress }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>营业执照照片：</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div
                  v-for="(src,index) in proposerInfo.orderProposerMaterialList"
                  :key="index"
                >
                  <el-image
                    v-if="parseInt(src.materialCode)===1016"
                    :src="src.url"
                    style="width: 192px;height: 108px;margin-right: 10px;cursor: zoom-in;"
                    @click="preview(src)"
                  />
                </div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>法定代表人姓名：</span><span>{{ proposerInfo.realName }}</span></div>
                <div class="image"><span>身份证号：</span><span>{{ proposerInfo.cardNum }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>法定代表人联系方式：</span><span>{{ proposerInfo.mobile }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div
                  class="image"
                  style="max-width: 600px;"
                ><span>CA证书序列号：</span><span>{{ proposerInfo.caCode }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>身份证照片：</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div
                  v-for="(src,index) in proposerInfo.orderProposerMaterialList"
                  :key="index"
                >
                  <el-image
                    v-if="parseInt(src.materialCode)===1001"
                    :src="src.url"
                    style="margin-right: 10px;cursor: zoom-in;"
                    @click="preview(src)"
                  />
                </div>
                <div
                  v-for="(src,index) in proposerInfo.orderProposerMaterialList"
                  :key="index+3"
                >
                  <el-image
                    v-if="parseInt(src.materialCode)===1000"
                    :src="src.url"
                    style="margin-right: 10px;cursor: zoom-in;"
                    @click="preview(src)"
                  />
                </div>
              </div>
            </li>
          </ul>

          <!-- organizationType=2时，显示的为香港企业信息的数据 -->
          <ul v-if="proposerInfo.organizationType==2">
            <li>
              <div class="basic-information">
                <div class="image"><span>申请人类型：</span><span>{{ proposerInfo.organizationType|type }}</span></div>
                <div class="image"><span>企业名称：</span><span>{{ proposerInfo.organizationName }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>企业注册编码：</span><span>{{ proposerInfo.organizationCardNum }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>企业联系方式：</span><span>{{ proposerInfo.organizationPhone }}</span></div>
                <div class="image"><span>企业地址 ：</span><span>{{ proposerInfo.organizationAddress }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>董事姓名：</span><span>{{ proposerInfo.realName }}</span></div>
                <div class="image"><span>董事联系方式：</span><span>{{ proposerInfo.mobile }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>证件类型：</span><span>{{ proposerInfo.cardType|cardNumType }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>证件号码：</span><span>{{ proposerInfo.cardNum }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div
                  class="image"
                  style="max-width: 600px;"
                ><span>CA证书序列号：</span><span>{{ proposerInfo.caCode }}</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div class="image"><span>身份证照片：</span></div>
              </div>
            </li>
            <li>
              <div class="basic-information">
                <div
                  v-for="(src,index) in proposerInfo.orderProposerMaterialList"
                  :key="index"
                >
                  <el-image
                    v-if="parseInt(src.materialCode)===1001||parseInt(src.materialCode)===1010||parseInt(src.materialCode)===1012"
                    :src="src.url"
                    style="margin-right: 10px;cursor: zoom-in;"
                    @click="preview(src)"
                  />
                </div>
                <div
                  v-for="(src,index) in proposerInfo.orderProposerMaterialList"
                  :key="index+3"
                >
                  <el-image
                    v-if="parseInt(src.materialCode)===1000||parseInt(src.materialCode)===1011||parseInt(src.materialCode)===1013"
                    :src="src.url"
                    style="margin-right: 10px;cursor: zoom-in;"
                    @click="preview(src)"
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 受让人信息展示 -->
      <div class="title">
        <p class="font-title">受让人信息</p>
      </div>
      <div class="cont_list">
        <div>
          <ul>
            <li>
              <div style="min-width: 400px;">
                <p style="margin-bottom: 15px;"><span>受让人类型：</span><span>{{ assigneeInfo.transfereeType|transfereeType }}</span></p>
                <p><span>证件号码：</span><span v-if="assigneeInfo.transfereeType==1">{{ assigneeInfo.cardNum }}</span><span v-else>{{ assigneeInfo.organizationCardNum }}</span></p>
              </div>
              <div style="min-width: 400px;">
                <p style="margin-bottom: 20px;"><span>受让人：</span><span v-if="assigneeInfo.transfereeType==1">{{ assigneeInfo.realName }}</span><span v-else>{{ assigneeInfo.organizationName }}</span></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getApplicantInfo, previewMaterials } from '../../api/details.js'
export default {
  filters: {
    // 申请人类型过滤器
    type(val) {
      var str = ''
      if (val === '' || val === null || val === 0) {
        str = '个人'
      } else if (val === 1) {
        str = '内地企业'
      } else if (val === 2) {
        str = '香港企业'
      }
      return str
    },
    // 受让人类型过滤器
    transfereeType(val) {
      var str = ''
      if (val === 1) {
        str = '个人'
      } else {
        str = '企业'
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
      // 订单ID
      orderId: null,
      // 相关信息集合
      data: {},
      // 受让人信息数据
      assigneeInfo: {},
      // 申请人信息数据
      proposerInfo: {},
      // 图片地址集合
      imgData: []
    }
  },
  mounted() {
    // 初始加载赋值给页面的订单ID
    this.orderId = this.$route.query.orderId
    // 调用初始渲染页面数据的函数
    this.getData()
  },
  methods: {
    // 初始渲染页面的函数
    getData() {
      this.imgData = []
      var data = { orderId: this.orderId }

      // 获取申请人信息数据
      getApplicantInfo(data).then(async(res) => {
        this.data = res.data
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].proposerType = parseInt(this.data[i].proposerType)

          // 当data中的数据的proposerType为10时,该数据为受让人信息数据
          if (this.data[i].proposerType === 10) {
            this.assigneeInfo = this.data[i]

            // 当data中的数据的proposerType为0时,该数据为申请人信息数据
          } else if (this.data[i].proposerType === 0) {
            this.proposerInfo = this.data[i]
          }
        }
        for (let i = 0; i < this.proposerInfo.orderProposerMaterialList.length; i++) {
          // 获取到申请人信息和受让人信息中图片的id
          var data = { id: this.proposerInfo.orderProposerMaterialList[i].id }

          // 获取用于图片展示的url
          const urlObj = await previewMaterials(data)
          //  .then((res) => {
          // if (res.data != null) {
          // 图片地址初始值为base64,给每个url转化成可渲染的地址
          this.proposerInfo.orderProposerMaterialList[i].url = 'data:image/png;base64,' + urlObj.data
          this.imgData.push('data:image/png;base64,' + urlObj.data)
          // }
          // })
        }
        console.log(this.data, '申请人信息数据')
      })
    },
    // 点击图片后预览图片
    preview(e) {
      var list = []
      // 将图片的url存入一个数组中
      list.push(e.url)
      // 将数组存入到vuex中在app.vue中调用预览
      this.$store.commit('app/CHANGE_IMAGE', list)
    }
  }
}
</script>

<style lang="less" scoped>
p,
ul {
  padding: 0;
  margin: 0;
  color: #333;
}
li {
  list-style: none;
}
/deep/ .el-image__inner {
  height: 128px;
  width: 192px;
  object-fit: contain;
  border: solid #eee 1px;
  // background: #eee;
}
.font-title {
  font-size: 14px !important;
  color: #333 !important;
}
.applicant_main {
  border: 1px solid #d7d7d7;
  margin: 10px 30px;
  font-size: 14px;
  margin-bottom: 50px;
  .title {
    background-color: #e6f6fe;
    height: 50px;
    display: flex;
    align-items: center;
    p {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bolder;
      line-height: 21px;
      color: #333333;
      padding-left: 20px;
    }
  }
  .cont_list {
    padding: 0 20px;
    & ul {
      & li {
        display: flex;
        margin: 15px 0;
        & > div {
          margin-right: 20px;
        }
        .id_card_image {
          border: dashed #d7d7d7 1px;
        }
        .basic-information {
          display: flex;
          // flex-wrap: wrap;
          & .image {
            min-width: 400px;
            max-width: 400px;
            // overflow: hidden;  /*超出部分隐藏*/
            // white-space: nowrap;  /*禁止换行*/
            // text-overflow: ellipsis; /*省略号*/
            & span {
              // font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
