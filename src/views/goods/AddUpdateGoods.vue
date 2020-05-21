<template>
  <div>
    <el-page-header
      @back="$router.replace('/goods/goodslist')"
      :content="isUpdate ? '修改商品' : '添加商品'"
    ></el-page-header>
    <el-form
      ref="form"
      style="margin-top: 2rem;"
      :model="goodsForm"
      :rules="goodsFormRules"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <el-tabs type="border-card" :before-leave="tabBeforeLeave">
        <el-tab-pane label="商品普通值">
          <el-form-item label="商品标题" prop="title">
            <el-input v-model="goodsForm.title" placeholder="请输入商品标题"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="category">
            <el-select
              clearable
              @clear="clearCategorySelect"
              v-model="goodsForm.category"
              style="width:100%"
              placeholder="请选择商品分类"
              @change="categoryChange"
            >
              <el-option
                v-for="item in categoryList"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="现价" prop="prices.nowPrice">
            <el-input v-model="goodsForm.prices.nowPrice" placeholder="请输入商品现价"></el-input>
          </el-form-item>
          <el-form-item label="热门价格" prop="prices.hotPrice">
            <el-input v-model="goodsForm.prices.hotPrice" placeholder="请输入商品热门价格"></el-input>
          </el-form-item>
          <el-form-item label="原价" prop="prices.initPrice">
            <el-input v-model="goodsForm.prices.initPrice" placeholder="请输入商品原价"></el-input>
          </el-form-item>
          <el-form-item label="商品服务" prop="service">
            <el-checkbox-group v-model="goodsForm.services" placeholder="请选择商品服务">
              <el-checkbox
                v-for="item in services"
                :key="item._id"
                :label="item._id"
                border
                size="medium"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="商品图片" prop="images">
            <el-upload
              action="#"
              list-type="picture-card"
              :on-change="handleChange"
              :auto-upload="false"
              :limit="9"
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
          <el-form-item label="商品评论" prop="comment">
            <el-select
              multiple
              style="width:100%"
              v-model="goodsForm.comments"
              placeholder="请选择商品评论"
            >
              <el-option
                v-for="item in commentList"
                :key="item._id"
                :label="item.message"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品详情">
            <quill-editor v-model="goodsForm.description"></quill-editor>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性值">
          <el-row>
            <el-button
              icon="el-icon-plus"
              @click="goodsForm.attributes.push(getPureDemoitem())"
            >添加属性</el-button>
          </el-row>
          <el-row type="flex" style="margin-top:1rem; flex-wrap: wrap;">
            <el-col
              :md="8"
              v-for="(item, index) in goodsForm.attributes"
              style="magrin-top: 1rem;"
              :key="index"
            >
              <el-form-item label="属性名称" prop>
                <el-input v-model="goodsForm.attributes[index].name"></el-input>
              </el-form-item>
              <el-form-item label="属性类型">
                <el-select
                  v-model="goodsForm.attributes[index].type"
                  style="width:100%"
                  placeholder="请选择属性类型"
                >
                  <el-option label="多选框" value="selects"></el-option>
                  <el-option label="单选框" value="select"></el-option>
                  <el-option label="输入框" value="input"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性值类型">
                <el-select
                  v-model="goodsForm.attributes[index].messageType"
                  style="width:100%"
                  placeholder="请选择属性值类型"
                  @change="selectChange(index)"
                  @click="goodsForm.attributes[index].messageType === 'array' && (goodsForm.attributes[index].message = [])"
                >
                  <el-option label="数组" value="array"></el-option>
                  <el-option label="数字" value="number"></el-option>
                  <el-option label="字符串" value="string"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性值">
                <el-input
                  v-if="goodsForm.attributes[index].messageType == 'number'"
                  v-model="goodsForm.attributes[index].message"
                  value="number"
                ></el-input>
                <div v-if="goodsForm.attributes[index].messageType == 'array'">
                  <el-form-item>
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      @click="goodsForm.attributes[index].message.push('')"
                      size="mini"
                    >新增属性值</el-button>
                  </el-form-item>
                  <el-row type="flex">
                    <el-form-item style="magrin-top: 10px; margin-top: 10px;">
                      <el-row
                        v-for="(item, _index) in goodsForm.attributes[index].message"
                        :key="_index"
                        type="flex"
                        style="margin-bottom:10px"
                      >
                        <el-input
                          v-model="goodsForm.attributes[index].message[_index]"
                          clearable
                          placeholder="请输入值"
                          style="margin-right:10px;"
                        ></el-input>
                        <el-button
                          type="text"
                          @click="goodsForm.attributes[index].message.splice(_index, 1)"
                        >删除</el-button>
                      </el-row>
                    </el-form-item>
                  </el-row>
                </div>
                <el-input
                  v-if="goodsForm.attributes[index].messageType == 'string'"
                  v-model="goodsForm.attributes[index].message"
                  type="textarea"
                  autosize
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="el-icon-delete" type="danger" @click="delAttribute(index)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-form-item style="margin-top: 1rem;">
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible">
      <img class="pre-img" :src="previewPath" alt />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { uploadImg } from "api";
