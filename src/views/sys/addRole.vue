<template>
    <div>
        <Form :label-width="80" :model="role" :rules="ruleValidate" class="form" ref="role">
            <FormItem label="角色名称" prop="name">
                <Input class="ipt" placeholder="请输入服务名称" v-model="role.name"/>
            </FormItem>
            <FormItem label="角色描述" prop="content">
                <Input class="ipt" placeholder="请输入说明内容" type="textarea" v-model="role.content"/>
            </FormItem>
            <FormItem>
                <Button @click="handleSubmit('role')" type="primary">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
  export default {
    name: 'addRole',
    data() {
      return {
        role: {
          name: '',
          content: '',
        },
        ruleValidate: {
          name: [
            {required: true, message: '服务名称不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '服务说明不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      handleSubmit: function (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$kit.ajax('post', this.$res.addRole, this.role, (res => {
              this.$Message.success(res.data.msg)
              this.$refs.role.resetFields()
            }), this)
          } else {
            this.$Message.error("请认真填写角色信息")
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
