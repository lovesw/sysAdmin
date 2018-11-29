<template>
    <div>
        <Table stripe :columns="columns" :data="data1" class="table"></Table>
        <div style="text-align: right;margin: 5px">
            <Page :total="total" size="small" show-total show-elevator show-sizer @on-change="pageChange"
                  @on-page-size-change="sizeChange"></Page>
        </div>
        <Modal @on-ok="ok" v-model="model" v-if="this.role.length>0">
            <template v-for="item in this.role">
                <checkbox v-model="item.status">{{item.name}}</checkbox>
            </template>
        </Modal>
    </div>

</template>

<script>
  export default {
    name: 'userList',
    data() {
      return {
        columns: [
          {title: '编号', key: 'id', align: 'center'},
          {title: '名称', key: 'username', align: 'center'},
          {
            title: '角色', key: 'role', align: 'center', render: (h, params) => {
              let roleName = this.roleDetail(params.row);
              return h('span', roleName.join(","))
            }
          },
          {title: '时间', key: 'date', align: 'center'},
          {
            title: '操作', key: 'operate', align: 'center', render: (h, params) => {
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
                      this.change(params.row)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id)
                    }
                  }
                }, '删除')
              ])
            }
          },
        ],
        // 用户数据
        data1: [],
        // 分页相关
        total: 0, // 总数据大小
        pageSize: 10, // 页码大小
        current: 1,
        // 角色列表
        role: [],
        model: false,
        userId: ''
      }
    },
    mounted: function () {
      // 获取用户数据
      this.getData()
      // 获取全部角色
      this.getRole()

    },
    methods: {
      // 修改当前页码
      pageChange: function (val) {
        this.current = val
        this.getData()
      },
      // 修改页码大小
      sizeChange: function (val) {
        this.pageSize = val
        this.getData()
      },
      // 获取数据
      getData: function () {
        this.$kit.ajax('get', this.$res.userList, {page: this.current, size: this.pageSize}, (res) => {
          this.data1 = res.data.data.data
          this.total = res.data.data.totalSize
        }, this)
      },
      // 获取所有的角色
      getRole: function () {
        let vm = this;
        this.$kit.ajax('get', this.$res.listRole, {}, (res) => {
          res.data.data.map(function (item) {
            vm.role.push({id: item.id, name: item.name, status: false})
          })

        }, this)
      },
      remove: function (id) {
        let param = {msg: "用户", id: id, permissionId: this.$res.deleteUser}
        this.$emit("remove", param, () => {
          this.getData();
        })
      },
      // 角色名称处理
      roleDetail: function (row) {
        let userRole = [];
        if (row.role !== null) {
          row.role.split(',').map(function (item) {
            if (item !== "") {
              userRole.push(item)
            }
          })
        }
        return userRole
      },
      // 授予用户角色
      change: function (row) {
        // 获取用户角色
        let userRole = row.role.split(',')
        // 标记用户拥有的角色
        this.role.forEach(function (items) {
          items.status = false
          userRole.map(function (item) {
            if (items.name === item) {
              items.status = true
            }
          })
        })
        this.model = true
        this.userId = row.id
      },
      // 确认授权操作
      ok: function () {
        let role = []
        this.role.map(function (item) {
          if (item.status) {
            role.push(item.id)
          }
        })
        let vm = this;
        // 角色集合大于0
        if (role.length > 0) {
          this.$kit.ajax('post', this.$res.userAddRole, {userId: this.userId, roleId: role}, (res) => {
            this.$Message.success(res.data.msg)
            // 重新加载数据
            vm.getData()
          }, this)
        } else {
          this.$Message.error("授权角色不能为空")
        }

      },
    }

  }
</script>

<style scoped>

</style>