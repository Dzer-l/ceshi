<template>
  <div class="main-rim">
    <div class="setting-main" onselectstart="return false;">
      <el-button type="primary" style="margin:20px 0 40px 0" @click="addFirstLevelNavigation('add',{})">添加</el-button>
      <div class="data-head">
        <ul>
          <li class="sort">排序</li>
          <li class="name">轮播图名称</li>
          <li class="early-definition-name">链接地址</li>
          <li class="label">标签</li>
          <li class="slogan">标语</li>
          <!-- <li class="level">导航级别</li> -->
          <li class="status">使用状态</li>
          <li class="operating">操作</li>
        </ul>
      </div>
      <!--使用draggable组件-->
      <draggable v-model="myArray" group="setting-main" chosen-class="chosen" force-fallback="true" :move="fatherMove" animation="300" @update="datadragEnd" @start="onStart" @end="onEnd">
        <transition-group>
          <div v-for="(element) in myArray" :key="element.id" class="item">
            <ul>
              <li class="sort"><i class="el-icon-d-caret" /></li>
              <li class="name">
                <span class="expand-the-text-level">
                  <span>{{ element.carouselName }}</span>
                </span>
              </li>
              <li class="early-definition-name"><span>{{ element.carouselUrl }}</span></li>
              <li class="label"><span>{{ element.title }}</span></li>
              <li class="slogan"><span>{{ element.label }}</span></li>
              <!-- <li class="level"> {{ element.parentId===null||parseInt(element.parentId)===0?'一级导航':'二级导航' }}</li> -->
              <li class="status">
                <el-switch
                  v-model="element.status"
                  style="display: block"
                  active-text=" 启用"
                  inactive-text="停用"
                  :disabled="parseInt(element.deletable)===0"
                  @change="stateTorsion(element)"
                />
              </li>
              <li class="operating">
                <span v-if="parseInt(element.deletable)!==0">
                  <el-button type="text" @click="addFirstLevelNavigation('edit',element)">编辑</el-button>
                  <el-button type="text" @click="deleteNavigation(element)">删除</el-button>
                </span>
              </li>
            </ul>
          </div>
        </transition-group>
      </draggable>

    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">

          <el-form-item label="轮播图名称" prop="carouselName">
            <el-input v-model="ruleForm.carouselName" maxlength="30" placeholder="请输入轮播图名称" @input="changeValue('carouselName')" />
          </el-form-item>
          <el-form-item label="URL链接" prop="" class="url-form-item">
            <el-input v-model="ruleForm.carouselUrl" placeholder="请输入跳转的URL链接" />
          </el-form-item>
          <el-form-item label="标签" prop="title">
            <el-input v-model="ruleForm.title" maxlength="30" placeholder="请输入标题，多个以','分割" @input="changeValue('title')" />
          </el-form-item>
          <el-form-item label="标语" prop="label">
            <el-input v-model="ruleForm.label" maxlength="30" placeholder="请输入标签，多个以','分割" @input="changeValue('label')" />
          </el-form-item>
          <el-form-item label="图片" prop="carouselImg">
            <div class="upload-img">
              <el-upload
                action
                list-type="picture-card"
                :before-upload="beforeUpload"
                :on-preview="handlePictureCardPreview"
                :http-request="upLoadFile"
                :data="ruleForm"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <div v-if="ruleForm.carouselImg!==''" class="demo-image__preview">
                <el-image :preview-src-list="srcList" :src="ruleForm.carouselImg" style="width: 146px; height: 146px;" fit="contain" @click="previewPicture" />
              </div>
            </div>
            <div class="upload-tip">请上传1张尺寸为1200*450px的图片且大小不超过500KB，支持jpg/png/jpeg</div>
            <!-- 111111 -->
          </el-form-item>
          <el-form-item label="当前窗口打开">
            <el-radio-group v-model="ruleForm.windowOpen">
              <el-radio label="1" border>当前窗口打开</el-radio>
              <el-radio label="2" border>新窗口</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { getWebsiteRim, deleteWebsiteRim, modifyTheRimBarStatus, rimSort, uploadImage } from '../../api/setting'
