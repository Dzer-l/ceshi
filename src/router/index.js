import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/login',
  component: () =>
    import('@/views/login/index'),
  hidden: true
},
{
  path: '/views/setting/previewModule',
  name: 'previewModule',
  component: () =>
    import('@/views/setting/previewModule'),
  hidden: false
},
{
  path: '/404',
  component: () =>
    import('@/views/404'),
  hidden: true
},

{
  path: '/',
  component: Layout,
  redirect: '/index',
  children: [{
    path: 'index',
    name: 'index',
    component: () =>
      import('@/views/dashboard/index'),
    meta: { title: '首页', icon: 'el-icon-s-home' }
  }]
},

// 人防车位
// {
//   path: '/parkingSpace',
//   component: Layout,
//   redirect: '/parkingSpace/index',
//   alwaysShow: true,
//   name: 'parkingSpace',
//   meta: { title: '人防车位', icon: 'el-icon-s-order' },
//   hidden: false,
//   children: [
//     {
//       path: 'index',
//       component: () => import('@/views/parkingSpace/index'),
//       name: 'parkingSpacelList',
//       meta: { title: '车位登记' },
//       hidden: false
//     },
//     {
//       path: 'parkingSpacelDetail',
//       component: () => import('@/views/parkingSpace/parkingSpacelDetail'),
//       name: 'parkingSpacelDetail',
//       meta: { title: '订单详情' },
//       hidden: true
//     },
//     {
//       path: 'parkingSpacePicture',
//       component: () => import('@/views/parkingSpace/parkingSpacePicture'),
//       name: 'parkingSpacePicture',
//       meta: { title: '车位图片' },
//       hidden: true
//     }
//   ]
// },

// {
//   path: '/develop',
//   component: Layout,
//   redirect: '/develop/dataManagement',
//   alwaysShow: true,
//   name: 'develop',
//   meta: { title: '开发平台', icon: 'el-icon-s-order' },
//   hidden: false,
//   children: [{
//     path: 'dataManagement',
//     component: () =>
//       import ('@/views/develop'),
//     name: 'dataManagement',
//     meta: { title: '数据管理' },
//     hidden: false
//   }]
// },

// 万能公证受理

// {
//   path: '/universal',
//   component: Layout,
//   redirect: '/universal/index',
//   alwaysShow: true,
//   name: 'universal',
//   meta: { title: '增值服务', icon: 'el-icon-s-order' },
//   hidden: false,
//   children: [
//     {
//       path: 'index',
//       component: () => import('@/views/universal/index'),
//       name: 'universalList',
//       meta: { title: '公证万能受理' },
//       hidden: false
//     },
//     {
//       path: 'universalDetailsOrder',
//       component: () => import('@/views/universal/universalDetailsOrder'),
//       name: 'universalDetailsOrder',
//       meta: { title: '订单详情' },
//       hidden: true
//     }
//   ]
// },

// 万能公证受理v1.2，线上路由长度为 6
// {
//   path: '/universal',
//   component: Layout,
//   redirect: '/universal/index',
//   alwaysShow: true,
//   name: 'universal',
//   meta: { title: '公证万能受理', icon: 'el-icon-s-order' },
//   hidden: false,
//   children: [
//     {
//       path: 'index',
//       // path: 'universalListAll',
//       component: () => import('@/views/universal/index'),
//       name: 'universalListAll',
//       meta: { title: '全部订单' },
//       hidden: false
//     },
//     {
//       path: 'universalListPersonal',
//       component: () => import('@/views/universal/universalListPersonal'),
//       name: 'universalListPersonal',
//       meta: { title: '我的订单' },
//       hidden: false
//     },
//     {
//       path: 'universalDetailsOrder',
//       component: () => import('@/views/universal/universalDetailsOrder'),
//       name: 'universalDetailsOrder',
//       meta: { title: '订单详情' },
//       hidden: true
//     }
//   ]
// },

// 邮寄管理
// {
//   path: '/mailManage',
//   component: Layout,
//   redirect: '/mailManage/index',
//   alwaysShow: true,
//   name: 'mailManage',
//   meta: { title: '邮寄管理', icon: 'el-icon-s-order' },
//   hidden: false,
//   children: [
//     {
//       path: 'index',
//       component: () => import('@/views/mailManage/index'),
//       name: 'mailManageIndex',
//       meta: { title: '发证管理' },
//       hidden: false
//     },
//     {
//       path: 'callMail',
//       component: () => import('@/views/mailManage/callMail'),
//       name: 'callMail',
//       meta: { title: '我要寄件' },
//       hidden: false
//     },
//     {
//       path: 'mailOrderDetail',
//       component: () => import('@/views/mailManage/mailOrderDetail'),
//       name: 'mailOrderDetail',
//       meta: { title: '订单详情' },
//       hidden: true
//     },
//     {
//       path: 'expressDelivery',
//       component: () => import('@/views/mailManage/expressDelivery'),
//       name: 'expressDelivery',
//       meta: { title: '发证' },
//       hidden: true
//     },
//     {
//       path: 'checkoutSuccess',
//       component: () => import('@/views/mailManage/checkoutSuccess'),
//       name: 'checkoutSuccess',
//       meta: { title: '下单成功' },
//       hidden: true
//     }
//   ]
// },

