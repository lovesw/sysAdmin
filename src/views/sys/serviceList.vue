<template>
    <div>
        <Table stripe :columns="columns" :data="data1" class="table"></Table>
        <div style="text-align: right">
            <router-link to="/sys/addService">
                <Button icon="plus-round" type="primary" shape="circle" class="add" v-has="this.$res.addMenu">添加
                </Button>
            </router-link>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'serviceList',
    data() {
      return {
        columns: [
          {title: '编号', key: 'id', align: 'center'},
          {title: '名称', key: 'name', align: 'center'},
          {title: '路由', key: 'url', align: 'center'},
          {title: '说明', key: 'content', align: 'center'},
          {title: '时间', key: 'date', align: 'center'},
          {
            title: '状态', key: 'status', align: 'center', render: (h, params) => {
              if (params.row.status === 0) {
                return h('span', '未启用')
              } else {
                return h('span', '启用')
              }
            }
          },
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
        // 服务数据
        data1: [],
        // 修改服务数据
        changeService: {
          id: '',
          name: '',
          url: '',
          content: '',
          status: ''
        },
        isData: '',
      }
    },
    mounted: function () {
      this.getData()
    },
    methods: {
      // 获取数据
      getData: function () {
        this.$kit.ajax('get', this.$res.listService, {page: this.current, size: this.pageSize}, (res) => {
          this.data1 = res.data.data
        }, this)
      },
      remove: function (id) {
        this.$Modal.confirm({
          title: '删除确定',
          content: '<p>你确定要删除该服务吗?删除后不可撤销</p>',
          onOk: () => {
            this.$kit.ajax('delete', this.$res.deleteService, {id: id}, (res) => {
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
      change: function (row) {
        this.changeService.id = row.id
        this.changeService.name = row.name
        this.changeService.url = row.url
        this.changeService.content = row.content
        this.changeService.status = row.status
        this.$Modal.confirm({
          title: '修改服务信息',
          render: (h) => {
            return ('div', [
              h('Input', {
                props: {
                  value: this.changeService.name,
                  placeholder: '服务名称'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.changeService.name = val
                  }
                }
              }),
              h('Input', {
                props: {
                  value: this.changeService.url,
                  placeholder: '修改的路由'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.changeService.url = val
                  }
                }
              }),
              h('Input', {
                props: {
                  type: 'textarea',
                  value: this.changeService.content,
                  placeholder: '修改的描述'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    this.changeService.content = val
                  }
                }
              })
            ])
          },
          onOk: () => {
            this.$kit.ajax('put', this.$res.updateService, this.changeService, (res) => {
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
