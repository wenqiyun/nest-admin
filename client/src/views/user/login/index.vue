<template>
  <div class="user-layout-wrapper">
    <div class="login-container">
      <div class="top">
        <span>nest-admin 权限管理系统</span>
      </div>
      <div class="main">
        <el-form ref="loginForm" :model="loginForm" :rules="rules">
          <el-form-item prop="account">
            <el-input placeholder="账号" prefix-icon="el-icon-user-solid" v-model.trim="loginForm.account"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="密码" type="password" prefix-icon="el-icon-lock" v-model="loginForm.password" @keyup.enter.native="confirmLoginEvent"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" :loading="loading" @click="confirmLoginEvent" style="width: 100%;margin-top: 24px;">登&nbsp;&nbsp;录</el-button>
      </div>
      <div class="footer">
        <span>©2020</span>
        <span>&nbsp;|&nbsp;</span>
        <a href="http://beian.miit.gov.cn" target="_blank">赣ICP备17000521号-1</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loading: false,
      loginForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, message: '用户名至少需要三位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      otherQuery: {},
      redirect: ''
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        // const query = route.query
        // if (query) {
        //   this.redirect = query.redirect
        //   this.otherQuery = this.getOtherQuery(query)
        // }
      },
      immediate: true
    }
  },
  methods: {
    confirmLoginEvent () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            })
            .catch(msg => {
              this.$message.error(msg)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.user-layout-wrapper{
  height: 100vh;
  .login-container {
    width: 100%;
    min-height: 100%;
    background: #f0f2f5 url(/static/img/login-bg.png) no-repeat 50%;
    background-size: 100%;
    padding: 220px 0 144px;
    position: relative;
  }
  .top {
    text-align: center;
    height: 77px;
    font-size: 33px;
    font-weight: 600;
    color: rgba(0,0,0,.85);
  }
  .main {
    vertical-align: middle;
    min-width: 260px;
    width: 368px;
    margin: 0 auto;
  }
  .footer {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
  }
}
</style>
