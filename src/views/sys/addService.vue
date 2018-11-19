<template>
    <div>
        <Form ref="service" :model="service" :rules="ruleValidate" :label-width="80" class="form">
            <FormItem label="服务名称" prop="name">
                <Input v-model="service.name" placeholder="请输入服务名称" class="ipt"/>
            </FormItem>
            <FormItem label="路由" prop="url">
                <Input v-model="service.url" placeholder="请输入服务请求应用名称(访问前缀)" class="ipt"/>
            </FormItem>
            <FormItem label="服务说明" prop="content">
                <Input type="textarea" v-model="service.content" placeholder="请输入说明内容" class="ipt"/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('service')">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
  export default {
    name: 'addService',
    data() {
      return {
        service: {
          name: '',
          url: '',
          content: '',
        },
        ruleValidate: {
          name: [
            {required: true, message: '服务名称不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '服务说明不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '服务地址不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      handleSubmit: function (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$kit.ajax('post', this.$res.addService, this.service, (res => {
              this.$Message.success(res.data.msg)
              this.$refs.service.resetFields()
            }), this)
          } else {
            this.$Message.error("请认真填写服务信息")
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
