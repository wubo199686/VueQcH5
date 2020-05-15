<template>
  <div id="app">
    <div class="title">
      <span><b>供应商:{{rapnetid}}</b></span>
    </div>
    <div class="maincontent">
      <!--<mt-field label="供应商"
                placeholder="请输入rapid创建qc签收单"
                type="number"
                v-model="rapnetid" v-on:focus="focus()"></mt-field>-->
      <mt-field label="当前qc地点:"
                placeholder="请选择qc地点"
                v-model="form.address"
                @click.native="popupVisible = true"
                readonly>
      </mt-field>
      <!--<mt-field label="供应商账户"
                v-model="form.accountname"></mt-field>-->
      <mt-field label="质检模式:"
                v-model="form.qcmodel"
                @click.native="popupModelVisible = true"
                readonly></mt-field>
      <mt-field label="是否绑定芯片:">
         <mt-switch v-model="isbind"
                   ref="bind"></mt-switch>
      </mt-field>
      <mt-field label="待取货总数:"
                v-model="form.sum"
                readonly></mt-field>
      <mt-field label="已检索应付款:"
                v-model="form.money"
                readonly></mt-field>
      <mt-field label="已质检正常数:"
                v-model="form.qcoksum"
                readonly>
                <mt-button size="small"
                       type="primary"
                       @click="JumpUrl('addqcok')">开始质检(正常货)</mt-button>
      </mt-field>
      <mt-field label="已质检异常数:"
                v-model="form.qcerrorsum"
                readonly>
                <mt-button size="small"
                       type="primary"
                       @click="JumpUrl('addqcerror')">开始质检(问题货)</mt-button>
      </mt-field>
    </div>
    <mt-popup v-model="popupVisible"
              position="bottom"
              popup-transition="popup-fade"
              closeOnClickModal="false" >
      <mt-picker :slots="slot"
                 @change="onAddressChange"
                 :visible-item-count="5"
                 :show-toolbar="false"
                 ref="picker"
                 value-key="form.address"
                 showToolbar
                 style="width:25rem">
                 <div class="picker-toolbar-title">
                     <div class="usi-btn-cancel" @click="popupVisible = !popupVisible">取消</div>
                     <div class="">请选择Qc地址</div>
                     <div class="usi-btn-sure" @click="popupVisible = !popupVisible">确定</div>
                 </div>
      </mt-picker>
    </mt-popup>
     <mt-popup v-model="popupModelVisible"
              position="bottom"
              popup-transition="popup-fade"
              closeOnClickModal="false" >
      <mt-picker :slots="slot2"
                 @change="onModelChange"
                 :visible-item-count="5"
                 :show-toolbar="false"
                 ref="picker"
                 value-key="form.qcmodel"
                 showToolbar
                 style="width:25rem">
                 <div class="picker-toolbar-title">
                     <div class="usi-btn-cancel" @click="popupModelVisible = !popupModelVisible">取消</div>
                     <div class="">请选择质检模式</div>
                     <div class="usi-btn-sure" @click="popupModelVisible = !popupModelVisible">确定</div>
                 </div>
      </mt-picker>
    </mt-popup>
    <mt-popup v-model="popupVisibleSupplier"
              position="bottom"
              popup-transition="popup-fade"
              closeOnClickModal="false">
      <mt-picker :slots="slot1"
                 @change="onSupplierChange"
                 :visible-item-count="5"
                 :show-toolbar="false"
                 ref="picker"
                 value-key="rapnetid"
                 showToolbar
                 style="width:25rem">
                 <div class="picker-toolbar-title">
                     <div class="usi-btn-cancel" @click="popupVisibleSupplier = !popupVisibleSupplier">取消</div>
                     <div class="">请选择供应商</div>
                     <div class="usi-btn-sure" @click="popupVisibleSupplier = !popupVisibleSupplier;ChangeSupplier(true)">确定</div>
                 </div>
      </mt-picker>
    </mt-popup>
    <div class="footer">
      <mt-tabbar v-model="selected">
        <mt-tab-item id="delete">
          <img slot="icon"
               src="../../assets/delete.png">
          删除当前QC
        </mt-tab-item>
        <mt-tab-item id="save">
          <img slot="icon"
               src="../../assets/save.png">
          完成质检
        </mt-tab-item>
        <mt-tab-item id="qclist">
          <img slot="icon"
               src="../../assets/return.png">
          返回质检列表
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>

<script>
import api from '@/axios/api.js';
import { Toast, MessageBox, Indicator } from 'mint-ui';

