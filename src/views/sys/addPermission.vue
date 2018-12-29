<template>
    <div>
        <Form :label-width="80" :model="permission" :rules="ruleValidate" class="form" ref="permission">
            <FormItem label="隶属服务" prop="serverId">
                <Select class="ipt" name="serverId" placeholder="请选择" v-model="permission.serverId">
                    <template v-for="(val, key) in data1">
                        <Option :value="key">{{val}}</Option>
                    </template>
                </Select>
            </FormItem>
            <FormItem label="必须权限" prop="must">
                <Select class="ipt" name="must" placeholder="请选择" v-model="permission.must">
                    <Option value="1">是</Option>
                    <Option value="0">否</Option>
                </Select>
            </FormItem>
            <FormItem label="隶属菜单" prop="menu">
                <Input class="ipt" placeholder="请选择菜单" readonly v-model="permission.menu"/>
                <Button @click="choiceMenu" icon="android-list" shape="circle" size="small" type="primary">请选择</Button>
            </FormItem>
            <FormItem label="权限名称" prop="name">
                <Input class="ipt" placeholder="请输入权限名称" v-model="permission.name"/>
            </FormItem>
            <FormItem label="URL" prop="url">
                <Input class="ipt" placeholder="请输入url地址" v-model="permission.url"/>
            </FormItem>

            <FormItem label="权限说明" prop="content">
                <Input class="ipt" placeholder="请输入说明内容" type="textarea" v-model="permission.content"/>
            </FormItem>
            <FormItem>
                <Button @click="handleSubmit('permission')" type="primary">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
  export default {
    name: 'addPermission',
    data() {
      return {
        permission: {
          name: '',
          url: '',
          content: '',
          serverId: '',
          must: '1',
          mid: '',
          menu: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '权限名称不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '权限URL不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '权限说明不能为空', trigger: 'blur'}
          ],
          serverId: [
            {required: true, message: '权限隶属服务不能为空', trigger: 'blur'}
          ],
          must: [
            {required: true, message: '权限是否为必要权限', trigger: 'blur'}
          ],
          mid: [
            {required: true, message: '权限隶属菜单不能为空', trigger: 'blur'}
          ]
        },
        data1: {},
        data2: [{
          title: '菜单',
          expand: true,
          id: 0,
          children: []
        }]
      }
    },
    mounted: function () {
      // 获取服务
      this.data1 = JSON.parse(this.$kit.getSession(this.$kit.serviceName));
      // 获取全部的菜单信息,并遍历好后,放入到结果中
      let vm = this;
      this.$kit.ajax('get', this.$res.allMenu, {}, (res => {
        vm.data2[0].children = vm.$kit.tree(res.data.data)
      }), this)
    },
    methods: {
      handleSubmit: function (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$kit.ajax('post', this.$res.addPermission, this.permission, (res => {
                this.$Message.success("添加成功");
                // 重置表单
                this.$refs.permission.resetFields();
              }
            ), this)
          } else {
            this.$Message.error("请认真填写权限信息")
          }
        })
      },
      // 选择菜单
      choiceMenu: function () {
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('Input', {
                props: {
                  value: this.permission.menu,
                  autofocus: true,
                  placeholder: '选择权限所属菜单',
                  readonly: true
                }
              }),
              h('Tree', {
                props: {
                  data: this.data2
                },
                style: {
                  marginLeft: '30px',
                  marginTop: '30px'
                },
                on: {
                  'on-select-change': (val) => {
                    console.log(val);
                    // 默认只能给二级菜单添加权限
                    if (val[0].status) {
                      this.permission.menu = val[0].title;
                      this.permission.mid = val[0].id;
                    }
                  }
                }
              })
            ])
          },
          onOk: () => {
            this.permission.mid ? this.$Message.success('选择成功') : this.$Message.info('未选择菜单')
          },
          onCancel: () => {
            this.permission.mid = ''
            this.$Message.info('取消操作')
          }
        })
      }
    }
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
