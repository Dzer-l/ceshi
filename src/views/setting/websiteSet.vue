<template>
  <div class="main">
    <div v-if="mainShow" class="setting-main" onselectstart="return false;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="网站导航设置" name="first">
          <el-button type="primary" style="margin:20px 0 40px 0" @click="addFirstLevelNavigation('add',{})">添加一级导航</el-button>
          <div class="data-head">
            <ul>
              <li class="sort">排序</li>
              <li class="name">导航名称</li>
              <li class="early-definition-name">自定义名称</li>
              <li class="level">导航级别</li>
              <li class="status">使用状态</li>
              <li class="operating">操作</li>
            </ul>
          </div>
          <!--使用draggable组件-->
          <draggable v-model="myArray" group="setting-main" filter=".forbid" chosen-class="chosen" force-fallback="true" :move="fatherMove" animation="300" @update="datadragEnd" @start="onStart" @end="onEnd">
            <transition-group>
              <div v-for="(element,i) in myArray" :key="element.id" class="item" :class="i===0?'item forbid':'item'">
                <ul>
                  <li class="sort"><i class="el-icon-d-caret" /></li>
                  <li class="name">
                    <span class="expand-the-text-level" @click.stop="expandTheNextLevel(element)">
                      <i class="el-icon-caret-right" :class="element.expand?'go':'aa'" />
                      <span>{{ element.navigationName }}</span>
                    </span>
                  </li>
                  <li class="early-definition-name">{{ element.navigationCustomizeName }} </li>
                  <li class="level"> {{ element.parentId===null||parseInt(element.parentId)===0?'一级导航':'二级导航' }}</li>
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
                      <el-button type="text" @click="addFirstLevelNavigation('add',element)">添加二级导航</el-button>
                      <el-button type="text" @click="deleteNavigation(element)">删除</el-button>
                    </span>
                  </li>
                </ul>

                <el-collapse-transition>
                  <div v-if="element.children!==null&&element.children.length>0" v-show="element.expand" :id="'child'+i" :class="'child'+i" class="child">
                    <draggable :id="'item'+element.id" animation="300" :group="'child'+i" @update="childDatadragEnd(element)">
                      <transition-group>
                        <div v-for="(item,index) in element.children" :key="index+item.id+100" :data-id="item.id">
                          <ul>
                            <li class="sort" />
                            <li class="name">
                              <span class="expand-the-text-level">{{ item.navigationName }}</span>
                            </li>
                            <li class="early-definition-name">{{ item.navigationCustomizeName }}</li>
                            <li class="level"> {{ item.parentId===null||parseInt(item.parentId)===0?'一级导航':'二级导航' }}</li>
                            <li class="status">
                              <el-switch
                                v-model="item.status"
                                style="display: block"
                                active-text="启用"
                                inactive-text="停用"
                                @change="stateTorsion(item)"
                              />
                            </li>
                            <li class="operating">
                              <el-button type="text" @click="addFirstLevelNavigation('edit',item)">编辑</el-button>
                              <el-button type="text" @click="deleteNavigation(item)">删除</el-button>
                            </li>
                          </ul>
                        </div>
                      </transition-group>
                    </draggable>
                  </div>
                </el-collapse-transition>
              </div>
            </transition-group>
          </draggable>
        </el-tab-pane>
        <el-tab-pane label="轮播图设置" name="second">
          <rim v-if="activeName==='second'" />
        </el-tab-pane>
        <el-tab-pane label="首页设置" name="third">
          <pageSet v-if="activeName==='third'" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="导航级别" prop="navigationLevel">
            <el-select v-model="ruleForm.navigationLevel" placeholder="请选择导航级别" style="width:100%" :disabled="disable" @change="selectLevel">
              <el-option label="一级导航" value="0" />
              <el-option label="二级导航" value="1" />
            </el-select>
            <!-- <el-input v-model="ruleForm.navigationLevel" /> -->
          </el-form-item>
          <el-form-item v-if="parseInt(ruleForm.navigationLevel)===1" label="父级导航" prop="parentNavigation">
            <el-select v-model="ruleForm.parentNavigation" placeholder="请选择导航级别" style="width:100%">
              <el-option v-for="(item,index) in myArray" :key="index" :label="item.navigationName" :value="item.id" :disabled="index===0" />
            </el-select>
          </el-form-item>
          <el-form-item label="导航名称" prop="navigationName">
            <el-input v-model="ruleForm.navigationName" maxlength="10" placeholder="请输入2-10个字，允许汉字、字母、数字、符号-" @input="changeValue('navigationName')" />
          </el-form-item>
          <el-form-item label="自定义名称">
            <el-input v-model="ruleForm.navigationCustomizeName" maxlength="10" placeholder="不超过10个字(允许汉字/数字/字母及符号-)" @input="changeValue('navigationCustomizeName')" />
          </el-form-item>
          <el-form-item v-if="save==='add'||ruleForm.deletable!==0" label="路由名称" prop="navigationUrl">
            <el-input v-model="ruleForm.navigationUrl" placeholder="请输入跳转的路由名称" />
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
import { getWebsiteNavigation, deleteWebsiteNavigation, modifyTheNavigationBarStatus, sort } from '../../api/setting'
import rim from '../../components/setting/rim'
import pageSet from '../../components/setting/pageSet'
export default {
  components: {
    draggable,
    rim,
    pageSet
  },
  data() {
    var verificationURL = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入跳转的URL链接'))
      } else if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.test(value) || value === '#') {
        callback()
      } else {
        callback(new Error('请输入正确的URL链接'))
      }
    }
    return {
      mainShow: false,
      value2: true,
      dialogTitle: '',
      activeName: 'first',
      rotate: false,
      drag: false,
      // 定义要被拖拽对象的数组
      myArray: [],
      fArr: [],
      cArr: [],
      expandArr: [],
      sortArray: [],
      stauts: true,
      beginningId: '',
      dialogVisible: false,
      save: '',
      disable: false,
      ruleForm: {
        id: null,
        navigationUrl: '',
        navigationName: '',
        navigationCustomizeName: '',
        navigationLevel: '',
        parentNavigation: '',
        windowOpen: '1',
        deletable: 1
      },
      rules: {
        navigationUrl: [
          { required: true, message: '请输入跳转的路由名称', trigger: 'blur' }
          // { required: true, message: '请输入跳转的URL链接', trigger: 'blur' },
          // { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        navigationName: [
          { required: true, message: '请输入导航名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        navigationLevel: [
          { required: true, message: '请选择导航级别', trigger: 'change' }
        ],
        parentNavigation: [{ required: true, message: '请选择父级导航', trigger: 'change' }]
      }
    }
  },
  watch: {
    $route: {
      handler(newName, oldName) {
        if (newName.name === 'websiteSet') {
          this.mainShow = true
        } else {
          this.mainShow = false
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    }
  },
  created() {
    this.getTableData()
    if (sessionStorage.getItem('back')) {
      this.activeName = 'third'
      sessionStorage.removeItem('back')
    }
    // console.log(this.fArr)
  },
  mounted() {
  // 阻止默认行为
  },
  methods: {
    changeValue(val) {
      this.ruleForm[val] = this.ruleForm[val].replace(/[^\u4E00-\u9FA5　a-z A-Z \d , ( ) （　）-]/g, '')
    },
    getTableData() {
      getWebsiteNavigation().then(res => {
        this.myArray = res.data
        this.sortArray = []
        for (let index = 0; index < this.myArray.length; index++) {
          this.beginningId = this.myArray[0].id
          const u = { id: this.myArray[index].id, sortOrder: index + 1 }
          this.sortArray.push(u)
          if (this.myArray[index].isOpen === 1) {
            this.$set(this.myArray[index], 'status', true)
          } else {
            this.$set(this.myArray[index], 'status', false)
          }
          this.$set(this.myArray[index], 'sortArray', [])
          if (this.myArray[index].children !== null && this.myArray[index].children.length > 0) {
            for (let i = 0; i < this.myArray[index].children.length; i++) {
              const o = { id: this.myArray[index].children[i].id, sortOrder: i + 1 }
              this.myArray[index].sortArray.push(o)
              this.fArr.push(this.myArray[index].children[i].id)
              if (this.myArray[index].children[i].isOpen === 1) {
                this.$set(this.myArray[index].children[i], 'status', true)
              } else {
                this.$set(this.myArray[index].children[i], 'status', false)
              }
            }
          }
          if (this.expandArr.indexOf(this.myArray[index].id) > -1) {
            this.$set(this.myArray[index], 'expand', true)
          } else {
            this.$set(this.myArray[index], 'expand', false)
          }
        }
        this.fArr.push(this.beginningId)
        this.dialogVisible = false
        // console.log(this.myArray, this.sortArray)
      })
    },
    handleClick(val) {

    },
    datadragEnd() {
      // console.log('00000000000000')
      const data = []
      for (let index = 0; index < this.myArray.length; index++) {
        const p = { id: this.myArray[index].id, sortOrder: index + 1 }
        data.push(p)
      }
      const u = { oldSortList: this.sortArray, newSortList: data }
      sort(u).then(res => {
        if (res.success) {
          this.$message({ message: '移动成功', type: 'success' })
        }
      })
    },
    childDatadragEnd(val) {
      const y = '#item' + val.id + '>span>div'
      const array = document.querySelectorAll(y)
      const idList = []
      for (let index = 0; index < array.length; index++) {
        const k = { id: array[index].dataset.id, sortOrder: index + 1 }
        idList.push(k)
      }
      const eData = { oldSortList: val.sortArray, newSortList: idList }
      console.log(idList)
      sort(eData).then(res => {
        console.log(res)
        if (res.success) {
          this.$message({ message: '移动成功', type: 'success' })
        }
      })
    },
    onMove(e) {
      if (this.stauts) {
        if (this.cArr.indexOf(e.relatedContext.element.id) > -1) return false
        return true
      } else {
        return false
      }
    },
    fatherMove(e) {
      // if (e.relatedContext.element.id === 1) return false
      if (this.fArr.indexOf(e.relatedContext.element.id) > -1) return false
      return true
    },
    onStart() {
      // console.log(e)
      // this.drag = true
    },
    // 拖拽结束事件
    onEnd() {
      // console.log(this.myArray)
      // this.drag = false
    },
    expandTheNextLevel(val) {
      // console.log(val)
      if (!val.expand) {
        if (this.expandArr.indexOf(val.id) < 0) {
          this.expandArr.push(val.id)
        }
      } else {
        if (this.expandArr.indexOf(val.id) > -1) {
          this.expandArr.splice(this.expandArr.indexOf(val.id), 1)
        }
      }
      val.expand = !val.expand
      // this.$forceUpdate
    },
    getOtherChild(val) {
      this.stauts = true
    },
    choose(evt) {
    // const ITEM_HEIGHT = 153;
      const ITEM_HEIGHT = evt.item.offsetHeight
      const container = evt.path[1]
      const index = evt.oldIndex

      if (index * ITEM_HEIGHT < container.scrollTop) {
        container.scrollTo({
          top: index * ITEM_HEIGHT
        })
      } else if ((index + 1) * ITEM_HEIGHT > container.scrollTop + container.offsetHeight) {
        container.scrollTo({
          top: (index + 1) * ITEM_HEIGHT - container.offsetHeight
        })
      }
    },
    start() {
      this.rotate = !this.rotate
    },
    addFirstLevelNavigation(val, data) {
      // console.log(data)
      this.disable = val !== 'add'
      // console.log(this.disable)
      if (Object.keys(data).length === 0) {
        if (this.myArray.length === 5) {
          this.$message({
            message: '网站导航已满5个，无法新增',
            type: 'warning'
          })
          return false
        }
      } else {
        if (data.children !== null && data.children.length === 5 && val === 'add') {
          this.$message({
            message: '最多添加5个二级导航',
            type: 'warning'
          })
          return false
        }
      }

      this.ruleForm.deletable = Object.keys(data).length > 0 ? data.deletable : 1
      this.save = val === 'add' ? 'add' : 'edit'
      const text = Object.keys(data).length > 0 ? (parseInt(data.parentId) === 0 ? (val === 'add' ? '二级' : '一级') : '二级') : '一级'
      console.log(Object.keys(data).length > 0, data)
      if (val !== 'add') {
        this.ruleForm.id = data.id
        this.ruleForm.navigationLevel = parseInt(data.parentId) !== 0 ? '1' : '0'
        this.ruleForm.navigationUrl = data.navigationUrl
        this.ruleForm.navigationName = data.navigationName
        this.ruleForm.navigationCustomizeName = data.navigationCustomizeName
        this.ruleForm.parentNavigation = parseInt(data.parentId) === 0 ? data.id : data.parentId
        this.ruleForm.windowOpen = data.target === 1 ? '1' : '2'
      } else {
        if (Object.keys(data).length === 0) {
          for (const key in this.ruleForm) {
            if (key === 'navigationLevel') {
              this.ruleForm[key] = '0'
            } else if (key === 'windowOpen') {
              this.ruleForm[key] = '1'
            } else {
              this.ruleForm[key] = ''
            }
          }
        } else {
          for (const key in this.ruleForm) {
            if (key === 'navigationLevel') {
              this.ruleForm[key] = '1'
            } else if (key === 'windowOpen') {
              this.ruleForm[key] = '1'
            } else if (key === 'parentNavigation') {
              this.ruleForm[key] = data.id
            } else {
              this.ruleForm[key] = ''
            }
          }
        }
      }
      this.dialogTitle = val === 'add' ? `新增${text}导航菜单` : `编辑${text}导航菜单`
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
        deleteWebsiteNavigation(data).then(res => {
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
      if (parseInt(this.ruleForm.navigationLevel) === 0) {
        if (this.dialogTitle.indexOf('二级') > -1) {
          this.dialogTitle = this.dialogTitle.replace('二级', '一级')
        }
      } else {
        if (this.dialogTitle.indexOf('一级') > -1) {
          this.dialogTitle = this.dialogTitle.replace(/一级/, '二级')
        }
      }
    },
    stateTorsion(val) {
      console.log(val)
      const data = {
        id: val.id,
        isOpen: val.isOpen === 1 ? 0 : 1
      }
      const msg = val.isOpen === 1 ? '停用成功' : '启用成功'
      modifyTheNavigationBarStatus(data).then(res => {
        console.log(res)
        if (res.success) {
          this.$message({ type: 'success', message: msg })
        }
        this.getTableData()
      })
    },
    submitForm(formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            id: this.ruleForm.id !== null ? this.ruleForm.id : null,
            parentId: parseInt(this.ruleForm.navigationLevel) === 0 ? 0 : this.ruleForm.parentNavigation,
            navigationUrl: this.ruleForm.navigationUrl,
            navigationName: this.ruleForm.navigationName,
            navigationCustomizeName: this.ruleForm.navigationCustomizeName,
            target: this.ruleForm.windowOpen
          }
          if (this.save === 'add') {
            delete data.id
          }
          console.log(data, this.save)
          this.$axios(this.save === 'add' ? 'org/org-navigation' : 'org/org-navigation', data, { method: this.save === 'add' ? 'POST' : 'PUT' }).then(res => {
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
.main{
  min-height: calc(100vh - 50px)
  // min-height: cacl(100vh - 50px);
}
.setting-main{
  min-height: calc(100vh - 90px)
}
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
  min-height: calc(100vh - 50px);
  height: 100%;
  padding: 20px;
  .setting-main{
    padding: 20px;
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
    padding: 15px 0;
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
.name,.early-definition-name,.level,.status{
  width: 18%;

}
.operating{
  flex: 1;
}
.expand-the-text-level{
  cursor: pointer;
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
}

/deep/.el-dialog>.el-dialog__header{
  justify-content: space-between;
  span{
    padding-left: 20px;
  }
}
/deep/.el-dialog>.el-dialog__header,/deep/.el-dialog>.el-dialog__footer{
  height: 60px;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}
/deep/.el-dialog>.el-dialog__footer{
  justify-content: flex-end;
}
/deep/.el-dialog>.el-dialog__footer>span{
  padding-right:24px ;
}
</style>
