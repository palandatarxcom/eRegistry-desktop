<template>
    <div class="login-container" :style="{background: 'url(' + bg_img + ') 50% no-repeat'}">
        <div class="alert alert-danger" v-if="keyMissing">
            <strong>无效的重置密码请求.</strong>
        </div>

        <div class="alert alert-warning" v-if="!success && !keyMissing && !error">
            <p>请设置新密码</p>
        </div>

        <div class="alert alert-danger" v-if="error">
            <p>无法重置密码. 请检查是否已重置过，或重新请求重置（您必须在请求重置密码后24小时内完成重置）.</p>
        </div>

        <p class="alert alert-success" v-if="success">
            <span><strong>您的密码已被重置.</strong> 请 </span>
            <router-link :to="{ path: '/login' }" class="alert-link">登录</router-link>
        </p>
        <el-card class="box-card mt-100" v-if="!keyMissing">
            <div slot="header" class="row-flex justify-center">
                <img src="../../../assets/logo-pdas.png"><h5>忘记密码</h5>
            </div>
            <div class="item">
                <el-form autoComplete="on"
                         :model="resetForm"
                         :rules="resetRules"
                         ref="resetForm"
                         label-position="left">
                    <el-form-item prop="password" class="imputStyle">
                        <span class="svg-container"><svg-icon icon-class="password"></svg-icon></span>
                        <el-input name="password"
                                  :type="pwdType"
                                  v-model="resetForm.password"
                                  autoComplete="on"
                                  placeholder="新密码"></el-input>
                        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
                    </el-form-item>
                    <el-form-item prop="checkPass" class="imputStyle">
                        <span class="svg-container"><svg-icon icon-class="password"></svg-icon></span>
                        <el-input name="checkPass"
                                  :type="pwdType"
                                  v-model="resetForm.checkPass"
                                  autoComplete="on"
                                  placeholder="确认新密码"></el-input>
                        <span class="show-pwd"><svg-icon icon-class="eye" /></span>
                    </el-form-item>

                    <el-form-item>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-button type="primary" style="width:100%;"
                                           :disabled="isSaving"
                                           @click.native.prevent="submit">
                                    重置密码
                                </el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button type="primary" style="width:100%;"
                                           @click.native.prevent="cancel">
                                    取消
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
  import { finishPasswordReset } from '@/api/AccountService'
  import bg_img from '@/assets/bg1.jpg'
  export default {
    name: 'resetFinish',
    data() {
      const key = this.$route.query.key
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (value.length < 5) {
            callback(new Error('密码不能小于5位'))
          } else {
            if (this.resetForm.checkPass !== '') {
              this.$refs.resetForm.validateField('checkPass')
            }
            callback()
          }
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.resetForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        bg_img,
        pwdType: 'password',
        isSaving: false,
        key,
        keyMissing: null,
        resetForm: {
          password: '',
          checkPass: ''
        },
        resetRules: {
          password: [{ validator: validatePass, trigger: 'change' }],
          checkPass: [{ validator: validatePass2, trigger: 'change' }]
        },
        success: null,
        error: null
      }
    },
    created() {
      this.keyMissing = !this.key
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      submit() {
        this.isSaving = true
        finishPasswordReset({
          key: this.key,
          newPassword: this.resetForm.password
        }).then(() => {
          this.isSaving = false
          this.success = 'OK'
          this.error = null
        }, () => {
          this.isSaving = false
          this.success = null
          this.error = 'ERROR'
        })
      },
      cancel() {
        this.$router.push({ path: '/login' })
      }
    }
  }
</script>

<style scoped>

</style>
