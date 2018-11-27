<template>
    <div>
        <Table stripe :columns="columns1" :data="data1" class="table"></Table>
        <div style="text-align: right">
            <router-link to="/sys/addRole">
                <Button icon="plus-round" type="primary" shape="circle" class="add" v-has="this.$res.addRole">添加
                </Button>
            </router-link>
        </div>
        <Modal v-model="modal1" @on-ok="ok">
            <Tree :data="data3" show-checkbox multiple ref="tree"></Tree>
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
                      // const that = this
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
        // 菜单二级数据
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
      getData: function () {
        this.$kit.ajax('get', this.$res.listRole, {}, (res) => {
          this.data1 = res.data.data
        }, this)
      },
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
        this.$Modal.confirm({
          title: '删除确定',
          content: '<p>你确定要删除角色吗?删除后不可撤销</p>',
          onOk: () => {
            this.$kit.ajax('delete', this.$res.deleteRole, {id: id}, (res) => {
              this.$Message.success('删除成功')
              // 重新加载数据
              this.getData()
            }, this)
          },
          onCancel: () => {
            this.$Message.error('删除失败')
          }
        })
      },
      // 授权操作
      authorization: function (row) {
        let vm = this;
        // 记录角色ID
        this.roleId = row.id;
        this.$kit.ajax('get', this.$res.rolePermission, {id: row.id}, (res => {
          vm.data3 = vm.$kit.rolePermissionTree(vm.data2, res.data.data);
          vm.modal1 = true;
        }), this)
      },
      ok: function () {
        let menu = [];
        let permission = [];
        this.$refs.tree.getCheckedAndIndeterminateNodes().map(function (item) {
          if (item.type) {
            permission.push(item.id)
          } else {
            menu.push(item.id)
          }
        })
        this.$kit.ajax("post", this.$res.roleAuthorization, {
          menuId: menu,
          permissionId: permission,
          roleId: this.roleId
        }, (res => {
          this.$Message.success(res.data.msg)
          this.data3 = []
        }), this)


      },
      cancel: function () {

      }
    }
  }
</script>

<style scoped>
    .add {
        margin: 10px;
    }
</style>