export default {
  components: {
    draggable
  },
  data() {
    var verificationURL = (rule, value, callback) => {
      if (value.length === 0) {
        callback()
      } else if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.test(value) || value === '#') {
        callback()
      } else {
        callback(new Error('请输入正确的URL链接'))
      }
    }
    var verificationImg = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    return {
      value2: true,
      dialogTitle: '',
      activeName: 'first',
      rotate: false,
      drag: false,
      // 定义要被拖拽对象的数组
      myArray: [],
      expandArr: [],
      sortArray: [],
      srcList: ['https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3234472720,1745056779&fm=26&gp=0.jpg'],
      stauts: true,
      dialogVisible: false,
      dialogVisibleImg: false,
      save: '',
      ruleForm: {
        id: null,
        title:'',
        label:'',
        carouselUrl: '',
        carouselName: '',
        carouselImg: '',
        windowOpen: '1'
      },
      rules: {
        carouselUrl: [
          { required: true, validator: verificationURL, trigger: 'blur' }
          // { required: true, message: '请输入跳转的URL链接', trigger: 'blur' },
          // { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        carouselName: [
          { required: true, message: '请输入1-30个字', trigger: 'blur' },
          { min: 1, max: 30, message: '请输入1-30个字', trigger: 'blur' }
        ],
        title:[
          { required: false, message: '请输入1-30个字', trigger: 'blur' },
          { min: 1, max: 30, message: '请输入1-30个字', trigger: 'blur' }
        ],
        label:[
          { required: false, message: '请输入1-30个字', trigger: 'blur' },
          { min: 1, max: 30, message: '请输入1-30个字', trigger: 'blur' }
        ],
        carouselImg: [{ required: true, validator: verificationImg, trigger: 'change' }]
      },
      file: {}
    }
  },
  // watch: {
  //   myArray: {
  //     handler(newName, oldName) {
  //       console.log('00000')
  //     },
  //     // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
  //     immediate: true
  //   }
  // },
  created() {
    this.getTableData()
  },
  mounted() {
  // 阻止默认行为
  },
  methods: {
    changeValue(val) {
      if(val=='title'){
        this.ruleForm[val] = this.ruleForm[val].replace(/[^\u4E00-\u9FA5\"\"\“\”　a-z A-Z \d , ( ) （　）-]/g, '')
      }else{
        this.ruleForm[val] = this.ruleForm[val].replace(/[^\u4E00-\u9FA5　a-z A-Z \d , ( ) （　）-]/g, '')
      }
    },
    getTableData() {
      getWebsiteRim().then(res => {
        this.myArray = res.data
        this.sortArray = []
        for (let index = 0; index < this.myArray.length; index++) {
          const u = { id: this.myArray[index].id, sortOrder: index + 1 }
          this.sortArray.push(u)
          if (this.myArray[index].isOpen === 1) {
            this.$set(this.myArray[index], 'status', true)
          } else {
            this.$set(this.myArray[index], 'status', false)
          }
        }
        this.dialogVisible = false
      })
    },
    handleClick(val) {

    },
    previewPicture() {},
    handlePictureCardPreview() {},
    handleRemove(file, fileList) {},
    datadragEnd() {
      const data = []
      for (let index = 0; index < this.myArray.length; index++) {
        const p = { id: this.myArray[index].id, sortOrder: index + 1 }
        data.push(p)
      }
      const u = { oldSortList: this.sortArray, newSortList: data }
      rimSort(u).then(res => {
        if (res.success) {
          this.$message({ type: 'success', message: '移动成功' })
        }
      })
    },
    onMove(e) {},
    onStart() {},
    // 拖拽结束事件
    onEnd() {},
    start() {
      this.rotate = !this.rotate
    },
    fatherMove() {},
    async addFirstLevelNavigation(val, data) {
      this.save = val
      this.dialogTitle = val === 'add' ? `新增轮播图` : `编辑轮播图`
      if (val === 'add') {
        if (this.myArray.length === 4) {
          this.$message({ type: 'warning', message: '图片已超4张，请删除后继续上传' })
          return false
        }
        this.ruleForm.carouselUrl = ''
        this.ruleForm.carouselName = ''
        this.ruleForm.carouselImg = ''
        this.ruleForm.title=''
        this.ruleForm.label=''
        this.file = ''
        this.ruleForm.id = null
      } else {
        const url = await this.$axios('org/org-carousel-file', { id: data.id })
        // console.log(data, url.data.data)
        this.ruleForm.carouselUrl = data.carouselUrl
        this.ruleForm.carouselName = data.carouselName
        this.ruleForm.id = data.id
        this.ruleForm.title=data.title
        this.ruleForm.label=data.label
        this.ruleForm.windowOpen = data.target.toString()
        this.ruleForm.carouselImg = 'data:image/png;base64,' + url.data.data
        this.srcList[0] = 'data:image/png;base64,' + url.data.data
        this.file = data.carouselFile
        this.ruleForm.windowOpen = data.target === 1 ? '1' : '2'
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    deleteNavigation(val) {
      console.log(val)
      if (val.status) {
        this.$message({
          message: '启用中，无法删除',
          type: 'warning'
        })
        return false
      }
      this.$confirm('确认删除该导航菜单？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { id: val.id }
        deleteWebsiteRim(data).then(res => {
          console.log(res)
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    selectLevel() {
    },
    stateTorsion(val) {
      const data = {
        id: val.id,
        isOpen: val.isOpen === 1 ? 0 : 1
      }
      modifyTheRimBarStatus(data).then(res => {
        if (res.success) {
          this.$message({ type: 'success', message: val.isOpen === 0 ? '该轮播图已开启' : '该轮播图已关闭' })
        }
        this.getTableData()
      })
    },
    upLoadFile(e) {
      const formData = new FormData()
      formData.append('file', e.file)
      uploadImage(formData).then(res => {
        if (res.success) {
          let _URL = window.URL || window.webkitURL
          this.ruleForm.carouselImg=_URL.createObjectURL(e.file)
          // this.ruleForm.carouselImg = res.data.url
          this.srcList[0] = res.data.url
          this.file = JSON.stringify(res.data)
        }
      })
    },
    beforeUpload(file) {
      if (file.type.indexOf('image') < 0) {
        this.$message.error('格式不支持，仅支持jpg/jpeg/png格式')
        return false
      }
      if (file.size > 500 * 1024) {
        this.$message.error('图片大小超过500kb')
        return false
      }
      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const img = new Image()
        img.onload = function() {
          // console.log(img.width, img.height)
          const valid = img.width === 1200 && img.height === 450
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
      }).then(
        () => {
          return file
        }, () => {
          this.$message.error('请上传尺寸为1200*450px的图片')
          return Promise.reject()
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            carouselFile: this.file,
            target: this.ruleForm.windowOpen,
            carouselUrl: this.ruleForm.carouselUrl,
            carouselName: this.ruleForm.carouselName,
            title:this.ruleForm.title,
            label:this.ruleForm.label,
            id: this.ruleForm.id
          }
          if (this.save === 'add') {
            delete data.id
          }
          this.$axios(this.save === 'add' ? 'org/org-carousel' : 'org/org-carousel', data, { method: this.save === 'add' ? 'POST' : 'PUT' }).then(res => {
            if (res.success) {
              this.$message({
                message: this.save === 'add' ? '新增成功' : '已保存修改',
                type: 'success'
              })
              this.getTableData()
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
ul{
  margin: 0;
  padding: 0;
  li{
    list-style: none;
    display: flex;
    align-items: center;
  }
}
  /deep/ .el-table--border:after,
/deep/ .el-table--group:after,
/deep/ .el-table:before {
  background-color: #eee;
}
/deep/ .el-table--border,
/deep/ .el-table--group {
  border-color: #eee;
}
/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
  border-bottom: 1px solid #eee;
}
/deep/ .el-table--border th,
/deep/ .el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid red;
}
/deep/ .el-table--border td,
/deep/ .el-table--border th {
  border-right: none;
}
.main{
  background: #f7f7f7;
  height: 100%;
  .setting-main{
    background: #fff;
  }
}
.item {
  border-bottom: solid #ddd 1px;
  cursor: move;
  ul{
    display: flex;
  padding: 15px 0;
    li{
      padding: 0 20px;
    }
  }
}
.child{
  ul{
    // padding: 15px 0;
    border-top: solid #ddd 1px;
      background: #f3f3f3;
  }
}
.data-head{
  ul{
    display: flex;
    align-items: center;
    li{
      border: solid 1px #ddd;
      border-left: none;
      border-right: none;
      padding: 20px;
      color: #333;
      font-weight: bold;
      font-size: 14px;
    }
  }
}
.sort{
  width: 8%;
}
.name,.level,.label,.slogan{
  width: 12%;

}
.early-definition-name,.status{
  width: 22%;
}
/deep/.early-definition-name>span,.label>span,.slogan>span{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.operating{
  flex: 1;
}
.alignment{
  padding-bottom: 0 !important;
}
/deep/ .el-button--text{
  padding: 0;
}
.aa{
        transition: all .5s;
    }
    .go{
        transform:rotate(90deg);
        transition: all .5s;
    }
/deep/ .el-dialog__body{
  border-top: solid #ddd 1px;
  border-bottom: solid #ddd 1px;
  // margin: 20px 0;
}
.upload-img{
  display: flex;
}
/deep/ .el-upload-list{
  display: none;
}
.demo-image__preview{
  border: solid #ddd 1px;
  border-radius: 6px;
  margin-left:20px
}
/deep/ .el-form-item__content{
  line-height: 0;
}
.upload-tip{
  margin-top: 20px;
  line-height: 20px;
  color: #999;
}
//  .url-form-item{
//    border: solid red 1px;
//   /deep/ .el-form-item__label::before{
//     content: '5';
//   }
// }
</style>
