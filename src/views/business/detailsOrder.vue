<template>
  <div ref="getheight" class="details_main" style="width: inherit">
    <div class="details_head">
      <ul>
        <li style="padding-bottom: 10px;display: flex;justify-content: space-between;align-items:center">
          <div style="font-size: 16px;font-weight: 600;">
            <i class="el-icon-s-order" style="color: #409eff;margin-right: 5px;" />
            <span style="color: #333">订单编号：</span>
            <span style="color: #333">{{ headData.orderNum }}</span>
          </div>
          <div style="padding-right: 40px;">
            <el-button style="width: 60px;" type="primary" size="small" @click="$router.go(-1)">返 回</el-button>
          </div>
        </li>
        <li class="cont_list">
          <div>
            <p style="white-space: nowrap; display: flex">
              <span>申请人：</span>
              <span style="white-space: pre-wrap">{{ headData.applicantName }}</span>
            </p>
            <p style="white-space: nowrap">
              <span>支付编号：</span>
              <span>{{ headData.tradeNo }}</span>
            </p>
          </div>
          <div>
            <p style="white-space: nowrap">
              <span style="white-space: nowrap">业务类型：</span>
              <span style="white-space: nowrap">{{
                headData.businessType | getSta
              }}</span>
            </p>
            <p style="white-space: nowrap">
              <span style="white-space: nowrap">签署完毕时间：</span>
              <span style="white-space: nowrap">{{ headData.signTime }}</span>
            </p>
          </div>
          <div style="height: 80px">
            <p style="white-space: nowrap">
              <span style="white-space: nowrap">订单生成时间：</span>
              <span style="white-space: nowrap">{{ headData.createTime }}</span>
            </p>
            <div style="display: flex">
              <p style="color: #666; min-width: 50px; white-space: nowrap">
                卷宗号：
              </p>
              <el-input
                v-model="headData.dossierNum"
                :disabled="disabled"
                style="width: 40%; margin-right: 20px; margin-top: -5px"
                size="mini"
                oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'');if(value.length>20)value=value.slice(0,20)"
              />
              <el-button
                type="primary"
                size="mini"
                style="margin-top: -5px"
                @click="save"
              >
                <template>
                  <span>{{ textSta }}</span>
                </template>
              </el-button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--tab栏 -->
    <div class="details_tabls">
      <!-- businessType业务类型不同，tab栏展示的信息也不一样 businessType为2时，为商标业务，businessType为3时，为公众号业务-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--businessType为2时，展示商标业务相关信息  -->
        <el-tab-pane v-if="headData.businessType === 2" label="商标登记信息" name="first">
          <registerInfo v-if="activeName == 'first'" />
        </el-tab-pane>
        <el-tab-pane v-if="headData.businessType === 2" label="申请人信息" name="second">
          <applicantInfo v-if="activeName == 'second'" />
        </el-tab-pane>
        <!-- businessType为3时，展示公众号业务相关信息 -->
        <el-tab-pane v-if="headData.businessType === 3" label="原公众号信息" name="first">
          <oldAndNoInfo v-if="activeName == 'first'" />
        </el-tab-pane>
        <el-tab-pane v-if="headData.businessType === 3" label="目标公众号信息" name="second">
          <newAndNoInfo v-if="activeName == 'second'" />
        </el-tab-pane>
        <!-- obtainCertType领证方式不一样，tab展示的信息也不一样 -->
        <el-tab-pane
          v-if="headData.obtainCertType === 1 || headData.obtainCertType == 2 || headData.obtainCertType == 3"
          label="材料信息"
          name="sixth"
        >
          <materialInfo v-if="activeName == 'sixth'" :name="headData.applicantName" :order-num="headData.orderNum" />
        </el-tab-pane>
        <el-tab-pane
          v-if="headData.obtainCertType === 1 || headData.obtainCertType == 2 || headData.obtainCertType == 3"
          label="已签署文件"
          name="third"
        >
          <signedMaterials v-if="activeName == 'third'" :name="headData.applicantName" :order-num="headData.orderNum" />
        </el-tab-pane>
        <!-- obtainCertType为1时是线上邮寄取证，展示快递信息 -->
        <el-tab-pane v-if="headData.obtainCertType === 1" label="快递信息" name="fourth">
          <expressInfo v-if="activeName == 'fourth'" :statu="headData.orderStatus" />
        </el-tab-pane>
        <!-- obtainCertType为2时是线下领证，展示的是领证信息 -->
        <el-tab-pane v-if="headData.obtainCertType === 2" label="领证信息" name="fifth">
          <licenseInfo
            v-if="activeName == 'fifth'"
            :statu="headData.orderStatus"
            @func="getChildData"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 1待审核状态 -->
    <el-dialog
      title="拒绝受理"
      :visible.sync="dialogVisibles"
      width="30%"
      :before-close="handleCloseTurnrefuse"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rule"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="拒绝原因:"
          prop="reason"
        ><el-input
          v-model="ruleForm.reason"
          type="textarea"
          :rows="4"
          placeholder="请输入5-120个字符"
        /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="headData.businessType == 2"
      title="驳回材料重新修改"
      :visible.sync="dialogTurn"
      width="30%"
      :before-close="handleCloseTurn"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleFormTurn"
        label-position="left"
        :model="ruleFormTurn"
        :rules="rulesTurn"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="需修改的材料:" prop="type">
          <el-checkbox-group v-model="ruleFormTurn.type">
            <el-checkbox label="申请人信息" name="type" />
            <el-checkbox label="商标信息" name="type" />
            <el-checkbox label="受让人信息" name="type" />
            <el-checkbox label="公证书送达方式" name="type" />
            <el-checkbox label="文书签名" name="type" />
            <el-checkbox label="其他" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="驳回原因:"
          prop="turn"
        ><el-input
          v-model="ruleFormTurn.turn"
          type="textarea"
          :rows="4"
          placeholder="请输入5-120个字符"
        /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTurn = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitFormTurn('ruleFormTurn')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="headData.businessType == 3"
      title="驳回材料重新修改"
      :visible.sync="dialogTurn"
      width="30%"
      :before-close="handleCloseTurn"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleFormTurn"
        label-position="left"
        :model="ruleFormTurn"
        :rules="rulesTurn"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="需修改的材料:" prop="type">
          <el-checkbox-group v-model="ruleFormTurn.type">
            <el-checkbox label="原公众号信息" name="type" />
            <el-checkbox label="目标公众号信息" name="type" />
            <el-checkbox label="原公众号方受托人信息" name="type" />
            <el-checkbox label="目标公众号方受托人信息" name="type" />
            <el-checkbox label="文书签名" name="type" />
            <el-checkbox label="公证书送达方式" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="驳回原因:"
          prop="turn"
        ><el-input
          v-model="ruleFormTurn.turn"
          type="textarea"
          :rows="4"
          placeholder="请输入5-120个字符"
        /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTurn = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitFormTurn('ruleFormTurn')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="succeed"
      width="30%"
      class="succeed_pop"
      :close-on-click-modal="false"
    >
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: column;
        "
      >
        <i class="el-icon-success" style="font-size: 10rem; color: #67c23a" />
        <p style="padding: 20px 0; font-size: 20px">操作成功</p>
        <span style="font-size: 12px">三秒后将关闭弹窗，跳转至已出证界面</span>
      </div>
    </el-dialog>
    <div
      v-if="headData.orderStatus === 201"
      ref="id_container"
      class="details_bottom"
      :style="{ width: boxWidth + 'px' }"
    >
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">待审核</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
      <div>
        <div style="background-color: #ff7272" @click="refusedAccept">
          拒绝受理
        </div>
        <div style="background-color: #3eb88b" @click="rejectedMaterial">
          补充材料
        </div>
        <div style="background-color: #409eff" @click="operateSuccessfully">
          通过审核
        </div>
      </div>
    </div>

    <!-- 2需补材料状态 -->
    <div
      v-if="headData.orderStatus === 202"
      ref="id_container"
      class="details_bottom"
      style="justify-content: space-between; padding-left: 20px"
    >
      <div>
        <p style="max-width: 500px; overflow: hidden; text-overflow: ellipsis">
          <span style="color: #ec0d0d">需要修改的材料：</span>
          <span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="remarkData.supplementaryMaterials"
              placement="top"
            >
              <span>{{ remarkData.supplementaryMaterials }}</span>
            </el-tooltip>
          </span>
        </p>
        <p style="display: flex">
          <span style="color: #ec0d0d">驳回原因：</span>
          <span
            class="hint"
            style="
              max-width: 200px;
              overflow-wrap: break-word;
              text-overflow: ellipsis;
            "
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="remarkData.remarkContent"
              placement="top"
            >
              <span>{{ remarkData.remarkContent }}</span>
            </el-tooltip>
          </span>
        </p>
      </div>
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">需补材料</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
    </div>

    <!-- 3制证中 -->
    <el-dialog
      title="终止办理"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="终止原因:"
          prop="reason"
        ><el-input
          v-model="ruleForm.reason"
          type="textarea"
          :rows="4"
          placeholder="请输入5-120个字符"
        /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitFormProvide('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="succeed"
      width="30%"
      class="succeed_pop"
      :close-on-click-modal="false"
    >
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: column;
        "
      >
        <i class="el-icon-success" style="font-size: 10rem; color: #67c23a" />
        <p style="padding: 20px 0; font-size: 20px">操作成功</p>
        <span style="font-size: 12px">三秒后将关闭弹窗，跳转至已出证界面</span>
      </div>
    </el-dialog>
    <div
      v-if="headData.orderStatus === 301"
      ref="id_container"
      class="details_bottom"
    >
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">制证中</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
      <div>
        <div style="background-color: #ff7272" @click="endDeal">终止办理</div>
        <div style="background-color: #409eff" @click="provide('ruleForm')">
          出具证书
        </div>
      </div>
    </div>

    <!-- 4待邮寄 -->
    <div
      v-if="headData.orderStatus === 302"
      ref="id_container"
      class="details_bottom"
    >
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">待邮寄</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
      <div>
        <div style="background-color: #409eff" @click="callCourier">
          呼叫快递揽收
        </div>
      </div>
    </div>

    <!-- 5待预约 -->
    <div
      v-if="headData.orderStatus === 303"
      ref="id_container"
      class="details_bottom"
    >
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">待预约</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
      <div>
        <div style="background-color: #409eff" @click="sendTextMessage">
          短信提醒领证
        </div>
      </div>
    </div>

    <!-- 6已邮寄 -->
    <div
      v-if="headData.orderStatus === 304"
      ref="id_container"
      class="details_bottom"
    >
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">已邮寄</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
      <div>
        <div style="background-color: #409eff" @click="completedThe">
          完成办理
        </div>
      </div>
    </div>

    <!-- 7已预约 -->
    <div
      v-if="headData.orderStatus === 305"
      ref="id_container"
      class="details_bottom"
    >
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">已预约</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
      <div>
        <div style="background-color: #0782d1" @click="sendTextMessage">
          短信提醒领取
        </div>
        <div style="background-color: #409eff" @click="completedThe">
          完成办理
        </div>
      </div>
    </div>

    <!-- 8已完成 -->
    <div
      v-if="headData.orderStatus === 306"
      ref="id_container"
      class="details_bottom"
    >
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">已完成</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
    </div>

    <!-- 拒绝受理 -->
    <div
      v-if="headData.orderStatus === 401"
      ref="id_container"
      class="details_bottom"
      style="justify-content: space-between; padding-left: 20px"
    >
      <div>
        <p style="display: flex">
          <span style="color: #ec0d0d">拒绝原因：</span>
          <span
            class="hint"
            style="
              max-width: 500px;
              overflow-wrap: break-word;
              text-overflow: ellipsis;
            "
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="remarkData.remarkContent"
              placement="top-start"
            >
              <span>{{ remarkData.remarkContent }}</span>
            </el-tooltip>
          </span>
        </p>
      </div>
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">拒绝受理</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
    </div>

    <!--已终止 -->
    <div
      v-if="headData.orderStatus === 402"
      ref="id_container"
      class="details_bottom"
      style="justify-content: space-between; padding-left: 20px"
    >
      <div>
        <p style="display: flex">
          <span style="color: #ec0d0d">终止原因：</span>
          <span
            class="hint"
            style="
              max-width: 400px;
              overflow-wrap: break-word;
              text-overflow: ellipsis;
            "
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="remarkData.remarkContent"
              placement="top"
            >
              <span>{{ remarkData.remarkContent }}</span>
            </el-tooltip>
          </span>
        </p>
      </div>
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">已终止</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
    </div>

    <!-- 待支付 -->
    <div
      v-if="headData.orderStatus === 101"
      ref="id_container"
      class="details_bottom"
    >
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">待支付</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
    </div>

    <div
      v-if="headData.orderStatus === 102"
      ref="id_container"
      class="details_bottom"
    >
      <div>
        <p>
          <span>状态：</span>
          <span style="color: #f96a00; font-weight: bolder">待签署</span>
        </p>
        <p>
          <span>订单金额：</span>
          <span
            style="color: #409eff; font-weight: bolder"
          >￥{{ headData.totalCost }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDetailsHead,
  updateOrderSta,
  getLicenseInfo,
  appointmentTime,
  addRemark,
  getRemark,
  modificationFile,
  getAllAddress
} from '../../api/details.js'
import { getRecipientsInfo } from '../../api/cloudMail'
import registerInfo from '../../components/tab/registerInfo.vue'
import applicantInfo from '../../components/tab/applicantInfo.vue'
import expressInfo from '../../components/tab/expressInfo.vue'
import signedMaterials from '../../components/tab/signedMaterials.vue'
import licenseInfo from '../../components/tab/licenseInfo.vue'
import oldAndNoInfo from '../../components/tab/oldAndNoInfo.vue'
import newAndNoInfo from '../../components/tab/newAndNoInfo.vue'
import materialInfo from '../../components/tab/materialInfo.vue'
export default {
  components: {
    registerInfo,
    applicantInfo,
    expressInfo,
    signedMaterials,
    licenseInfo,
    oldAndNoInfo,
    newAndNoInfo,
    materialInfo
  },
  filters: {
    getSta(val) {
      var str = ''
      if (val === 1) {
        str = '公证在线业务'
      } else {
        if (val === 2) {
          str = '商标转让'
        } else {
          str = '公众号迁移'
        }
      }
      return str
    }
  },
  data() {
    return {
      fileNum: '',
      activeName: 'first',
      orgId: null,
      headData: {},
      textSta: '保存',
      disabled: false,
      dialogVisible: false,
      dialogVisibles: false,
      dialogTurn: false,
      succeed: false,
      ruleForm: {
        reason: ''
      },
      rules: {
        reason: [
          { required: true, message: '请填写拒绝原因', trigger: 'blur' },
          {
            min: 5,
            max: 120,
            message: '长度在 5 到 120 个字符',
            trigger: 'blur'
          }
        ]
      },
      rule: {
        reason: [
          { required: true, message: '请填写拒绝原因', trigger: 'blur' },
          {
            min: 5,
            max: 120,
            message: '长度在 5 到 120 个字符',
            trigger: 'blur'
          }
        ]
      },
      ruleFormTurn: {
        turn: '',
        type: []
      },
      rulesTurn: {
        turn: [
          { required: true, message: '请填写驳回原因', trigger: 'blur' },
          {
            min: 5,
            max: 120,
            message: '长度在 5 到 120 个字符',
            trigger: 'blur'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个选项',
            trigger: 'change'
          }
        ]
      },
      childData: { licenseTime: '', licenseNum: '' },
      remarkData: '',
      bidType: null,
      boxWidth: null,
      submitStatu: null,
      selectAddresData: [],
      expressId:"",   // 对接新物流系统需要用到
    }
  },
  watch: {
    submitStatu: {
      handler(newval) {
        this.submitStatu = newval
      },
      deep: true
    }
  },
  mounted() {
    this.orgId = this.$route.query.orderId
    this.bidType = this.$route.query.bidType
    this.getHeadData()
  },
  methods: {
    getChildData(data) {
      this.childData = data
    },
    handleClick(tab, event) {
    },
    getHeadData() {
      var data = { orderId: this.orgId }
      getDetailsHead(data).then((res) => {
        this.headData = res.data
        getRecipientsInfo({ orderNum: res.data.orderNum }).then((res) => {
          console.log(res);
          if (res.success) {
            this.expressId = res.data.id
          }
        }).catch((err) => {
          
        })
        if (
          this.headData.dossierNum != null ||
          this.headData.dossierNum === ''
        ) {
          this.disabled = true
          this.textSta = '编辑'
        }
        if (
          this.headData.orderStatus === 401 ||
          this.headData.orderStatus === 202 ||
          this.headData.orderStatus === 402
        ) {
          var sta = null
          if (this.headData.orderStatus === 401) {
            sta = 1
          } else {
            if (this.headData.orderStatus === 202) {
              sta = 2
            } else {
              sta = 3
            }
          }
          var datas = { orderId: this.orgId, remarkType: sta }
          getRemark(datas).then((res) => {
            if (res.data != null) {
              res.data.supplementaryMaterials = res.data.supplementaryMaterials.replace(
                /,$/,
                ''
              )
              this.remarkData = res.data
            }
          })
        }
      })
    },
    save() {
      if (this.textSta === '保存') {
        if (
          this.headData.dossierNum === null ||
          this.headData.dossierNum === ''
        ) {
          this.textSta = '保存'
          this.disabled = false
        } else {
          var data = { id: this.orgId, dossierNum: this.headData.dossierNum }
          modificationFile(data).then((res) => {
            if (res.success) {
              this.textSta = '编辑'
              this.disabled = true
            }
          })
        }
      } else {
        this.disabled = false
        this.textSta = '保存'
      }
    },
    // 拒绝受理
    refusedAccept() {
      this.dialogVisibles = true
    },
    handleClose(done) {
      this.dialogVisible = false
    },
    // 拒绝受理填写拒绝理由后点击确定的事件
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var datas = {
            orderId: this.orgId,
            remarkType: 1,
            remarkContent: this.ruleForm.reason,
            supplementaryMaterials: ''
          }
          addRemark(datas).then((res) => {
            if (res.success) {
              var data = { id: this.orgId, orderStatus: 401 }
              updateOrderSta(data).then((res) => {
                if (res.success) {
                  this.dialogVisible = false
                  this.$router.go(0)
                }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 需补材料
    rejectedMaterial() {
      this.dialogTurn = true
    },
    handleCloseTurn() {
      this.dialogTurn = false
    },
    handleCloseTurnrefuse() {
      this.dialogVisibles = false
    },
    submitFormTurn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var str = ''
          for (let i = 0; i < this.ruleFormTurn.type.length; i++) {
            str += this.ruleFormTurn.type[i] + ','
          }
          str = str.replace(/,$/gi, '')
          var datas = {
            orderId: this.orgId,
            remarkType: 2,
            remarkContent: this.ruleFormTurn.turn,
            supplementaryMaterials: str
          }
          addRemark(datas).then((res) => {
            if (res.success) {
              var data = { id: this.orgId, orderStatus: 202 }
              updateOrderSta(data).then((res) => {
                if (res.success) {
                  this.dialogTurn = false
                  this.$router.go(0)
                }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 通过审核
    operateSuccessfully() {
      var data = { id: this.orgId, orderStatus: 301 }
      updateOrderSta(data).then((res) => {
        this.succeed = true
        setTimeout(() => {
          this.succeed = false
          this.$router.go(0)
        }, 3000)
      })
    },

    // 发送短信
    sendTextMessage() {
      if (this.submitStatu === true || this.submitStatu == null) {
        getAllAddress().then((res) => {
          this.selectAddresData = res.data
          getLicenseInfo({ orderNum: this.$route.query.orderNum || sessionStorage.getItem("detailsOrderNum")}).then(
            (res) => {
              console.log(res)
              if (res.data != null) {
                this.childData.licensePhone = res.data.mobile
                this.childData.licensePlace = res.data.receivePointName
                this.childData.licenseName = res.data.receiveName
                this.childData.prodName = res.data.prodName
                this.childData.licenseTime = res.data.receiveTime
                this.childData.licenseNum = res.data.receiveNumber
                this.childData.idCard = res.data.cardNum
                this.childData.licenseAddress = res.data.receiveAddress
                if (
                  this.childData.licenseTime != null &&
                  this.childData.licenseTime !== '' &&
                  this.childData.licenseNum != null &&
                  this.childData.licenseNum !== ''
                ) {
                  this.$confirm(
                    '确定通过短信把预约信息发给领证人吗？',
                    '提示',
                    {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      customClass: 'pop'
                    }
                  )
                    .then(() => {
                      var datas = {
                        orderNum: this.$route.query.orderNum || sessionStorage.getItem("detailsOrderNum"),
                        mobile: this.childData.licensePhone,
                        receiveTime: this.childData.licenseTime,
                        cardNum: this.childData.idCard,
                        receivePointName: this.childData.licensePlace,
                        receiveAddress: this.childData.licenseAddress,
                        receiveNumber: this.childData.licenseNum,
                        receiveName: this.childData.licenseName,
                        prodName: this.childData.prodName
                      }
                      appointmentTime(datas).then((res) => {
                        if (res.success) {
                          this.$message({
                            type: 'success',
                            message: '发送成功'
                          })
                          this.$router.go(0)
                        } else {
                          this.$message.error('发送失败')
                        }
                      })
                    })
                    .catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消发送'
                      })
                    })
                } else {
                  this.activeName = 'fifth'
                }
              } else {
                this.activeName = 'fifth'
                this.$message.error('未查询到信息')
              }
            }
          )
        })
      } else {
        this.activeName = 'fifth'
        this.$message({
          type: 'info',
          message: '请先保存信息'
        })
      }
    },

    // 终止办理
    endDeal() {
      this.dialogVisible = true
    },
    // 出具证书
    provide(formName) {
      var data = { id: this.orgId, orderStatus: 303 }
      if (this.headData.obtainCertType === 1) {
        data.orderStatus = 302
      } else {
        data.orderStatus = 303
      }
      if (this.submitStatu != null) {
        if (this.submitStatu === true) {
          this.succeed = true
          updateOrderSta(data).then((res) => {
            setTimeout(() => {
              this.succeed = false
              this.$router.go(0)
            }, 3000)
          })
        } else {
          this.activeName = 'fifth'
          this.$message({
            type: 'info',
            message: '请先保存信息'
          })
        }
      } else {
        this.succeed = true
        updateOrderSta(data).then((res) => {
          if (res.success) {
            setTimeout(() => {
              this.succeed = false
              this.$router.go(0)
            }, 3000)
          }
        })
      }
    },
    // 终止办理
    submitFormProvide(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var datas = {
            orderId: this.orgId,
            remarkType: 3,
            remarkContent: this.ruleForm.reason,
            supplementaryMaterials: ''
          }
          addRemark(datas).then((res) => {
            if (res.success) {
              var data = { id: this.orgId, orderStatus: 402 }
              updateOrderSta(data).then((res) => {
                if (res.success) {
                  this.dialogVisible = false
                  this.$router.go(0)
                }
              })
            }
          })
        } else {
          return false
        }
      })
    },

    // 呼叫快递揽收
    callCourier() {
      // var data = { id: this.orgId, orderStatus: 304 }
      // updateOrderSta(data).then((res) => {
      // var str = "'" + this.$route.query.orderNum + "'"
      // this.$router.push({
      //   name: 'mailList',
      //   query: { orderNum: str, userType: 1 }
      // })
	    sessionStorage.setItem("detailsOrderNum",this.$route.query.orderNum)
      this.$router.push({
				name: "expressDelivery",
				query: {
          from: "detailsOrder",
          ids: [this.expressId],
          fromOrderId: this.$route.query.orderId
        }
			})
      // })
    },

    // 完成办理跳转到已完成详情页
    completedThe() {
      var data = { id: this.orgId, orderStatus: 306 }
      updateOrderSta(data).then((res) => {
        this.$router.go(0)
      })
    }
  }
}
</script>

<style lang="less" scoped>
ul,
p,
li {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
.felx-row {
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/ .el-form-item__label,
/deep/ .el-dialog__title {
  color: #666 !important;
  font-size: 14px;
}

.details_main {
  background: #f7f7f7;
  min-height: calc(100vh - 50px);
  padding: 15px;
  padding-bottom: 0;
  position: relative;
  display: flex;
  flex-flow: column;
  font-size: 14px;
  .details_head {
    padding: 20px 20px;
    padding-bottom: 0;
    background: #fff;
    // height: 105px;
    ul {
      .cont_list {
        display: flex;
        align-items: center;
        overflow: hidden;
        & > div {
          padding-right: 30px;
          flex: 1;
          & > p {
            // margin-top: 20px;
            height: 40px;
            color: #666666;
            display: flex;
          }
        }
      }
    }
  }
  .details_tabls {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    padding-top: 10px;
    flex: 1;
    background: #fff;
    margin: 10px 0 0 0;
    /deep/ .el-tabs__nav-wrap {
      padding-left: 40px;
      .el-tabs__item {
        padding: 0 40px;
        font-size: 16px;
      }
    }
    /deep/ .el-tabs__content {
      padding: 0 20px;
    }
  }
  .details_bottom {
    background: #fff;
    height: 80px;
    display: flex;
    justify-content: flex-end;
    box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.16);
    & > div {
      .felx-row;
      & p {
        padding-right: 20px;
        white-space: nowrap;
        & > span {
          white-space: nowrap;
        }
      }
      & > div {
        width: 200px;
        height: 100%;
        color: #fff;
        cursor: pointer;
        .felx-row;
      }
    }
    .hint {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  }
  .el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .el-dialog {
    margin: 0 !important;
    min-width: 400px !important;
    /deep/ .el-dialog__body {
      padding: 10px 20px !important;
      padding-top: 30px !important;
      margin-top: 10px;
      border-top: solid 1px #d5d5d5;
      border-bottom: solid 1px #d5d5d5;
    }
  }
  .succeed_pop /deep/ .el-dialog {
    /deep/ .el-dialog__header {
      display: none;
    }
    /deep/ .el-dialog__body {
      border: none;
      margin: 0;
      padding: 30px !important;
    }
  }
}
.applicant-font {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
