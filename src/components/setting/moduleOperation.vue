<template>
    <div class="form-box">
        <div class="form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="模块名称:" prop="templateName">
                    <el-input size="small" v-model="ruleForm.templateName" placeholder="请输入2-15个字"></el-input>
                </el-form-item>
                <el-form-item label="模块类型:" prop="templateType">
                    <el-select size="small" v-model="ruleForm.templateType" :disabled="type==='editModule'" placeholder="请选择" @change='templateTypeEvent'>
                        <el-option
                        v-for="item in templateTypeData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="模块样式:" prop="templateStyle">
                    <el-select size="small" :popper-class="select_show?'':'select_show'" :disabled="type==='editModule'" @focus="panduan" v-model="ruleForm.templateStyle" placeholder="请选择">
                        <el-option
                        v-for="item in templateStyleData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="text" style="margin-left:20px" @click="sampleShowEvent">查看示例</el-button>
                </el-form-item>
            </el-form>
            <div class="content-style-box" v-show="ruleForm.templateStyle!==''">
                <div class="content-style-item" v-show="ruleForm.templateType===2">
                    <div class="content-box">
                        <h2>图片设置</h2>
                        <el-form :model="ruleFormPublicity" :rules="rules" ref="ruleFormPublicity" label-width="110px">
                            <el-form-item label="宣传标签:" prop="publicity_title">
                                <el-input size="small" v-model="ruleFormPublicity.publicity_title" placeholder="请输入标签多个以','分割，勿含符号"></el-input>
                            </el-form-item>
                            <el-form-item label="宣传标语:" prop="publicity_label">
                                <el-input size="small" v-model="ruleFormPublicity.publicity_label" placeholder="请输入标语多个以','分割，勿含符号"></el-input>
                            </el-form-item>
                            <el-form-item label="跳转链接:" prop="imgUrl">
                                <el-input size="small" v-model="ruleFormPublicity.imgUrl" placeholder="请输入URL链接，如https://www.baidu.com"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="style-box">
                        <h2>样式设置</h2>
                        <div>
                            <p>标签颜色:</p>
                            <el-color-picker v-model="publicityStyleData.titleColor"></el-color-picker>
                        </div>
                        <div>
                            <p>标语颜色:</p>
                            <el-color-picker v-model="publicityStyleData.labelColor"></el-color-picker>
                        </div>
                    </div>
                </div>
                <div class="uploading-img-box">
                    <el-upload
                        class="avatar-uploader"
                        action
                        :before-upload="beforeUpload"
                        :show-file-list="false"
                        :http-request="upLoadFile">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <div v-else class="avatar-uploader-hint">
                            <div>点击上传图片</div>
                            <div style="color:#D9001B"><i class="el-icon-warning"></i><span> {{uploadImgHint}}</span></div>
                            <div>建议上传png、jpg格式，尺寸{{ruleForm.templateType===2?'1200*400':'600*450'}}px，大小300KB以内</div>
                        </div>
                    </el-upload>
                </div>
                <div class="content-style-item" v-show="ruleForm.templateType===1">
                    <div class="content-box">
                        <h2>内容设置</h2>
                        <el-form :model="ruleFormBusiness" :rules="rules" ref="ruleFormBusiness" label-width="110px">
                            <el-form-item label="业务标题:" prop="title">
                                <el-input size="small" v-model="ruleFormBusiness.title" placeholder="请输入2-15个字的标题，勿含符号"></el-input>
                            </el-form-item>
                            <el-form-item class="labels" v-for="(item,index) in ruleFormBusiness.label" :key="index" :label="item.labelName" :prop="'label.'+index+'.label'" :rules="rules.label">
                                <el-input size="small" v-model="item.label" placeholder="标签至多5个字，勿含符号"></el-input>
                                <span @click="addLabel" v-if="item.type==='add'" style="padding-left:12px;font-size:24px;line-height:40px;color:#28A164"><i :class="item.ico"></i></span>
                                <span @click="removeLabel(index)" v-else style="padding-left:12px;font-size:24px;line-height:40px;color:red"><i :class="item.ico"></i></span>
                            </el-form-item>
                            <el-form-item label="业务描述:" prop="description">
                                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 5 }" v-model="ruleFormBusiness.description" placeholder="请用2-150个字简要描述业务，用于业务宣传展示"></el-input>
                            </el-form-item>
                            <el-form-item label="按钮文字:" prop="buttonText">
                                <el-input size="small" v-model="ruleFormBusiness.buttonText" placeholder="请输入2-5个字，勿含符号"></el-input>
                            </el-form-item>
                            <el-form-item label="路由名称:" prop="buttonUrl">
                                <el-input size="small" v-model="ruleFormBusiness.buttonUrl" placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="style-box">
                        <h2>样式设置</h2>
                        <div>
                            <p>标题颜色:</p>
                            <el-color-picker v-model="businessStyleData.titleColor"></el-color-picker>
                        </div>
                        <div>
                            <p>标签颜色:</p>
                            <el-color-picker v-model="businessStyleData.labelColor"></el-color-picker>
                        </div>
                        <div>
                            <p>描述文字颜色:</p>
                            <el-color-picker v-model="businessStyleData.descriptionColor"></el-color-picker>
                        </div>
                        <div>
                            <p>按钮颜色:</p>
                            <el-color-picker v-model="businessStyleData.buttonColor"></el-color-picker>
                        </div>
                        <div>
                            <p>按钮文字颜色:</p>
                            <el-color-picker v-model="businessStyleData.buttonTextColor"></el-color-picker>
                        </div>
                        <div>
                            <p>按钮悬停颜色:</p>
                            <el-color-picker v-model="businessStyleData.buttonHoverColor"></el-color-picker>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-left:110px">
                <el-button size='small' type="primary" @click="submitForm">保存</el-button>
                <el-button size='small' @click="goBack">返回</el-button>
                <el-button type="warning" size='small' @click="previewEvent">预览</el-button>
            </div>
        </div>
        <div class="popup-box" v-show="popupShow">
            <div class="popup-item sample-graph" v-show="sampleGraphShow">
                <div class="title-button">
                    <div class="title">查看示例</div>
                    <div class="button" @click="popupHideEvent"><i class="el-icon-close"></i></div>
                </div>
                <div class="ensample-content">
                    <div class="img-box" v-if="ruleForm.templateType===2&&ruleForm.templateStyle===1"><img src="../../assets/imgs/publicity.png" alt=""></div>
                    <div class="img-box" v-if="ruleForm.templateType===1&&ruleForm.templateStyle===1"><img src="../../assets/imgs/style1.png" alt=""></div>
                    <div class="img-box" v-if="ruleForm.templateType===1&&ruleForm.templateStyle===2"><img src="../../assets/imgs/style2.png" alt=""></div>
                    <div v-if="ruleForm.templateStyle===''" style="font-weight: 650;color: #AAAAAA;font-size:18px">请先选择样式</div>
                </div>
            </div>
            <div class="popup-item preview-template" v-show="previewShow">
                <div class="title-button">
                    <div class="title">预览模块</div>
                    <div class="button" @click="popupHideEvent"><i class="el-icon-close"></i></div>
                </div>
                <div class="product-name" v-if="ruleForm.templateStyle!==2" :style="{color:businessStyleData.titleColor}">
                    {{ruleFormBusiness.title}}
                </div>
                <div class="content" v-if="ruleForm.templateType===1" :class="ruleForm.templateStyle===2?'content-right-float':''">
                    <div class="img-box">
                        <div v-if="ruleForm.templateStyle===2" class="mail-serve-name">产品服务</div>
                        <div class="img-show">
                            <img width="100%" height="100%" :src="imageUrl" alt="">
                        </div>
                    </div>
                    <div class="product-content">
                        <div v-if="ruleForm.templateStyle===2" :style="{color:businessStyleData.titleColor}" class="title">
                            {{ruleFormBusiness.title}}
                        </div>
                        <div class="label-content">
                            <div :style="{color:businessStyleData.labelColor}" v-for="(item,index) in ruleFormBusiness.label" :key='index'>
                                {{item.label}}
                            </div>
                        </div>
                        <div :style="{color:businessStyleData.descriptionColor}" class="describe">
                            <p>{{ruleFormBusiness.description}}</p>
                        </div>
                        <div class="button">
                            <el-button :style="{background:businessStyleData.buttonColor,borderColor:businessStyleData.buttonColor,color:businessStyleData.buttonTextColor}" size='small' type="primary">{{ruleFormBusiness.buttonText}}</el-button>
                        </div>
                    </div>
                </div>
                <div v-else class="preview-content" >
                    <div class="title" :style="{color:publicityStyleData.titleColor,backgroundImage:'url('+imageUrl+')'}">
                       <span>{{ruleFormPublicity.publicity_title}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {homePageUploadImage,addTemplate,getAllocationMap,editTemplate} from '../../api/setting'
export default {
    data () {
        var pattern = new RegExp("[`~!@#$^&*()=|{}%':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：'。，、？]")
        var symbol = new RegExp("[`~!@#$^&*()=|{}%':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：'。、？]")
        var is_path=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~#]+)\.)+([A-Za-z0-9-~#\/.])+$/
        var verifyModuleName=(rule, value, callback)=>{
            if(value.replace(/\s+/g,"").length===0){
                callback(new Error('不能为空'))
            }else if(value.replace(/\s+/g,"").length<2||value.replace(/\s+/g,"").length>15){
                callback(new Error('请输入2-15个字'))
            }else{
                callback()
            }
        }
        var verifyBusinessTitle=(rule, value, callback)=>{
            if(value.replace(/\s+/g,"").length===0){
                callback(new Error('不能为空'))
            }else if(value.replace(/\s+/g,"").length<2||value.replace(/\s+/g,"").length>15){
                callback(new Error('请输入2-15个字'))
            }else{
                if(pattern.test(value)){
                    callback(new Error('请勿含符号'))
                }else{
                    callback()
                }
                    
            }
        }
        var verifyLabel=(rule, value, callback)=>{
            if(value.replace(/\s+/g,"").length===0){
                callback()
            }else if(value.replace(/\s+/g,"").length>5){
                callback(new Error('请勿超过5个字'))
            }else{
                if(pattern.test(value)){
                    callback(new Error('请勿含符号'))
                }else{
                    callback()
                }  
            }
        }
        var verifyBusinessDescribe=(rule, value, callback)=>{
            if(value.replace(/\s+/g,"").length===0){
                callback(new Error('不能为空'))
            }else if(value.replace(/\s+/g,"").length<2||value.replace(/\s+/g,"").length>150){
                callback(new Error('请输入2-150个字'))
            }else{
                callback()
            }
        }
        var verifyButtonText=(rule, value, callback)=>{
            if(value.replace(/\s+/g,"").length===0){
                callback(new Error('不能为空'))
            }else if(value.replace(/\s+/g,"").length<2||value.replace(/\s+/g,"").length>5){
                callback(new Error('请输入2-5个字'))
            }else{
                if(pattern.test(value)){
                    callback(new Error('请勿含符号'))
                }else{
                    callback()
                }
                    
            }
        }
        var verifyIsLink=(rule, value, callback)=>{
            if(value.replace(/\s+/g,"").length===0){
                callback(new Error('不能为空'))
            }else{
                if(!is_path.test(value)){
                    callback(new Error('请输入正确的URL链接，如https://www.baidu.com'))
                }else{
                    callback()
                } 
            }
        }
        var publicity_verifyBusinessTitle=(rule, value, callback)=>{
            if(value.replace(/\s+/g,"").length>0){
                if(value.replace(/\s+/g,"").length<2||value.replace(/\s+/g,"").length>15){
                    callback(new Error('请输入2-15个字'))
                }else{
                    if(pattern.test(value)){
                        callback(new Error('请勿含符号'))
                    }else{
                        callback()
                    }
                }
            }else{
                callback()   
            }
        }
        var publicity_verifyIsLink=(rule, value, callback)=>{
            if(value&&value.replace(/\s+/g,"").length>0){
                if(!is_path.test(value)){
                    callback(new Error('请输入正确的URL链接，如https://www.baidu.com'))
                }else{
                    callback()
                }
            }else{
                callback()
            }
        }
        var publicity_verifyLabel=(rule, value, callback)=>{
            if(value&&value.replace(/\s+/g,"").length>0&&symbol.test(value)){
                callback(new Error('请勿含符号'))
            }else{
                callback()
            }
        }
        return {
            uploadImgHint:'请上传图片',
            imgFileData:'',
            imageUrl:'',
            businessStyleData:{
                titleColor:'#333333',
                labelColor:'#333333',
                descriptionColor:'#333333',
                buttonColor:'#1989FA',
                buttonTextColor:'#ffffff',
                buttonHoverColor:'#ffca28'
            },
            publicityStyleData:{
                titleColor:'#333333',
                labelColor:'#333333'
            },
            ruleForm:{
                templateName:'',
                templateType:'',
                templateStyle:''
            },
            ruleFormBusiness:{
                title:'',
                description:'',
                buttonText:'立即办理',
                buttonUrl:'',
                label:[{labelName:'标签：',label:'',ico:'el-icon-circle-plus',type:'add'}]
            },
            ruleFormPublicity:{
                publicity_title:'',
                imgUrl:'',
                publicity_label:''
            },
            rules:{
                templateName: [
                    { required: true,validator:verifyModuleName, trigger: "blur" }
                ],
                templateType:[
                    {required: true,message: "请选择模块类型",trigger: "change"}
                ],
                templateStyle:[
                    {required: true,message: "请选择模块样式",trigger: "change"}
                ],
                title:[
                    {required: true,validator: verifyBusinessTitle,trigger: "blur"}
                ],
                label:[
                    {required: false,validator: verifyLabel,trigger: "blur"}
                ],
                description:[
                    {required: true,validator: verifyBusinessDescribe,trigger: "blur"}
                ],
                buttonText:[
                    {required: true,validator: verifyButtonText,trigger: "blur"}
                ],
                buttonUrl:[
                    {required: true,message: "请输入路由名称",trigger: "blur"}
                ],
                publicity_title:[
                    {required: false,validator: publicity_verifyLabel,trigger: "blur"}
                ],
                publicity_label:[
                    {required: false,validator: publicity_verifyLabel,trigger: "blur"}
                ],
                imgUrl:[
                    {required: false,message: "请输入名称",trigger: "blur"}
                ]
            },
            templateTypeData:[{value:1,label:'业务入口'},{value:2,label:'宣传位'}],
            templateStyleData:[],
            select_show:false,
            popupShow:false,
            sampleGraphShow:false,
            previewShow:false,
            type:'',
            params:'',
            id:'',
            urls:''
        }
    },
    methods: {
        addLabel(){
            if(this.ruleFormBusiness.label.length<3){
                this.ruleFormBusiness.label.push({labelName:'',label:'',ico:'el-icon-remove',type:'subtract'})
            }else{
                this.$message({type:'error',message:'最多三个标签'})
            }
        },
        removeLabel(index){
            this.ruleFormBusiness.label.splice(index,1)
        },
        previewEvent(){
            this.popupShow=true
            this.previewShow=true
        },
        sampleShowEvent(){
            this.popupShow=true
            this.sampleGraphShow=true
        },
        popupHideEvent(){
            this.popupShow=false
            this.sampleGraphShow=false
            this.previewShow=false
        },
        templateTypeEvent(){
            if(this.type!=='editModule'){
                this.ruleForm.templateStyle=''
            }
            if(this.ruleForm.templateType===1){
                this.templateStyleData=[{value:1,label:'业务样式1'},{value:2,label:'业务样式2'}]
            }else{
                this.templateStyleData=[{value:1,label:'宣传位样式1'}]
            }
        },
        // 提交表单
        submitForm() {
            console.log(this.ruleFormBusiness)
            if(this.imgFileData===''){
                this.$message({
                    type: 'warning',
                    message: '请上传图片'
                })
                return 
            }
            let form=[]
            let form1=new Promise((resolve, reject) => {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            })
            form.push(form1)
            if(this.ruleForm.templateType===1){
                this.params=Object.assign({},this.ruleForm,this.ruleFormBusiness,this.businessStyleData,{imgFile:this.imgFileData})
                let form2=new Promise((resolve, reject) => {
                    this.$refs['ruleFormBusiness'].validate((valid) => {
                        if (valid) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
                })
                form.push(form2)
            }else{
                this.params=Object.assign({},this.ruleForm,this.ruleFormPublicity,this.publicityStyleData,{imgFile:this.imgFileData})
                let form3=new Promise((resolve, reject) => {
                    this.$refs['ruleFormPublicity'].validate((valid) => {
                        if (valid) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
                })
                form.push(form3)
            }
            this.verifyForm(form,this.params)
        },
        verifyForm(form,params){
            Promise.all(form).then((res) => {
                let is_verify=res.toString().indexOf('false')===-1?true:false
                if(params.templateType===1){
                    let labels=''
                    for(let i of params.label){
                        labels+=i.label+','
                    }
                    labels=labels.substr(0, labels.length - 1)
                    params.label=labels
                }
                if(params.templateType===2){
                    params.title=params.publicity_title
                    params.label=params.publicity_label
                    delete params.publicity_title
                    delete params.publicity_label
                }
                if(is_verify){
                    if(this.type==='editModule'){
                        delete params.templateType
                        delete params.templateStyle
                        params.id=this.id
                        editTemplate(params).then(res=>{
                            if(res.success){
                                this.goBack()
                                this.$message({
                                    message: '模块编辑成功',
                                    type: 'success'
                                });
                            }
                        })
                    }else{
                        addTemplate(params).then(res=>{
                            if(res.success){
                                this.goBack()
                                this.$message({
                                    message: '模块新增成功',
                                    type: 'success'
                                });
                            }
                        })
                    }
                }else{
                    return
                } 
            })
        },
        panduan(){
            if(this.ruleForm.templateType===''){
                this.$message({
                    type: 'warning',
                    message: '请先选择模块类型'
                })
            }else{
                this.select_show=true
            }
        },
        beforeUpload (file) {
            let _this = this
            if (file.type.indexOf('image') < 0) {
                _this.uploadImgHint='图片格式不符合要求'
                _this.$message.error('格式不支持，仅支持jpg/jpeg/png格式')
                return false
            }
            const is1M = file.size < 600 * 1024 // 限制小于300kb
            if (!is1M) {
                _this.uploadImgHint='图片大小不符合要求'
                _this.$message.error('图片大小不符合要求')
                return false
            }
            return new Promise((resolve, reject)=> {
                let _URL = window.URL || window.webkitURL
                let img = new Image();
                let width=_this.ruleForm.templateType==1?600:1200
                let height=_this.ruleForm.templateType==1?450:400
                img.onload = function () {
                    let valid = true
                    valid ? resolve() : reject()
                }
                img.src = _URL.createObjectURL(file)
            }).then(() => {
                return file
            }, () => {
                _this.uploadImgHint='图片尺寸不符合要求'
                _this.$message.error('图片尺寸不符合要求')
                return Promise.reject()
            })
        },
        upLoadFile(e){
            const file=e.file
            const formData = new FormData()
            formData.append('file',file)
            homePageUploadImage(formData).then(res=>{
                if(res.success){
                    let _URL = window.URL || window.webkitURL
                    this.imageUrl=_URL.createObjectURL(file)
                    this.imgFileData=JSON.stringify(res.data)
                }
            })
        },
        goBack(){
            sessionStorage.setItem('back',true)
            this.$router.go(-1)
        },
        dataEcho(){
            this.type=this.$route.query.type
            if(this.type==='editModule'&&sessionStorage.getItem('templateEdit')){
                let templateData=JSON.parse(sessionStorage.getItem('templateEdit'))
                this.id=templateData.id
                getAllocationMap({id:templateData.id}).then(async res=>{
                    if(res.success){
                        this.imageUrl='data:image/jpeg;base64,'+res.data.data
                    }
                })
                this.ruleForm.templateName=templateData.templateName
                this.ruleForm.templateType=templateData.templateType
                this.ruleForm.templateStyle=templateData.templateStyle
                this.imgFileData=templateData.imgFile
                this.templateTypeEvent()
                if(templateData.templateType===1){
                    this.businessStyleData.titleColor=templateData.titleColor
                    this.businessStyleData.labelColor=templateData.labelColor
                    this.businessStyleData.descriptionColor=templateData.descriptionColor
                    this.businessStyleData.buttonColor=templateData.buttonColor
                    this.businessStyleData.buttonTextColor=templateData.buttonTextColor
                    this.businessStyleData.buttonHoverColor=templateData.buttonHoverColor
                    this.ruleFormBusiness.title=templateData.title
                    this.ruleFormBusiness.description=templateData.description
                    this.ruleFormBusiness.buttonText=templateData.buttonText
                    this.ruleFormBusiness.buttonUrl=templateData.buttonUrl
                    let arrayData=[]
                    for(let i=0; i<templateData.label.split(",").length;i++){
                        let obj={label:templateData.label.split(",")[i]}
                        if(i===0){
                            obj.labelName='标签：'
                            obj.ico='el-icon-circle-plus'
                            obj.type='add'
                        }else{
                            obj.labelName=''
                            obj.ico='el-icon-remove'
                            obj.type='subtract'
                        }
                        arrayData.push(obj)
                    }
                    this.ruleFormBusiness.label=JSON.parse(JSON.stringify(arrayData))
                    console.log(this.ruleFormBusiness.label)
                }else{
                    this.ruleFormPublicity.publicity_title=templateData.title
                    this.ruleFormPublicity.publicity_label=templateData.label
                    this.ruleFormPublicity.imgUrl=templateData.imgUrl
                    this.publicityStyleData.titleColor=templateData.titleColor
                    this.publicityStyleData.labelColor=templateData.labelColor
                }
            }
        }
    },
    mounted () {
        this.dataEcho()
    }
}
</script>
<style lang='less' scoped>
.moduleOperation{
    padding: 20px;
    background-color: #fff;
    min-height: calc(100vh - 90px)
}
.form-box{
    /deep/.el-input{
        width: 400px;
    }
    /deep/.el-textarea__inner{
        width: 400px;
    }
}
.form-box .content-style-box{
    border: 1px rgba(235, 235, 235, 1) solid;
    box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.2);
    margin:0px 0px 20px 112px ;
    border-radius: 4px;
    /deep/.labels>div{
        display: flex;
        flex-direction: row;
    }
    .content-style-item{
        display: flex;
        flex-direction: row;
        .content-box{
            flex: 55;
            padding: 0 20px;
        }
        .style-box{
            p{
                width: 110px;
                text-align: right;
                font-size: 14px;
                color: #606266;
                line-height: 40px;
                font-weight: 700;
                padding-right:12px ;
                margin:0;
            }
            flex: 45;
        }
        .style-box>div{
            display: flex;
            align-items: center;
            margin:0 0 22px 0 ;
            /deep/.el-color-picker{
                height: 20px;
            }
            /deep/.el-color-picker__trigger{
                padding: 0px;
                border-width:0px ;
                width: 20px;
                height: 20px;
                /deep/.el-color-picker__color{
                    border: 1px rgba(121, 121, 121, 1) solid;
                }
            }
            /deep/.el-color-picker__icon{
                display: none;
            }
        }
    }
}
//图片上传样式
.uploading-img-box{
    display: flex;
    flex-direction: row;
    padding: 20px;
    
}
/deep/.avatar-uploader img{
    width: 600px;
}
.avatar-uploader{
    flex: 1;
    background-color: rgba(235, 248, 253, 1);
    border-radius: 4px;
    height: 450px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
/deep/.avatar-uploader .el-upload--text{
    width: 100%;
    height: 100%;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
/deep/.el-upload--text{
    display: block;
}
.avatar-uploader-hint {
    font-size: 14px;
    color: #8AC4DC;
    width: 100%;
    min-height: 450px;
    line-height: 30px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(235, 235, 235, 1);
    border-radius: 4px;
}
.popup-box{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 1002;
    .popup-item{
        width: 860px;
        background-color: #fff;
        border-radius: 5px;
        .title-button{
            font-size:14px ;
            line-height: 22px;
            padding: 20px;
            border-bottom: 1px #ccc solid;
            display: flex;
            justify-content: space-between;
            .button{
                font-size: 20px;
            }
        }
        .product-name{
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
            font-size: 30px;
        }
        .ensample-content{
            margin: 20px;
        }
        .content{
            display: flex;
            justify-content: space-between;
            flex-direction: row-reverse;
            margin: 20px;
            background-color: #10224A;
        }
        .content>div{
            width: 50%;
            height: 100%;
        }
        .preview-content{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 360px;
            padding: 20px;
            .title{
                font-size: 22px;
                font-weight: 600;
                text-align: center;
                line-height: 30px;
                margin-bottom:15px ;
                background-size: 100% 100%;
                min-height: 320px;
                width: 100%;
                padding-top:30px;
            }
        }
    }
}

.preview-template .content{
    .img-box{
        .mail-serve-name{
            flex-direction: row;
            font-size: 22px;
            padding: 12px 0px;
        }
        img{
            display: block;
        }
    }
    .product-content{
        padding-left: 20px;
        .title{
            font-size: 30px;
            line-height: 47px;
        }
        .label-content{
            margin-top: 86px;
            display: flex;
            flex-direction: row;
            font-size: 24px;
            line-height: 31px;
            div{
                margin-right:15px ;
            }
        }
        .describe{
            font-size: 14px;
            line-height: 25px;
            p{
                width: 336px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }
        }
        .button{
            margin-top:30px ;
            button{
                height: 36px;
            }
        }
    }
}
.preview-template.popup-item>.content-right-float{
    flex-direction: row;
    background-color: #fff;
    .label-content{
        margin-top: 20px;
        div{
            margin-right: 0px;
            margin-left: 15px;
        }
    }
    .product-content{
        margin-top: 70px;
    }
    .product-content>div{
        text-align: right;
        display: flex;
        flex-direction: row-reverse;
    }
}
.sample-graph{
    .img-box{
        img{
            width: 100%;
            display: block;
        }
    }
}
</style>
