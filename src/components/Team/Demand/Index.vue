<template>
  <div>
    <!-- 主面板begin-->
    <section class="main-content-wrapper wrapper"
             style="overflow:hidden">
      <section id="main-content">
        <!-- 查询 -->
        <el-form label-width="100px"
                 ref="query">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item label="标题">
                <el-input v-model="filter.title"
                          auto-complete="off"
                          size="small"
                          placeholder="请输入标题"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="版本">
                <el-select v-model="filter.milestoneIds"
                           placeholder="请选择"
                           size="small"
                           multiple
                           collapse-tags
                           @change="selectChange">
                  <el-option v-for="item in milestoneslist"
                             :key="item.Id"
                             :label="item.Name"
                             :value="item.Id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="指派人">
                <el-select v-model="filter.assignUserIds"
                           placeholder="请选择"
                           size="small"
                           multiple
                           collapse-tags
                           @change="selectChangeAssign">
                  <el-option v-for="item in assignUserslist"
                             :key="item.Id"
                             :label="item.NickName"
                             :value="item.Id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="状态">
                <el-select v-model="filter.status"
                           placeholder="请选择"
                           size="small">
                  <el-option label="请选择"
                             value="-1"></el-option>
                  <el-option label="未完成"
                             value="0"></el-option>
                  <el-option label="已完成"
                             value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary"
                           icon="search"
                           @click="query"
                           size="small">查询</el-button>
                <el-button type="info"
                           icon="search"
                           size="small">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 操作 -->
        <el-row style="position:relative;right:520px">
          <el-col :span="24">
            <el-button type="primary"
                       size="small"
                       icon="el-icon-plus"
                       @click="create()">新增</el-button>
            <el-button type="primary"
                       size="small"
                       icon="el-icon-delete"
                       :disabled="selected.length==0"
                       @click="rdelete()">删除</el-button>
            <el-button type="primary"
                       size="small"
                       icon="el-icon-edit"
                       :disabled="selected.length!=1"
                       @click="update()">修改</el-button>
            <el-button type="primary"
                       size="small"
                       icon="el-icon-setting"
                       :disabled="selected.length==0"
                       @click="associatedMilestone()">关联版本</el-button>
            <el-button type="primary"
                       size="small"
                       icon="el-icon-setting"
                       :disabled="selected.length==0"
                       @click="associatedUser()">指派</el-button>
            <el-button type="primary"
                       size="small"
                       icon="el-icon-setting"
                       :disabled="selected.length!=1"
                       @click="Addinfo()">添加测试说明</el-button>
            <el-button type="primary"
                       size="small"
                       icon="el-icon-setting"
                       @click="Export()">根据搜索条件导出(包括分页数据)</el-button>
          </el-col>
        </el-row>
        <el-tabs value="first"
                 style="margin-left:20px">
          <el-tab-pane label="数据列表"
                       name="first">
            <!-- 数据列表-->
            <el-row>
              <el-col :span="24">
                <el-table :data="items"
                          stripe
                          border
                          v-loading="loading"
                          element-loading-text="拼命加载中..."
                          style="width: 100%"
                          height="650"
                          @sort-change="tableSortChange"
                          @selection-change="tableSelectionChange"
                          @row-click="clickRow"
                          ref="moviesTable"
                          id="Maintable">
                  <el-table-column type="selection"
                                   width="60">
                  </el-table-column>

                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left"
                               inline
                               class="demo-table-expand">
                        <el-form-item label="标题">
                          <span>{{ props.row.Title }}</span>
                        </el-form-item>
                        <el-form-item label="申请人">
                          <span>{{ props.row.ApplyName }}</span>
                        </el-form-item>
                        <el-form-item label="申请日期">
                          <span>{{ ToString(props.row.ApplyDate,"yyyy-MM-dd") }}</span>
                        </el-form-item>
                        <el-form-item label="创建日期">
                          <span>{{ ToString(props.row.CreateDate,"yyyy-MM-dd") }}</span>
                        </el-form-item>
                        <el-form-item label="详细情况说明">
                          <div class="ql-container ql-snow custom-noneborder"
                               v-if="!IsEmpty(props.row.Content)">
                            <div class="ql-editor">
                              <div v-html="props.row.Content"
                                   class="Vhtml"></div>
                            </div>
                          </div>
                        </el-form-item>

                        <el-form-item label="测试说明">
                          <div class="ql-container ql-snow custom-noneborder"
                               v-if="!IsEmpty(props.row.CompletedContent)">
                            <div class="ql-editor">
                              <div v-html="props.row.CompletedContent"
                                   class="Vhtml"></div>
                            </div>
                          </div>
                        </el-form-item>
                        <el-form-item label="附件列表">
                          <ul>
                            <li v-for="item in props.row.Filelist"
                                :key="item.id">
                              <a :href="Hosturl+item.Url"
                                 @click.prevent="DownLoadFile(item.Url)"
                                 target="_blank">{{ item.Name }}</a>
                            </li>
                          </ul>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>

                  <el-table-column prop="Milestone.Name"
                                   label="版本"
                                   width="140">
                  </el-table-column>

                  <el-table-column prop="Title"
                                   label="标题"
                                   width="375"
                                   fit="true">
                    <template slot-scope="scope">
                      <el-popover trigger="hover"
                                  placement="right">
                        <p>详情: </p>
                        <div class="ql-container ql-snow custom-noneborder"
                             v-if="!IsEmpty(scope.row.Content)">
                          <div class="ql-editor">
                            <div v-html="scope.row.Content"
                                 class="Vhtml"></div>
                          </div>
                        </div>
                        <p>测试说明: </p>
                        <div class="ql-container ql-snow custom-noneborder"
                             v-if="!IsEmpty(scope.row.CompletedContent)">
                          <div class="ql-editor">
                            <div v-html="scope.row.CompletedContent"
                                 class="Vhtml"></div>
                          </div>
                        </div>
                        <div slot="reference"
                             class="name-wrapper">
                          <el-tag size="medium">{{ scope.row.Title }}</el-tag>
                        </div>
                        <p>附件列表</p>
                        <ul>
                          <li v-for="item in scope.row.Filelist"
                              :key="item.id">
                            <a :href="Hosturl+item.Url"
                               @click.prevent="DownLoadFile(item.Url)"
                               target="_blank">{{ item.Name }}</a>
                          </li>
                        </ul>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="AssignUser.NickName"
                                   label="指派人"
                                   width="300">
                  </el-table-column>
                  <el-table-column prop="ApplyName"
                                   label="申请人"
                                   width="300">
                  </el-table-column>
                  <el-table-column prop="ApplyDate"
                                   sortable="custom"
                                   :formatter="dateFormats"
                                   label="申请日期"
                                   width="320">
                  </el-table-column>
                  <el-table-column prop="Status"
                                   label="状态"
                                   sortable="custom"
                                   width="300">
                    <template slot-scope="scope">
                      <span v-if="scope.row.Status==1">已完成</span>
                      <span v-if="scope.row.Status==0">未完成</span>
                    </template>
                  </el-table-column>
                </el-table>
                <!--分页begin-->
                <el-pagination class="tc mg"
                               :current-page="filter.page"
                               :page-sizes="[2,10, 20, 50, 100]"
                               :page-size="filter.limit"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="total_rows"
                               @size-change="pageSizeChange"
                               @current-change="pageCurrentChange">
                </el-pagination>
                <!--分页end-->
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="管理打包"
                       name="second">
            <a @click="Batchdownload">正在开发,请耐心等待!</a>
          </el-tab-pane>
        </el-tabs>
      </section>
    </section>
    <!-- 新增 begin-->
    <el-dialog title="新增"
               :visible.sync="dialogCreateVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               custom-class="dialogcss">
      <el-form id="#create"
               :model="model"
               :rules="rules"
               ref="create"
               label-width="100px">
        <el-form-item label="标题"
                      prop="Title">
          <el-input v-model="model.Title"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="说明"
                      prop="Content">
          <quill-editor ref="editoradd"
                        :content="model.ContentAdd"
                        v-model="model.ContentAdd"
                        :config="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="申请人"
                      prop="ApplyName">
          <el-input v-model="model.ApplyName"
                    auto-complete="off"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="申请日期"
                      prop="ApplyDate">
          <el-col :span="11">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            v-model="model.ApplyDate"
                            value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="关联版本">
          <el-select v-model="model.MilestoneId"
                     placeholder="请选择"
                     class="Lfloat">
            <el-option v-for="item in milestones"
                       :key="item.Id"
                       :label="item.Name"
                       :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指派人">
          <el-select v-model="model.AssignUserId"
                     placeholder="请选择"
                     class="Lfloat">
            <el-option v-for="item in assignUsers"
                       :key="item.Id"
                       :label="item.NickName"
                       :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload class="upload-demo Lfloat"
                     drag
                     action=""
                     :before-upload="beforeUpload"
                     :on-success="uploadSuccess"
                     :on-error="uploadError"
                     :on-preview="handlePreview"
                     :file-list="fileList"
                     :on-remove="Fileremove"
                     ref="upload"
                     multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button type="primary"
                   :loading="createLoading"
                   @click="rcreate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改 begin-->
    <el-dialog title="修改"
               :visible.sync="dialogUpdateVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#update"
               :model="model"
               :rules="rules"
               ref="update"
               label-width="100px">
        <el-form-item label="标题"
                      prop="Title">
          <el-input v-model="model.Title"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="说明"
                      prop="Content">
          <quill-editor ref="editor"
                        v-model="model.Content"
                        :content="model.Content"
                        :config="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="申请人"
                      prop="ApplyName">
          <el-input v-model="model.ApplyName"
                    auto-complete="off"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="申请日期"
                      prop="ApplyDate">
          <el-col :span="11">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            v-model="model.ApplyDate"
                            value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
        <el-button type="primary"
                   :loading="updateLoading"
                   @click="rupdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 版本关联 begin-->
    <el-dialog title="版本关联"
               :visible.sync="dialogAssociatedMilestoneVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#associatedMilestone"
               :model="milestone"
               ref="associatedMilestone"
               label-width="100px">
        <el-form-item label="关联版本"
                      prop="MilestoneId">
          <el-select v-model="milestone.Id"
                     placeholder="请选择"
                     class="Lfloat">
            <el-option v-for="item in milestones"
                       :key="item.Id"
                       :label="item.Name"
                       :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogAssociatedMilestoneVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="rassociatedMilestone">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 指派用户 -->
    <el-dialog title="指派用户"
               :visible.sync="dialogAssignUserVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#assignUser"
               :model="assignUser"
               ref="assignUser"
               label-width="100px">
        <el-form-item label="指派用户"
                      prop="UserId">
          <el-select v-model="assignUser.Id"
                     placeholder="请选择"
                     class="Lfloat">
            <el-option v-for="item in assignUsers"
                       :key="item.Id"
                       :label="item.NickName"
                       :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogAssignUserVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="rassociatedUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 完成人添加测试说明 begin  custom-class="customWidth"-->
    <el-dialog title="添加测试说明"
               :visible.sync="dialogContentVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#ContentForm"
               :model="model"
               ref="ContentForm"
               label-width="100px">
        <el-form-item label="测试说明">
          <quill-editor ref="editorcompleted"
                        v-model="model.CompletedContent"
                        :content="model.CompletedContent"
                        :config="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload class="upload-demo Lfloat"
                     drag
                     action=""
                     :before-upload="beforeUpload"
                     :on-success="uploadSuccess"
                     :on-error="uploadError"
                     :on-preview="handlePreview"
                     :file-list="fileList"
                     :on-remove="Fileremove"
                     ref="upload"
                     multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogContentVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="ContentFormSure">确 定</el-button>
      </div>
    </el-dialog>
    <!--End-->
  </div>
