<template>
    <div>
        <Table stripe :columns="columns" :data="data1" class="table"></Table>
        <div style="text-align: right">
            <Page :total="total" size="small" show-total show-elevator show-sizer @on-change="pageChange"
                  @on-page-size-change="sizeChange"></Page>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'articleList',
    data() {
      return {
        columns: [
          {title: '编号', key: 'id', align: 'center',width:80},
          {title: '标题', key: 'title', align: 'center'},
          {title: '摘要', key: 'summary', align: 'center', width: 320},
          {title: '作者', key: 'author', align: 'center'},
          {
            title: '图片', key: 'image', align: 'center', render: (h, params) => {
              return h("img", {
                attrs: {
                  src: params.row.image
                },
                style: {
                  width: '50px',
                  height: '50px'
                }
              })
            }
          },
          {
            title: '文章连接', key: 'url', align: 'center', render: (h, params) => {
              return h("a", {
                attrs: {
                  href: params.row.url,
                  target: '_black'
                }
              }, params.row.url);
            }
          },
          {
            title: '类型',
            key: 'type',
            align: 'center',
            render: (h, params) => {
              if (params.row.type === 1) {
                return h('span', '原创')
              } else {
                return h('span', '行业')
              }
            }
          },
          {title: '时间', key: 'date', align: 'center'},
          {
            title: '状态', key: 'status', align: 'center', render: (h, params) => {
              if (params.row.status === 1) {
                return h('span', '启用')
              } else {
                return h('span', '未启用')
              }
            }
          },
          {
            title: '操作', key: 'operate', align: 'center', render: (h, params) => {
              let status = params.row.status === 1

              return h("div", [
                h("Button", {
                  props: {
                    type: status ? 'error' : 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '<p>你确定要执行该操作吗?</p>',
                        onOk: () => {
                          this.$kit.ajax("put", "/article/modifyStatus", {
                            id: params.row.id,
                            status: status ? 0 : 1
                          }, (res) => {
                            this.$Message.success(res.data.msg)
                            params.row.status = status ? 0 : 1;
                          }, this)
                        },
                        onCancel: () => {
                          this.$Message.info('你取消了该操作');
                        }
                      });
                    }
                  }

                }, status ? "禁用" : "启用")]
              )
            }
          },
        ],
        // 数据
        data1: [],
        // 分页相关
        total: 0, // 总数据大小
        pageSize: 10, // 页码大小
        current: 1
      }
    },
    mounted: function () {
      this.getData()
    },
    methods: {
      pageChange: function (val) {
        this.current = val
        this.getData()
      },
      sizeChange: function (val) {
        this.pageSize = val
        this.getData()
      },
      getData: function () {
        this.$kit.ajax('get', 'article/listAll', {page: this.current, size: this.pageSize, type: 1}, (res) => {
          this.data1 = res.data.data.data
          this.total = res.data.data.totalSize
        }, this)
      }
    }

  }
</script>

<style scoped>

</style>
