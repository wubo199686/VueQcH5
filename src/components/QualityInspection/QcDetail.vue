<template>
  <div id="app">
    <div class="title">
      <span><b>待质检明细</b></span>
    </div>
    <div class="search">
      <mt-search v-model="reportno"
                 cancel-text="取消"
                 placeholder="输入证书号进行模糊搜索,批量搜索用逗号分隔">
      </mt-search>
    </div>
    <div class="mask"
        v-if="list.length === 0">暂无数据~</div>
    <div class="ulDiv">
      <ul class="wrap"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="isMoreLoading"
          :infinite-scroll-immediate-check="true"
          infinite-scroll-distance="10">
        <li v-for="(item, index) in list"
            :key="index">
          <table class="tb">
            <tr align='center'
                v-if="index===0">
              <td width="20%">证书号</td>
              <td width="13%">克拉</td>
              <td width="13%">颜色</td>
              <td width="13%">净度</td>
              <td width="20%">买退点</td>
              <td width="20%">买美金/粒</td>
            </tr>
            <br />
            <tr align='center'>
              <td width="20%">{{item.reportno}}</td>
              <td width="13%">{{item.carat}}</td>
              <td width="13%">{{item.color}}</td>
              <td width="13%">{{item.clarity}}</td>
              <td width="20%">{{item.back}}</td>
              <td width="20%">{{item.dollorprice}}</td>
            </tr>
          </table>
        </li>
      </ul>
      <!--显示加载中-->
      <div v-if="isLoading"
           class="loading-more">
        <mt-spinner type="snake"></mt-spinner>
      </div>
      <div class="no-more"
           v-if="noMore && list.length !== 0">没有更多了~</div>
    </div>
    <div class="footer">
      <mt-tabbar v-model="selected">
        <mt-tab-item id="addqcorder">
          <img slot="icon"
               src="../../assets/add.png">
          添加质检单
        </mt-tab-item>
        <mt-tab-item id="qclist">
          <img slot="icon"
               src="../../assets/return.png">
          返回可质检查询
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>

<script>
import api from '@/axios/api.js';
import { Toast } from 'mint-ui';

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
        limit: 8,
        total: 0, // 总条数
        totalPage: 1 // 总分页数
      },
      s_rapnet: this.$route.query.rapnetid,
      reportno: '',
      qc_region_detail: this.$route.query.qc_region_detail,
      selected: ''
    };
  },
  methods: {
    getListInfo (type) {
      // 获取数据列表
      let that = this;
      that.isLoading = true;

      api
        .JH_news(`/appapi/QcMobile.ashx?action=GetQcListGroupByRapid
                  &s_group=byrapaddress
                  &s_xmltype=waitingqc
                  &s_timetype=1
                  &s_qcstatus=0
                  &s_ontheway=0
                  &s_ispaged=0
                  &s_isgroup=0
                  &s_pagesize=${that.pageInfo.limit}
                  &s_pageindex=${that.pageInfo.page}
                  &s_rapnet=${that.s_rapnet}
                  &s_qc_region_detail=${encodeURIComponent(that.qc_region_detail)}
                  &mobile_reportno=${that.reportno}`, {
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
            // 根据证书号 需要去重
            that.list = that.filterArr(that.list, 'reportno');
            // 设置分页
            that.pageInfo.total = msg.records; // 总数据条数
            that.pageInfo.totalPage = Math.ceil(
              that.pageInfo.total / that.pageInfo.limit
            );
            console.log(
              '总页数',
              Math.ceil(that.pageInfo.total / that.pageInfo.limit)
            );
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
      setTimeout(() => {
        this.getListInfo('loadMore');
      }, 100);
    },
    JumpUrl (type) {
      switch (type) {
        case 'qclist':
          this.$router.push({
            name: 'QcList'
          });
          break;
        case 'addqcorder':
          this.$router.push({
            name: 'AddQcOrder',
            params: {rapnetid: this.s_rapnet,
            isadd: true
            }
          });
          break;
      }
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
    selected: function (val, oldVal) {
      // 这里就可以通过 val 的值变更来确定
      this.JumpUrl(val);
    },
    reportno: function (val, oldVal) {
      // 这里就可以通过 val 的值变更来确定
      setTimeout(() => {
        this.getListInfo('');
      }, 100);
    }
  },
  created () {
    this.getListInfo('loadMore');
  },
  mounted () {
  }
};
</script>

<style scoped>
.wrap {
  max-height: 68vh;
  height: 68vh;
  overflow-y: auto;
  padding-top: 10%;
}

.ulDiv li {
  list-style: none;
  margin-top: 0vh;
}

.mint-search {
  height: 20vh;
}

.tb {
  font-size: 0.8em;
}

.loading-more {
  padding-left: 45%;
}

.footer {
  width: 100%;
  background: #f8f8f8;
  position: fixed;
  bottom: 0;
}

.mask{
  margin-top: 10%;
}

.search {
  height: 5vh;
  width: 96%;
  padding-left: 2%;
}

</style>
