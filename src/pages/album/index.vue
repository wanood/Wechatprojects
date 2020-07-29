<template>
  <view>
  <!-- 专辑背景开始 -->
  <view class="album_bg">
    <image :src="album.cover" mode="widthFix"></image>
    <view class="album_info">
      <view class="album_name">{{album.name}}</view>
      <view class="album_btn">关注专辑</view>
    </view>
  </view>
  <!-- 专辑背景结束 -->

  <!-- 专辑作者开始 -->
  <view class="album_author">
    <view class="album_info">
      <image :src="album.user.avatar" mode="widthFix"></image>
      <view class="author_name">{{album.user.name}}</view>
    </view>
    <view class="album_author_desc">
      <!-- 描述文字可能存在换行符，空格等，view标签解释不出来，用text标签是比较好的习惯（功能比较多，支持复制粘贴等） -->
      <text>{{album.desc}}</text>
    </view>
  </view>
  <!-- 专辑作者结束 -->

  <!-- 列表开始 -->
  <view class="album_list">
    <view class="album_item" v-for="(item,index) in wallpaper" :key="item.id">
    <go-detail :list="wallpaper" :index="index">
      <image :src="item.thumb+item.rule.replace('$<Height>',360)" mode="aspectFill"></image>
    </go-detail>
      
    </view>
  </view>
  <!-- 列表技术 -->

  </view>
</template>

<script>
import goDetail from "@/components/goDetail"
export default {
  components:{goDetail},
  data(){
    return{
      params:{
        limit:30,
        order:"new",
        skip:0,
        //1表示第一次请求数据，返回值中有album对象信息，0表示不是第一次请求数据，且无album对象信息，只有wallpaper数组
        first:1 
      },
      //为了方便获取，将id变为全局参数
      id:-1,
      album:{},
      wallpaper:[],
      hasMore:true
    }
  },
  onLoad(options){
    // console.log(options);
    //页面加载完毕会触发onLoad,然后拿到id（this.id），在通过this.getList拿到请求
    this.id =  options.id;
    this.getList();

  },
  //页面触底 上拉加载下一页 滑动包含整个页面，而scrop-view标签滑动不包含搜索框栏
  onReachBottom(){
    if(this.hasMore){
      this.params.first=0;
      this.params.skip+=this.params.limit;
      this.getList();
    }else{
      uni.showToast({
        title:"没有了",
        icon:"none"
      })
    }
  },
  methods:{
    getList(){
      this.request({
        url:`http://157.122.54.189:9088/image/v1/wallpaper/album/${this.id}/wallpaper`,
        data:this.params
      }).then(result=>{
        if(Object.keys(this.album).length===0){
        this.album=result.res.album;
        }

        if(result.res.wallpaper.length===0){
          this.hasMore=false
          uni.showToast({
            title:"没有了",
            icon:"none"
          })
          return;
        }
        this.wallpaper=[...this.wallpaper,...result.res.wallpaper];
        
        
      })
    }
  }
}
</script>

<style lang = "scss" scoped>
.album_bg {
  /* 大标签相对定位 */
  position: relative;
  image {

  }
  /* 绝对定位 */
  .album_info {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    display: flex;
    /* 放两边 */
    justify-content: space-between;
    height: 80rpx;
    /* 里面的子元素垂直居中 */
    align-items: center;
    color: #fff;
    padding: 0 15rpx;
    .album_name {
      font-size: 40rpx;
    }

    .album_btn {
      background-color: $color;
      width: 152rpx;
      height: 60rpx;
      display: flex;
      padding-right: 25rpx;
      /* 文字水平垂直居中 */
      justify-content: center;
      /* 垂直居中 */
      align-items: center;
      border-radius: 10rpx;
    }
  }
}
.album_author {
  padding: 10rpx;

  .album_info {
    padding: 10rpx 0;
    display: flex;
    image {
      width: 50rpx;
    }

    .author_name {
      color: #000;
      margin-left: 15rpx;
    }
  }

  .album_author_desc {

  }
}
.album_list {
  display: flex;  
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  .album_item {
    justify-content: space-around;
    width: 33.33%;
    border: 0px solid #fff;
    image {
      
    }
  }
}
</style>