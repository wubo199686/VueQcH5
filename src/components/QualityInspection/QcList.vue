<template>
  <div id="app">
    <div class="title">
      <span><b>待质检查询</b></span>
    </div>
    <div class="search">
      <mt-search v-model="s_rapnet"
                 cancel-text="取消"
                 placeholder="输入RAPID模糊搜索,批量搜索用逗号分隔RAPID">
      </mt-search>
    </div>
    <div class="no-more mask"
         v-if="list.length === 0">暂无数据~</div>
    <!--<div style="position: absolute;right:2%;top:18%;opacity:0.5;">
      <img src="../../assets/menu.png" @click="JumpUrl()" alt="添加质检单"/>
    </div>-->
    <div class="ulDiv" id="content">
      <ul class="wrap"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="isMoreLoading"
          :infinite-scroll-immediate-check="true"
          infinite-scroll-distance="10"
          ref="wrap">
        <li v-for="(item, index) in list"
            :key="index" :id="index">
            <table class="tb">
              <tr align='left'>
                <td width="100px"><b>供应商:{{item.rapnetid}}</b></td>
                <router-link :to="{ name: 'QcDetail', query: { rapnetid: item.rapnetid,qc_region_detail:item.qc_region_detail}}">
                  <td width="40px"><i class="el-icon-view"></i></td>
                </router-link>
                <td width="40px" style="padding-left:5px"><i class="el-icon-edit-outline" @click="JumpUrl(item.rapnetid)"></i></td>
                <td width="150px">总金额:{{item.totalmoney}}$</td>
                <td width="60px">{{item.totalcount}}粒</td>
              </tr>
              <tr align='left' v-if="item.contactway!=null">
                <td colspan="3">联系方式:{{item.contactway}}</td>
              </tr>
              <tr align='left'>
                <td colspan="5">QC地点:{{item.qc_region_detail}}</td>
              </tr>
              <tr align='left'>
                <td colspan="3">备注:{{item.remark}}</td>
              </tr>
            </table>
        </li>
      </ul>
      <!--显示加载中-->
      <!--<div v-if="isLoading"
           class="loading-more">
        <mt-spinner type="snake"></mt-spinner>
      </div>-->
      <div class="no-more"
           v-if="noMore && list.length !== 0" style="padding-top:5%">没有更多了~</div>
    </div>
    <div style="position: absolute;right:5%;bottom:2%" v-if="list.length !== 0">
      <i class="el-icon-top topicon" @click="goTop()" alt="返回顶部"/>
    </div>
  </div>
</template>

<script>
import api from '@/axios/api.js';
import { Toast, Indicator } from 'mint-ui';

