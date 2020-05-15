<template>
  <div id="app">
    <div class="title">
      <span><b>质检异常</b></span>
    </div>
    <div class="maincontent">
      <table>
        <tr style="height:5vh">
          <td align="left"
              width="62%"
              colspan="3">
            <mt-field v-bind:label="accountname">
              <label>已QC异常数量:{{errorsum}}</label>
            </mt-field>
          </td>
        </tr>
        <tr>
          <td align="left"
              colspan="3">
            <mt-field label="证书号:"
                      placeholder="请输入证书号"
                      v-model="s_reportno"
                      v-on:focus="focus()"></mt-field>
          </td>
        </tr>
        <tr>
          <td align="left"
              colspan="2">
            <mt-field label="质检备注:"
                      type="textarea"
                      rows="2"
                      placeholder="请输入质检备注"
                      v-model="s_remark"></mt-field>
          </td>
          <td>
            <mt-button size="small"
                       type="primary"
                       @click="save()">保存</mt-button>
          </td>
        </tr>
        <tr>
          <td align="left"
              colspan="3">
            <mt-field label="问题标识:">
              <mt-button size="small"
                         type="default"
                         ref="s_eyeclean" @click.native="selectItem($event)">净度问题</mt-button>
              <mt-button size="small"
                         type="default"
                         ref="s_milky" @click.native="selectItem($event)">奶色</mt-button>
              <mt-button size="small"
                         type="default"
                         ref="s_notarrived" @click.native="selectItem($event)">未到货</mt-button>
              <mt-button size="small"
                         type="default"
                         ref="s_broken" @click.native="selectItem($event)">底尖问题</mt-button>
              <mt-button size="small"
                         type="default"
                         ref="s_colish" @click.native="selectItem($event)">色调</mt-button>
            </mt-field>
          </td>
        </tr>
        <tr>
          <td align="left"
              colspan="3">
            <mt-field label="质检问题:"
                      placeholder=''
                      type="textarea"
                      rows="2"
                      v-bind:value="s_remark==''?qcerrordetail:s_remark+','+qcerrordetail"
                      readonly></mt-field>
          </td>
        </tr>
      </table>
      <div class="tb">
      <table class="tb">
        <tr>
          <td width="100px">证书号</td>
          <td width="200px">说明</td>
          <td width="100px">时间</td>
        </tr>
        <tr v-for="(item,index) in errorlist" v-bind:key="index">
          <td width="100px">{{item.reportno}}</td>
          <td width="200px">{{item.detail_remark}} {{item.s_Eyeclean===1?'净度问题 ':''}}{{item.s_Milky===1?'奶色 ':''}}{{item.s_Notarrived===1?'未到货 ':''}}{{item.s_Broken===1?'底尖问题 ':''}}{{item.s_Colish===1?'色调 ':''}}</td>
          <td width="100px">{{ToDateFormat(item.systime_det,'hh:mm:ss')}}</td>
        </tr>
      </table>
     </div>
    </div>
    <mt-popup v-model="popupVisibleReportno"
              position="bottom"
              popup-transition="popup-fade"
              closeOnClickModal="false">
      <mt-picker :slots="slot"
                 @change="onReportnoChange"
                 :visible-item-count="5"
                 :show-toolbar="false"
                 ref="picker"
                 value-key="reportno"
                 showToolbar
                 style="width:25rem">
                 <div class="picker-toolbar-title">
                     <div class="usi-btn-cancel" @click="ConfirmReport(0)">取消</div>
                     <div class="">请选择钻石</div>
                     <div class="usi-btn-sure" @click="ConfirmReport(1)">确定</div>
                 </div>
      </mt-picker>
    </mt-popup>
    <div class="footer">
      <mt-tabbar v-model="selected">
        <mt-tab-item id="save">
          <img slot="icon"
               src="../../assets/save.png">
          完成质检
        </mt-tab-item>
        <mt-tab-item id="addqcok">
          <img slot="icon"
               src="../../assets/add.png">
          添加质检正常
        </mt-tab-item>
        <mt-tab-item id="addqcorder">
          <img slot="icon"
               src="../../assets/return.png">
          返回质检单
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
import { Toast, MessageBox } from 'mint-ui';

