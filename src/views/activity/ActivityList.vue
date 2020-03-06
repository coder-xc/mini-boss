<template>
  <div>
    <!-- 头部面包屑区域 -->
    <my-bread />
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="openAddActiveDialog">添加活动</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="activeList" stripe border>
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="title" label="活动名称" width="200"></el-table-column>
        <el-table-column align="center" prop="icon" label="活动图片">
          <template v-slot:default="slotProps">
            <img
              v-if="slotProps.row.icon"
              :src="slotProps.row.icon"
              alt
              style="width:50px;height:50px"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updateActive(slotProps.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delActive(slotProps.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination
          :total="activeTotal"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[1,2,5,10]"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加/修改分类对话框 -->
    <el-dialog title="添加活动" :visible.sync="isShowDialog" :lock-scroll="false" @close="dialogClose">
      <el-form ref="form" :model="activeForm" :rules="activeFormRules" label-width="80px">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="activeForm.title" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="活动图标" prop="icon">
          <el-upload
            action="#"
            list-type="picture"
            :file-list="fileList"
            :auto-upload="false"
            :limit="1"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpDateActive">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt />
    </el-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";
import { uploadImg } from "api";
import { addUpdateActive, delActive } from "api/activity";
export default {
  computed: {
    ...mapState({
      activeList: state => state.goods.activeList,
      activeTotal: state => state.goods.activeTotal
    })
  },
  data() {
    return {
      loading: true,
      activeForm: {
        title: "",
        icon: ""
      },
      activeFormRules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        icon: [{ required: true, message: "请添加图片", trigger: "change" }]
      },
      fileList: [], // 上传图片的列表
      previewPath: "", // 预览的图片地址
      previewVisible: false, // 是否显示预览图片
      isShowDialog: false, // 是否显示对话框
      isUpdate: false // 是否修改
    };
  },

  created() {
    this.$store.dispatch("getActiveList").then(() => (this.loading = false));
  },
  methods: {
    /**
     * 打开添加/修改活动的对话框
     */
    openAddActiveDialog() {
      if(this.activeForm._id) delete this.activeForm._id
      this.isShowDialog = true;
      this.isUpdate = false;
    },

    /**
     * 关闭对话框前的回调
     */
    dialogClose() {
      this.$refs.form.resetFields();
      this.fileList = [];
    },

    /**
     * 监听upload组件图片的变化
     */
    async handleChange({ raw }) {
      const file = raw;
      const result = await uploadImg(file);
      this.activeForm.icon = result.url;
      const tempObj = {
        name: result.filename,
        url: result.url
      };
      this.fileList.push(tempObj);
    },

    /**
     * 对话框点击确定按钮: 添加/修改活动
     */
    addOrUpDateActive() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await addUpdateActive(this.activeForm);
          this.isShowDialog = false;
          this.$message({
            type: "success",
            message: `${this.isUpdate ? "修改成功!" : "添加成功!"}`
          });
          this.$store.dispatch("getActiveList");
        } else {
          return false;
        }
      });
    },
    /**
     * 点击修改按钮: 打开修改对话框
     */
    updateActive(active) {
      this.isShowDialog = true;
      this.isUpdate = true;
      this.$nextTick(() => {
        this.activeForm.title = active.title;
        this.activeForm.icon = active.icon;
        this.activeForm._id = active._id;
        const tempObj = {
          name: active.title,
          url: active.icon
        };
        this.fileList.push(tempObj);
      });
    },
    /**
     * 移除已上传的图片
     */
    handleRemove(file) {
      const uid = file.uid;
      const i = this.fileList.findIndex(file => file.uid === uid);
      this.fileList.splice(i, 1);
    },
    delActive(active) {
      this.$confirm("确定删除该活动吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await delActive(active);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.$store.dispatch("getActiveList");
      });
    }
  }
};
</script>
