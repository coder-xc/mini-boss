<template>
  <div>
    <!-- 头部面包屑区域 -->
    <my-bread />
    <!-- 卡片区域 -->
    <el-card class="filter">
      <el-row>
        <el-col class="input" :xs="24" :md="8">
          <el-input
            v-model="searchQuery.where.name.$regex"
            placeholder="请输入店铺名称"
            clearable
            @clear="clearSearch"
            @keyup.enter.native="getMerchant"
          >
            <el-button slot="append" icon="el-icon-search" @click="getMerchant"></el-button>
          </el-input>
        </el-col>
        <!-- <el-col class="search" :xs="8" :md="3">
          <el-button type="primary" @click="getMerchant">查询</el-button>
        </el-col>-->
        <el-col class="add" :xs="8" :md="8">
          <el-button type="primary" @click="openAddShopDialog">添加店铺</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="merchantList" stripe border>
        <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="name" label="店铺名称"></el-table-column>
        <el-table-column align="center" prop="logo" label="店铺图标" width="120">
          <template v-slot:default="slotProps">
            <img :src="slotProps.row.logo" alt="logo" style="width:50px;height:50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="salesVolume" label="总交易量" width="70"></el-table-column>
        <el-table-column align="center" prop="commoditiesCount" label="商品总量" width="70"></el-table-column>
        <el-table-column align="center" label="店铺评价" width="70">
          <el-table-column align="center" prop="appraise.meet" label="描述相符" width="70">
            <template v-slot:default="slotProps">
              <span>{{slotProps.row.appraise.meet}}星</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="appraise.rational" label="价格合理" width="70">
            <template v-slot:default="slotProps">
              <span>{{slotProps.row.appraise.rational}}星</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="appraise.quality" label="质量满意" width="70">
            <template v-slot:default="slotProps">
              <span>{{slotProps.row.appraise.quality}}星</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" prop="collectCount" label="收藏量" width="70"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openUpdateShopDialog(slotProps.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delMerchant(slotProps.row)"
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

    <!-- 添加/修改店铺对话框 -->
    <el-dialog
      :title="this.isUpdate ? '修改店铺' : '添加店铺'"
      :visible.sync="isShowDialog"
      :lock-scroll="false"
      @close="dialogClose"
    >
      <el-form ref="form" :model="shopForm" :rules="shopFormRules" label-width="80px">
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="shopForm.name" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="店铺图片" prop="logo">
          <el-upload
            ref="upload"
            action="#"
            list-type="picture-card"
            :on-change="handleChange"
            :auto-upload="false"
            :limit="1"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺商品" prop="commodities">
          <el-select
            clearable
            v-model="shopForm.commodities"
            style="width:100%"
            placeholder="请选择店铺商品"
            multiple
          >
            <el-option
              v-for="item in goodsList"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总交易量" prop="salesVolume">
          <el-input v-model.number="shopForm.salesVolume" placeholder="请输入总交易量"></el-input>
        </el-form-item>
        <el-form-item label="商品总量" prop="commoditiesCount">
          <el-input v-model.number="shopForm.commoditiesCount" placeholder="请输入商品总量"></el-input>
        </el-form-item>
        <el-form-item label="店铺评分" prop="appraise">
          <el-card>
            <el-form-item label="描述相符" prop="appraise.meet" class="shop-rate">
              <el-rate
                v-model="shopForm.appraise.meet"
                show-score
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
            </el-form-item>
            <el-form-item label="价格合理" prop="appraise.rational" class="shop-rate">
              <el-rate
                v-model="shopForm.appraise.rational"
                show-score
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
            </el-form-item>
            <el-form-item label="质量满意" prop="appraise.quality" class="shop-rate">
              <el-rate
                v-model="shopForm.appraise.quality"
                show-score
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
            </el-form-item>
          </el-card>
        </el-form-item>
        <el-form-item label="收藏量" prop="collectCount">
          <el-input v-model.number="shopForm.collectCount" placeholder="请输入商品总量"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addMerchant">确 定</el-button>
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
import _cloneDeep from "lodash/cloneDeep";
import { uploadImg } from "api";
import { reqAddUpdateMerchant, reqDelMerchant } from "api/merchant";
export default {
  computed: {
    ...mapState({
      merchantList: state => state.goods.merchantList,
      total: state => state.goods.merchantTotal,
      goodsList: state => state.goods.goodsList
    })
  },
  data() {
    return {
      loading: true,
      searchName: "",
      isShowDialog: false,
      isUpdate: false,
      shopForm: {
        name: "", // 店铺名称
        logo: "", // 店铺图标
        commodities: [], // 店铺商品
        salesVolume: null, // 总交易量
        commoditiesCount: null, // 商品总量
        appraise: {
          // 店铺评价
          meet: 5, // 描述相符
          rational: 5, // 价格合理
          quality: 5 // 质量满意
        },
        collectCount: "" // 收藏量
      },
      shopFormRules: {
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
        logo: [{ required: true, message: "请上传店铺图片", trigger: "blur" }],
        salesVolume: [
          { required: true, message: "请输入总交易量", trigger: "blur" },
          { validator: this.checkNumber, trigger: "blur" }
        ],
        commoditiesCount: [
          { required: true, message: "请输入商品总量", trigger: "blur" },
          { validator: this.checkNumber, trigger: "blur" }
        ],
        collectCount: [
          { required: true, message: "请输入收藏量", trigger: "blur" },
          { validator: this.checkNumber, trigger: "blur" }
        ]
      },
      pageSize: [5, 10, 15, 20],
      searchQuery: { limit: 10, page: 1, where: { name: { $regex: "" } } },
      fileList: [],
      previewPath: "",
      previewVisible: false
    };
  },

  created() {
    this.getMerchant();
    /**
     * 不存在: 获取数据; 存在: 但数据只有10条以下, 也获取数据
     */
    if (!this.goodsList) {
      this.$store.dispatch("getGoods", {});
    }
    if (this.goodsList && this.goodsList.length <= 10) {
      this.$store.dispatch("getGoods", {});
    }
  },

  methods: {
    getMerchant() {
      this.$store
        .dispatch("getMerchants", this.searchQuery)
        .then(() => (this.loading = false));
    },
    /**
     * 每页/条改变时触发
     */
    sizeChange(size) {
      this.searchQuery.limit = size;
      this.getMerchant();
    },

    /**
     * 页码改变时触发
     */
    pageChange(page) {
      this.searchQuery.page = page;
      this.getMerchant();
    },
    /**
     * 添加店铺
     */
    openAddShopDialog() {
      if (this.shopForm._id) delete this.shopForm._id;
      this.isShowDialog = true;
      this.isUpdate = false;
    },

    /**
     * 编辑店铺
     */
    openUpdateShopDialog(merchant) {
      this.isShowDialog = true;
      this.isUpdate = true;
      const {
        name,
        logo,
        commodities,
        salesVolume,
        commoditiesCount,
        appraise,
        collectCount,
        _id
      } = merchant;

      this.$nextTick(() => {
        this.shopForm._id = _id;
        this.shopForm.name = name;
        this.shopForm.logo = logo;
        commodities.forEach(item => this.shopForm.commodities.push(item._id));
        this.shopForm.salesVolume = salesVolume;
        this.shopForm.commoditiesCount = commoditiesCount;
        this.shopForm.appraise = _cloneDeep(appraise);
        this.shopForm.collectCount = collectCount;
        const tempObj = {
          name,
          url: logo
        };
        this.fileList.push(tempObj);
      });
    },

    /**
     * 监听上传图片组件的事件
     */
    async handleChange(file) {
      const files = file.raw;
      this.imgLoading = this.$notify({
        title: "提示",
        message: "图片上传中...",
        duration: 0
      });
      const result = await uploadImg(files);
      if (!result) {
        return;
      }
      this.imgLoading.close();
      this.$notify({
        title: "成功",
        message: "图片上传成功！",
        type: "success"
      });
      this.shopForm.logo = result.url;
      this.$refs.form.validateField("logo");
      const tempObj = {
        name: result.filename,
        url: result.url
      };
      this.fileList.push(tempObj);
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
      this.shopForm.logo = "";
      this.$refs.form.validateField("logo");
    },

    /**
     * 图片超出限制
     */
    handleExceed() {
      this.$message.error("只能上传一张图片");
    },

    /**
     * 自定义表单验证
     * 验证是否为数字
     */
    checkNumber(rule, value, callback) {
      let tip = "该值不能为空";
      if (!value && value !== 0) {
        return callback(new Error(tip));
      }
      if (rule.field === "collectCount") {
        tip = "请输入收藏量";
      } else if (rule.field === "commoditiesCount") {
        tip = "请输入商品总量";
      } else if (rule.field === "salesVolume") {
        tip = "请输入总交易量";
      }
      const reg = /^[0-9]\d*$/;
      if (!reg.test(value)) {
        callback(new Error("请输入大于等于0的数字"));
      } else {
        callback();
      }
    },

    /**
     * 对话框关闭时
     */
    dialogClose() {
      this.fileList = [];
      this.$refs.form.resetFields();
    },

    /**
     * 点击确定按钮: 添加/修改店铺
     */
    addMerchant() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await reqAddUpdateMerchant(this.shopForm);
          this.isShowDialog = false;
          this.$message({
            message: `${this.isUpdate ? "修改" : "添加"}成功!`,
            type: "success"
          });
          this.$store
            .dispatch("getMerchants", this.searchQuery)
            .then(() => (this.loading = false));
        }
      });
    },

    /**
     * 删除店铺
     */
    delMerchant(merchant) {
      this.$confirm("确定删除该店铺吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await reqDelMerchant(merchant);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$store
            .dispatch("getMerchants")
            .then(() => (this.loading = false));
        })
        .catch(() => {});
    },
    clearSearch() {
      this.getMerchant();
    }
  }
};
</script>

<style lang="scss" scoped>
.shop-rate {
  display: flex;
  align-items: center;
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>


