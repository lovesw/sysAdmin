<template>
    <div id="login">
        <h1> PERMISSION
            <br>Management System
        </h1><br>
        <Form :model="formInline" :rules="ruleInline" inline ref="formInline">
            <FormItem prop="username">
                <i-input class="ipt" placeholder="Username" type="text" v-model="formInline.username">
                    <Icon slot="prepend" type="ios-person-outline"></Icon>
                </i-input>
            </FormItem>
            <br><br>
            <FormItem prop="password">
                <i-input class="ipt" placeholder="Password" type="password" v-model="formInline.password">
                    <Icon slot="prepend" type="ios-locked-outline"></Icon>
                </i-input>
            </FormItem>
            <br>
            <FormItem>
                <Button @click="handleSubmit('formInline')" class="ipt" type="primary">login</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        formInline: {
          username: '',
          password: ''
        },
        ruleInline: {
          username: [
            {required: true, message: 'Please fill in the user name', trigger: 'blur'}
          ],
          password: [
            {required: true, message: 'Please fill in the password.', trigger: 'blur'},
            {type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        let vm = this
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$emit('login', vm.formInline)
          } else {
            this.$Message.error('请认真填写登录信息!')
          }
        })
      }
    }
  }
</script>

<style scoped>
    #login {
        padding-top: 10%;
        text-align: center;
    }

    .ipt {
        width: 300px
    }
</style>
