<template>
  <div class="main-rim">
    <div class="setting-main" onselectstart="return false;">
      <el-button type="primary" style="margin:20px 0 40px 0" @click="addModule">新增模块</el-button>
      <!-- <el-button style="margin:20px 0 40px 15px" @click="popupShowEvent">预览首页</el-button> -->
      <div class="data-head">
        <ul>
          <li class="sort">排序</li>
          <li class="templateName">模块名称</li>
          <li class="title">标题</li>
          <li class="templateType">模块类型</li>
          <li class="templateState">状态</li>
          <li class="switch">是否上架</li>
          <li class="operating">操作</li>
        </ul>
      </div>
      <!--使用draggable组件-->
      <draggable v-model="templateList" group="setting-main" chosen-class="chosen" force-fallback="true" animation="300" @update="datadragEnd" @start="onStart">
        <transition-group>
          <div v-for="(element,index) in templateList" :key="element.id" class="item">
            <ul>
              <li class="sort"><i class="el-icon-d-caret" /></li>
              <li class="templateName">
                <span class="expand-the-text-level">
                  <span>{{element.templateName}}</span>
                </span>
              </li>
              <li class="title"><span>{{ element.title }}</span></li>
              <li class="templateType"><span>{{ element.templateType===1?'业务入口':'宣传位'}}</span></li>
              <li class="templateState" style="color:#67C329" v-if="element.templateState===2">已上架</li>
              <li class="templateState" style="color:#B3B7BE" v-if="element.templateState===1">待上架</li>
              <li class="templateState" style="color:#F56C6C" v-if="element.templateState===0">未上架</li>
              <li class="switch">
                <el-switch
                  v-model="element.templateState"
                  style="display: block"
                  :active-value="2"
                  :inactive-value="element.templateState!==2?element.templateState:''"
                  @change="stateTorsion(index,element.id)"
                />
              </li>
              <li class="operating">
                <span>
                  <el-button type="text" @click="tableEdit(element)">编辑</el-button>
                  <el-button type="text" @click="deleteNavigation(index,element.id)">删除</el-button>
                </span>
              </li>
            </ul>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { judgeWho } from '../../api/delegate'
import {getPageSetList,editPutawayState,templateSort} from '../../api/setting'
export default {
  components: {
    draggable
  },
  data() {
    return {
      // 定义要被拖拽对象的数组
      sortArray: [],
      dialogVisible: false,
      templateList:[],
      oldTemplateList:[],
      popupShow:false
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {
  // 阻止默认行为
  },
  methods: {
    popupShowEvent(){
      let routeData = this.$router.resolve({
      　　name:'previewModule'
      })
      window.open(routeData.href, '_blank');
    },
    //获取表格数据
    getTableData(){
      getPageSetList().then(res=>{
        if(res.success){
          console.log(res.data)
          this.templateList=JSON.parse(JSON.stringify(res.data))
        }
      })
    },
    addModule(){
        if(this.templateList.length<10){
            this.$router.push({name:'addModule'})
        }else{
            this.$message({ type: 'warning', message: '数量已达上限，无法继续新增' })
        }
    },
    datadragEnd() {
      let newTemplateList=[]
      for(let i=0;i<this.templateList.length;i++){
        const item={id:this.templateList[i].id,sortOrder:i+1}
        newTemplateList.push(item)
      }
      const data = { oldSortList: this.oldTemplateList, newSortList: newTemplateList }
      templateSort(data).then(res=>{
        if(res.success){
          this.$message({
            type: 'success',
            message: `移动成功`
          })
        }
      })
    },  
    onStart() {
      this.oldTemplateList=[]
      for(let i=0;i<this.templateList.length;i++){
        const item={id:this.templateList[i].id,sortOrder:i+1}
        this.oldTemplateList.push(item)
      }
    },
    deleteNavigation(index,id) {
        let status=this.templateList[index].templateState,title
        const h = this.$createElement;
        if(status===2){
            title='请先下架，再操作。'
        }else{
            title=''
        }
        this.$msgbox({
            title:'',
            message:h('div', {style:'line-height:24px'}, [
            h('p',{style:'display:flex;align-items: center;'},[h('i',{class:'el-icon-warning',style:'color:#FAAD14;font-size:20px;padding-right:15px'},''),h('span',null,`${status===2?'模块使用中，无法删除！':'删除后无法恢复，确定删除该模块？'}`)]),
            h('p', { style: 'color: red;padding-left:35px' }, title)
          ]),
            showCancelButton:status!==2?true:false,
            confirmButtonText: `${status===2?'知道了':'确定'}`,
            cancelButtonText: '取消'
        }).then(() => {
          if(status!==2){
            this.$axios(`org/org-home-page-conf/${id}`,{},{method:'DELETE'}).then(res=>{
              if(res.success){
                this.getTableData()
                this.$message({
                  type: 'success',
                  message: `删除成功!`
                })
              }
            })
          }
          
        }).catch(() => {
          if(status!==2){
            this.$message({
              type: 'info',
              message: `已取消删除`
            })
          } 
        })
    },
    //表格编辑事件
    tableEdit(item){
      sessionStorage.setItem('templateEdit',JSON.stringify(item))
      this.$router.push({name:'editModule',query:{type:'editModule'}})
    },
    stateTorsion(index,id) {
      let status=this.templateList[index].templateState,title
      const h = this.$createElement;
      if(status===2){
        title='确定后，将在网站首页展示。'
      }else{
        title='确定后，首页将不展示该模块。'
      }
      this.$msgbox({
        title:'',
        message:h('div', null, [
          h('p', null,[h('i',{class:'el-icon-warning',style:'color:#FAAD14;font-size:20px;padding-right:15px'},''),h('span',null,`确定${status===2?'上':'下'}架该模块？`)]),
          h('p', { style: 'color: red;padding-left:35px' }, title)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        editPutawayState({id:id,templateState:status===2?2:0}).then(res=>{
          if(res.success){
            this.getTableData()
            this.$message({
              type: 'success',
              message: `${status===2?'上':'下'}架成功!`
            })
          }
        })
      }).catch(() => {
        if(status===2){
          this.templateList[index].templateState=0
        }else{
          this.templateList[index].templateState=2
        }
        this.$message({
          type: 'info',
          message: `已取消${status===2?'上':'下'}架`
        })
      })
    },
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
.templateName,.title,.templateType,.templateState,.switch{
  width: 15%;

}
/deep/.early-definition-name>span{
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
</style>