export default {
  data () {
    return {
      selected: '',
      qcerrorList: [],
      qcerrordetail: '',
      qcrecordno: this.$route.params.qcrecordno,
      supplierguid: this.$route.params.supplierguid,
      accountname: `供应商:${this.$route.params.rapnetid}`,
      qcaddress: this.$route.params.qcaddress,
      s_reportno: '',
      s_remark: '',
      s_rapnat: this.$route.params.rapnetid,
      detailno: '',
      errorsum: 0,
      errorlist: [],
      fuzzy_list: [],
      popupVisibleReportno: false,
      s_pattern: this.$route.params.s_pattern,
      tempreportno: ''
    };
  },
  methods: {
    JumpUrl (type) {
      switch (type) {
        case 'qclist':
            this.$router.push({
              name: 'QcList'
            });
          break;
        case 'addqcok':
          this.$router.push({
            name: 'AddQcOk',
            params: {qcrecordno: this.qcrecordno,
            supplierguid: this.supplierguid,
            accountname: this.$route.params.accountname,
            rapnetid: this.s_rapnat,
            qcaddress: this.$route.params.qcaddress,
            s_pattern: this.$route.params.s_pattern}
          });
          break;
        case 'addqcorder':
            this.$router.push({
              name: 'AddQcOrder',
              params: {qcrecordno: this.qcrecordno,
              supplierguid: this.supplierguid,
              accountname: this.$route.params.accountname,
              qcaddress: this.$route.params.qcaddress,
              rapnetid: this.s_rapnat,
              isadd: false
              }
            });
          break;
        case 'save':
          this.completeqc();
          break;
      }
    },
    selectItem (event) {
      if (this.qcerrordetail !== '') {
          this.qcerrorList = this.qcerrordetail.split(',');
      }
      // 按钮点击切换样式
      if (event.target.className.includes('mint-button--primary')) {
          // 如果已经被点击 去除样式 去除质检问题
          event.target.className = 'mint-button mint-button--default mint-button--small';
          if (this.qcerrorList.includes(event.target.innerText)) {
              this.qcerrorList.splice(this.qcerrorList.indexOf(event.target.innerText), 1);
          }
      } else {
          if (event.target.innerText !== this.s_remark) {
              this.qcerrorList.push(event.target.innerText);
          }
          event.target.className = 'mint-button mint-button--primary mint-button--small';
      };
      // 数组转换为字符串
      this.qcerrordetail = this.qcerrorList.join(',');
    },
    save () {
       let that = this;

       // check
       if (that.s_reportno === '') {
           Toast({
              message: '证书号不能为空',
              duration: 2000
           });
           return;
       }

       // 调取接口
       api.JH_news(`/appapi/QcMobile.ashx?action=addqcerror
                  &s_reportno=${that.s_reportno}
                  &s_remark=${that.s_remark}
                  &s_rapnat=${that.s_rapnat}
                  &s_qc_no=${that.qcrecordno}
                  &s_eyeclean=${this.$refs.s_eyeclean.$el.className.includes('mint-button--primary') ? 1 : 0}
                  &s_broken=${this.$refs.s_broken.$el.className.includes('mint-button--primary') ? 1 : 0}
                  &s_milky=${this.$refs.s_milky.$el.className.includes('mint-button--primary') ? 1 : 0}
                  &s_colish=${this.$refs.s_colish.$el.className.includes('mint-button--primary') ? 1 : 0}
                  &s_notarrived=${this.$refs.s_notarrived.$el.className.includes('mint-button--primary') ? 1 : 0}
                  &userId=${localStorage.getItem('userId')}`, {
        })
        .then(res => {
          if (res.status === 1) {
            // 成功之后
            Toast({
              message: '标记成功',
              duration: 2000
            });
            this.detailno = JSON.parse(res.msgdata)[0].detailno;
            this.loadqcinfo();
            // 清空证书号
            this.s_reportno = '';
            // 焦点在证书号上
            this.focus();
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
        });
    },
    completeqc () {
       MessageBox.confirm('确定完成质检?完成后操作不可逆!!!').then(action => {
       // 调取接口
       api.JH_news(`/appapi/QcMobile.ashx?action=confirmqc
                  &s_qc_nos=${this.qcrecordno}
                  &s_qc_address=${this.qcaddress}
                  &userId=${localStorage.getItem('userId')}`, {
        })
        .then(res => {
          if (res.status === 1) {
            // 成功之后
            Toast({
              message: '完成质检成功',
              duration: 2000
            });
            this.JumpUrl('qclist');
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
        });
       });
    },
    loadqcinfo () {
        api.JH_news(`/appapi/QcMobile.ashx?action=queryqcinfobyrecordno
                  &qcrecordno=${this.qcrecordno}`, {
        })
        .then(res => {
          if (res.status === 1) {
            // 成功之后
            let data = JSON.parse(res.msgdata);
            this.errorsum = data.m_Stock_QC_ERRORs.length;
            this.errorlist = data.m_Stock_QC_ERRORs;
            console.log(this.errorlist);
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
        });
    },
    ToDateFormat (obj, format) {
      var dateTime = new Date(obj);
      format = format.replace('yyyy', dateTime.getFullYear());
      format = format.replace('yy', dateTime.getFullYear().toString().substr(2));
      format = format.replace('MM', dateTime.getMonth() + 1);
      format = format.replace('dd', dateTime.getDate());
      format = format.replace('hh', dateTime.getHours());
      format = format.replace('mm', dateTime.getMinutes());
      format = format.replace('ss', dateTime.getSeconds());
      format = format.replace('ms', dateTime.getMilliseconds());
      return format;
    },
    focus: function () {
      // if (document.querySelector('input') === document.activeElement) {
         this.fuzzy_search(this.s_reportno.trim());
      // }
    },
    fuzzy_search: function (value) {
       var that = this;
       if (!value) {
          that.fuzzy_list = [];
       }
       that.popupVisibleReportno = true;
       // 调取接口
       api.JH_news(`/appapi/QcMobile.ashx?action=queryqcdiamond
                  &s_qcstatus=0
                  &s_ispaged=0
                  &s_supplier_guid=${that.supplierguid}
                  &mobile_reportno=${that.s_reportno}`, {
        })
        .then(res => {
          if (res.status === 1) {
            // 成功之后
            that.fuzzy_list = JSON.parse(res.msgdata);
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
        });
    },
    onReportnoChange (picker, values) {
        if (values[0] !== undefined) {
            this.tempreportno = values[0];
        }
    },
    ConfirmReport (type) {
      if (type === 1) {
        this.s_reportno = this.tempreportno;
      }
      this.popupVisibleReportno = false;
    }
  },
  watch: {
    selected: function (val, oldVal) {
      // 这里就可以通过 val 的值变更来确定
      this.JumpUrl(val);
      this.selected = '';
    },
    s_reportno: function () {
       if (this.s_reportno !== this.tempreportno) {
           this.focus();
       }
    },
    s_remark: function (val, oldVal) {

    }
  },
  created () {

  },
  mounted () {
    this.loadqcinfo();
  },
  computed: {
    slot () {
       let temp = [{
          flex: 1,
          values: this.fuzzy_list.map((item) => { return item.reportno; }),
          className: 'slot1',
          textAlign: 'center'
       }];
       return temp;
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

.router-link-active {
  text-decoration: none;
}

.footer {
  width: 100%;
  background: #f8f8f8;
  position: fixed;
  bottom: 0;
}

.picker {
  width: 100em;
}

.mtbutton {
  width: 60px;
}

.tb{
  margin-top:2vh;
  border-spacing:0px 2vh;
}

.maincontent{
  overflow: auto;
  max-height: 80vh;
}

.picker-toolbar-title {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

.usi-btn-cancel,
.usi-btn-sure {
  color: #FF6600
}

</style>
