<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routes'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      if ((route.fullPath.indexOf('business') === -1 || route.fullPath.indexOf('myBusiness') !== -1) && sessionStorage.getItem('pageNum')) {
        sessionStorage.removeItem('pageNum')
      } else if (route.fullPath.indexOf('entry') === -1 && sessionStorage.getItem('entryPageNum')) {
        sessionStorage.removeItem('entryPageNum')
      } else if (route.name === 'businessList' || (route.fullPath.indexOf('business') === -1 && sessionStorage.getItem('mypageNum'))) {
        sessionStorage.removeItem('mypageNum')
      } else if (route.fullPath.indexOf('universal') === -1 && sessionStorage.getItem('universalPageNum')) {
        sessionStorage.removeItem('universalPageNum')
      }
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return true // this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
