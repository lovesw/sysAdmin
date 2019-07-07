<template>
    <div>
        <Table :columns="columns" :data="data1" class="table" stripe></Table>
        <div style="text-align: right">
            <router-link to="/sys/addCron">
                <Button class="add" icon="plus-round" shape="circle" type="primary" v-has="this.$res.addCron">添加
                </Button>
            </router-link>s
        </div>
        <br/>
        <div style="text-align: right;margin: 5px">
            <Page :total="total" @on-change="pageChange" @on-page-size-change="sizeChange" show-elevator show-sizer
                  show-total size="small"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        name: "cornList",
        data() {
            return {
                columns: [

                    {title: '编号', key: 'id', align: 'center', width: '80px'},
                    {title: '名称', key: 'name', align: 'center'},
                    {title: '表达式', key: 'cron', align: 'center'},
                    {title: '任务类', key: 'clazz', align: 'center', width: '300px'},
                    {title: '描述', key: 'describe', align: 'center'},
                    {
                        title: '状态', key: 'status', align: 'center', render: (h, params) =>
                            h('i-switch', {
                                props: {
                                    value: params.row.status === 1,
                                    size: 'large'
                                },
                                scopedSlots: {
                                    open: () => h('span', 'ON'),
                                    close: () => h('span', 'OFF')
                                },
                                on: {
                                    'on-change': (status) => {
                                        let url;
                                        if (status) {
                                            url = this.$res.resumeCron
                                        } else {
                                            url = this.$res.pauseCron
                                        }
                                        // 修改状态
                                        this.$kit.ajax('put', url, {
                                            id: params.row.id
                                        }, (res) => {
                                            // 重新加载表格
                                            this.getData();
                                            this.$Message.success(res.data.msg)
                                        }, this)
                                    }
                                }
                            })
                    },
                    {title: '修改时间', key: 'gmtModified', align: 'center'},
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
                // 数据类
                data1: [],
                total: 0, // 总数据大小
                pageSize: 10, // 页码大小
                current: 1
            }
        },
        mounted: function () {
            this.getData()
        }
        ,
        methods: {
            // 修改当前页码
            pageChange: function (val) {
                this.current = val
                this.getData()
            }
            ,
            // 修改页码大小
            sizeChange: function (val) {
                this.pageSize = val
                this.getData()
            }
            ,
            // 获取数据
            getData: function () {
                this.$kit.ajax('get', this.$res.cronList, {page: this.current, size: this.pageSize}, (res) => {
                    this.data1 = res.data.data.data
                    this.total = res.data.data.totalSize
                }, this)
            }
            ,
            change: function (row) {

                let cron = row.cron;

                this.$Modal.confirm({
                    title: '修改定时任务表达式',
                    render: (h) => {
                        return ('div', [
                            h('Input', {
                                props: {
                                    value: cron,
                                    placeholder: '任务表达式'
                                },
                                style: {
                                    marginTop: '20px'
                                },
                                on: {
                                    input: (val) => {
                                        cron = val
                                    }
                                }
                            }),
                        ])
                    },
                    onOk: () => {
                        this.$kit.ajax('put', this.$res.updateCron, {id: row.id, cron: cron}, (res) => {
                            // 重新加载表格
                            this.getData()
                            this.$Message.success(res.data.msg)
                        })
                    },
                    onCancel: () => {
                        this.$Message.warning("取消操作")
                    }
                })
            },
            remove: function (id) {
                let param = {msg: "任务", id: id, permissionId: this.$res.deleteCron}
                this.$emit("remove", param, () => {
                    this.getData();
                })
            }

        }
    }
</script>s

<style scoped>

</style>