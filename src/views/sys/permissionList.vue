<template>
    <div>
        <Table stripe :columns="columns" :data="data1" class="table"></Table>
        <div style="text-align: right">
            <router-link to="/sys/addPermission">
                <Button icon="plus-round" type="primary" shape="circle" class="add" v-has="this.$res.addPermission">添加
                </Button>
            </router-link>
        </div>
        <div style="text-align: right;margin: 5px">
            <Page :total="total" size="small" show-total show-elevator show-sizer @on-change="pageChange"
                  @on-page-size-change="sizeChange"></Page>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'permissionList',
    data() {
      return {
        columns: [
          {title: '编号', key: 'id', align: 'center'},
          {title: '菜单', key: 'menuName', align: 'center'},
          {title: '名称', key: 'name', align: 'center'},
          {title: '路由', key: 'url', align: 'center'},
          {title: '内容', key: 'content', align: 'center'},
          {title: '所属服务', key: 'serverName', align: 'center'},
          {
            title: '必要类型', key: 'must', align: 'center', render: (h, params) => {
              return h('span', params.row.must === 1 ? '是' : '否')
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
        // 权限数据
        data1: [],
        // 分页相关
        total: 0, // 总数据大小
        pageSize: 10, // 页码大小
        current: 1,
        // 修改的权限信息定义
        permission: {
          id: '',
          name: '',
          url: '',
          content: '',
          must: ''
        },
      }
    },
    mounted: function () {
      this.getData()
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
        this.$kit.ajax('get', this.$res.permissionList, {page: this.current, size: this.pageSize}, (res) => {
          this.data1 = res.data.data.data
          this.total = res.data.data.totalSize
        }, this)
      },
      remove: function (id) {
        this.$Modal.confirm({
          title: '删除确定',
          content: '<p>你确定要删除该权限吗?删除后不可撤销</p>',
          onOk: () => {
            this.$kit.ajax('delete', this.$res.deletePermission, {id: id}, (res) => {
              this.$Message.success('删除成功')
              // 重新加载数据
              this.getData()
            }, this)
          },
          onCancel: () => {
            this.$Message.info('取消操作')
          }
        })
      },
      // 修改权限信息
      change: function (row) {
        this.permission.id = row.id;
        this.permission.name = row.name;
        this.permission.url = row.url;
        this.permission.must = row.must;
        this.permission.content = row.content;

        this.$Modal.confirm({
          title: '修改的权限信息',
          render: (h) => {
            return ('div', [
              h('Input', {
                props: {
                  value: this.permission.name,
                  placeholder: '修改权限名称'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.permission.name = val
                  }
                }
              }), h('Input', {
                props: {
                  value: this.permission.url,
                  placeholder: '修改权限URL'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.permission.url = val
                  }
                }
              }), h('i-switch', {
                props: {
                  value: row.must === 1,
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  'on-change': (val) => {
                    this.permission.must = val ? 1 : 0;
                  }
                }
              }),
              h('Input', {
                props: {
                  type: 'textarea',
                  value: this.permission.content,
                  placeholder: '修改的描述'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.permission.content = val
                  }
                }
              })

            ])
          },
          onCancel: () => {
            this.$Message.info("取消操作")
          },
          onOk: () => {
            this.$kit.ajax('put', this.$res.updatePermission, this.permission, (res) => {
              // 重新加载表格
              this.getData()
              this.$Message.success(res.data.msg)
            })
          }

        });
      }
    }
  }
</script>

<style scoped>
    .add {
        margin: 10px;
    }
</style>
