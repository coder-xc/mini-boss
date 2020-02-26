const Home = () => import('../views/home/Home.vue');
const Banner = () => import('../views/banner/Banner.vue');
const BannerList = () => import('../views/banner/BannerList.vue');
const Login = () => import('../views/login/Login.vue');
const Category = () => import('../views/category/Category.vue');
const CategoryList = () => import('../views/category/CategoryList.vue');
const Goods = () => import('../views/goods/Goods.vue');
const Acitve = () => import('../views/activity/Activity.vue');
const AcitveList = () => import('../views/activity/ActivityList.vue');
const Auth = () => import('../views/auth/Auth.vue');
const UserList = () => import('../views/auth/UserList.vue');
const AddCategory = () => import('../views/category/AddCategory.vue');
const GoodsList = () => import('../views/goods/GoodsList.vue');
const Detail = () => import('../views/goods/Detail.vue');
const GoodsService = () => import("../views/goods/GoodsService.vue");
const AddUpdateGoods = () => import('../views/goods/AddUpdateGoods.vue')

export default [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { title: '首页' },
    children: [
      {
        path: '/banner',
        component: Banner,
        redirect: '/banner/bannerlist',
        meta: { title: '轮播图' },
        children: [
          {
            path: '/banner/bannerlist',
            component: BannerList,
            meta: { title: '首页轮播图' },
          }
        ]
      },
      {
        path: '/category',
        component: Category,
        redirect: '/category/categorylist',
        meta: { title: '分类管理' },
        children: [
          {
            path: '/category/categorylist',
            component: CategoryList,
            meta: {
              title: '分类列表',
              activeMenu: '/categorylist',
              activeChildMenu: '/category/addcategory'
            }
          },
          {
            path: '/category/addcategory',
            name: 'addCategory',
            component: AddCategory,
            meta: {
              title: '添加分类',
              activeMenu: '/category',
              activeChildMenu: '/category/addcategory'
            }
          },
        ]
      },
      {
        path: '/auth',
        component: Auth,
        redirect: '/auth/userlist',
        meta: { title: '权限管理' },
        children: [{
          path: '/auth/userlist',
          component: UserList,
          meta: { title: '用户管理' },
        }]
      },
      {
        path: '/active',
        component: Acitve,
        redirect: '/active/activelist',
        meta: { title: '活动管理' },
        children: [{
          path: '/active/activelist',
          component: AcitveList,
          meta: { title: '首页活动' },
        }]

      },
      {
        path: '/goods',
        component: Goods,
        redirect: '/goods/goodslist',
        meta: { title: '商品管理' },
        children: [
          {
            path: '/goods/goodslist',
            component: GoodsList,
            meta: { title: '商品列表' },
          },
          {
            path: '/goods/detail',
            name: 'detail',
            component: Detail,
            meta: { title: '商品详情' },
          },
          {
            path: '/goods/goodsservice',
            component: GoodsService,
            meta: { title: '商品服务' },
          },
          {
            path: '/goods/addupdategoods',
            name: 'addUpdateGoods',
            component: AddUpdateGoods,
          },
        ]
      },

    ]
  },
]