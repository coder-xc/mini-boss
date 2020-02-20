<template>
  <div>
    <el-page-header @back="goBack" content="商品详情"></el-page-header>
    <el-card v-if="currentGoods._id">
      <el-form :model="currentGoods" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="商品名称：">
          <span>{{currentGoods.title}}</span>
        </el-form-item>
        <el-form-item label="商品分类：">
          <span>{{currentGoods.category.name}}</span>
        </el-form-item>
        <el-form-item label="商品原价：">
          <span>￥{{currentGoods.prices.initPrice}}</span>
        </el-form-item>
        <el-form-item label="商品现价：">
          <span>￥{{currentGoods.prices.nowPrice}}</span>
        </el-form-item>
        <el-form-item label="商品热门价格：">
          <span>￥{{currentGoods.prices.hotPrice}}</span>
        </el-form-item>
        <el-form-item label="商品图片：">
          <img class="detail-img" v-for="(item, index) in currentGoods.images" :key="index" :src="item.url" />
        </el-form-item>
        <el-form-item label="商品描述：">
          <span v-html="currentGoods.description"></span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      currentGoods: state => state.goods.currentGoods
    })
  },
  data() {
    return {
      rules: {}
      // goods: {}
    };
  },
  methods: {
    goBack() {
      this.$router.replace("/goodslist");
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== "/goodslist") {
      next("/goodslist");
    } else {
      next();
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
</style>


