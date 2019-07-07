<template>
    <div>
        <Form :label-width="80" :model="job" :rules="ruleValidate" class="form" ref="job">
            <FormItem label="任务名称" prop="name">
                <Input class="ipt" placeholder="请输入任务名称" v-model="job.name"/>
            </FormItem>
            <FormItem label="任务分组" prop="groupName">
                <Input class="ipt" placeholder="请输入任务分组名称" v-model="job.groupName"/>
            </FormItem>
            <FormItem label="执行类" prop="clazz">
                <Select class="ipt" name="type" placeholder="请选择" v-model="job.clazz">
                    <template v-for="item in data">
                        <Option :value="item">{{item}}</Option>
                    </template>
                </Select>
            </FormItem>

            <FormItem label="表达式" prop="cron">
                <Input class="ipt" placeholder="执行任务表达式" v-model="job.cron"/>
            </FormItem>
            <FormItem label="任务说明" prop="describe">
                <Input class="ipt" placeholder="任务说明" type="textarea" v-model="job.describe"/>
            </FormItem>
            <FormItem>
                <Button @click="handleSubmit('job')" type="primary">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "addCron",
        data() {
            return {
                job: {
                    name: "",
                    groupName: "",
                    cron: '',
                    clazz: '',
                    describe: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '任务名称不能为空', trigger: 'blur'}
                    ],
                    groupName: [
                        {required: true, message: '分组名称不能为空', trigger: 'blur'}
                    ],
                    cron: [
                        {required: true, message: '表达式不能为空', trigger: 'blur'}
                    ],
                    clazz: [
                        {required: true, message: '执行任务类不能为空', trigger: 'blur'}
                    ],
                    describe: [
                        {required: true, message: '任务描述不能为空', trigger: 'blur'}
                    ]
                },
                data: [],
            }
        },
        mounted: function () {
            this.data = this.getClazz();
        },
        methods: {
            getClazz: function () {
                // 首先加载去全部的定时任务列表
                this.$kit.ajax('get', this.$res.clazzCron, {}, (res => {
                    this.data = res.data.data
                }), this)
            },
            handleSubmit: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$kit.ajax('post', this.$res.addCron, this.job, (res => {
                            this.$Message.success(res.data.msg)
                        }), this)
                    } else {
                        this.$Message.error("请认真填写任务信息")
                    }
                })
            }
        },

    }
</script>


<style scoped>
    .ipt {
        width: 500px;
    }

    .form {
        margin: 60px 0 10px 200px;
    }
</style>