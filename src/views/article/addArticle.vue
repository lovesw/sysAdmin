<template>
    <div class="form">
        <Form id="article" ref="article" :model="article" :rules="ruleValidate" :label-width="120" class="form">
            <FormItem label="文章标题" prop="title">
                <Input v-model="article.title" name="title" placeholder="请输入文章标题" class="ipt"/>
            </FormItem>
            <FormItem label="作者" prop="author">
                <Input v-model="article.author" name="author" placeholder="请输入作者的名称" class="ipt"/>
            </FormItem>
            <FormItem label="文章连接" prop="url">
                <Input v-model="article.url" name="url" placeholder="请输入文章可访问的链接" class="ipt"/>
            </FormItem>
            <FormItem label="请选择文章类型" prop="type">
                <Select v-model="article.type" class="ipt" placeholder="请选择" name="type">
                    <Option value="1">原创</Option>
                    <Option value="2">行业</Option>
                </Select>
            </FormItem>
            <FormItem label="文章摘要" prop="summary">
                <Input type="textarea" v-model="article.summary" name="summary" placeholder="请输入文章摘要" class="ipt"/>
            </FormItem>
            <FormItem label="展示图" prop="img">
                <Upload :max-size="2048" action="" :before-upload="handleBeforeUpload">
                    <Button icon="ios-cloud-upload-outline">选择上传的图片</Button>
                </Upload>
                <span v-if="article.img !== null">图片名称: {{ article.img.name }}</span>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('article')">提交</Button>
            </FormItem>
        </Form>


    </div>
</template>

<script>
  export default {
    name: 'addArticle',
    data() {
      return {
        article: {
          title: "",
          author: "",
          img: null,
          url: "",
          summary: "",
          type: 1
        },
        ruleValidate: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          author: [
            {required: true, message: '作者不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '访问URL不能为空', trigger: 'blur'},
            {type: 'url', message: '参数必须为可访问的URL', trigger: 'blur'},
          ],
          type: [
            {required: true, message: '文章类型不能为空', trigger: 'blur'}
          ],
          summary: [
            {required: true, message: '文章概要不能为空', trigger: 'blur'}
          ],
        },
      }

    },
    methods: {
      handleSubmit: function (name) {
        console.log(this.article.img)
        this.$refs[name].validate((valid) => {
          if (valid) {
            let form = new FormData(document.getElementById('article'))
            form.append("img", this.article.img)
            this.$kit.ajaxFormData("/article/add", form, (res) => {
              this.$Message.success("文章添加成功")
              // 重置文件对象,隐藏提示信息
              this.article.img = null
              // 重置表单
              this.$refs.article.resetFields();
            }, this)
          } else {
            this.$Message.error('请认真填写信息!')
          }
        })
      },
      handleBeforeUpload: function (file) {
        this.article.img = file
        return false
      }
    }
  }
</script>

<style scoped>
    .ipt {
        width: 500px;
    }

    .form {
        margin: 100px 0 10px 200px;
    }
</style>