// 物流管理
// {
//   path: '/logisticsManage',
//   component: Layout,
//   redirect: '/logisticsManage/mailingRecord',
//   alwaysShow: true,
//   name: 'logisticsManage',
//   meta: { title: '快递管理', icon: 'el-icon-s-order' },
//   hidden: false,
//   children: [
//     {
//       path: 'index',
//       component: () => import('@/views/logisticsManage/index'),
//       name: 'mailingRecord',
//       meta: { title: '寄件记录' },
//       hidden: false
//     },
//     {
//       path: 'receivingRecord',
//       component: () => import('@/views/logisticsManage/receivingRecord'),
//       name: 'receivingRecord',
//       meta: { title: '收件记录' },
//       hidden: false
//     },
//     {
//       path: 'mailingDetail',
//       component: () => import('@/views/logisticsManage/mailingDetail'),
//       name: 'mailingDetail',
//       meta: { title: '快递详情' },
//       hidden: true
//     },
//     {
//       path: 'addressBook',
//       component: () => import('@/views/systemManage/addressBook'),
//       name: 'addressBook',
//       meta: { title: '地址簿' },
//       hidden: false
//     },
//     {
//       path: 'addOrEditAddress',
//       component: () => import('@/views/systemManage/addOrEditAddress'),
//       name: 'addOrEditAddress',
//       meta: { title: '编辑地址' },
//       hidden: true
//     },
//   ]
// },


{ path: '*', redirect: '/404', hidden: true }
]

if (process.env.VUE_APP_BASE_MODE !== 'production') {
  constantRoutes.push(
    {
      path: '/develop',
      component: Layout,
      redirect: '/develop/dataManagement',
      alwaysShow: true,
      name: 'develop',
      meta: { title: '开发平台', icon: 'el-icon-s-platform' },
      hidden: false,
      children: [{
        path: 'index',
        component: () =>
          import('@/views/develop/index'),
        name: 'dataManagement',
        meta: { title: '数据源管理' },
        hidden: false
      }, {
        path: 'code',
        component: () =>
          import('@/views/develop/code'),
        name: 'dataCode',
        meta: { title: '代码生成' },
        hidden: false
      }, {
        path: 'dict',
        component: () =>
          import('@/views/develop/dict'),
        name: 'dataDict',
        meta: { title: '字典管理' },
        hidden: false
      }, {
        path: 'menu',
        component: () =>
          import('@/views/develop/menu'),
        name: 'dataMenu',
        meta: { title: '菜单管理' },
        hidden: false
      }]
    }
  )
}
//  else {
//   constantRoutes.push(
//     {
//       path: '/develop',
//       component: Layout,
//       redirect: '/develop/dataManagement',
//       alwaysShow: true,
//       name: 'develop',
//       meta: { title: '开发平台', icon: 'el-icon-s-platform' },
//       hidden: false,
//       children: [{
//         path: 'menu',
//         component: () =>
//           import ('@/views/develop/menu'),
//         name: 'dataMenu',
//         meta: { title: '菜单管理' },
//         hidden: false
//       }]
//     }
//   )
// }

