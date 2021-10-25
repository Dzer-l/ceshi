<template>
    <div class="order-jurisdiction-box">
        <div class="order-info">
            <div class="title">{{productionName}}</div>
            <div class="order-info-item">
                <div>公证事项</div>
                <div style="padding-left:20px;color:#000">{{notaryName}}</div>
            </div>
            <div class="order-info-item">
                <div>公证类型</div>
                <div style="padding-left:20px;color:#000">{{notaryType}}</div>
            </div>
        </div>
        <div class="table-box">
            <el-tabs v-model="activeName">
                <el-tab-pane label="订单权限" name="first">
                    <div class="hint-box">
                        <i style="padding:0 15px;font-size:24px" class="el-icon-warning-outline"></i>
                        <span>关联的用户将拥有对该产品的订单进行分配的权限。</span>
                    </div>
                    <div class="button-box">
                        <el-button size='small' type="primary" @click="popupShowEvent">关联用户</el-button>
                    </div>
                    <div class="table">
                        <el-table :data="relevanceUserList" border stripe style="width: 100%">
                            <el-table-column prop="realName" label="姓名"></el-table-column>
                            <el-table-column prop="mobile" label="手机号"></el-table-column>
                            <el-table-column label="角色">
                                <template slot-scope="scope">
                                    <el-tag v-if="scope.row.parentId==null" disable-transitions style="margin: 0 10px 0 0;display:inline-block">超级管理员</el-tag>
                                    <div v-else>
                                        <el-tag v-for="(item, index) of scope.row.orgRoleList" :key="index" style="margin: 0 10px 0 0;display:inline-block">{{ item.roleName }}</el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="relieveRelevance(scope.row.id)">解除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="paging-box">
                        <el-pagination 
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="关联用户" width='665px' :visible.sync="relevanceUser" class="sign-manage-popup">
            <div class="transfer-box">
                <div class="left-select-box">
                    <div class="select-sum">选择用户（共{{userList.length}}个）</div>
                    <div class="select-list">
                        <div class="search" style="border-bottom:1px #ccc solid">
                            <el-input size='small' placeholder="请输入要搜索的用户姓名" v-model="search" class="input-with-select">
                                <el-button slot="append" icon="el-icon-search" @click="gainUserListEvent">搜索</el-button>
                            </el-input>
                        </div>
                        <el-checkbox-group v-model="checkList" style="max-height:360px;overflow: auto;" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="(item,index) in userList" :key='index' :disabled='item.have===0?false:true' :label="item.orgUserId">{{item.realName}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div style="padding:0 12px;display:flex;align-items: center;">
                    <img src="@/assets/imgs/arrows.svg" alt="">
                </div>
                <div class="right-select-box">
                    <div class="select-sum">已选择（{{checkListed.length}}）个</div>
                    <div class="select-list">
                        <div class="select" v-for="(item,index) in checkListed" :key='index'>
                            <div class="select-name">{{item.realName}}</div>
                            <el-button type="text"><i class="el-icon-error" style="color:#ccc" @click="removeSelectUser(item.orgUserId)"></i></el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="confirm-btn">
                <el-button plain size='small' @click="relevanceUser = false">取消</el-button>
                <el-button type="primary" size='small' @click="addProductionUserEvent">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {gainAllocationPrivilegeUser,gainUserList,addProductionUser,deleteProductionUser} from '@/api/productManage'
export default {
    data () {
        return {
            checkList:[],
            checkListed:[],
            search:'',
            relevanceUser:false,
            id:'',
            activeName:'first',
            userList:[],
            relevanceUserList:[],
            size:10,
            total:0,
            page:1,
            notaryName:'',
            notaryType:'',
            productionName:''
        }
    },
    created () {
       this.id=this.$route.query.id 
       this.notaryName=this.$route.query.name
       this.notaryType=this.$route.query.type
       this.productionName=this.$route.query.productionName
       this.gainAllocationPrivilegeUser()
    },
    methods: {
        // 分页事件
        handleCurrentChange(val){
            this.page=val
            this.gainAllocationPrivilegeUser()
        },
        handleSizeChange(val){
            this.size=val
            this.gainAllocationPrivilegeUser()
        },
        handleCheckedCitiesChange(val){
            this.checkListed=[]
            if(val.length>0){
                for(let x of val){
                    for(let y of this.userList){
                        if(y.orgUserId===x){
                            this.checkListed.push(y)
                        }
                    }
                }   
            }
        },
        removeSelectUser(id){
            for(let i=0;i<this.checkList.length;i++){
                if(this.checkList[i]===id){
                    this.checkList.splice(i,1)
                    this.handleCheckedCitiesChange(this.checkList)
                }
            }
        },
        gainUserListEvent(){
            gainUserList({productionId:this.id,realName:this.search}).then(res=>{
                if(res.success){
                    this.userList=JSON.parse(JSON.stringify(res.data))
                }
            })
        },
        // 获取关联用户列表事件
        gainAllocationPrivilegeUser(){
            gainAllocationPrivilegeUser({productionId:this.id,pageNum:this.page,pageSize:this.size}).then(res=>{
                if(res.success){
                    this.relevanceUserList=JSON.parse(JSON.stringify(res.data.list))
                    this.total=res.data.total
                }
            })
        },
        // 关联用户弹层显示事件
        popupShowEvent(){
            this.checkList=[]
            this.checkListed=[]
            this.gainUserListEvent()
            this.relevanceUser=true
        },
        //解除关联事件
        relieveRelevance(id){
            this.$confirm('是否确认解除该用户的订单分配权限？', '解除关联', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                deleteProductionUser({productionId:this.id,orgUserId:id,}).then(res=>{
                    if(res.success){
                        this.gainAllocationPrivilegeUser()
                        this.$message({
                            type: 'success',
                            message: '解除成功!'
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消解除'
                })       
            })
        },
        addProductionUserEvent(){
            let params=[]
            for(let i of this.checkList){
                params.push({orgProductionId:this.id,orgUserId:i})
            }
            addProductionUser(params).then(res=>{
                if(res.success){
                    this.gainAllocationPrivilegeUser()
                    this.relevanceUser=false
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    })
                }
            })
        },
    }
}
</script>
<style lang='less' scoped>
.order-jurisdiction-box{
    background-color: #f5f5f5;
    padding: 20px;
    min-height: calc(100vh - 50px);
    .order-info{
        background-color: #fff;
        margin-bottom: 20px;
        line-height: 30px;
        .title{
            color: #333;
            font-size: 16px;
            font-weight: bold;
        }
        .order-info-item{
            display: flex;
            font-size: 14px;
            color: #333;
        }
    }
    .table-box{
        background-color: #fff;
        .hint-box{
            display: flex;
            align-items: center;
            background-color: #c4d6f0;
            line-height: 40px;
            font-size: 14px;
            color: #3366FF;
            margin-top: 9px;
        }
        .button-box{
            margin: 15px 0 10px 0px;
        }
    }
    .paging-box{
        padding: 20px 0px;
        /deep/.el-pagination{
            display: flex;
            justify-content: center;
        }
    }
    .transfer-box{
        font-size: 14px;
        display: flex;
        .left-select-box{
            flex: 1;
            /deep/.el-input-group__append{
                background-color: #409EFF;
                border-left-color: #409EFF;
                color: #fff;
            }
            .search{
                background-color: #409EFF;
            }
        }
        .right-select-box{
            flex: 1;
            .select{
                display: flex;
                justify-content: space-between;
                border-bottom: 1px #ccc solid;
                padding:0 15px;
                .select-name{
                    line-height: 40px;
                }
            }
            .select-list{
                overflow: auto;
                max-height: 400px;
            }
        }
    }
    .select-list{
        min-height: 400px;
        margin: 10px 0px 20px 0;
        border: #ccc 1px solid;
        .el-checkbox-group{
            display: flex;
            flex-direction: column;
            label{
                margin-right: 0;
                padding: 15px 0 15px 15px;
                border-bottom:1px #ccc solid ;
            }
        }
        /deep/.el-input__inner,/deep/.el-input-group__append{
            border-radius: 0;
            border: none;
        }
    }
    .select-sum{
        line-height: 30px;
    }
}
.order-jurisdiction-box>div{
    padding:20px;
}
 .sign-manage-popup{
     .confirm-btn{
         display: flex;
         justify-content: flex-end;
     }
 }   
</style>