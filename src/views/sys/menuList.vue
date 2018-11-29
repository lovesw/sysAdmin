<template>
    <div>
        <Table stripe :columns="columns" :data="data1" class="table"></Table>
        <div style="text-align: right">
            <router-link to="/sys/addMenu">
                <Button icon="plus-round" type="primary" shape="circle" class="add" v-has="this.$res.addMenu">添加
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
    name: 'menuList',
    data() {
      return {
        columns: [
          {title: '编号', key: 'id', align: 'center'},
          {title: '父级ID', key: 'fid', align: 'center'},
          {title: '名称', key: 'name', align: 'center'},
          {title: '路由', key: 'url', align: 'center'},
          {title: '内容', key: 'content', align: 'center'},
          {title: '排序', key: 'sort', align: 'center'},
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
        // 菜单数据
        data1: [],
        // 修改菜单数据
        changeMenu: {
          id: '',
          name: '',
          url: '',
          content: '',
          sort: '',
          fid: ''
        },
        isData: '',
        // 分页相关
        total: 0, // 总数据大小
        pageSize: 10, // 页码大小
        current: 1
      }
    },
    mounted: function () {
      this.getData()
      this.getFidMenu()
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
        this.$kit.ajax('get', this.$res.menuList, {page: this.current, size: this.pageSize}, (res) => {
          this.data1 = res.data.data.data
          this.total = res.data.data.totalSize
        }, this)
      },
      getFidMenu: function () {
        // 首先加载一级菜单
        this.$kit.ajax('get', this.$res.fidMenu, {}, (res => {
          this.isData = res.data.data
        }), this)
      },
      remove: function (id) {
        let param = {msg: "菜单", id: id, permissionId: this.$res.deleteMenu}
        this.$emit("remove", param, () => {
          this.getData();
        })
      },
      change: function (row) {
        this.changeMenu.id = row.id
        this.changeMenu.fid = row.fid
        this.changeMenu.name = row.name
        this.changeMenu.url = row.url
        this.changeMenu.content = row.content
        this.changeMenu.sort = row.sort
        this.$Modal.confirm({
          title: '修改菜单信息',
          render: (h) => {
            return ('div', [
              h('Select', {
                    props: {
                      value: this.changeMenu.fid,
                    },
                    style: {
                      marginTop: '20px'
                    }
                  }, this.isData.map((item) => {
                    return h('Option', {
                      props: {
                        value: item.id,
                        label: item.name
                      }
                    })
                  })
              ),
              h('Input', {
                props: {
                  value: this.changeMenu.name,
                  placeholder: '修改的菜单'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.changeMenu.name = val
                  }
                }
              }),
              h('Input', {
                props: {
                  value: this.changeMenu.url,
                  placeholder: '修改的路由'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.changeMenu.url = val
                  }
                }
              }),
              h('InputNumber', {
                props: {
                  max: 100,
                  value: this.changeMenu.sort,
                  placeholder: '修改排序值'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.changeMenu.sort = val
                  }
                }
              }),
              h('Input', {
                props: {
                  type: 'textarea',
                  value: this.changeMenu.content,
                  placeholder: '修改的描述'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.changeMenu.content = val
                  }
                }
              })
            ])
          },
          onOk: () => {
            this.$kit.ajax('put', this.$res.updateMenu, this.changeMenu, (res) => {
              // 重新加载表格
              this.getData()
              this.$Message.success(res.data.msg)
            })

          },
          onCancel: () => {
            this.$Message.warning("取消操作")
          }
        })
      }
    }

  }
</script>

<style scoped>
    .add {
        margin: 10px;
    }
</style>
