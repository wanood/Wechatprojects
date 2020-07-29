<template>
  <scroll-view class="album_scroll_view" scroll-y @scrolltolower="handleToLower">
    <!-- 
      swiper标签
      1.自动轮播 ： autoplay
      2.指示器: indicator-dots
      3.衔接轮播: circular
      swiper 标签存在默认高度 150px
      image 标签默认宽度 320px  => 基本样式中已经重置了100% 默认高度为240px
      解决：计算图片的宽高比，把比例写到swiper标签样式中
     -->
    <!-- 轮播图开始 -->
    <view class="album_swiper">
      <swiper autoplay indicator-dots circular>
        <swiper-item v-for="item in banner" :key=item.id>
          <image :src="item.thumb"></image>
        </swiper-item>
      </swiper>
    </view>
    <!-- 轮播图结束 -->

    <!-- 列表开始 -->
    <view class="album_list">
      <navigator class="album_item" v-for="item in album" :key="item.id" :url="`/pages/album/index?id=${item.id}`">
        <!-- 条目左边图片 -->
        <view class="album_img">
          <!-- aspectFill对专辑项左侧的图片进行了渲染，既保证原来图片内容的等比例拉伸，同时也会把这个图片拉伸至整张图的大小 -->
          <image :src="item.cover" mode="aspectFill"></image>
        </view>
        <!-- 条目右边 -->
        <view class="album_info">
          <view class="album_name">{{item.name}}</view>
          <view class="album_desc">{{item.desc}}</view>
          <view class="album_btn">
            <view class="album_attention">+关注</view>
          </view>
        </view>
      </navigator>
    </view>
    <!-- 列表结束 -->

  </scroll-view>
</template>

<script>
export default {
  data(){
    return{
      params:{
        limit:30,
        order:"new",
        skip:0
      },
      //轮播图数组
      banner:[],
      //列表数组
      album:[],
      //是否还有分页数据
      hasMore:true
    }
  },
  mounted(){
    //修改页面的标题
    uni.setNavigationBarTitle({title:"专辑"})
    this.getList();
  },
  methods:{
    //获取接口数据
    getList(){
      this.request({
        url: 'http://157.122.54.189:9088/image/v1/wallpaper/album',
        data: this.params
      }).then(result=>{
        console.log();
        
        if(this.banner.length===0){
          this.banner=result.res.banner;
        }

        if(result.res.album.length===0){
          this.hasMore=false;
          uni.showToast({
            title:"没有了",
            icon:"none"
          })
          return;
        }
        this.album=[...this.album,...result.res.album];
      });
    },
    //上拉加载，执行分页
    handleToLower(){
      
      if(this.hasMore){
        this.params.skip+=this.params.limit;
        this.getList();
      }else{
        uni.showToast({
          title:"没有了",
          icon:"none"
        })
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
.album_scroll_view{
  height: calc(100vh - 36px);
}
.album_swiper{
  swiper{
    //750rpx
    height: calc(750rpx / 2.3);
    image{
      height: 100%;
    }
  }
}
.album_list {
  padding: 10rpx;
  .album_item {
    // 每个item之间上下间隔10rpx，左右不给为0
    padding: 10rpx 0;
    display: flex;
    border-bottom: 1rpx solid #ccc;
    .album_img {
      flex: 1;
      padding: 10rpx;
      image {
        width: 200rpx;
        height: 200rpx;
      }
    }

    .album_info {
      flex: 2;
      padding: 0 10rpx;
      //文字很多就截取，出现“...”效果
      overflow: hidden;
      .album_name {
        font-size: 30rpx;
        color: #000;
        padding: 10rpx 0;
      }

      .album_desc {
        padding: 10rpx 0;
        font-size: 24rpx;
        // 文字描述部分的优化
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .album_btn {
        padding: 10rpx;
        display: flex;
        //靠右显示
        justify-content: flex-end;
        .album_attention {
          color: $color;
          border: 1rpx solid $color;
          padding: 10rpx;
        }
      }
    }
  }
}
</style>