export default {
  data () {
    return {
      list: [],
      isLoading: false, // 加载中转菊花
      isMoreLoading: true, // 加载更多中
      noMore: false, // 是否还有更多
      pageInfo: {
        // 分页信息
        page: 1,
        limit: 0,
        total: 0, // 总条数
        totalPage: 1 // 总分页数
      },
      s_rapnet: ''
    };
  },
  methods: {
    getListInfo (type) {
      // 获取数据列表
      let that = this;
      that.isLoading = true;
      api.JH_news(`/appapi/QcMobile.ashx?action=GetQcListGroupByRapid
                  &s_group=byrapaddress
                  &s_xmltype=waitingqc
                  &s_timetype=1
                  &s_qcstatus=0
                  &s_ontheway=0
                  &s_ispaged=0
                  &s_isgroup=1
                  &s_pagesize=${that.pageInfo.limit}
                  &s_pageindex=${that.pageInfo.page}
                  &mobile_rapnet=${that.s_rapnet}`, {
        })
        .then(res => {
          if (res.status === 1) {
            // 成功之后
            let msg = JSON.parse(res.msgdata);
            if (type === 'loadMore') {
              that.list = that.list.concat(msg.rows);
            } else {
              that.list = msg.rows;
            }
            // 根据供应商 qc地址 备注 联系方式去重
             that.list.forEach(item => {
                item.filter = `${item.rapnetid}/${item.qc_region_detail}/${item.contactway}/${item.remark}`;
             });
             that.list = that.filterArr(that.list, 'filter');
            // 设置分页
            that.pageInfo.total = msg.rows.length; // 总数据条数
            that.pageInfo.totalPage = Math.ceil(
              that.pageInfo.total / 8
            );
            Indicator.close();
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
          that.isLoading = false;
          that.isMoreLoading = false;
        })
        .catch(() => {
          Toast({
            message: '错了哦，这是一条错误消息',
            duration: 2000
          });
        });
    },
    // 加载更多
    loadMore () {
      this.pageInfo.page += 1; // 增加分页
      this.isMoreLoading = true; // 设置加载更多中
      this.isLoading = true; // 加载中
      if (this.pageInfo.page > this.pageInfo.totalPage) {
        // 超过了分页  但是判断条件不一定相同，
        this.noMore = true; // 显示没有更多了
        this.isLoading = false; // 关闭加载中
        return false;
      }
      // 缓冲
      this.getListInfo('loadMore');
    },
    JumpUrl (rapnetid) {
          this.$router.push({
            name: 'AddQcOrder',
            params: {
              isadd: true,
              rapnetid: rapnetid
            }
          });
    },
    init () {
        Indicator.open('加载中...');
        // 保存用户userId
        if (this.getQueryVariable('userId') !== undefined) {
            localStorage.setItem('userId', this.getQueryVariable('userId'));
        }
        // 缓冲
        this.getListInfo('loadMore');
    },
    goTop () {
      // 回到顶部
      document.getElementById('0').scrollIntoView(false);
    },
    getQueryVariable (variable) {
       var query = window.location.search.substring(1);
       var vars = query.split('&');
       for (var i = 0; i < vars.length; i++) {
               var pair = vars[i].split('=');
               if (pair[0] === variable) { return pair[1]; }
       }
       return (false);
    },
        // 根据对象中的属性进行去重
    filterArr (arr, name) {
         let hash = {};
         return arr.reduce((ss, item) => { // reduce累计器, ss是具体满足条件后返回的数据, item是数组依次循环的每一项
         // eslint-disable-next-line no-unused-expressions
         hash[item[name]] ? '' : hash[item[name]] = true && ss.push(item);
         // 1、判断对象的键值是否存在
         return ss;
       }, []);
    }
  },
   watch: {
    s_rapnet: function (val, oldVal) {
      // 这里就可以通过 val 的值变更来确定
      this.getListInfo('');
    }
  },
  created () {

  },
  mounted () {
      this.init();
  }
};
</script>
<style>
.mint-search-list{
 display: none !important;
}

*{
  margin:0;
  padding:0;
}

html,body{
  width:100%;
  height:100%;
  padding: 0;
  overflow: hidden;
}

::-webkit-scrollbar {
  display: none;
}

.title {
  width: 100%;
  height: 5vh;
  background:none;
  color: black;
  line-height: 5vh;
  border-bottom: 1px solid gray;
}

.mint-search {
  height: 20vh;
  padding-top: 1vh;
}
</style>

<style scoped>
.wrap {
  max-height: 78vh;
  height: 100%;
  overflow:scroll;
  padding-left:3%;
  padding-top: 5%;
}

.ulDiv li {
  list-style: none;
  padding-top: 2vh;
  width: 100%
}

.ulDiv li a{
  color: black;
}

.tb {
  font-size: 0.8em;
}

a {
  text-decoration: none;
  color: black;
}

.router-link-active {
  text-decoration: none;
}

.loading-more {
  padding-left: 45%;
}

.topicon{
  font-size: 28px;
  opacity:0.5;
}

.mask{
  padding-top: 10%;
}

.search {
  height: 5vh;
  width: 96%;
  padding-left: 2%;
}

</style>
