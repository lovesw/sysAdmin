<template>
    <div>
        <Form :label-width="80" :model="service" :rules="ruleValidate" class="form" ref="service">
            <FormItem label="服务名称" prop="name">
                <Input class="ipt" placeholder="请输入服务名称" v-model="service.name"/>
            </FormItem>
            <FormItem label="路由" prop="url">
                <Input class="ipt" placeholder="请输入服务请求应用名称(访问前缀)" v-model="service.url"/>
            </FormItem>
            <FormItem label="服务说明" prop="content">
                <Input class="ipt" placeholder="请输入说明内容" type="textarea" v-model="service.content"/>
            </FormItem>
            <FormItem>
                <Button @click="handleSubmit('service')" type="primary">提交</Button>
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
