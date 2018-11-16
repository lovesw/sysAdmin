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
    name: 'menuList',
    data() {
      return {
        columns: [
          {title: '编号', key: 'id', align: 'center'},
          {title: '父级ID', key: 'title', align: 'center'},
          {title: '名称', key: 'summary', align: 'center'},
          {title: '路由', key: 'author', align: 'center'},
          {title: '内容', key: 'type', align: 'center'},
          {title: '时间', key: 'date', align: 'center'},
          {title: '排序', key: 'status', align: 'center'},
          {title: '操作', key: 'operate', align: 'center'},
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
