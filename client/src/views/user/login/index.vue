<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="form-wrapper">
        <h3 class="form-title">登 录</h3>
        <el-form ref="loginFormRef" style="width: 100%;" :model="formData" :rules="loginFormRules" >
          <el-form-item prop="account">
            <el-input v-model.trim="formData.account" placeholder="帐号/邮箱/手机号"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input type="password" v-model="formData.password" placeholder="密码"  @keyup.enter="loginEvent"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="action-wrapper">
              <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
              <el-button type="text">忘记密码</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%;" @click="loginEvent" :loading="loading">登&nbsp;&nbsp;&nbsp;录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { UserLogin, login as loginApi, LoginResult } from '@/api/user'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ResultData } from '@/common/types/apiResult.type'

import { setRefreshToken, setToken } from '../../../utils/storage'
import { ElMessage } from 'element-plus'

export default {
  setup () {
    const formData = ref<UserLogin>({ account: '', password: '' })
    const autoLogin = ref<boolean>(false)

    const loginFormRules = ref({
      account: [
        { required: true, message: '请输入帐号/邮箱/手机号', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    })

    const router = useRouter()
    const route = useRoute()
    const loginFormRef = ref()
    // 登录事件
    const loginEvent = () => {
      if (loginFormRef.value) {
        loginFormRef.value.validate(async (valid: boolean) => {
          if (valid) {
            const res: ResultData<LoginResult> = await loginApi(formData.value)
            if (res?.code === 200) {
              const data = res.data as LoginResult
              setToken(data.accessToken)
              setRefreshToken(data.refreshToken)
              router.replace((route.query?.redirect || '/') as string)
            } else {
              ElMessage({ message: res?.msg || '网络异常，请稍后重试', type: 'error' })
            }
          }
        })
      }
    }

    return {
      autoLogin,
      formData,
      loginFormRef,
      loginFormRules,
      loginEvent
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  position: relative;

  .login-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .form-wrapper {
    .form-title {
      font-size: 30px;
      line-height: 36px;
      margin: 30px 0;
      text-align: center;
    }
    .action-wrapper {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
