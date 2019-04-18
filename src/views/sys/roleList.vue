<template>
    <div>
        <Table :columns="columns1" :data="data1" class="table" stripe></Table>
        <div style="text-align: right">
            <router-link to="/sys/addRole">
                <Button class="add" icon="plus-round" shape="circle" type="primary" v-has="this.$res.addRole">添加
                </Button>
            </router-link>
        </div>
        <Modal @on-ok="ok" v-model="modal1">
            <Tree :data="rolePermission" multiple ref="tree" show-checkbox></Tree>
        </Modal>
    </div>
</template>

<script>
  export default {
    name: "roleList",
    data() {
      return {
        columns1: [
          {
            title: 'id',
            key: 'id',
            align: 'center'
          },
          {
            title: '名字',
            key: 'name',
            align: 'center'
          },
          {
            title: '角色描述',
            key: 'content',
            align: 'center'
          },
          {
            title: '时间',
            key: 'date',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operate',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.authorization(params.row)
                    }
                  }
                }, '授权'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        data1: [],
        // 全部菜单与权限信息树状图关系
        data2: [],
        // 权限菜单信息
        data3: [],
        // 设置对话框显示
        modal1: false,
        //全局的角色ID
        roleId: ''
      }
    },
    mounted: function () {
      // 获取数据
      this.getData();
      // 初始化权限与菜单的级联关系
      this.initMenuPermission();
    },
    methods: {
      // 获取所有的角色数据
      getData: function () {
        this.$kit.ajax('get', this.$res.listRole, {}, (res) => {
          this.data1 = res.data.data
        }, this)
      },
      // 初始化菜单与权限的树状图关系.
      initMenuPermission: function () {
        let vm = this;
        this.$kit.ajax('get', this.$res.allMenu, {}, (res => {
          let data1 = res.data.data;
          this.$kit.ajax('get', this.$res.allPermission, {}, (res => {
            vm.data2 = vm.$kit.permissionTree(data1, res.data.data)
          }), this)
        }), this)
      },
      // 删除按钮
      remove: function (id) {
        let param = {msg: "角色", id: id, permissionId: this.$res.deleteRole}
        this.$emit("remove", param, () => {
          this.getData();
        })
      },
      // 授权操作
      authorization: function (row) {
        let vm = this;
        // 记录角色ID
        this.roleId = row.id;
        // 获取角色权限信息并遍历树状图中
        this.$kit.ajax('get', this.$res.rolePermission, {id: row.id}, (res => {
          // 将遍历好的树结构数组转为json字符串在转为数组，避免影响原始数组中的树结构，因为是引用类型。修改赋值后的变量会修改原始数组
          let data=JSON.parse(JSON.stringify(vm.data2));
          vm.data3 = vm.$kit.rolePermissionTree(data, res.data.data);
          // 显示弹框
          vm.modal1 = true;
        }), this)
      },
      ok: function () {
        let menu = [];
        let permission = [];
        // 获取所有选中与半选中的方法节点并遍历出菜单与权限
        this.$refs.tree.getCheckedAndIndeterminateNodes().map(function (item) {
          if (item.type) {
            permission.push(item.id)
          } else {
            menu.push(item.id)
          }
        })
        // 请求后台进行授权.
        this.$kit.ajax("post", this.$res.roleAuthorization, {
          menuId: menu.join(','),
          permissionId: permission.join(','),
          roleId: this.roleId
        }, (res => {
          this.$Message.success(res.data.msg)
          this.data3 = []
        }), this)
      },
    },
      computed:{
        rolePermission:function () {
            return this.data3
        }
      }
  }
</script>

<style scoped>
    .add {
        margin: 10px;
    }
</style>
