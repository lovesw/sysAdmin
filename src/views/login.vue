<template>
    <div class="background">
        <div id="login">
            <Card>
                <p slot="title">欢迎登陆PermissionAdmin系统</p>
                <Form :model="formInline" :rules="ruleInline" inline ref="formInline">
                    <FormItem prop="username">
                        <Input class="ipt" placeholder="Username" type="text" v-model="formInline.username">
                            <Icon type="md-person" slot="prepend"/>
                        </Input>
                    </FormItem>
                    <br>
                    <FormItem prop="password">
                        <Input class="ipt" placeholder="Password" type="password" v-model="formInline.password">
                            <Icon type="md-key" slot="prepend"/>
                        </Input>
                    </FormItem>
                    <br>
                    <FormItem>
                        <Button @click="handleSubmit('formInline')" class="ipt" type="primary">login</Button>
                    </FormItem>
                </Form>
            </Card>
        </div>
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
                        {required: true, message: '请输入登陆的用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登陆密码', trigger: 'blur'},
                        {
                            type: 'string',
                            min: 6,
                            message: 'The password length cannot be less than 6 bits',
                            trigger: 'blur'
                        }
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
        margin-top: 10%;
        right: 5%;
        text-align: center;
        width: 300px;
        position: absolute;
    }

    /*设置背景图片全部沾满*/
    .background {
        background-image: url(../assets/login-background.jpg);
        background-size: cover;
        background-position: center center;
        position: fixed;
        height: 100%;
        width: 100%;
    }

    .ipt {
        width: 250px;
    }
</style>