import { reqAddUpdateGoods } from "api/goods";
export default {
  data() {
    return {
      isUpdate: false,
      goodsForm: {
        title: "",
        images: [],
        category: "",
        prices: {
          priceType: "RMB",
          nowPrice: 0,
          hotPrice: 0,
          initPrice: 0
        },
        description: "",
        attributes: [],
        services: [],
        comments: []
      },
      goodsFormRules: {
        title: [{ required: true, message: "请输入商品标题", trigger: "blur" }],
        category: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ],
        comment: [
          { required: true, message: "请选择商品评论", trigger: "blur" }
        ],
        images: [
          { required: true, message: "请上传商品图片", trigger: "blur" }
        ],
        prices: {
          nowPrice: [
            { required: true, message: "请输入商品现价", trigger: "blur" },
            { validator: this.checkNumber, trigger: "blur" }
          ],
          hotPrice: [
            { required: true, message: "请输入热门价格", trigger: "blur" },
            { validator: this.checkNumber, trigger: "blur" }
          ],
          initPrice: [
            { required: true, message: "请输入商品原价", trigger: "blur" },
            { validator: this.checkNumber, trigger: "blur" }
          ]
        },
        service: { required: true, message: "请选择商品服务", trigger: "blur" }
      },
      fileList: [],
      previewPath: "",
      previewVisible: false,
      content: "",
      //为attribute 提供的空值, 防止 新增时 get 不到需要的属性
      demoItem: {
        name: "",
        type: "",
        messageType: null,
        message: ""
      }
    };
  },
  computed: {
    ...mapState({
      categoryList: state => state.goods.categoryList,
      services: state => state.goods.goodsService,
      currentGoods: state => state.goods.currentGoods,
      commentList: state => state.goods.commentList
    })
  },

  created() {
    if (!this.services) this.$store.dispatch("getGoodsService", {});
    if (!this.commentList) this.$store.dispatch("getComments", {});
    this.getCategories();
    this.dealExistData();
  },
  methods: {
    /**
     * 判断是添加还是更新, 若是更新的话, 就把数据添加上去
     */
    dealExistData() {
      const { type } = this.$route.params;
      if (type === "add") {
        this.isUpdate = false;
      } else if (type === "update") {
        this.isUpdate = true;
        const {
          attributes,
          category,
          description,
          images,
          prices,
          services,
          title,
          comments,
          _id
        } = this.currentGoods;
        const { hotPrice, initPrice, nowPrice } = prices;
        this.goodsForm._id = _id;
        this.goodsForm.title = title;
        this.goodsForm.description = description;
        this.goodsForm.attributes = attributes;
        this.goodsForm.category = category._id;
        this.goodsForm.images = images;
        // this.goodsForm.comments = comments;
        comments.forEach(comment => {
          this.goodsForm.comments.push(comment._id);
        });
        images.forEach(img => {
          const tempPic = {
            url: img,
            name: new Date().getTime()
          };
          this.fileList.push(tempPic);
        });
        this.goodsForm.prices.hotPrice = hotPrice;
        this.goodsForm.prices.initPrice = initPrice;
        this.goodsForm.prices.nowPrice = nowPrice;
        services &&
          services.forEach(service => {
            this.goodsForm.services.push(service._id);
          });
      }
    },
    /**
     * 序列化 demoItem
     */
    getPureDemoitem() {
      return JSON.parse(JSON.stringify(this.demoItem));
    },

    /**
     * 获取分类列表
     */
    getCategories() {
      if (this.categoryList.length === 0) {
        this.$store.dispatch("getCategory");
      }
      this.categoryList.forEach(category => {
        category.attributes.forEach(attribute => {
          attribute.defaultVal = true;
        });
      });
    },

    /**
     * 清除已选择的父类
     */
    clearCategorySelect() {
      this.goodsForm.category = "";
      this.$refs.form.validateField("category");
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
      const uid = file.uid;
      const i = this.fileList.findIndex(file => file.uid === uid);
      this.fileList.splice(i, 1);
      this.goodsForm.images.splice(i, 1);
      this.$refs.form.validateField("images");
    },

    /**
     * 监听上传图片组件的事件
     */
    async handleChange(file) {
      const files = file.raw;
      const loading = this.$notify({
        title: "提示",
        message: "图片上传中...",
        duration: 0
      });
      const result = await uploadImg(files);
      loading.close();
      this.$notify({
        title: "成功",
        message: "图片上传成功！",
        type: "success"
      });
      this.goodsForm.images.push(result.url);
      this.$refs.form.validateField("images");
      const tempObj = {
        name: result.filename,
        url: result.url
      };
      this.fileList.push(tempObj);
    },

    /**
     * 图片超出限制
     */
    handleExceed() {
      this.$message.error("只能上传九张图片");
    },

    /**
     * 商品分类修改时触发的事件
     */
    categoryChange(id) {
      this.goodsForm.attributes = this.currentGoods.attributes;
      const category = this.categoryList.find(item => item._id === id);
      category.attributes.forEach(item => {
        if (item.messageType && item.type) {
          this.goodsForm.attributes = this.goodsForm.attributes.concat(
            category.attributes
          );
        }
      });
    },

    /**
     * tab切换的回调钩子
     */
    tabBeforeLeave(item) {
      if (item == "1" && !this.goodsForm.category) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },

    /**
     * 删除属性
     */
    delAttribute(index) {
      if (!this.goodsForm.attributes[index].defaultVal) {
        this.goodsForm.attributes.splice(index, 1);
      } else {
        this.$message.error("这是分类默认属性，不能删除！");
      }
    },

    selectChange(index) {
      if (this.goodsForm.attributes[index].messageType === "array") {
        this.goodsForm.attributes[index].message = [];
      } else {
        this.goodsForm.attributes[index].message = "";
      }
    },

    async save() {
      this.goodsForm.prices.hotPrice = parseFloat(
        this.goodsForm.prices.hotPrice
      );
      this.goodsForm.prices.initPrice = parseFloat(
        this.goodsForm.prices.initPrice
      );
      this.goodsForm.prices.nowPrice = parseFloat(
        this.goodsForm.prices.nowPrice
      );
      await reqAddUpdateGoods(this.goodsForm);
      this.$message({
        message: `${this.isUpdate ? "修改" : "添加"}商品成功！`,
        type: "success"
      });
      this.$router.replace("/goods/goodslist");
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
      if (rule.field === "prices.nowPrice") {
        tip = "请输入现价";
      } else if (rule.field === "prices.hotPrice") {
        tip = "请输入热门价格";
      } else if (rule.field === "prices.initPrice") {
        tip = "请输入原价";
      }
      const reg = /^[0-9]+.?[0-9]*$/;
      if (!reg.test(value)) {
        callback(new Error("请输入大于等于0的数字"));
      } else {
        callback();
      }
    }
  }
};
</script>