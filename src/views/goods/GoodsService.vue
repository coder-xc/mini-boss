<template>
  <div>
    <!-- 头部面包屑区域 -->
    <my-bread />
    <!-- 卡片区域 -->
    <el-card class="filter">
      <el-row>
        <el-col class="input" :xs="24" :md="6">
          <el-select style="width:100%" v-model="searchType">
            <el-option label="按服务名称" value="name"></el-option>
            <el-option label="按服务内容" value="message"></el-option>
          </el-select>
        </el-col>
        <el-col class="input" :xs="24" :md="7">
          <el-input 
            v-model="inputVal" 
            :placeholder="placeholder" 
            clearable
            @clear="clearSearch"
            @keyup.enter.native="getGoodsService"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsService"></el-button>
          </el-input>
        </el-col>
        <!-- <el-col class="search" :xs="8" :md="3">
          <el-button type="primary" @click="getGoodsService">查询</el-button>
        </el-col> -->
        <el-col class="add" :xs="8" :md="8">
          <el-button type="primary" @click="openAddServiceDialog">添加服务</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table :data="services" stripe border>
        <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="name" label="服务名称"></el-table-column>
        <el-table-column align="center" prop="message" label="服务内容"></el-table-column>
        <el-table-column align="center" prop="icon" label="图标">
          <template v-slot:default="slotProps">
            <img :src="slotProps.row.icon" alt style="width:50px;height:50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openUpdateServiceDialog(slotProps.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delService(slotProps.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="pageSize"
          @size-change="sizeChange"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加/修改服务对话框 -->
    <el-dialog
      :title="this.isUpdate ? '修改服务' : '添加服务'"
      :visible.sync="isShowDialog"
      :lock-scroll="false"
      @close="dialogClose"
    >
      <el-form ref="form" :model="servicesForm" :rules="servicesFormRules" label-width="80px">
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="servicesForm.name" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="服务内容" prop="message">
          <el-input type="textarea" autosize v-model="servicesForm.message" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <el-upload
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :file-list="fileList"
            :on-change="handleChange"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddService">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible">
      <img class="pre-img" :src="previewPath" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { uploadImg } from "api";
