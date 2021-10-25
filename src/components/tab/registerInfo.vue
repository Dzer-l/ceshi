<template>
  <div class="register_main">
    <div style="padding-bottom: 20px;">
      <div class="title"><p>商标登记信息</p></div>
      <div class="cont_list">
        <div class="cont">
          <div>
            <p>
              <span>商品名称：</span>
              <span>{{ data.trademarkName }}</span>
            </p>
            <p>
              <span>商标状态：</span>
              <span>{{ data.trademarkStatus | brandSta }}</span>
            </p>
          </div>
          <div>
            <p style="width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
              <span>商标类别：</span>
              <span>{{ string }}</span>
            </p>
            <p>
              <span>注册号(申请号)：</span>
              <span>{{ data.registrationNum }}</span>
            </p>
          </div>
        </div>
        <div>
          <p style="line-height: 30px;" v-if="data.trademarkStatus === 1">商标注册证:</p>
          <p style="line-height: 30px;" v-if="data.trademarkStatus === 0">受理通知书:</p>
          <div class="image">
            <div v-for="(item, index) in data.trademarkMaterialList" :key="index">
              <el-image v-if="parseInt(item.materialCode) === 1008" :src="item.url" style="width: 192px;height: 108px;cursor: zoom-in;" @click="previewImage(item)" />
              <el-image v-if="parseInt(item.materialCode) === 1009" :src="item.url" style="width: 192px;height: 108px;cursor: zoom-in;" @click="previewImage(item)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getReginsterData, previewMaterials } from '../../api/details.js';
export default {
  filters: {
    // 商标状态过滤器
    brandSta(val) {
      var str = '';
      if (val === 0) {
        str = '未完成注册';
      } else {
        if (val === 1) {
          str = '已注册';
        }
      }
      return str;
    }
  },
  data() {
    return {
      // 订单ID
      orderId: null,
      // 商标登记信息数据
      data: {},
      // 商标类别的字符串
      string: ''
    };
  },
  mounted() {
    // 给页面的订单id赋值为路由传递的订单id
    this.orderId = this.$route.query.orderId;
    // 调用初始渲染页面需要的信息数据的函数
    this.getData();
  },
  methods: {
    // 获取初始页面商标登记信息的函数
    getData() {
      var data = { orderId: this.orderId };
      // 获取商标登记信息数据
      getReginsterData(data).then(res => {
        // 初始商标类别数据为数组,将其转化成字符串的形式
        for (let i = 0; i < res.data.trademarkCategoryNames.length; i++) {
          this.string += res.data.trademarkCategoryNames[i] + '，';
        }
        // 字符串拼接,字符串最后一位是'，',将其处理
        this.string = this.string.slice(0, this.string.length - 1);
        // 将返回的数据赋值给data
        this.data = res.data;
        console.log(this.data, '登记信息数据');
        // 获取到要展示的图片的id
        for (let i = 0; i < this.data.trademarkMaterialList.length; i++) {
          var data = { id: this.data.trademarkMaterialList[i].id };
          // 获取图片的url
          previewMaterials(data).then(res => {
            console.log(res, '获取图片url');
            if (res.data != null) {
              // 获取到的url为base64,处理成可展示的url
              this.data.trademarkMaterialList[i].url = 'data:image/png;base64,' + res.data;
            }
          });
        }
      });
    },
    async getImg(id, type) {
      const url = type == 1 ? `org/order-document-preview-img/${id}` : `org/order-proposer-material-preview-img?id=${id}`;
      return await this.$axios(url).then(async res => {
        if (res.success) {
          return 'data:image/png;base64,' + res.data;
        }
      });
    },
    // 点击图片预览
    previewImage(e) {
      var list = [];
      list.push(e.url);
      this.$store.commit('app/CHANGE_IMAGE', list);
    }
  }
};
</script>

<style lang="less" scoped>
p {
  margin: 0;
  color: #333;
}
.register_main {
  border: 1px solid #d7d7d7;
  margin: 10px 30px;
  .title {
    background-color: #e6f6fe;
    height: 50px;
    display: flex;
    align-items: center;
    p {
      height: 21px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bolder;
      line-height: 21px;
      color: #333333 !important;
      padding-left: 20px;
    }
  }
  .cont_list {
    padding: 10px 20px;
    .cont {
      display: flex;
      & > div {
        min-width: 400px;
        max-width: 600px;
        padding-right: 30px;
        & > p {
          line-height: 30px;
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .image {
      display: flex;
      margin-top: 10px;
      & > div {
        // border: dashed #D7D7D7 1px;
        margin-right: 20px;
      }
    }
    .el-image {
      /deep/ .el-image__inner{
        object-fit: contain;
        border: solid #eee 1px;
      }
    }
  }
}
</style>
