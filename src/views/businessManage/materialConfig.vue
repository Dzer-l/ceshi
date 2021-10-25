<template>
  <section id="materialConfig">
    <div class="app-container">
      <div class="main-box">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">用户材料</el-menu-item>
          <el-menu-item index="2">事项所需材料</el-menu-item>
        </el-menu>
        <div v-show="activeIndex == '1'" class="content-box">
          <div class="material-box">
            <div class="client-box">
              <div class="client-header">{{ clientObj.roleName }}</div>
              <div class="client-content">
                <span>{{ clientObj.certTypeName }}</span>
                <ul>
                  <li v-for="item in clientObj.orgRoleCertTypes" :key="item.id">
                    <div :class="{selected:objSelected==clientObj.id&&idSelected==item.id}" @click="typeSelect(item,clientObj)">
                      {{ item.certName }}<i class="el-icon-arrow-right icon" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="trustee-box">
              <div class="trustee-header">{{ trusteeObj.roleName }}</div>
              <div class="trustee-content">
                <span>{{ trusteeObj.certTypeName }}</span>
                <ul>
                  <li v-for="item in trusteeObj.orgRoleCertTypes" :key="item.id">
                    <div :class="{selected:objSelected==trusteeObj.id&&idSelected==item.id}" @click="typeSelect(item,trusteeObj)">
                      {{ item.certName }}<i class="el-icon-arrow-right icon" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="search-table-box">
            <div class="search-box">
              <span>材料名称:</span>
              <el-input v-model="userListQuery.materialName" placeholder="请输入材料名称" size="medium" />
              <div style="min-width:155px;flex:1;">
                <el-button type="primary" size="medium" @click="search('user')">搜索</el-button>
                <el-button size="medium" @click="reset('user')">重置</el-button>
              </div>
            </div>
            <div class="table-box">
              <div class="align-right">
                <el-button size="medium" type="primary" style="margin-bottom:10px" @click="showAddMaterialDialog()">添加</el-button>
                <el-button size="medium" type="primary" style="margin-bottom:10px" @click="confirmDelete('multiple')">删除</el-button>
              </div>
              <el-table
                id="userMaterial"
                :key="tableKey"
                :v-loading="userListLoading"
                :data="userMaterialList"
                fit
                border
                highlight-current-row
                style="width: 100%;"
                @selection-change="setSelectionItem"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="顺序" width="100px">
                  <div class="move"><i class="el-icon-d-caret" /></div>
                </el-table-column>
                <el-table-column label="材料名称">
                  <template slot-scope="scope">
                    <span>{{ scope.row.materialName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  class-name="operate-cell"
                >
                  <template slot-scope="scope">
                    <span class="span-btn" @click="showEditDialog(scope.row)">编辑</span>
                    <span class="span-btn" @click="confirmDelete('single',scope.row)">删除</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-show="total>0"
                :page-size="userListQuery.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :current-page.sync="userListQuery.pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
                @current-change="getPaginationList"
                @size-change="handleSizeChange"
              />
            </div>
          </div>
        </div>
        <div v-show="activeIndex == '2'" style="padding:20px">
          <div class="search-box">
            <span>材料名称:</span>
            <el-input v-model="itemListQuery.materialName" placeholder="请输入产品名称" size="medium" />
            <div style="min-width:155px;flex:1;">
              <el-button type="primary" size="medium" @click="search('item')">搜索</el-button>
              <el-button size="medium" @click="reset('item')">重置</el-button>
            </div>
          </div>
          <div class="table-box">
            <div class="align-right">
              <el-button size="medium" type="primary" style="margin-bottom:10px" @click="showAddItemMaterialDialog()">添加</el-button>
              <el-button size="medium" type="primary" style="margin-bottom:10px" @click="confirmDeleteItem('multiple')">删除</el-button>
            </div>
            <el-table
              id="itemMaterial"
              :key="tableKey"
              v-loading="itemListLoading"
              :data="itemList"
              fit
              border
              highlight-current-row
              style="width: 100%;"
              @selection-change="getSelectedItemMaterial"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="顺序" width="100px">
                <div class="move"><i class="el-icon-d-caret" /></div>
              </el-table-column>
              <el-table-column label="材料名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.materialName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                class-name="operate-cell"
              >
                <template slot-scope="scope">
                  <span class="span-btn" @click="showEditDialog(scope.row)">编辑</span>
                  <span class="span-btn" @click="confirmDeleteItem('single',scope.row)">删除</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-show="total>0"
              :page-size="itemListQuery.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :current-page.sync="itemListQuery.pageNum"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              background
              @current-change="getPaginationList"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
        <!-- 添加材料对话框 -->
        <el-dialog title="添加材料" :visible.sync="addMaterialVisible" @close="closeAddMaterialDialog">
          <el-transfer
            ref="myTransfer"
            v-model="selectedMaterial"
            filterable
            :titles="['未选择', '已选择']"
            :data="MaterialList"
            :filter-method="filterMethod"
          />
          <!-- 新增材料对话框 -->
          <el-dialog width="30%" title="新增材料" :visible.sync="innerVisible" append-to-body @close="closeAddDialog">
            <el-alert title="需要注意，材料名称一经确认将无法更改。" style="background-color: #d2e3fe;color: #337aff;margin-bottom: 20px;" show-icon :closable="false" />
            <el-form ref="addMaterialForm" :model="addMaterialForm" :rules="addRules" label-width="100px" style="margin-top: 30px;">
              <el-form-item label="材料名称" prop="name">
                <el-input v-model="addMaterialForm.name" maxlength="50" />
              </el-form-item>
              <el-form-item label="说明" prop="desc">
                <el-input v-model="addMaterialForm.desc" type="textarea" maxlength="100" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeAddDialog()">取消</el-button>
              <el-button v-if="activeIndex === '1'" type="primary" @click="confirmAddNewMaterial('user')">确认</el-button>
              <el-button v-else-if="activeIndex === '2'" type="primary" @click="confirmAddNewMaterial('item')">确认</el-button>
            </div>
          </el-dialog>

          <div slot="footer" class="dialog-footer">
            <span class="add-material" @click="innerVisible = true">没有找到想要的材料，点击此处新增</span>
            <el-button @click="closeAddMaterialDialog()">取消</el-button>
            <el-button v-if="activeIndex === '1'" type="primary" @click="confirmAddMaterial('user')">确认</el-button>
            <el-button v-else-if="activeIndex === '2'" type="primary" @click="confirmAddMaterial('item')">确认</el-button>
          </div>
        </el-dialog>

        <!-- 编辑材料对话框 -->
        <el-dialog title="编辑材料" :visible.sync="editDialogVisible" @close="closeEditDialog">
          <el-form ref="editMaterialForm" :model="editMaterialForm" label-width="100px">
            <el-form-item label="材料名称" prop="name">
              <el-input v-model="editMaterialForm.materialName" disabled />
            </el-form-item>
            <el-form-item label="说明" prop="desc">
              <el-input v-model="editMaterialForm.materialDesc" type="textarea" maxlength="100" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeEditDialog()">取消</el-button>
            <el-button type="primary" @click="confirmEditMaterial()">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </section>
</template>

<script>
import { getClientList, getMaterialRe, editMaterial, selectCertTypeRe, selectMaterialRe, selectProductionMaterial, addRoleMaterial, deleteUserMaterial, addMaterial, addOrgNotaryMaterial, deleteItemMaterial, sortMaterial } from '@/api/productManage'
import Sortable from 'sortablejs'

export default {
  data() {
    return {
      activeIndex: '1', // 标记当前是哪个nav
      userListQuery: {
        pageSize: 10,
        pageNum: 1,
        materialName: '',
        orgRoleCertTypeId: null,
        roleCertTypeCode: null,
        productionCode: null
      },
      itemListQuery: {
        pageSize: 10,
        pageNum: 1,
        materialName: '',
        orgProductionId: 1
      },
      userListLoading: true,
      itemListLoading: false,
      tableKey: 0,
      userMaterialList: [], // 用户材料表
      itemList: [], // 事项材料表格
      total: 0,
      clientObj: { // 保存委托人信息
        roleName: '',
        certTypeName: '',
        orgRoleCertTypes: []
      },
      trusteeObj: { // 保存受托人信息
        roleName: '',
        certTypeName: '',
        orgRoleCertTypes: []
      },
      addMaterialForm: {
        name: '',
        desc: ''
      },
      editMaterialForm: {
        materialName: '',
        materialDesc: '',
        id: null
      },
      addRules: { // 新增材料校验规则
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      objSelected: null, // 保存被选中的是委托人还是受托人
      idSelected: null, // 保存被选中的材料id
      codeSelected: null, // 保存被选中的材料code
      addMaterialVisible: false, // 控制添加材料对话框显示
      editDialogVisible: false, // 编辑材料对话框显示
      innerVisible: false, // 新增材料对话框显示
      selectedMaterial: [], // 被选中材料
      MaterialList: [], // 存放所有材料
      selectedItemMaterial: [], // 存放勾选的事项材料
      selectedUserMaterial: [], // 存放勾选的用户材料
      orgProductionId: 1, // 存放传入的产品id
      productionCode: 1, // 存放传入的产品code
      tempRow: {} // 保存零时行数据
    }
  },
  created() {
    this.orgProductionId = Number(this.$route.query.productionId)
    this.productionCode = this.$route.query.productionCode
    console.log(this.orgProductionId)
    this.getClientList()
  },
  mounted() {
    this.rowDrop()
    this.itemRowDrop()
  },
  methods: {
    // nav切换
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      this.activeIndex = key
      // 初始化搜索条件
      this.userListQuery = {
        pageSize: 10,
        pageNum: 1,
        materialName: '',
        orgRoleCertTypeId: null
      }
      this.itemListQuery = {
        pageSize: 10,
        pageNum: 1,
        materialName: '',
        orgProductionId: this.orgProductionId
      }
      if (this.activeIndex === '1') {
        this.getClientList()
      } else if (this.activeIndex === '2') {
        this.getProductionMaterial()
      }
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('#userMaterial .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          console.log(newIndex, oldIndex)
          const param = {
            id1: _this.userMaterialList[oldIndex].id,
            id2: _this.userMaterialList[newIndex].id,
            index1: _this.userMaterialList[newIndex].sortOrder,
            index2: _this.userMaterialList[oldIndex].sortOrder
          }
          sortMaterial(param).then(res => {

          })
        }
      })
    },
    // 事项材料拖拽
    itemRowDrop() {
      const tbody = document.querySelector('#itemMaterial .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          console.log(newIndex, oldIndex)
          const param = {
            id1: _this.itemList[oldIndex].id,
            id2: _this.itemList[newIndex].id,
            index1: _this.itemList[newIndex].sortOrder,
            index2: _this.itemList[oldIndex].sortOrder
          }
          sortMaterial(param).then(res => {

          })
        }
      })
    },
    // 获取委托人材料
    getClientList() {
      const data = {
        orgProductionId: this.orgProductionId,
        pageSize: 10,
        pageNum: 1
      }
      getClientList(data).then(res => {
        if (res.success) {
          if (res.data) {
            this.clientObj = res.data[0]
            this.trusteeObj = res.data[1]
            // 默认选中委托人的第一项证件类型
            if (!this.objSelected) {
              this.objSelected = this.clientObj['id']
            }
            if (!this.idSelected) {
              this.idSelected = this.clientObj['orgRoleCertTypes'][0].id
            }
            // 获取到证件类型id后再查询材料列表
            if (!this.codeSelected) {
              this.codeSelected = this.clientObj['orgRoleCertTypes'][0].roleCertTypeCode
            }
            this.userListQuery.productionCode = this.productionCode
            this.userListQuery.roleCertTypeCode = this.codeSelected
            this.getMaterialRe()
          }
        }
      })
    },
    // 获取到证件类型id后再查询材料列表
    getMaterialRe() {
      getMaterialRe(this.userListQuery).then(res => {
        if (res) {
          this.total = res.total
          this.userMaterialList = res.list
          this.userListLoading = false
        }
      })
    },
    // 获取事项所需材料
    getProductionMaterial() {
      selectProductionMaterial(this.itemListQuery).then(res => {
        if (res.list) {
          this.itemList = res.list
        }
      })
    },
    // 证件类型选择
    typeSelect(item, obj) {
      this.objSelected = obj.id
      this.idSelected = item.id
      this.codeSelected = item.roleCertTypeCode
      // 获取到证件类型id初始化查询条件后再查询材料列表
      this.userListQuery.materialName = ''
      this.userListQuery.orgRoleCertTypeId = this.idSelected
      this.userListQuery.productionCode = this.productionCode
      this.userListQuery.roleCertTypeCode = this.codeSelected
      getMaterialRe(this.userListQuery).then(res => {
        if (res) {
          this.total = res.total
          this.userMaterialList = res.list
          this.userListLoading = false
        }
      })
    },
    getList() {
      getMaterialRe(this.userListQuery).then(res => {
        if (res) {
          this.total = res.total
          this.userMaterialList = res.list
          this.userListLoading = false
        }
      })
    },
    search(type) { // 条件搜索
      // this.listLoading = true
      if (type === 'user') {
        this.getList()
      } else if (type === 'item') {
        this.getProductionMaterial()
      }
    },
    reset(type) { // 重置表格
      // this.userListLoading = true;
      if (type === 'user') {
        this.userListQuery = {
          pageSize: 10,
          pageNum: 1,
          materialName: '',
          orgRoleCertTypeId: this.idSelected,
          roleCertTypeCode: this.codeSelected,
          productionCode: this.productionCode
        }
        this.getList()
      } else if (type === 'item') {
        this.itemListQuery = {
          pageSize: 10,
          pageNum: 1,
          materialName: '',
          orgProductionId: this.orgProductionId
        }
        this.getProductionMaterial()
      }
    },
    getPaginationList(e) {
      this.userListQuery.pageNum = e
      this.getList()
    },
    // 每页显示条数变化
    handleSizeChange(val) {
      this.userListQuery.pageSize = val
      this.getList()
    },
    // 显示添加材料模态框并
    showAddMaterialDialog() {
      this.getAllUserMaterial()
      this.addMaterialVisible = true
    },
    // 显示添加事项材料模态框
    showAddItemMaterialDialog() {
      this.getAllItemMaterial()
      this.addMaterialVisible = true
    },
    // 获取已经添加和未添加的用户材料
    getAllUserMaterial() {
      const data = {
        orgRoleCertTypeId: this.idSelected
      }
      selectCertTypeRe(data).then(res => {
        if (res.success) {
          const MaterialList = []; const selectedMaterial = []
          res.data.distributedList.forEach(item => {
            MaterialList.push({
              key: item.materialCode,
              label: item.materialName
            })
            selectedMaterial.push(item.materialCode)
          })
          res.data.notDistributedList.forEach(item => {
            MaterialList.push({
              key: item.materialCode,
              label: item.materialName
            })
          })
          console.log(this.$refs.myTransfer)
          this.MaterialList = MaterialList
          this.selectedMaterial = selectedMaterial
        }
      })
    },
    // 获取已经添加和未添加的事项材料
    getAllItemMaterial() {
      const data = {
        orgProductionId: this.orgProductionId
      }
      selectMaterialRe(data).then(res => {
        if (res.success) {
          const MaterialList = []; const selectedMaterial = []
          res.data.distributedList.forEach(item => {
            MaterialList.push({
              key: item.materialCode,
              label: item.materialName
            })
            selectedMaterial.push(item.materialCode)
          })
          res.data.notDistributedList.forEach(item => {
            MaterialList.push({
              key: item.materialCode,
              label: item.materialName
            })
          })
          this.MaterialList = MaterialList
          this.selectedMaterial = selectedMaterial
        }
      })
    },
    // 显示修改模态框
    showEditDialog(row) {
      console.log(row)
      this.tempRow = Object.assign({}, row)
      this.editMaterialForm = this.tempRow
      this.editDialogVisible = true
    },
    // 关闭添加材料对话框
    closeAddMaterialDialog() {
      this.addMaterialVisible = false
      this.$refs.myTransfer.clearQuery('left')
      this.$refs.myTransfer.clearQuery('right')
    },
    // 关闭新增材料模态框
    closeAddDialog() {
      this.innerVisible = false
      this.addMaterialForm.name = ''
      this.addMaterialForm.desc = ''
      this.$refs['addMaterialForm'].resetFields()
    },
    // 关闭修改模态框
    closeEditDialog() {
      this.editDialogVisible = false
    },
    // 删除确认框(用户材料)
    confirmDelete(type, row) {
      this.$confirm('是否确认删除此材料?', '删除材料', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param
        if (type === 'single') {
          param = {
            roleCertTypeCode: this.codeSelected,
            materialCodeList: [row.materialCode]
          }
        } else {
          const codes = []
          this.selectedUserMaterial.forEach(item => {
            codes.push(item.materialCode)
          })
          param = {
            roleCertTypeCode: this.codeSelected,
            materialCodeList: codes
          }
        }
        console.log(param)
        deleteUserMaterial(param).then(res => {
          if (res.success) {
            this.getMaterialRe()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除确认框(事项材料)
    confirmDeleteItem(type, row) {
      this.$confirm('是否确认删除此材料?', '删除材料', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param
        if (type === 'single') {
          param = {
            productionCode: this.productionCode,
            materialCodeList: [row.materialCode]
          }
        } else if (type === 'multiple') {
          const codes = []
          this.selectedItemMaterial.forEach(item => {
            codes.push(item.materialCode)
          })
          param = {
            productionCode: this.productionCode,
            materialCodeList: codes
          }
        }
        deleteItemMaterial(param).then(res => {
          if (res.success) {
            this.getProductionMaterial()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除多条材料
    deleteMultipleUserMaterial() {
      const data = {
        orgRoleCertTypeId: this.idSelected
      }
      deleteUserMaterial(data).then(res => {
        if (res.success) {
          this.getMaterialRe()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      })
    },
    // 确认添加材料(数据库已有材料的添加)
    confirmAddMaterial(type) {
      // console.log(this.selectedMaterial);
      const distributedList = []; const notDistributedList = [] // 已分配和未分配的材料
      console.log(this.MaterialList)
      this.MaterialList.forEach(item => {
        if (this.selectedMaterial.indexOf(item.key) !== -1) {
          distributedList.push({
            materialCode: item.key,
            productionCode: this.productionCode,
            roleCertTypeCode: this.codeSelected
          })
        } else {
          notDistributedList.push({
            materialCode: item.key,
            productionCode: this.productionCode,
            roleCertTypeCode: this.codeSelected
          })
        }
      })
      if (type === 'user') { // 添加用户材料
        const param = {
          distributedList: distributedList,
          notDistributedList: notDistributedList
        }
        addRoleMaterial(param).then(res => {
          if (res.success) {
            this.addMaterialVisible = false
            this.$fun.msg('添加材料成功', 'success')
            this.getClientList()
          }
        })
      } else if (type === 'item') { // 添加事项材料
        const param = {
          distributedList: distributedList,
          notDistributedList: notDistributedList
        }
        addOrgNotaryMaterial(param).then(res => {
          if (res.success) {
            this.addMaterialVisible = false
            this.$fun.msg('添加材料成功', 'success')
            this.getProductionMaterial()
          }
        })
      }
    },
    // 确认新增材料(添加新的材料到数据库)
    confirmAddNewMaterial(type) {
      this.$refs['addMaterialForm'].validate((valid) => {
        if (valid) {
          const data = {
            materialName: this.addMaterialForm.name,
            materialDesc: this.addMaterialForm.desc
          }
          addMaterial(data).then(res => {
            if (res.success) {
              this.closeAddDialog()
              this.$fun.msg('新增材料成功', 'success')
              if (type === 'user') {
                this.getAllUserMaterial()
              } else {
                this.getAllItemMaterial()
              }
            } else {
              this.$fun.msg(res.msg, 'error')
            }
          })
        } else {
          return false
        }
      })
    },
    // 确认修改材料
    confirmEditMaterial() {
      const data = {
        materialDesc: this.editMaterialForm.materialDesc,
        id: this.editMaterialForm.id
      }
      editMaterial(data).then(res => {
        if (res.success) {
          this.editDialogVisible = false
          this.$fun.msg('编辑材料成功', 'success')
        }
      })
    },
    // 保存当前选中的行
    setSelectionItem(rows) {
      this.selectedUserMaterial = rows
    },
    // 保存当前选中事项材料
    getSelectedItemMaterial(rows) {
      this.selectedItemMaterial = rows
      console.log(rows)
    },
    // 添加材料框搜索
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    }
  }
}
</script>

<style lang="scss">
#materialConfig{
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
    padding: 0px;
  }
  .main-box {
    background: #fff;
    padding: 30px;
    min-height: calc(100vh - 100px);
  }
  .content-box{
    padding: 20px;
    display: flex;
    .material-box{
      flex: 1;
      .client-box,.trustee-box{
        width: 100%;
        border: 1px solid #e6e6e6;
        margin-bottom: 30px;
        .client-header,.trustee-header{
          padding: 7px;
          height: 35px;
          line-height: 21px;
          font-weight: bold;
          border-bottom: 1px solid #e6e6e6;
          text-align: center;
          font-size: 15px;
        }
        .client-content,.trustee-content{
          padding: 7px 10px;
          font-size: 15px;
          ul{
            padding-left: 0px;
          }
          li{
            list-style: none;
            position: relative;
            font-size: 14px;
            cursor: pointer;
            .icon{
              position: absolute;
              right: 10px;
            }
          }
          li > div{
            padding: 5px 0 5px 20px;
          }
          li > div.selected{
            background-color: #409EFF;
          }
        }
      }
    }
    .search-table-box{
      flex: 4;
      border: 1px solid #e6e6e6;
      margin-left: 10px;
    }
    .table-box {
      background: #fff;
      padding: 30px;
      min-height: calc(100vh - 170px);
    }
  }
  .search-box {
    background: #fff;
    margin-bottom: 20px;
    padding: 30px;
    display: flex;
    >span{
      min-width: 75px;
      line-height: 36px;
    }
      .el-input,.el-select {
      // flex:1;
      width: 250px;
      margin-right: 30px;
    }
  }
  .el-dialog{
    width: 650px;
  }
  .add-material{
    color: #409EFF;
    line-height: 40px;
    float: left;
    cursor: pointer;
  }
  .move{
    cursor: pointer;
  }
  .operate-cell span{
    margin:0 15px 0 0;
  }
}
</style>
