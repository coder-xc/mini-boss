<template>
  <div>
    <el-page-header @back="goBack" content="商品详情"></el-page-header>
    <el-card v-if="currentGoods._id">
      <el-row type="flex" style="margin-top:1rem; flex-wrap: wrap;">
        <el-col :md="14" style="magrin-top: 1rem;">
          <el-form :model="currentGoods" :rules="rules" ref="ruleForm" label-width="120px">
            <el-form-item label="商品标题：">
              <span>{{currentGoods.title}}</span>
            </el-form-item>
            <el-form-item label="商品分类：">
              <span>{{currentGoods.category.name}}</span>
            </el-form-item>
            <el-form-item label="商品原价：">
              <span>{{currentGoods.prices.initPrice}}元</span>
            </el-form-item>
            <el-form-item label="商品现价：">
              <span>{{currentGoods.prices.nowPrice}}元</span>
            </el-form-item>
            <el-form-item label="商品热门价格：">
              <span>{{currentGoods.prices.hotPrice}}元</span>
            </el-form-item>
            <el-form-item label="商品图片：">
              <img
                class="detail-img"
                v-for="(item, index) in currentGoods.images"
                :key="index"
                :src="item"
              />
            </el-form-item>
            <el-form-item label="商品属性：">
              <el-card>
                <el-collapse v-model="activeNames">
                  <el-collapse-item
                    v-for="(item, index) in currentGoods.attributes"
                    :key="index"
                    :title="item.name"
                    :name="index"
                  >
                    <el-form>
                      <el-form-item label="属性类型">
                        <span v-if="item.type === 'selects'">多选框</span>
                        <span v-if="item.type === 'select'">单选框</span>
                        <span v-if="item.type === 'input'">输入框</span>
                      </el-form-item>
                      <el-form-item label="属性值类型">
                        <span v-if="item.messageType === 'array'">数组</span>
                        <span v-if="item.messageType === 'number'">数字</span>
                        <span v-if="item.messageType === 'string'">字符串</span>
                      </el-form-item>
                      <el-form-item label="属性值">
                        <template v-if="item.messageType === 'array'">
                          <span v-for="(list, _index) in item.message" :key="_index">
                            <span>{{list}}</span>
                            <span v-if="_index !== item.message.length - 1">，</span>
                          </span>
                        </template>
                        <div v-if="item.messageType !== 'array'">{{item.message}}</div>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </el-form-item>
            <el-form-item label="商品服务：">
              <el-card v-if="currentGoods.services && currentGoods.services.length > 0">
                <div class="service" v-for="item in currentGoods.services" :key="item._id">
                  <el-form>
                    <el-form-item label="服务名称">
                      <span>{{item.name}}</span>
                    </el-form-item>
                    <el-form-item label="服务内容">
                      <span>{{item.message}}</span>
                    </el-form-item>
                    <el-form-item label="服务图标">
                      <img :src="item.icon" width="50" height="50" alt="service" />
                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
              <span v-if="!currentGoods.services || currentGoods.services.length === 0">无</span>
            </el-form-item>
            <el-form-item label="商品评论：">
              <div
                class="goods-comment"
                v-for="(item, index) in currentGoods.comments"
                :key="index"
              >
                <el-form label-width="100px">
                  <el-form-item label="评论内容：">
                    <span>{{item.message}}</span>
                  </el-form-item>
                  <el-form-item label="评论图片：">
                    <img
                      v-for="(pic, _index) in item.images"
                      :key="_index"
                      :src="pic"
                      alt="commentPic"
                      class="commtent-img"
                    />
                  </el-form-item>
                </el-form>
              </div>
              <span v-if="currentGoods.comments.length === 0">无</span>
            </el-form-item>
            <el-form-item label="商品描述：">
              <span v-html="currentGoods.description"></span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>


<script>
import { mapState } from "vuex";
import { RECEIVE_BACK_ROUTE_PATH } from "@/vuex/mutation-types";
export default {
  computed: {
    ...mapState({
      currentGoods: state => state.goods.currentGoods,
      backRoutePath: state => state.goods.backRoutePath
    })
  },

  data() {
    return {
      rules: {},
      activeNames: ["1"]
    };
  },

  /**
   * 该路由导航守卫的作用: 用于获取进入此页面前上一个页面的路由路径
   * 在渲染该组件的对应路由被 confirm 前调用
   * 不能获取组件实例 `this`
   * 因为当守卫执行前，组件实例还没被创建
   */
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      if (from.path === "/") {
        return;
      }
      vm.$store.commit(RECEIVE_BACK_ROUTE_PATH, from.path);
    });
  },

  methods: {
    goBack() {
      this.$router.replace(this.backRoutePath);
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-img {
  width: 150px;
  height: 150px;
  border: 1px solid #000;
  margin-right: 10px;
}
.goods-comment {
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 15px;
  .commtent-img {
    width: 150px;
    height: 150px;
    border: 1px solid #000;
    margin-right: 10px;
  }
}

.service {
  border-bottom: 1px solid #ccc;
  &:last-child {
    border-bottom: none;
  }
}
</style>