export default {
  data () {
    return {
      rapnetid: this.$route.params.rapnetid || '',
      supplierguid: this.$route.params.supplierguid || '',
      form: {
        accountname: this.$route.params.accountname || '',
        sum: 0,
        money: 0,
        qcoksum: 0,
        qcerrorsum: 0,
        qcmodel: '完整(COMP)',
        address: '香港'
      },
      selected: '',
      slot: [
        {
          flex: 1,
          values: ['香港', '印度', '深圳'],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      slot2: [
        {
          flex: 1,
          values: ['完整(COMP)', '简单(SIMP)'],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      popupVisible: false,
      popupVisibleSupplier: false,
      popupModelVisible: false,
      fuzzy_list: [],
      qcrecordno: this.$route.params.qcrecordno || '',
      temprapname: '',
      isadd: this.$route.params.isadd,
      isbind: true
    };
  },
  methods: {
    JumpUrl (type, istip) {
      switch (type) {
        case 'qclist':
          if (typeof (istip) === 'boolean' && !istip) {
            this.$router.push({
              name: 'QcList'
            });
          } else {
              this.$router.push({
                name: 'QcList'
              });
          }
          break;
        case 'addqcorder':
          this.$router.push({
            name: 'AddQcOrder'
          });
          break;
        case 'addqcok':
          if (this.qcrecordno === '') {
            Toast({
              message: '请先创建质检单',
              duration: 2000
            });
            return;
          }
          this.$router.push({
            name: 'AddQcOk',
            params: {qcrecordno: this.qcrecordno,
            supplierguid: this.supplierguid,
            accountname: this.form.accountname,
            rapnetid: this.rapnetid,
            qcaddress: this.form.address === '香港' ? 'HK' : (this.form.address === '深圳' ? 'SZ' : 'IND'),
            s_pattern: this.form.qcmodel === '完整(COMP)' ? 1 : 0,
            isbind: this.isbind }
          });
          break;
        case 'addqcerror':
          if (this.qcrecordno === '') {
            Toast({
              message: '请先创建质检单',
              duration: 2000
            });
            return;
          }
          this.$router.push({
            name: 'AddQcError',
            params: {qcrecordno: this.qcrecordno,
            supplierguid: this.supplierguid,
            accountname: this.form.accountname,
            rapnetid: this.rapnetid,
            qcaddress: this.form.address === '香港' ? 'HK' : (this.form.address === '深圳' ? 'SZ' : 'IND'),
            s_pattern: this.form.qcmodel === '完整(COMP)' ? 1 : 0 }
          });
          break;
        case 'save':
          this.completeqc();
          break;
      }
    },
    delete () {
         // 调取接口
         api.JH_news(`/appapi/QcMobile.ashx?action=deleteqc
                  &qcrecordno=${this.qcrecordno}`, {
         })
         .then(res => {
          if (res.status === 1) {
            // 成功之后
            Toast({
              message: '删除成功',
              duration: 2000
            });
            this.rapnetid = '';
            this.supplierguid = '';
            this.form.accountname = '';
            this.form.sum = 0;
            this.fuzzy_list = [];
            this.qcrecordno = '';

            // 返回待质检列表
            this.JumpUrl('qclist', false);
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
        });
    },
    onAddressChange (picker, values) {
      this.form.address = values[0];
    },
    onSupplierChange (picker, values) {
      if (values[0] !== undefined) {
          this.temprapname = values[0];
      }
    },
    onModelChange (picker, values) {
      this.form.qcmodel = values[0];
    },
    ChangeSupplier (isSave = false) {
      if (this.temprapname !== '') {
          this.supplierguid = this.fuzzy_list.filter((item) => { return item.name === this.temprapname; })[0].guidid;
          // 填充待取货总数
          api.JH_news(`/appapi/QcMobile.ashx?action=queryqcdiamond
                  &s_qcstatus=0
                  &s_ispaged=0
                  &s_supplier_guid=${this.supplierguid.trim()}`, {
          })
          .then(res => {
          if (res.status === 1) {
            // 成功之后
            this.form.sum = JSON.parse(res.msgdata).length;
            if (isSave) {
              this.addQc();
            }
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
        });
      }
    },
    focus: function () {
      if (document.querySelector('input') === document.activeElement) {
         this.fuzzy_search(this.rapnetid.trim());
         this.isadd = true;
      }
    },
    fuzzy_search: function (value, isshow = true) {
       var that = this;
       if (!value) {
          that.fuzzy_list = [];
       }
       that.popupVisibleSupplier = isshow;
       // 调取接口
       api.JH_news(`/appapi/QcMobile.ashx?action=querysupplierbyrapid
                  &s_guidtype=3
                  &jsonsearch=${that.rapnetid.trim()}`, {
        })
        .then(res => {
          if (res.status === 1) {
            // 成功之后
            that.fuzzy_list = JSON.parse(res.msgdata);
            if (!isshow) {
                this.ChangeSupplier(!isshow);
            }
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
        });
    },
    addQc () {
      if (this.isadd) {
        if (this.qcrecordno === '') {
            this.OperateAddQc();
        }
      }
    },
    OperateAddQc () {
         let that = this;
         Indicator.open('数据加载中...');
         if (that.supplierguid !== '') {
         // 创建质检单
         // 调取接口
         api.JH_news(`/appapi/QcMobile.ashx?action=addqc
                  &s_supplier_guid=${that.supplierguid.trim()}
                  &userId=${localStorage.getItem('userId')}`, {
         })
         .then(res => {
          if (res.status === 1) {
            // 成功之后
            let formObj = JSON.parse(res.msgdata);
            // 赋值基础数据
            let copyData = that.fuzzy_list.filter((item) => { return item.guidid === formObj.supplier_guid_fk; })[0];
            this.form.accountname = copyData.accountname;
            this.rapnetid = copyData.rapID;
            this.qcrecordno = formObj.qcrecordNo;
            this.loadqcinfo();
            Indicator.close();
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
        });
      }
    },
    completeqc () {
       MessageBox.confirm('确定完成质检?完成后操作不可逆!!!').then(action => {
       // 调取接口
       api.JH_news(`/appapi/QcMobile.ashx?action=confirmqc
                  &s_qc_nos=${this.qcrecordno}
                  &s_qc_address=${this.form.address === '香港' ? 'HK' : (this.form.address === '深圳' ? 'SZ' : 'IND')}
                  &userId=${localStorage.getItem('userId')}`, {
        })
        .then(res => {
          if (res.status === 1) {
            // 成功之后
            Toast({
              message: '完成质检成功',
              duration: 2000
            });
            // 返回待质检列表
            this.JumpUrl('qclist', false);
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
            this.form.qcoksum = data.m_Stock_QC_OKs.length;
            this.form.qcerrorsum = data.m_Stock_QC_ERRORs.length;
            this.form.money = 0;
            // 加载检索应付款
            if (data.m_Stock_QC_OKs.length > 0) {
                data.m_Stock_QC_OKs.forEach(item => {
                     this.form.money += item.dollorprice;
                });
            }
            if (this.form.money !== 0) {
                this.form.money = this.form.money.toFixed(2);
            }
          } else {
            Toast({
              message: res.message,
              duration: 2000
            });
          }
       });
    }
  },
  watch: {
    selected: function (val, oldVal) {
      // 这里就可以通过 val 的值变更来确定
      switch (val) {
        case 'delete':
          MessageBox.confirm('是否删除当前质检单?').then(action => {
            this.delete(val);
          });
          break;
        default:
          this.JumpUrl(val);
          break;
      }
      this.selected = '';
    },
    rapnetid: function () {
       this.focus();
    }
  },
  created () {

  },
  mounted () {
    if (this.qcrecordno !== '') {
        this.temprapname = this.rapnetid.trim();
        this.fuzzy_search(this.rapnetid.trim(), false);
        this.loadqcinfo();
    } else {
      api.JH_news(`/appapi/QcMobile.ashx?action=getqcbysupplieroperator
                  &operatorno=${localStorage.getItem('userId')}
                  &rapnetid=${this.rapnetid}`, {
        })
        .then(res => {
          if (res !== '' && res.status === 1) {
            if (res !== undefined) {
              // 成功之后
              let data = JSON.parse(res.msgdata);
              this.qcrecordno = data.qcrecordNo;
              if (this.qcrecordno !== '') {
                  this.temprapname = this.rapnetid.trim();
                  this.fuzzy_search(this.rapnetid.trim(), false);
                  this.loadqcinfo();
              }
            }
          } else {
              if (this.rapnetid.trim() !== '') {
                  this.temprapname = this.rapnetid.trim();
                  this.fuzzy_search(this.rapnetid.trim(), false);
                  this.loadqcinfo();
              }
          }
      });
    }
    this.$refs.bind.$el.parentElement.parentElement.firstChild.remove();
  },
  computed: {
    slot1 () {
       let temp = [{
          flex: 1,
          values: this.fuzzy_list.map((item) => { return item.name; }),
          className: 'slot1',
          textAlign: 'center'
       }];
       return temp;
    }
  }
};
</script>

<style>
.mint-cell-wrapper{
  background-image: none !important
}

.mint-cell{
  background-color: transparent !important
}

.mint-field-core{
  background: transparent !important;
}

.mint-field .mint-cell-title{
  width:130px !important;
  text-align: center;
}
</style>

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