</template>

<script>
import api from '@/axios/api.js';
import moment from 'moment';
import XLSX from 'xlsx';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default {
  data () {
    return {
      milestone: {},
      milestones: [],
      milestoneslist: [],
      assignUser: {
      },
      assignUserslist: [],
      assignUsers: {
      },
      items: [
      ],
      model: {
      },
      rules: {
        Title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 400, message: '长度在 3 到 400 个字符' }
        ],
        ApplyName: [
          { required: true, message: '请输入申请人', trigger: 'blur' }
        ],
        ApplyDate: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        MilestoneId: [
          { required: true, message: '请选择版本', trigger: 'blur' }
        ],
        UserId: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        CompletedContent: [
          { required: false, message: '请填写完成说明', trigger: 'blur' }
        ]
      },
      filter: {
        limit: 10, // 页大小
        page: 1, // 当前页
        title: '',
        content: '',
        milestoneId: '-1',
        assignUserId: '-1',
        status: '0'
      },
      total_rows: 0,
      selected: [], // 已选择项
      loading: true,
      createLoading: false,
      updateLoading: false,
      dialogCreateVisible: false, // 创建对话框的显示状态
      dialogUpdateVisible: false, // 编辑对话框的显示状态
      dialogAssociatedMilestoneVisible: false, // 关联版本弹窗
      dialogContentVisible: false, // 添加完成说明
      dialogAssignUserVisible: false,
      fileList: [], // 文件列表
      toolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
        ['blockquote', 'code-block'], // 引用，代码块
        [{ 'header': 1 }, { 'header': 2 }], // 标题，键值对的形式；1、2表示字体大小
        [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
        [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
        [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
        [{ 'direction': 'rtl' }], // 文本方向
        [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 几级标题
        [{ 'color': [] }, { 'background': [] }], // 字体颜色，字体背景颜色
        [{ 'font': [] }], // 字体
        [{ 'align': [] }], // 对齐方式
        ['clean'], // 清除字体样式
        ['link', 'image', 'video'] // 上传文件、图片、上传视频
      ],
      editorOption: {
        // theme:'bubble'
        modules: {
          toolbar: {
            container: this.toolbarOptions,
            handlers: {
              'link': (value) => {
                if (value) {
                  this.$refs.upload.click();
                } else {
                  this.$refs.editor.format('link', false);
                }
              }
            }
          },
          imageDrop: true,
          imageResize: true
        },
        theme: 'snow'
      },
      Hosturl: api.Hosturl(),
      oldOptions: [],
      oldOptionsAssign: []
    };
  },
  methods: {
    initModel: function () {
      return {
        Id: '',
        Title: '',
        Content: '',
        ApplyName: '',
        ApplyDate: this.ToString(new Date().toLocaleDateString(), 'yyyy-MM-dd'),
        MilestoneId: '',
        AssignUserId: '',
        CompletedContent: '',
        ContentAdd: '',
        Filelist: [],
        MilestoneIds: [],
        AssignUserIds: []
      };
    },
    tableSelectionChange (val) {
      this.selected = val;
    },
    clickRow (row) {
      this.$refs.moviesTable.toggleRowSelection(row);
    },
    tableSortChange (val) {
      if (val.prop != null) {
        if (val.order === 'descending') {
          this.filter.sorts = '-' + val.prop;
        } else {
          this.filter.sorts = '' + val.prop;
        }
      } else {
        this.filter.sorts = '';
      }
      this.rquery();
    },
    pageSizeChange (val) {
      this.filter.limit = val;
      this.rquery();
    },
    pageCurrentChange (val) {
      this.filter.page = val;
      this.rquery();
    },
    reset () {
      // this.$refs.create.resetFields();
      this.model = this.initModel();
      this.fileList = [];
    },
    query (flag) {
      this.filter.page = 1;
      this.rquery(flag);
    },
    create () {
      this.reset();
      this.dialogCreateVisible = true;
    },
    update (flag) {
      this.reset();
      this.model.Id = this.selected[0].Id;
      this.model.Title = this.selected[0].Title;
      this.model.Content = this.selected[0].Content;
      this.model.ApplyName = this.selected[0].ApplyName;
      this.model.ApplyDate = moment(this.selected[0].ApplyDate).format('YYYY-MM-DD HH:mm:ss');
      this.model.CompletedContent = this.selected[0].CompletedContent;
      if (typeof (flag) === 'boolean' && flag) {
        this.dialogUpdateVisible = false;
      } else {
        this.dialogUpdateVisible = true;
      }
    },
    associatedMilestone () {
      this.dialogAssociatedMilestoneVisible = true;
      this.rqueryMilestone();
    },
    associatedUser () {
      this.dialogAssignUserVisible = true;
      this.rqueryUser();
    },
    rqueryMilestone () {
      var self = this;
      api.JH_news('/api/Milestone/Get', { status: 0 })
        .then((res) => {
          self.milestones = res.Data.Items;
          self.milestoneslist = res.Data.Items;
          if (!self.milestoneslist.some(x => x.Id === -1)) {
            self.milestoneslist.unshift({ Id: -1, Name: '全部' });
            self.milestoneslist.push({ Id: 0, Name: '无版本号' });
          }
          const listarrayMilestone = [-1, 0];
          self.milestones = self.milestones.filter(x => !listarrayMilestone.includes(x.Id));
        })
        .catch((res) => {
          self.$message.error('错了哦，这是一条错误消息');
        });
    },
    rassociatedMilestone () {
      // debugger
      this.$refs.associatedMilestone.validate((valid) => {
        if (valid) {
          var ids = [];
          this.selected.forEach(item => {
            ids.push(item.Id);
          });
          api.JH_news('/api/Demand/AssociatedMilestone', { ids: ids, milestoneId: this.milestone.Id })
            .then((res) => {
              this.$message.success('关联成功');
              this.dialogAssociatedMilestoneVisible = false;
              this.rquery();
            })
            .catch((res) => {
              this.$message.error('关联失败');
            });
        } else {
          return false;
        }
      });
    },
    rqueryUser () {
      // this.loading = true;
      var self = this;
      api.JH_news('/api/SysUser/Get')
        .then((res) => {
          self.assignUsers = res.Data.Items;
          self.assignUserslist = res.Data.Items;
          if (!self.assignUserslist.some(x => x.Id === -1)) {
            self.assignUserslist.unshift({ Id: -1, NickName: '全部' });
            self.assignUserslist.push({ Id: 0, NickName: '无指派人' });
          }
          const listarray = [-1, 0];
          self.assignUsers = self.assignUsers.filter(x => !listarray.includes(x.Id));
        })
        .catch((res) => {
          self.$message.error('错了哦，这是一条错误消息');
        });
    },
    rassociatedUser () {
      this.$refs.assignUser.validate((valid) => {
        if (valid) {
          var ids = [];
          this.selected.forEach(item => {
            ids.push(item.Id);
          });
          api.JH_news('/api/Demand/AssignUser', { ids: ids, userId: this.assignUser.Id })
            .then((res) => {
              this.$message.success('指派成功');
              this.dialogAssignUserVisible = false;
              this.rquery();
            })
            .catch((res) => {
              this.$message.error('指派失败');
            });
        } else {
          return false;
        }
      });
    },
    rquery (flag) {
      this.loading = true;
      var self = this;
      api.JH_news('/api/Demand/Get', this.filter)
        .then((res) => {
          self.items = res.Data.Items;
          self.total_rows = res.Data.TotalItems;
          self.loading = false;
          self.selected.splice(0, self.selected.length);
          if (typeof (flag) === 'boolean' && flag) {
            this.Exportdata();
          }
        })
        .catch(() => {
          self.$message.error('错了哦，这是一条错误消息');
          self.loading = false;
        });
    },
    rcreate () {
      this.model.Content = this.model.ContentAdd;
      // 主动校验
      this.$refs.create.validate((valid) => {
        if (valid) {
          this.createLoading = true;
          var self = this;
          this.model.Filelist = this.fileList;
          api.JH_news('/api/Demand/Create', this.model)
            .then((res) => {
              self.$message.success('创建成功');
              self.dialogCreateVisible = false;
              self.createLoading = false;
              self.rquery();
            })
            .catch((res) => {
              self.$message.error('创建失败');
              self.createLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    rupdate () {
      // this.model.Content = this.model.Content = this.$refs.editor.value
      this.$refs.update.validate((valid) => {
        if (valid) {
          this.updateLoading = true;
          api.JH_news('/api/Demand/Edit', this.model)
            .then((res) => {
              this.$message.success('修改成功');
              this.dialogUpdateVisible = false;
              this.updateLoading = false;
              this.rquery();
            })
            .catch((res) => {
              self.$message.error('修改失败');
              self.updateLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    rdelete () {
      this.$confirm('此操作将永久删除 ' + this.selected.length + ' 条记录, 是否继续?', '提示', { type: 'warning' })
        .then(() => {
          var ids = [];
          this.selected.forEach(item => {
            ids.push(item.Id);
          });
          api.JH_news('/api/Demand/Delete', { ids: ids.join(',') })
            .then((res) => {
              this.$message.success('删除成功');
              this.rquery();
            })
            .catch((res) => {
              this.$message.error('删除失败');
            });
        })
        .catch(() => {
          this.$message('已取消操作');
        });
    },
    // 导出
    Export () {
      // 当前页
      this.filter.page = 1;
      // 导出分页所有数据 先将当前页数据显示加长
      this.filter.limit = this.total_rows;
      try {
        /* 需要导出的JSON数据 */
        // 需要重新进行一次查询
        this.query(true);
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e);
      }
    },
    Exportdata () {
      let data = this.items;/* 如果没有导入xlsx组件则导入 */
      // 转换为指定中文说明的json格式
      let json = [];
      if (data.length > 0) {
        data.forEach(x => {
          json.push({
            '版本': x.Milestone == null ? '' : x.Milestone.Name,
            '标题': x.Title,
            '状态': x.Status === 1 ? '已完成' : '未完成',
            '指派人': x.AssignUser == null ? '' : x.AssignUser.NickName,
            '申请人': x.ApplyName || '',
            '申请日期': this.ToString(x.ApplyDate, 'yyyy-MM-dd'),
            '创建日期': this.ToString(x.CreateDate, 'yyyy-MM-dd')
          });
        });
      }
      this.downloadExl(json, 'xlsx');
      // let ws = XLSX.utils.json_to_sheet(json);/* 新建空workbook，然后加入worksheet */
      // let wb = XLSX.utils.book_new();/*新建book*/
      // XLSX.utils.book_append_sheet(wb, ws, "Sheet");/* 生成xlsx文件(book,sheet数据,sheet命名) */
      // XLSX.writeFile(wb, "sheetjs_" + new Date().toLocaleString() + ".xlsx");/*写文件(book,xlsx文件名称)*/
      // 还原当前页数据
      this.filter.limit = 10;
      this.query();
    },
    downloadExl (json, type) {
      // 配置文件类型
      const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true };
      var tmpdata = json[0];
      json.unshift({});
      // 获取keys
      var keyMap = [];
      for (var k in tmpdata) {
        keyMap.push(k);
        json[0][k] = k;
      }
      tmpdata = [];// 用来保存转换好的json
      json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k],
        position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
      }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => (tmpdata[v.position] = {
        v: v.v
      }));
      var outputPos = Object.keys(tmpdata); // 设置区域,比如表格从A1到D10
      // tmpdata["A3"].s = {
      //    font: { sz: 50, bold: true, color: { rgb: "FFFFAA00" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } }, alignment: { wrapText: true }
      // };//<====设置xlsx单元格样式
      // tmpdata["!merges"] = [{
      //    s: { c: 1, r: 0 },
      //    e: { c: 4, r: 0 }
      // }];//<====合并单元格
      // 设置列宽
      tmpdata['!cols'] = ([
        {
          wpx: 100
        },
        {
          wpx: 150
        },
        {
          wpx: 150
        },
        {
          wpx: 100
        },
        {
          wpx: 100
        },
        {
          wpx: 150
        },
        {
          wpx: 150
        }
      ]);

      var tmpWB = {
        SheetNames: ['mySheet'], // 保存的表标题
        Sheets: {
          'mySheet': Object.assign({},
            tmpdata, // 内容
            {
              '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
            })
        }
      };
      var tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
        { bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }// 这里的数据是用来定义导出的格式类型
      ))], { type: '' });
      this.SaveAs(tmpDown, 'sheet_' + new Date().toLocaleString() + '.' + (wopts.bookType === 'biff2' ? 'xls' : wopts.bookType));
    },
    // 下载功能
    SaveAs (obj, fileName) {
      var tmpa = document.createElement('a');
      tmpa.download = fileName || '未命名';
      // 兼容ie
      if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(obj, 'sheet_' + new Date().toLocaleString() + '.xlsx');
      } else {
        tmpa.href = URL.createObjectURL(obj);
      }
      tmpa.click();
      setTimeout(() => {
        URL.revokeObjectURL(obj);
      }, 100);
    },
    // 获取26个英文字母用来表示excel的列
    getCharCol (n) {
      let s = '';
      let m = 0;
      while (n > 0) {
        m = n % 26 + 1;
        s = String.fromCharCode(m + 64) + s;
        n = (n - m) / 26;
      }
      return s;
    },
    s2ab (s) {
      if (typeof ArrayBuffer !== 'undefined') {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      } else {
        var buff = new Array(s.length);
        for (var j = 0; j !== s.length; ++j) buff[j] = s.charCodeAt(j) & 0xFF;
        return buff;
      }
    },
    // 上传文件之前
    beforeUpload (file) {
      let fd = new FormData();
      fd.append('files', file);// 传文件
      fd.append('id', this.uid);// 传其他参数
      api.JH_news('/api/Upload/Post', fd)
        .then((res) => {
          if (res != null) {
            let dataSource = res;
            for (let item in dataSource) {
              this.fileList.push({ 'name': item, 'url': this.Hosturl + dataSource[item] });
            }
          }
          this.$message.success('上传成功');
        })
        .catch((res) => {
          this.$message.error('上传失败');
        });
      return false; // 屏蔽了action的默认上传
    },
    // 上传成功
    uploadSuccess (file, fileList) {
      console.log(file, fileList);
    },
    // 上传失败
    uploadError (err, file, fileList) {
      console.log(err + file + fileList);
    },
    // 预览文件
    handlePreview (file) {
      // 下载文件
      // window.open(file.url)
      this.DownLoadFile('/Tempupload/' + file.name);
    },
    // 删除文件的操作
    Fileremove (file, fileList) {
      this.fileList = this.fileList.filter(x => x.uid !== file.uid);
    },
    // 添加完成情况说明
    Addinfo () {
      this.update(true);
      this.dialogContentVisible = true;
      this.filelist = this.selected[0].Filelist;
      console.log(this.selected[0]);
      console.log(this.filelist);
    },
    // 添加完成说明保存
    ContentFormSure () {
      this.$refs.ContentForm.validate((valid) => {
        if (valid) {
          var ids = [];
          this.selected.forEach(item => {
            ids.push(item.Id);
          });
          api.JH_news('/api/Demand/AddCompletedContent', { ids: ids, content: this.$refs.editorcompleted.value, fileList: this.fileList })
            .then((res) => {
              this.$message.success('添加完成说明成功');
              this.dialogContentVisible = false;
              this.rquery();
            })
            .catch((res) => {
              this.$message.error('添加完成说明失败');
            });
        } else {
          return false;
        }
      });
    },
    dateFormats (row, column, style) {
      let date = row[column.property];
      if (date === undefined) {
        return '';
      }

      let code = '';
      switch (style) {
        case 110:
          code = 'YYYY-MM-DD';
          break;
        case 120:
          code = 'YYYY-MM-DD HH:mm:ss';
          break;
        default:
          code = 'YYYY-MM-DD';
          break;
      }
      return moment(date).format(code);
    },
    ToString (obj, format) {
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
    Batchdownload () {
      this.handleBatchDownload();
    },
    handleBatchDownload () {
      const data = ['http://192.168.0.200/Tempupload/QQ图片20190527115103.jpg', 'http://192.168.0.200/Tempupload/cls92192job-cs.cs']; // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
      const zip = new JSZip();
      const cache = {};
      const promises = [];
      data.forEach(item => {
        const promise = api.getFile(item).then(data => { // 下载文件, 并存成ArrayBuffer对象
          const arrname = item.split('/');
          const filename = arrname[arrname.length - 1]; // 获取文件名
          zip.file(filename, data, { binary: true }); // 逐个添加文件
          cache[filename] = data;
        });
        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => { // 生成二进制流
          FileSaver.saveAs(content, '打包下载.zip'); // 利用file-saver保存文件
        });
      });
    },
    IsEmpty (obj) {
      return obj === undefined || obj === '' || obj === null;
    },
    // 当版本下拉框的值改变时触发的方法，
    selectChange (val) {
      const allValues = [];
      // 保留所有值
      for (const item of this.milestoneslist) {
        allValues.push(item.Id);
      }

      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.length === 1 ? this.oldOptions[0] : [];
      // 若是全部选择
      if (val.includes(-1)) this.filter.milestoneIds = allValues;
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes(-1) && !val.includes(-1)) this.filter.milestoneIds = [];
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes(-1) && val.includes(-1)) {
        const index = val.indexOf(-1);
        val.splice(index, 1); // 排除全选选项
        this.filter.milestoneIds = val;
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes(-1) && !val.includes(-1)) {
        if (val.length === allValues.length - 1) this.filter.milestoneIds = [-1].concat(val);
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldOptions[0] = this.filter.milestoneIds;
    },
    // 当指派人下拉框的值改变时触发的方法，
    selectChangeAssign (val) {
      const allValues = [];
      // 保留所有值
      for (const item of this.assignUserslist) {
        allValues.push(item.Id);
      }

      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptionsAssign.length === 1 ? this.oldOptionsAssign[0] : [];
      // 若是全部选择
      if (val.includes(-1)) this.filter.assignUserIds = allValues;
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes(-1) && !val.includes(-1)) this.filter.assignUserIds = [];
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes(-1) && val.includes(-1)) {
        const index = val.indexOf(-1);
        val.splice(index, 1); // 排除全选选项
        this.filter.assignUserIds = val;
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes(-1) && !val.includes(-1)) {
        if (val.length === allValues.length - 1) this.filter.assignUserIds = [-1].concat(val);
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldOptionsAssign[0] = this.filter.assignUserIds;
    },
    DownLoadFile (path) {
      api.JH_File('/api/Demand/DownloadFile', { path: path })
        .then((data) => {
          let blob = new Blob([data]);
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = path.split('/').pop();
          link.click();
        })
        .catch((res) => {
          this.$message.error('下载失败');
        });
    }
  },
  created () {

  },
  mounted () {
    this.rquery();
    this.rqueryMilestone();
    this.rqueryUser();
    this.model = this.initModel();
  },
  components: {

  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

ul li {
  list-style: none;
}

#editor {
  min-height: 180px;
}

.Animatecss {
  position: relative;
  bottom: 100px;
}

.customWidth {
  width: 65%;
}

.Lfloat {
  float: left;
}

.scroll {
  min-height: 350px;
  overflow-y: scroll;
}

.Vhtml {
  width: 785px;
}

.custom-noneborder {
  border: none !important;
  max-height: auto !important;
}
</style>
