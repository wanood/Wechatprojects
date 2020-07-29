<template>
  <scroll-view   @scrolltolower="handleToLower" class="recommend_view" scroll-y  v-if="recommends.length>0">
    <!-- 推荐开始 -->
    <view class="recommend_wrap">
      <!-- 给首页推荐模块中的图片添加超链接 重点是添加了一个:url  -->
      <navigator 
        class="recommend_item" 
        v-for="item in recommends" 
        :key="item.id" 
        :url="`/pages/album/index?id=${item.target}`">
        <!-- mode="widthFix"高度自适应；thumb表示存在于recommend属性中的缩略图 -->
        <image  :src="item.thumb" mode="widthFix"></image>  
      </navigator>
    </view>
    <!-- 推荐结束 -->

    <!-- 月份开始 -->
    <view class="months_wrap">
      <view class="months_title">
        <view class="months_title_info">
          <view class="months_info">
            <text>{{months.DD}}/</text>
            {{months.MM}}月 
          </view>
          <view class="months_text">  {{months.title}} </view>
        </view>
        <view class="months_title_more">更多>></view>
      </view>
      <view class="months_content"></view>
        <view class="months_item" v-for="(item,index) in months.items" :key= "item.id">
        <go-detail :list="months.item" :index= "index">
          <image :src= "item.thumb + item.rule.replace('$<Height>',360)"  mode="aspectFill"></image>
        </go-detail>
        </view>
    </view>
    <!-- 月份结束 -->

    <!-- 热门开始 -->

      <view class="hots_wrap">
        <view class="hots_title">
          <text>热门</text>
        </view>
        <view class="hots_content">
          <view class="hot_item" v-for="(item,index) in hots" :key= item.id>
          <go-detail :list="hots" :index="index">
            <image :src="item.thumb" mode="widthFix"></image>
          </go-detail>
          </view>
        </view>
      </view>

    <!-- 热门结束 -->
  </scroll-view>
</template>

<script>
import moment from "moment";
import goDetail from "@/components/goDetail";
export default {
  components:{
    goDetail
  },
  data(){
    return{
      //推荐列表
      recommends:[],
      ///月份
      months:{},
      //热门
      hots:[],
      //请求的参数 (这里知识将data换成全局的，方便修改)
      params:{
        limit:30,   //获取几条数据
        order:"hot",   //关键字,热门，直接写死
        skip:0 //当请求第一页数据的时候要跳过几条
      },
      //是否还有下一页
      hasMore:true
    };
  },
  //组件挂载完毕
  mounted(){
    //修改页面的标题
    uni.setNavigationBarTitle({title:"推荐"})
    this.getList();
  },
  methods:{
    //获取接口数据
    getList(){
      this.request({
        url: 'http://157.122.54.189:9088/image/v3/homepage/vertical',
        data:this.params,
      }).then(result=>{
        // console.log(result);
      //判断还有没有下一页数据===0表示没有数据了
      if(result.res.vertical.length===0){
        this.hasMore=false;
          uni.showToast({
            title:"没有了",
            icon:"none"
          })
        return;
      }
        //做优化的，避免多余加载
        if(this.recommends.length===0){
          //第一次发送的请求
          //推荐模块
          this.recommends=result.res.homepage[1].items;  //推荐模块拿到数据
          //月份模块
          this.months=result.res.homepage[2];
          //将时间戳改成动态时间（日月）moment.js ,stime的值是个时间戳
          this.months.MM=moment(this.months.stime).format("MM");
          this.months.DD=moment(this.months.stime).format("DD");
        }
        //获取热门数据的列表(表示“有数据啦”)
        //这里使用数组拼接的方式 es6  新的数组展开，旧的数组展开
        this.hots=[...this.hots,...result.res.vertical];
      });
    },
    //滚动条触底事件
    handleToLower(){
      /*
      1.修改参数  skip+=limit;每页30条，一页一页加载
      2.重新发送请求  getList()
      3.请求回来成功 hots 数据的叠加
      */

     if(this.hasMore){
     this.params.skip+=this.params.limit;
     this.getList();
     }else{
       //弹窗提示用户
       uni.showToast({
         title:"没有数据了",
         icon:"none"
       })
     }

    }
  }
}
</script>

<style lang = "scss" scoped> 
.recommend_view{
  /* height:屏幕的高度-头部标题的高度 */
  /* 屏幕的高度不能写死，因为不同机型高度不同，calc是计算属性 100vh为整个屏幕的高（它不包含底部tabbar的高，也不用考虑）*/
  height: calc(100vh - 36px);  
}
/* scoped为局部作用域，这个属性跟vue相关，这里直接用 */
.recommend_wrap{
  /* flex布局 */
  /*伸缩盒子*/
  display:flex;   
  /* 换行属性 */
  flex-wrap: wrap;  
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  .recommend_item{
    width: 50%;
    /* border:0rpx solid #fff; */

  }
}
.months_wrap {
  .months_title {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    .months_title_info {
      /* padding-left: 10rpx; */
      color:$color;
      font-size: 30rpx;
      font-weight: 600;
      display: flex;
      .months_info {
        text {
          font-size: 36rpx;
        }
      }

      .months_text {
        font-size: 34rpx;
        color: #666;
      }
    }

    .months_title_more {
      font-size: 30rpx;
      color:$color;
      margin-left: 25rpx;
    }
  }

  .months_content {
    display: flex;
    flex-wrap: wrap;
    .months_item{
      width: 33.33%;
      border: 5rpx solid #fff;
    }

  }
}
.hots_wrap {
  .hots_title {
    padding: 20rpx;
    text {
      border-left: 20rpx solid $color;
      padding-left: 20rpx;
      font-size: 34rpx;
      font-weight: 600;
    }
  }

  .hots_content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    .hot_item {
      width: 33.33%;
      /* border: 0px solid #fff; */
      image {

      }
    }
  }
}
</style>