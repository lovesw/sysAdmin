<template>
    <div id="app">
        <router-view @login="login"/>
    </div>
</template>

<script>
  export default {
    name: 'App',
    methods: {
      login: function (params) {
        this.$kit.ajax('post', this.$kit.loginUrl, params, (res) => {
          // 登录成功后,响应的菜单与权限信息放在sessionStorage中
          sessionStorage.setItem(this.$kit.menuName, JSON.stringify(res.data.data.menu))
          // 保存服务
          this.$kit.setServerName(res.data.data.service)
          // 保存权限
          this.$kit.setResources(res.data.data.permission)
          // 登录成功后,跳转到后台首页
          this.$router.push({path: '/index', query: {username: params.username}})
        }, this)
      }
    }
  }
</script>

