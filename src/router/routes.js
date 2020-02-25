const Home = () => import('../views/home/Home.vue');
const Banner = () => import('../views/banner/BannerList.vue');
const Login = () => import('../views/login/Login.vue');
const Category = () => import('../views/category/Category.vue');
const CategoryList = () => import('../views/category/CategoryList.vue');
const Goods = () => import('../views/goods/Goods.vue');
const Acitve = () => import('../views/activity/ActivityList.vue');
const UserList = () => import('../views/user/UserList.vue');
const AddCategory = () => import('../views/category/AddCategory.vue');
const GoodsList = () => import('../views/goods/GoodsList.vue');
const Detail = () => import('../views/goods/Detail.vue');
const GoodsService = () => import("../views/goods-service/GoodsService.vue");

export default [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/banner',
        component: Banner
      },
      {
        path: '/category',
        component: Category,
        redirect: '/categorylist',
        children: [
          {
            path: '/categorylist',
            component: CategoryList,
            meta: {
              activeMenu: '/categorylist',
              activeChildMenu: '/categorylist/addcategory'
            }
          },
          {
            path: '/categorylist/addcategory',
            name: 'addCategory',
            component: AddCategory,
            meta: {
              activeMenu: '/categorylist',
              activeChildMenu: '/categorylist/addcategory'
            }
          },
        ]
      },
      {
        path: '/userlist',
        component: UserList
      },
      {
        path: '/active',
        component: Acitve
      },
      {
        path: '/goods',
        component: Goods,
        redirect: '/goodslist',
        children: [
          {
            path: '/goodslist',
            component: GoodsList,
          },
          {
            path: '/goodslist/detail',
            name: 'detail',
            component: Detail
          },
        ]
      },
      {
        path: '/goodsservice',
        component: GoodsService,
      }
    ]
  },
]