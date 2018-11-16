<style>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }

    .logo {
        width: 40px;
        height: 40px;
        margin: 10px;
    }

    .title {
        color: #fff;
        font-size: 17px;
        display: inline-block;
        position: relative;
        top: -23px;
    }
</style>
<template>
    <div class="layout">
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto', zIndex: '2'}">
            <img src="../assets/icon.png" class="logo"/>
            <span class="title">后台管理</span>
            <!--菜单-->
            <Menu theme="dark" width="auto" :active-name.sync="activeName" @on-select="handleChange">
                <template v-for="item in menu " v-if="item.child !==null">
                    <Submenu :name="item.name">
                        <template slot="title">
                            <Icon type="ios-analytics"/>
                            {{item.name}}
                        </template>
                        <template v-for="child in item.child">
                            <MenuItem :name="child.url">{{child.name}}</MenuItem>
                        </template>
                    </Submenu>
                </template>
            </Menu>
        </Sider>
        <Layout :style="{marginLeft: '200px'}">
            <!--Header-->
            <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', textAlign: 'right'}">
                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>
                <Dropdown @on-click="menuClick">
                    <a href="javascript:void(0)">
                        {{username}}
                        <Icon type="arrow-down-b"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="1">个人信息</DropdownItem>
                        <DropdownItem name="2">密码修改</DropdownItem>
                        <DropdownItem name="3">退出登录</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Header>
            <!--内容-->
            <Content>
                <Card>
                    <div style="padding-bottom: 100px">
                        <router-view></router-view>
                    </div>
                </Card>
            </Content>
        </Layout>
    </div>
</template>
<script>
  export default {
    name: 'navigation',
    data() {
      return {
        username: 'admin',
        activeName: '',
      }
    },
    methods: {
      // 点击个人信息和密码修改的下拉菜单项事件
      menuClick(val) {
        let vm = this
        switch (val) {
          case '1':
            vm.$router.push('/u/userInfo')
            break
          case '2':
            vm.$router.push('/u/pwdChange')
            break
          case '3':
            vm.$emit('logout')
            break
        }

      },
      // 菜单选中事件
      handleChange(name) {
        this.activeName = name
        this.$router.push(name)
      },
    },
    computed: {
      // 通过计算属性来获取用户权限菜单
      menu() {
        return JSON.parse(this.$kit.getSession(this.$kit.menuName));
      }
    }
  }
</script>