import { reqAddUpdateGoodsService, reqDelGoodsService } from "api/goods";
export default {
  data() {
    return {
      searchName: "",
      servicesForm: {
        // form表单
        name: "",
        message: "",
        icon: ""
      },
      servicesFormRules: {
        // form表单规则
        name: [{ required: true, message: "请输入服务名称", trigger: "blur" }],
        message: [
          { required: true, message: "请输入服务内容", trigger: "blur" }
        ],
        icon: [{ required: true, message: "请添加服务图标", trigger: "blur" }]
      },
      pageSize: [5, 10, 15, 20],
      searchType: "name", // 搜索类型
      placeholder: "按服务名称",
      searchQuery: {
        // 分页以及搜索的参数对象
        limit: 10,
        page: 1,
        where: { name: { $regex: "" }, message: { $regex: "" } }
      },
      fileList: [], // 上传的文件列表
      previewVisible: false, // 是否显示预览图片对话框
      previewPath: "", // 预览的图片地址
      isUpdate: false, // 是否编辑
      isShowDialog: false // 是否显示 添加/修改 对话框
    };
  },
  created() {
    this.getGoodsService();
  },

  watch: {
    /**
     * 监听searchType（下拉框）的变化
     */
    searchType(val) {
      if (val === "name") {
        // 修改输入框placeholder
        this.placeholder = "按服务名称";
        // 把两个参数的值进行交换
        this.searchQuery.where.name.$regex = this.searchQuery.where.message.$regex;
        // 把对方参数的值清空
        this.searchQuery.where.message.$regex = "";
      } else if (val === "message") {
        // 修改输入框placeholder
        this.placeholder = "按服务内容";
        // 把两个参数的值进行交换
        this.searchQuery.where.message.$regex = this.searchQuery.where.name.$regex;
        // 把对方参数的值清空
        this.searchQuery.where.name.$regex = "";
      }
    }
  },
  computed: {
    ...mapState({
      services: state => state.goods.goodsService,
      total: state => state.goods.servicesTotal
    }),
    inputVal: {
      set(val) {
        if (this.searchType === "name") {
          this.searchQuery.where.name.$regex = val;
        } else {
          this.searchQuery.where.message.$regex = val;
        }
      },
      get() {
        if (this.searchType === "name") {
          return this.searchQuery.where.name.$regex;
        } else {
          return this.searchQuery.where.message.$regex;
        }
      }
    }
  },
  methods: {
    getGoodsService() {
      this.$store.dispatch("getGoodsService", this.searchQuery);
    },
    /**
     * 每页/条改变时触发
     */
    sizeChange(size) {
      this.searchQuery.limit = size;
      this.getGoods();
    },

    /**
     * 页码改变时触发
     */
    pageChange(page) {
      this.searchQuery.page = page;
      this.getGoods();
    },
    /**
     * 监听上传图片组件
     */
    async handleChange({ raw }) {
      const file = raw;
      this.imgLoading = this.$notify({
        title: "提示",
        message: "图片上传中...",
        duration: 0
      });
      const result = await uploadImg(file);
      this.imgLoading.close();
      if (!result) {
        return;
      }
      this.$notify({
        title: "成功",
        message: "图片上传成功！",
        type: "success",
        duration: 3000
      });
      this.servicesForm.icon = result.url;
      this.$refs.form.validateField("icon");
      const tempObj = {
        name: result.filename,
        url: result.url
      };
      this.fileList.push(tempObj);
    },

    /**
     * 打开添加服务对话框
     */
    openAddServiceDialog() {
      this.isUpdate = false;
      this.isShowDialog = true;
    },

    /**
     * 打开修改服务对话框
     */
    openUpdateServiceDialog(service) {
      this.isUpdate = true;
      this.isShowDialog = true;
      const { name, message, icon, _id } = service;
      this.$nextTick(() => {
        this.servicesForm.name = name;
        this.servicesForm.message = message;
        this.servicesForm.icon = icon;
        this.servicesForm._id = _id;
        const tempObj = {
          name,
          url: icon
        };
        this.fileList.push(tempObj);
      });
    },
    /**
     * 图片预览
     */
    handlePreview(file) {
      this.previewPath = file.url;
      this.previewVisible = true;
    },

    /**
     * 移除已上传的图片
     */
    handleRemove(file) {
      this._axiosPromiseArr.forEach(cancel => {
        cancel({ msg: "图片已停止上传", code: 600 });
      });
      this.imgLoading.close();
      const uid = file.uid;
      const i = this.fileList.findIndex(file => file.uid === uid);
      this.fileList.splice(i, 1);

      // 删除后, 重新表单验证
      this.servicesForm.icon = "";
      this.$refs.form.validateField("icon");
    },

    /**
     * 图片超出限制
     */
    handleExceed() {
      this.$message.error("只能上传一张图片");
    },

    /**
     * 对话框关闭时
     */
    dialogClose() {
      this.fileList = [];
      this.$refs.form.resetFields();
    },

    delService(service) {
      this.$confirm("确定删除该服务吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await reqDelGoodsService(service);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$store.dispatch("getGoodsService");
        })
        .catch(() => {});
    },

    /**
     * 点击确定按钮：添加/修改服务
     */
    confirmAddService() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await reqAddUpdateGoodsService(this.servicesForm);
          this.isShowDialog = false;
          this.$message({
            message: `${this.isUpdate ? "修改" : "添加"}成功!`,
            type: "success"
          });
          this.$store.dispatch("getGoodsService", this.searchQuery);
        }
      });
    },
    clearSearch() {
      this.getGoodsService();
    }
  }
};
</script>
