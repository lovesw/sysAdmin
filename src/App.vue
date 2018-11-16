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
        this.$kit.ajax('post', '/u/login', params, (res) => {
          // 登录成功后,响应的菜单与权限信息放在sessionStorage中
          sessionStorage.setItem(this.$kit.menuName, JSON.stringify(res.data.data.menu))
          this.$kit.setResources(res.data.data.permission)
          this.$router.push({path: '/index', query: {month: params.username}})
        }, this)
      }
    }
  }
</script>

