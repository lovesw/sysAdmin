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

    .ivu-poptip-title {
        margin: 0;
        padding: 0 !important;
        position: relative;
    }

    .ivu-poptip-inner {
        width: 100px !important;
        margin: auto !important;
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
        <Layout :style="{marginLeft: left+'px'}">
            <!--Header-->
            <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', textAlign: 'right'}">
                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>
                <Dropdown @on-click="menuClick">
                    <a href="javascript:void(0)">
                        {{username}}
                        <Icon type="arrow-down-b"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="2">密码修改</DropdownItem>
                        <DropdownItem name="3">退出登录</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Header>
            <!--内容-->
            <Content>
                <div ref="scrollAll"
                     style="position: relative;width: 100%;box-sizing: border-box;padding: 8px 0;height: 50px">
                    <div style="overflow: hidden;width: 94%;position: absolute;height: 100%">
                        <template v-for="item in menuTag">
                            <Tag type="dot" closable :color="item.status?'primary':'default'"
                                 :path="item.path" @on-close="closed(item)" @click.native="tagsClick(item)"
                                 @click.native.right="mouseRight(item,$event)">
                                {{item.name}}
                            </Tag>
                        </template>
                    </div>
                    <Poptip v-model="visible" placement="bottom" style="margin-top: 20px" id="tip">
                        <div slot="title" @click="closedOther" style="text-align: center">
                            <DropdownItem>关闭其他</DropdownItem>
                        </div>
                        <div slot="title" @click="closedAll" style="text-align: center">
                            <DropdownItem>关闭所有</DropdownItem>
                        </div>
                    </Poptip>
                </div>
                <Card>
                    <div style="padding-bottom: 100px">
                        <router-view @remove="remove"></router-view>
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
        username: this.$route.query.username,
        activeName: '',
        tag: null,
        visible: false,
        // 定义左边导航菜单宽度像素
        left: 200,
        // 用来保存鼠标右键点击的按钮信息
        tagRight: null
      }
    },
    methods: {
      // 点击个人信息和密码修改的下拉菜单项事件
      menuClick(val) {
        if (val === '3') {
          this.$router.push('/');
          // 退出登录后,就清除session中数据
          sessionStorage.clear()
        }
      },
      // 菜单选中事件
      handleChange(name) {
        this.activeName = name
        this.$router.push(name)
      },
      // 点击X 关闭标签事件
      closed(item) {
        let mTag = this.menuTag;
        // 判断大于1 是避免把首页也关闭了
        if (mTag.length > 1) {
          mTag.map(function (x, index) {
            // index!==0 是防止关闭首页
            if (x.path === item.path && index !== 0) {
              mTag.splice(index, 1)
              return;
            }
          })
          this.menuTag = mTag;
          //设置最后一个为标签页
          this.$router.push(mTag[mTag.length - 1].path)
        }
      },
      //关闭全部标签事件
      closedAll() {
        this.$router.push(this.menuTag[0].path)
        this.menuTag = null;
        this.visible = false

      },
      // 关闭其他按钮
      closedOther() {
        // 保留首页与当前标签
        if (this.tagRight.path === this.menuTag[0].path) {
          this.menuTag = [this.menuTag[0]]
          this.menuTag[0].status = true
        } else {
          this.menuTag = [this.menuTag[0], this.tagRight];
        }
        this.visible = false
      },
      // 标签点击事件
      tagsClick(item) {
        this.$router.push(item.path)
      },
      // 鼠标右键事件
      mouseRight(item, event) {
        // 禁用鼠标右键默认弹出
        event.view.oncontextmenu = function () {
          return false;
        }
        // 设置显示关闭标签
        this.visible = true
        // 设置显示位置
        let dom = document.getElementById("tip")
        dom.style.display = "block";
        dom.style.position = "absolute"
        dom.style.left = event.x - this.left + "px";
        // 记录点击的按钮
        this.tagRight = item
      },
      /***
       * 全局删除提示操作
       * @param params 参数
       * @param reload 删除成功后的处理方法
       */
      remove: function (params, reload) {
        this.$Modal.confirm({
          title: '删除确定',
          content: '<p>你确定要删除该' + params.msg + '吗?删除后不可撤销</p>',
          onOk: () => {
            this.$kit.ajax('delete', params.permissionId, {id: params.id}, (res) => {
              this.$Message.success('删除成功')
              reload();
            }, this)
          },
          onCancel: () => {
            this.$Message.info('取消操作')
          }
        })
      }
    },
    computed: {
      // 通过计算属性来获取用户权限菜单
      menu() {
        return JSON.parse(this.$kit.getSession(this.$kit.menuName));
      },
      //标签页获取计算与循环
      menuTag: {
        get: function () {
          this.tag = JSON.parse(this.$kit.getSession(this.$kit.menuTag))
          if (this.tag == null) {
            this.tag = [{name: '首页', path: '/index', status: true}];
          }
          return this.tag;
        },
        set: function (value) {
          this.$kit.setSession(this.$kit.menuTag, JSON.stringify(value))
          this.tag = value;

        }
      },
      // 通过计算属性来确定

    },
    watch: {
      // 监听路由变化,用来修改标签页
      $route(to, from) {
        let mTag = this.menuTag;
        let status = false
        // 设置其他为false 并且如果已经存在了,就直接修改状态就好了
        mTag.map(function (item, index) {
          mTag[index].status = false;
          if (item.path === to.path) {
            mTag[index].status = true
            status = true
          }
        })
        // 添加一个新的标签
        if (!status) {
          mTag[mTag.length] = {name: to.name, path: to.path, status: true};
        }
        this.menuTag = mTag;
      }
    }
  }
</script>
