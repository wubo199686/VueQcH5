<template>
  <div id="app">
    <div class="title">
      <span><b>质检正常</b></span>
    </div>
    <div class="maincontent">
      <table>
        <tr style="height:5vh">
          <td align="left"
              width="62%"
              colspan="3">
            <mt-field v-bind:label="accountname">
              <label>已QC正常数量:{{oksum}}</label>
            </mt-field>
          </td>
        </tr>
        <tr>
          <td align="left"
              colspan="3">
            <mt-field label="证书号:"
                      placeholder="请输入证书号"
                      v-model="reportno"
                      v-on:focus="focus()"></mt-field>
          </td>
        </tr>
        <tr>
          <td align="left"
              colspan="2">
            <mt-field label="芯片号:"
                      placeholder="请输入芯片号"
                      v-model="spacecode"
                      v-bind:readonly="!isbind"></mt-field>
          </td>
          <td>
            <mt-button size="small"
                       type="primary"
                       @click="save()">保存</mt-button>
          </td>
        </tr>
        <tr :class="{'none':s_pattern === 0}">
          <td align="left"
              colspan="3">
            <mt-field label="底尖:">
              <mt-button size="small"
                         type="default"
                         ref="diy2" :class="{'mint-button--primary':form.qcculet === 0}" @click="form.qcculet=0"  v-model="form.qcculet">{{form.qcculet==0?'无(NONE)':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default" :class="{'mint-button--primary':form.qcculet === 1}" @click="form.qcculet=1" v-model="form.qcculet">{{form.qcculet==1?'有(CULET)':'&#12288;&#12288;'}}</mt-button>
            </mt-field>
          </td>
        <tr :class="{'none':s_pattern === 0}">
          <td align="left"
              colspan="3">
            <mt-field label="肉眼干净:">
              <mt-button size="small"
                         type="default"
                         ref="diy1" :class="{'mint-button--primary':form.eyeclean === 'EC0'}" @click="form.eyeclean='EC0'"  v-model="form.eyeclean">{{form.eyeclean=='EC0'?'EC0':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default" :class="{'mint-button--primary':form.eyeclean === 'EC1'}" @click="form.eyeclean='EC1'"  v-model="form.eyeclean">{{form.eyeclean=='EC1'?'EC1':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default" :class="{'mint-button--primary':form.eyeclean === 'EC2'}" @click="form.eyeclean='EC2'"  v-model="form.eyeclean">{{form.eyeclean=='EC2'?'EC2':'&#12288;&#12288;'}}</mt-button>
            </mt-field>
          </td>
        </tr>
        <tr :class="{'none':s_pattern === 0}">
          <td align="left"
              colspan="3">
            <mt-field label="颜色等级:">
              <mt-button size="small"
                         type="default"
                         ref="diy3"
                         class="mtbutton" :class="{'mint-button--primary':form.colorgrade === 1}" @click="form.colorgrade=1"  v-model="form.colorgrade">{{form.colorgrade==1?'优':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.colorgrade === 0}" @click="form.colorgrade=0"  v-model="form.colorgrade">{{form.colorgrade==0?'标准':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.colorgrade === -1}" @click="form.colorgrade=-1"  v-model="form.colorgrade">{{form.colorgrade==-1?'弱':'&#12288;&#12288;'}}</mt-button>
            </mt-field>
          </td>
        </tr>
        <tr :class="{'none':s_pattern === 0}">
          <td align="left"
              colspan="3">
            <mt-field label="净度等级:">
              <mt-button size="small"
                         type="default"
                         ref="diy4"
                         class="mtbutton" :class="{'mint-button--primary':form.claritygrade === 1}" @click="form.claritygrade=1"  v-model="form.claritygrade">{{form.claritygrade==1?'优':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.claritygrade === 0}" @click="form.claritygrade=0"  v-model="form.claritygrade">{{form.claritygrade==0?'标准':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.claritygrade === -1}" @click="form.claritygrade=-1"  v-model="form.claritygrade">{{form.claritygrade==-1?'弱':'&#12288;&#12288;'}}</mt-button>
            </mt-field>
          </td>
        </tr>
        <tr :class="{'none':s_pattern === 0}">
          <td align="left"
              colspan="3">
            <mt-field label="奶色:">
              <mt-button size="small"
                         type="default"
                         ref="diy5"
                         class="mtbutton" :class="{'mint-button--primary':form.milky === 'M0'}" @click="form.milky='M0'"  v-model="form.milky">{{form.milky=='M0'?'M0':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.milky === 'M1'}" @click="form.milky='M1'"  v-model="form.milky">{{form.milky=='M1'?'M1':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.milky === 'M2'}" @click="form.milky='M2'"  v-model="form.milky">{{form.milky=='M2'?'M2':'&#12288;&#12288;'}}</mt-button>
            </mt-field>
          </td>
        </tr>
        <tr :class="{'none':s_pattern === 0}">
          <td align="left"
              colspan="3">
            <mt-field label="咖色:">
              <mt-button size="small"
                         type="default"
                         ref="diy6"
                         class="mtbutton" :class="{'mint-button--primary':form.brown === 'B0'}" @click="form.brown='B0'"  v-model="form.brown">{{form.brown=='B0'?'B0':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.brown === 'B1'}" @click="form.brown='B1'"  v-model="form.brown">{{form.brown=='B1'?'B1':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.brown === 'B2'}" @click="form.brown='B2'"  v-model="form.brown">{{form.brown=='B2'?'B2':'&#12288;&#12288;'}}</mt-button>
            </mt-field>
          </td>
        </tr>
        <tr :class="{'none':s_pattern === 0}">
          <td align="left"
              colspan="3">
            <mt-field label="绿色:">
              <mt-button size="small"
                         type="default"
                         ref="diy7"
                         class="mtbutton" :class="{'mint-button--primary':form.green === 'G0'}" @click="form.green='G0'"  v-model="form.green">{{form.green=='G0'?'G0':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.green === 'G1'}" @click="form.green='G1'"  v-model="form.green">{{form.green=='G1'?'G1':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.green === 'G2'}" @click="form.green='G2'"  v-model="form.green">{{form.green=='G2'?'G2':'&#12288;&#12288;'}}</mt-button>
            </mt-field>
          </td>
        </tr>
        <tr :class="{'none':s_pattern === 0}">
          <td align="left"
              colspan="3">
            <mt-field label="黑点:">
              <mt-button size="small"
                         type="default"
                         ref="diy9"
                         class="mtbutton" :class="{'mint-button--primary':form.black === 'BL0'}" @click="form.black='BL0'"  v-model="form.black">{{form.black=='BL0'?'BL0':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.black === 'BL1'}" @click="form.black='BL1'"  v-model="form.black">{{form.black=='BL1'?'BL1':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.black === 'BL2'}" @click="form.black='BL2'"  v-model="form.black">{{form.black=='BL2'?'BL2':'&#12288;&#12288;'}}</mt-button>
            </mt-field>
          </td>
        </tr>
        <tr :class="{'none':s_pattern === 0}">
          <td align="left"
              colspan="3">
            <mt-field label="其他色调:">
              <mt-button size="small"
                         type="default"
                         ref="diy8"
                         class="mtbutton" :class="{'mint-button--primary':form.other === 'OT0'}" @click="form.other='OT0'"  v-model="form.other">{{form.other=='OT0'?'OT0':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.other === 'OT1'}" @click="form.other='OT1'"  v-model="form.other">{{form.other=='OT1'?'OT1':'&#12288;&#12288;'}}</mt-button>
              <mt-button size="small"
                         type="default"
                         class="mtbutton" :class="{'mint-button--primary':form.other === 'OT2'}" @click="form.other='OT2'"  v-model="form.other">{{form.other=='OT2'?'OT2':'&#12288;&#12288;'}}</mt-button>
            </mt-field>
          </td>
        </tr>
      </table>
      <div class="tb">
      <table class="tb" cellspacing="0" cellpadding="0">
        <tr>
          <td width="150px">证书号</td>
          <td width="150px">芯片号</td>
          <td width="100px">时间</td>
        </tr>
        <tr v-for="(item,index) in oklist" v-bind:key="index" class="trclass">
          <td width="100px">{{item.reportno}}</td>
          <td width="150px">{{item.spaceone}}</td>
          <td width="150px">{{ToDateFormat(item.systime_det,'hh:mm:ss')}}</td>
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
        <mt-tab-item id="addqcerror">
          <img slot="icon"
               src="../../assets/add.png">
          添加质检异常
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
      qcrecordno: this.$route.params.qcrecordno,
      supplierguid: this.$route.params.supplierguid,
      accountname: `供应商:${this.$route.params.rapnetid}`,
      rapnetid: this.$route.params.rapnetid,
      qcaddress: this.$route.params.qcaddress,
      selected: '',
      form: {
        qcculet: 0, // 底尖
        eyeclean: 'EC0', // 肉眼干净
        colorgrade: 0, // 颜色等级
        claritygrade: 0, // 净度等级
        milky: 'M0', // 奶 M0 M1 M2
        brown: 'B0', // 咖 B0 B1 B2
        green: 'G0', // 绿 G0 G1 G2
        other: 'OT0', // 其他色调 OT0 OT1 OT2
        black: 'BL0'
      },
      popupVisibleReportno: false,
      reportno: '',
      spacecode: '',
      fuzzy_list: [],
      oksum: 0,
      oklist: [],
      isbind: this.$route.params.isbind === undefined ? true : this.$route.params.isbind,
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
        case 'addqcerror':
          this.$router.push({
            name: 'AddQcError',
            params: {qcrecordno: this.qcrecordno,
            supplierguid: this.supplierguid,
            accountname: this.$route.params.accountname,
            qcaddress: this.$route.params.qcaddress,
            rapnetid: this.$route.params.rapnetid,
            isadd: false,
            s_pattern: this.$route.params.s_pattern
            }
          });
          break;
        case 'addqcorder':
          this.$router.push({
            name: 'AddQcOrder',
            params: {qcrecordno: this.qcrecordno,
            supplierguid: this.supplierguid,
            accountname: this.$route.params.accountname,
            qcaddress: this.$route.params.qcaddress,
            rapnetid: this.$route.params.rapnetid,
            isadd: false
            }
          });
          break;
        case 'save':
          this.completeqc();
          break;
      }
    },
    onReportnoChange (picker, values) {
        if (values[0] !== undefined) {
            this.tempreportno = values[0];
        }
    },
    ConfirmReport (type) {
      if (type === 1) {
        this.reportno = this.tempreportno;
      }
      this.popupVisibleReportno = false;
    },
    focus: function () {
      // if (document.querySelector('input') === document.activeElement) {
         this.fuzzy_search(this.reportno.trim());
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
                  &mobile_reportno=${that.reportno}`, {
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
    save () {
       let that = this;

       // check
       if (that.reportno === '') {
           Toast({
              message: '证书号不能为空',
              duration: 2000
           });
           return;
       }

       if (that.isbind && (that.spacecode.length < 10 || that.spacecode.length > 14)) {
           Toast({
              message: '芯片号不正确',
              duration: 2000
           });
           return;
       }

       // 调取接口
       api.JH_news(`/appapi/QcMobile.ashx?action=addqcok
                  &s_reportno=${that.reportno}
                  &s_rapnat=${that.rapnetid}
                  &s_qc_no=${that.qcrecordno}
                  &s_pattern=${that.s_pattern}
                  &s_spacecode=${that.spacecode}
                  &s_green=${that.form.green}
                  &s_black=${that.form.black}
                  &s_mixedcolor=${that.form.other}
                  &s_milky=${that.form.milky}
                  &s_colsh=${that.form.brown}
                  &s_qcculet=${that.form.qcculet}
                  &s_eyeclean=${that.form.eyeclean}
                  &s_colorgrade=${that.form.colorgrade}
                  &s_claritygrade=${that.form.claritygrade}
                  &userId=${localStorage.getItem('userId')}`, {
        })
        .then(res => {
          if ([1, 2].includes(res.status)) {
            // 成功之后
            Toast({
              message: res.message,
              duration: 2000
            });
            this.loadqcinfo();
            // 清空证书号和芯片号
            this.reportno = '';
            this.spacecode = '';
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
    loadqcinfo () {
        api.JH_news(`/appapi/QcMobile.ashx?action=queryqcinfobyrecordno
                  &qcrecordno=${this.qcrecordno}`, {
        })
        .then(res => {
          if (res.status === 1) {
            // 成功之后
            let data = JSON.parse(res.msgdata);
            this.oklist = data.m_Stock_QC_OKs;
            this.oksum = this.oklist.length;
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
    }
  },
  watch: {
    selected: function (val, oldVal) {
      // 这里就可以通过 val 的值变更来确定
      this.JumpUrl(val);
      this.selected = '';
    },
    reportno: function () {
       if (this.reportno !== this.tempreportno) {
           this.focus();
       }
    },
    isbind: function (val, oldVal) {
      if (!this.isbind) {
          this.spacecode = '';
      }
    }
  },
  created () {

  },
  mounted () {
    // 表单样式
    this.$refs.diy1.$el.parentElement.parentElement.firstChild.remove();
    this.$refs.diy2.$el.parentElement.parentElement.firstChild.remove();
    this.$refs.diy3.$el.parentElement.parentElement.firstChild.remove();
    this.$refs.diy4.$el.parentElement.parentElement.firstChild.remove();
    this.$refs.diy5.$el.parentElement.parentElement.firstChild.remove();
    this.$refs.diy6.$el.parentElement.parentElement.firstChild.remove();
    this.$refs.diy7.$el.parentElement.parentElement.firstChild.remove();
    this.$refs.diy8.$el.parentElement.parentElement.firstChild.remove();
    this.$refs.diy9.$el.parentElement.parentElement.firstChild.remove();
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
  margin-top:0.5vh;
  border-spacing:0vh 0vh;
}

.trclass{
  overflow-y: auto;
  height: 6vh;
}

table{
  border-collapse: collapse;
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

.maincontent{
  overflow: auto;
  max-height: 80vh;
}

.none{
  display: none;
}

</style>
