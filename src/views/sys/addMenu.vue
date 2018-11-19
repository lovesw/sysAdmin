<template>
    <div>
        <Form ref="menu" :model="menu" :rules="ruleValidate" :label-width="80" class="form">
            <FormItem label="菜单名称" prop="name">
                <Input v-model="menu.name" placeholder="请输入菜单名称" class="ipt"/>
            </FormItem>
            <FormItem label="父级菜单" prop="menu">
                <Select v-model="menu.fid" class="ipt" placeholder="请选择" name="type">
                    <template v-for="item in data1">
                        <Option :value="item.id">{{item.name}}</Option>
                    </template>
                </Select>
            </FormItem>
            <FormItem label="URL" prop="url">
                <Input v-model="menu.url" placeholder="请输入url地址" class="ipt"/>
            </FormItem>
            <FormItem label="排序值" prop="sort">
                <Input v-model="menu.sort" placeholder="排序值" class="ipt"/>
            </FormItem>
            <FormItem label="添加说明" prop="content">
                <Input type="textarea" v-model="menu.content" placeholder="请输入说明内容" class="ipt"/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('menu')">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
  export default {
    name: 'add-menu',
    data() {
      return {
        menu: {
          fid: '',
          name: '',
          url: '',
          content: '',
          sort: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '菜单名称不能为空', trigger: 'blur'}
          ],
          fid: [
            {required: true, message: '父级菜单不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '菜单说明不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: 'url地址不能为空', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '排序值不能为空', trigger: 'blur'}
          ]
        },
        data1: []
      }
    },
    mounted: function () {
      this.data1 = this.getFidMenu();
    },
    methods: {
      getFidMenu: function () {
        // 首先加载一级菜单
        this.$kit.ajax('get', this.$res.fidMenu, {}, (res => {
          this.data1 = res.data.data
        }), this)
      },
      handleSubmit: function (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$kit.ajax('post', this.$res.addMenu, this.menu, (res => {
              let fid = this.menu.fid;
              this.$Message.success(res.data.msg)
              this.$refs.menu.resetFields()
              // 如果添加的是一级菜单,也是就是fid==0的时候,是需要重新去加载一次菜单
              if (fid === '0') {
                this.data1 = this.getFidMenu()
              }
            }), this)
          } else {
            this.$Message.error("请认真填写菜单信息")
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