export const asyncRoutes = [
  //   {
  //   path: '/delegate',
  //   component: Layout,
  //   redirect: '/delegate/table',
  //   alwaysShow: true,
  //   name: 'delegate',
  //   meta: { title: '房产委托', icon: 'el-icon-s-order' },
  //   hidden: true,
  //   children: [{
  //     path: 'table',
  //     component: () =>
  //       import ('@/views/delegate'),
  //     name: 'delegateList',
  //     meta: { title: '订单列表' },
  //     hidden: true
  //   }, {
  //     path: 'info',
  //     component: () =>
  //       import ('@/views/delegate/info'),
  //     name: 'delegateInfo',
  //     meta: { title: '订单详情' },
  //     hidden: true
  //   }, {
  //     path: 'video',
  //     component: () =>
  //       import ('@/views/delegate/video'),
  //     name: 'delegateVideo',
  //     meta: { title: '视频会话' },
  //     hidden: true
  //   }]
  // }, {
  //   path: '/business',
  //   component: Layout,
  //   redirect: '/business/index',
  //   alwaysShow: true,
  //   name: 'business',
  //   meta: { title: '业务处理', icon: 'el-icon-s-order' },
  //   hidden: true,
  //   children: [{
  //     path: 'index',
  //     component: () =>
  //       import ('@/views/business/index'),
  //     name: 'businessList',
  //     meta: { title: '业务列表' },
  //     hidden: true
  //   }, {
  //     path: 'detailsOrder',
  //     component: () =>
  //       import ('@/views/business/detailsOrder'),
  //     name: 'detailsOrder',
  //     meta: { title: '订单详情' },
  //     hidden: true
  //   }]
  // }, {
  //   path: '/issuance',
  //   component: Layout,
  //   redirect: '/issuance/index',
  //   alwaysShow: true,
  //   name: 'issuance',
  //   meta: { title: '发证管理', icon: 'el-icon-s-ticket' },
  //   hidden: true,
  //   children: [{
  //     path: 'mail',
  //     component: () => import ('@/views/issuance/mail'),
  //     name: 'mailList',
  //     meta: { title: '邮寄' },
  //     hidden: true
  //   }, {
  //     path: 'index',
  //     component: () =>
  //       import ('@/views/issuance/index'),
  //     name: 'myIssuanceList',
  //     meta: { title: '我的订单' },
  //     hidden: true
  //   }, {
  //     path: 'totalIndex',
  //     component: () =>
  //       import ('@/views/issuance/totalIndex'),
  //     name: 'totalIssuanceList',
  //     meta: { title: '全部订单' },
  //     hidden: true
  //   }, {
  //     path: 'info',
  //     component: () =>
  //       import('@/views/issuance/info'),
  //     name: 'expressInfo',
  //     meta: {
  //       title: '快递详情'
  //     },
  //     hidden: true
  //   }, {
  //     path: 'orderSuccess',
  //     component: () =>
  //       import('@/views/issuance/orderSuccess'),
  //     name: 'orderSuccess',
  //     meta: {
  //       title: '下单成功'
  //     },
  //     hidden: true
  //   }, {
  //     path: 'print',
  //     component: () =>
  //       import('@/views/issuance/print'),
  //     name: 'print',
  //     meta: {
  //       title: '打印面单'
  //     },
  //     hidden: true
  //   },
  //   {
  //     path: 'print2',
  //     component: () =>
  //       import('@/views/issuance/print2'),
  //     name: 'print2',
  //     meta: {
  //       title: '打印面单'
  //     },
  //     hidden: true
  //   }
  //   ]
  // }, {
  //   path: '/loanAppt',
  //   component: Layout,
  //   redirect: '/loanAppt/index',
  //   alwaysShow: true,
  //   name: 'loanAppt',
  //   meta: { title: '公证房产交易服务', icon: 'el-icon-s-order' },
  //   hidden: true,
  //   children: [{
  //     path: 'index',
  //     component: () =>
  //       import ('@/views/loanAppt/index'),
  //     name: 'loanApptList',
  //     meta: { title: '订单列表' },
  //     hidden: true
  //   }, {
  //     path: 'info',
  //     component: () =>
  //       import ('@/views/loanAppt/info'),
  //     name: 'loanApptInfo',
  //     meta: { title: '订单详情' },
  //     hidden: true
  //   }]
  // }, {
  //   path: '/systemManage',
  //   component: Layout,
  //   redirect: '/systemManage/accountManage',
  //   alwaysShow: true,
  //   name: 'systemManage',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'el-icon-s-tools'
  //   },
  //   hidden: true,
  //   children: [{
  //     path: 'accountManage',
  //     name: 'accountManage',
  //     component: () =>
  //       import ('@/views/systemManage/accountManage'),
  //     meta: { title: '账号管理', showRole: true },
  //     hidden: true,
  //     children: [{
  //       path: 'addAccount',
  //       name: 'addAccount',
  //       component: () =>
  //         import ('@/views/systemManage/addAccount'),
  //       meta: { title: '新增账号', activeMenu: '@/views/systemManage/addAccount', showRole: false },
  //       hidden: true
  //     }, {
  //       path: 'editAccount',
  //       name: 'editAccount',
  //       component: () =>
  //         import ('@/views/systemManage/editAccount'),
  //       meta: { title: '编辑账号', activeMenu: '@/views/systemManage/editAccount', showRole: false },
  //       hidden: true
  //     },
  //     ]
  //   }, {
  //     path: 'roleManage',
  //     name: 'roleManage',
  //     component: () =>
  //       import ('@/views/systemManage/roleManage'),
  //     meta: { title: '角色管理', showRole: true },
  //     hidden: true,
  //     children: [{
  //       path: 'addRole',
  //       name: 'addRole',
  //       component: () =>
  //         import ('@/views/systemManage/addRole'),
  //       meta: { title: '新增角色', activeMenu: '@/views/systemManage/roleManage', showRole: false },
  //       hidden: true
  //     }, {
  //       path: 'editRole/:id',
  //       name: 'editRole',
  //       component: () =>
  //         import ('@/views/systemManage/editRole'),
  //       meta: { title: '编辑角色', activeMenu: '@/views/systemManage/roleManage', showRole: false },
  //       hidden: true
  //     }]
  //   }, {
  //     path: 'userInfo',
  //     name: 'userInfo',
  //     component: () =>
  //       import ('@/views/systemManage/userInfo'),
  //     meta: { title: '个人信息' },
  //     hidden: true
  //   }]
  // }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes.concat(asyncRoutes)
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
