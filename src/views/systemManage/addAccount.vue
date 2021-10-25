<template>
  <section id="addAccount">
    <div class="app-container">
      <div class="main-box">
        <el-form
          ref="addAccountform"
          :model="accountInfoForm"
          :rules="rules"
          label-width="100px"
        >
          <h3>基本信息</h3>
          <el-form-item label="用户名:" prop="userName">
            <el-input
              v-model="accountInfoForm.userName"
              maxlength="10"
              placeholder="请设置用户名(支持英文、数字及组合)"
            />
          </el-form-item>
          <el-form-item label="手机号:" prop="phone">
            <el-input
              v-model="accountInfoForm.phone"
              maxlength="11"
              placeholder="请输入手机号(用于登录)"
            />
          </el-form-item>
          <el-form-item label="角色:" prop="role">
            <el-select
              v-model="accountInfoForm.role"
              multiple
              placeholder="请选择角色"
              @change="roleChange()"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- <el-input v-model="accountInfoForm.role"></el-input> -->
          </el-form-item>
          <el-form-item label="登录密码:" prop="password">
            <el-input
              v-model="accountInfoForm.password"
              type="password"
              maxlength="16"
              placeholder="请设置8-16位包含数字、大小写字母"
            />
          </el-form-item>
          <el-form-item label="确认密码:" prop="confirmPassword">
            <el-input
              v-model="accountInfoForm.confirmPassword"
              type="password"
              maxlength="16"
              placeholder="确认密码"
            />
          </el-form-item>
          <h3>个人信息</h3>
          <el-form-item label="真实姓名:" prop="realName">
            <el-input
              v-model="accountInfoForm.realName"
              placeholder="请输入真实姓名"
              maxlength="15"
            />
          </el-form-item>
          <el-form-item label="性别:">
            <el-radio-group v-model="accountInfoForm.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="medium"
          style="margin-left: 120px"
          @click="save()"
          >保存</el-button
        >
      </div>
    </div>
  </section>
</template>

<script>
import { getRoleList, addUser } from "@/api/userManage";
export default {
  data() {
    var validateUserName = (rule, value, callback) => {
      const reg = /^[0-9a-zA-Z]{1,10}$/;
      if (value === "") {
        callback(new Error("不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入字母、数字或其组合"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
      if (value === "") {
        callback(new Error("请设置密码"));
      } else if (!reg.test(value)) {
        callback(new Error("格式不正确"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("不能为空"));
      } else if (value !== this.accountInfoForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    var validateRealName = (rule, value, callback) => {
      const reg = /^[A-Za-z\u2E80-\u9FFF\(\)\.\（\）]+$/;
      if (value === "") {
        callback(new Error("不能为空"));
      } else if (!reg.test(value) || value.length < 2 || value.length > 15) {
        callback(new Error("需输入2-15个字"));
      } else {
        callback();
      }
    };
    return {
      accountInfoForm: {
        userName: "",
        phone: "",
        role: [],
        password: "",
        confirmPassword: "",
        realName: "",
        gender: 1, // 1为男,2为女,默认为男
      },
      rules: {
        // 表单校验
        userName: [
          { required: true, validator: validateUserName, trigger: "blur" },
        ],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "change" }],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
        realName: [
          { required: true, validator: validateRealName, trigger: "blur" },
        ],
      },
      roleOptions: [], // 存放角色信息
    };
  },
  watch: {
    "accountInfoForm.phone": function (newValue, oldValue) {
      // 电话号码控制只能输入数字
      this.accountInfoForm.phone = newValue.replace(/[^\d\-]/g, "");
    },
    "accountInfoForm.realName": function (newValue, oldValue) {
      // 真实姓名不能输入数字
      this.accountInfoForm.realName = newValue.replace(/\d/g, "");
    },
  },
  created() {
    this.getRole();
  },
  methods: {
    // 获取角色列表
    getRole() {
      getRoleList().then((res) => {
        const roleArr = res.data;
        const optionList = [];
        roleArr.forEach((item) => {
          optionList.push({
            value: item.id,
            label: item.roleName,
          });
        });
        this.roleOptions = optionList;
      });
    },
    roleChange() {
      console.log(this.accountInfoForm.role);
    },
    // 保存
    save() {
      this.$refs["addAccountform"].validate((valid) => {
        if (valid) {
          const param = {
            username: this.accountInfoForm.userName,
            password: this.accountInfoForm.password,
            mobile: this.accountInfoForm.phone,
            realName: this.accountInfoForm.realName,
            gender: this.accountInfoForm.gender,
            ruleIds: this.accountInfoForm.role.join(","),
          };
          console.log(param);
          addUser(param).then((res) => {
            if (res.success) {
              this.$fun.msg("账号添加成功", "success");
              this.$router.push({ path: "/systemManage/accountManage" });
            } else {
              this.$fun.msg(res.msg, "error");
            }
          });
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
#addAccount {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
    padding: 10px;
  }
  .main-box {
    background: #fff;
    padding: 30px;
    min-height: calc(100vh - 100px);
  }
  .el-input--suffix .el-input__inner,
  .el-input {
    width: 400px;
  }
  .el-form-item {
    margin-left: 20px;
  }
}
</style>
