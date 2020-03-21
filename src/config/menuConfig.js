const menuList = [
    // {
    //     title: '首页', // 菜单标题名称
    //     key: '/home', // 对应的path
    //     icon: 'el-icon-s-home', // 图标名称
    //     public: true, // 公开的
    // },
    {
        title: '轮播图',
        key: '/banner',
        icon: 'el-icon-picture',
        children: [ // 子菜单列表
            {
                title: '首页轮播图',
                key: '/banner/bannerlist',
                icon: 'el-icon-picture'
            },
        ]
    },
    {
        title: '分类管理',
        key: '/category',
        icon: 'el-icon- iconfont icon-leimupinleifenleileibie',
        children: [ // 子菜单列表
            {
                title: '分类列表',
                key: '/category/categorylist',
                icon: ''
            },
        ]
    },
    {
        title: '商品管理',
        key: '/goods',
        icon: 'el-icon-goods',
        children: [ // 子菜单列表
            {
                title: '商品列表',
                key: '/goods/goodslist',
                icon: ''
            },
            {
                title: '商品服务',
                key: '/goods/goodsservice',
                icon: ''
            },
        ]
    },
    {
        title: '商家管理',
        key: '/merchant',
        icon: 'el-icon- iconfont icon-shangjia',
        children: [ // 子菜单列表
            {
                title: '店铺列表',
                key: '/metchant/merchantlist',
                icon: ''
            },
        ]
    },
    {
        title: '权限管理',
        key: '/auth',
        icon: 'el-icon- iconfont icon-quanxianguanli',
        children: [ // 子菜单列表
            {
                title: '用户管理',
                key: '/auth/userlist',
                icon: ''
            },
        ]
    },
    {
        title: '活动管理',
        key: '/active',
        icon: 'el-icon- iconfont icon-huodong',
        children: [ // 子菜单列表
            {
                title: '用户管理',
                key: '/active/activelist',
                icon: ''
            },
        ]
    },
    {
        title: '订单管理',
        key: '/order',
        icon: 'el-icon- iconfont icon-dingdanguanli',
        children: [ // 子菜单列表
            {
                title: '订单列表',
                key: '/order/orderlist',
                icon: ''
            },
        ]
    },
    {
        title: '评论管理',
        key: '/comment',
        icon: 'el-icon- iconfont icon-ziyuan',
        children: [ // 子菜单列表
            {
                title: '评论列表',
                key: '/comment/commentlist',
                icon: ''
            },
        ]
    },
]

export default menuList