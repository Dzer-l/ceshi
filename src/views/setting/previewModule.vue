<template>
    <div class="preview-box">
      <div class="content-top">
        <img src="../../assets/imgs/nav1-1.png" alt="">
      </div>
      <div class="middle-box" :style="{marginTop:index==0?(item.templateStyle==1?'-140px':'-110px'):'0'}" v-for="(item,index) in previewTemplateList" :key="index">
        <div v-if="item.templateType===1" class="content-box">
          <div class="product-name" v-if="item.templateStyle!==2" :style="{color:item.titleColor,textAlign:index==0?'left':'center'}">
            {{item.title}}
          </div>
          <div class="style2-type" v-if="item.templateStyle==2&&index==0">
            产品服务
          </div>
          <div class="content" v-if="item.templateType===1" :class="item.templateStyle===2?'content-right-float':''">
            <div class="img-box">
              <div class="img-show">
                <img width="100%" height="100%" :src="item.url" alt="">
              </div>
            </div>
            <div class="product-content">
              <div v-if="item.templateStyle===2" :style="{color:item.titleColor}" class="title">
                {{item.title}}
              </div>
              <div class="label-content" :style="{color:item.labelColor}">
                <span :class="item.templateStyle===2?'right-label':'left-label'" v-for="(item1,index1) in item.label" :key='index1'>{{item1}}</span>
              </div>
              <div :style="{color:item.descriptionColor}" class="describe">
                <p>{{item.description}}</p>
              </div>
              <div class="button-box" >
                <div :style="{color:item.buttonTextColor,background:item.buttonColor,width:(110+(item.buttonText.length-4)*9)+'px'}">
                  <div class="button-bg" :style="{background:item.buttonHoverColor}"></div>
                  <div class="text">
                    {{item.buttonText}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.templateType===2" class="publicity-box">
          <div>
            <img :src="item.url" alt="">
          </div>
          <!-- <div class="title">
            {{item.templateName}}
          </div> -->
        </div>
      </div>
      <div class="content-bottom">
        <img src="../../assets/imgs/preview-foot.png" alt="">
      </div>
    </div>
</template>
<script>
import {getPreviewConfiguration,getAllocationMap} from '../../api/setting'
export default {
    data () {
        return {
          bg:false,
          templateList:[],
          previewTemplateList:[]
        }
    },
    methods: {
      getList(){
        getPreviewConfiguration().then(res=>{
          if(res.success){
            this.templateList=JSON.parse(JSON.stringify(res.data))
            this.popupShowEvent()
          }
        })
      },
        async getBackgroundImg(id){
        return await new Promise((resolve, reject)=>{
            getAllocationMap({id:id}).then(async res=>{
                if(res.success){
                    resolve('data:image/jpeg;base64,'+res.data.data)
                }else{
                    reject()
                }
            })
        })
        },
        async popupShowEvent(){
          let null_array=[]
          for(let i of this.templateList){
            let obj=JSON.parse(JSON.stringify(i))
            if(obj.label!==null){
              if(obj.label.indexOf(',')!==-1){
                obj.label=obj.label.split(",")
              }else{
                obj.label=[]
                obj.label[0]=i.label
              }
            }
            obj.url=await this.getBackgroundImg(obj.id)
            null_array.push(obj)
          }
          this.previewTemplateList=JSON.parse(JSON.stringify(null_array))
        },
    },
    mounted () {
      this.getList()
    }
}
</script>
<style lang='less' scoped>
.content-bottom{
  img{
    margin: auto;
    display: block;
    width: 1200px;
  }
}
.content-top{
  img{
    width: 100%;
    display: block;
  }
}
.middle-box{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 120px;
  .product-name{
    font-size: 42px;
    font-weight: 700;
    line-height: 55px;
    margin-top: 20px;
    text-align: center;
    margin-bottom: 30px;
  }
  .style2-type{
    font-size: 30px;
    margin: auto;
    color: #fff;
    border-top: 1px #fff solid;
    width: 1200px;
    padding: 24px 0;
  }
  .content>div{
    width: 50%;
    height: 100%;
  }
  .content{
    width: 1200px;
    height: 450px;
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    background-color: #10224A;
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
      padding-left: 50px;
      .title{
        font-size: 36px;
        font-weight: 700;
        line-height: 47px;
      }
      .label-content{
        margin-top: 86px;
        display: flex;
        flex-direction: row;
        font-size: 28px;
        line-height: 37px;
        span{
          margin-right:15px ;
        }
      }
      .describe{
        font-size: 18px;
        line-height: 36px;
        p{
          width: 336px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
      }
      .button-box>div{
        min-width: 124px;
        font-size:18px ;
        height: 45px;
        border-radius:4px;
        position: relative;
      } 
      .button-box>div:hover>.button-bg{
        width: 100%;
      }
      .button-box{
        padding-top: 30px;
        display: flex;
        .button-bg{
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          opacity: 1;
          width: 0;
          border-radius: 4px;
          z-index: 0;
        }
      }
      .button-box .text{
        text-align: center;
        width: 100%;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        line-height: 45px;
        border-radius:4px ;
        white-space: nowrap;
      }
    }
  }
    .content-right-float{
      flex-direction: row;
      background-color: rgba(255, 255, 255, 0);
      .product-content{
        margin-top: 70px;
        .label-content{
          flex-direction: row-reverse;
          margin-top: 20px;
          span{
            margin-right: 0px;
            margin-left: 15px;
          }
        }
      }
      .product-content>div{
          text-align: right;
          display: flex;
          flex-direction: row-reverse;
      }
}
  .background-img-box{
    flex: 1;
    max-width: 1200px;
    height: 360px;
    background-size:100% 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .publicity-box{
    width: 100%;
    img{
      width: 100%;
    }
    .title{
      line-height: 30px;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
    }
  }
}
.preview-box .left-float-content>div{
  display: flex;
  flex-direction: row-reverse;
}
.preview-box .left-float-content .describe{
  text-align: right;
}
/deep/.middle-box .left-float-content .label-box>.right-label{
  padding-left: 20px;
}
.preview-box>.bg{
  background-color:rgb(235, 248, 253) ;
}
</style>