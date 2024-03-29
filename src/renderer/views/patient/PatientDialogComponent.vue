<template>
    <el-dialog title="创建或编辑患者" width="500px" :visible.sync="display" :before-close="close">
        <el-form label-width="75px" size="mini" :model="patient" :rules="rules" ref="patientForm">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="patient.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="patient.sex">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期">
                <el-date-picker type="date" placeholder="请填写出生日期" v-model="patient.birthday" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="就诊日期">
                <el-date-picker type="date" placeholder="请填写就诊日期" v-model="patient.visitDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="电话" prop="telephone">
                <el-input v-model="patient.telephone" placeholder="请填写手机号码"></el-input>
            </el-form-item>
            <el-form-item label="备用电话">
                <el-input v-model="patient.reserveTelephone"></el-input>
            </el-form-item>
            <el-form-item label="地区">
                <el-cascader
                        v-model="provinceCity"
                        :options="options" :props="{value: 'label'}"
                        @change="handleChange" style="width: 100%"></el-cascader>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="patient.address"></el-input>
            </el-form-item>
			<el-form-item label="负责人" v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
				<el-select v-model="patient.chargedBy" placeholder="请选择">
					<el-option
							v-for="member in members"
							:key="member.username"
							:label="member.username"
							:value="member.username">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="绑定用户" v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
				<el-autocomplete
						v-model="patient.username"
						:fetch-suggestions="querySearchAsync"
						placeholder="请输入用户名"
						@select="handleSelect"
				></el-autocomplete>
			</el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" :disabled="isSaving" @click="confirm('patientForm')">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { getSensitiveIgnorePatient, createPatient, updatePatient } from '@/api/PatientService'
  import { getUsersByLoginStartingWith } from '../../api/UserService'
  import { getProjectChargedByMembers } from '../../api/MemberService'
  import store from '../../store'
  const codes = require('./pca-code.json')
  export default {
    name: 'PatientDialogComponent',
    data() {
      return {
        projectId: this.$route.params.projectId,
        patientId: null,
        display: false,
        resolve: null,
        reject: null,
        rules: {
          name: [
            { required: true, message: '请输入患者姓名', trigger: 'change' }
          ],
          telephone: [
            { pattern: /^(1(3|4|5|6|7|8|9)\d{9})$/, message: '手机号码有误，请重填', trigger: 'change' }
          ]
        },
        patient: { name: '' },
        provinceCity: [],
        options: [],
        isSaving: false,
        members: []
      }
    },
    methods: {
      show(patientId) {
        this.patient = { name: '' }
        this.provinceCity = []
        this.options = JSON.parse(JSON.stringify(codes))
        this.display = true
        this.patientId = patientId
        this.getMembers()
        this.findPatient()
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      findPatient() {
        if (this.patientId) {
          getSensitiveIgnorePatient(this.projectId, this.patientId).then(res => {
            this.patient = res.data
            const cityList = []
            if (this.patient.province) {
              cityList.push(this.patient.province)
            }
            if (this.patient.city) {
              cityList.push(this.patient.city)
            }
            if (this.patient.area) {
              cityList.push(this.patient.area)
            }
            this.provinceCity = cityList
          })
        } else {
          this.patient = JSON.parse(JSON.stringify({
            projectId: this.projectId,
            chargedBy: store.getters.name,
            name: ''
          }))
        }
      },
      handleChange(value) {
        this.patient.province = value[0]
        this.patient.city = value[1]
        this.patient.area = value[2]
      },
      cancel() {
        this.display = false
        this.reject('cancel')
      },
      close() {
        this.display = false
        this.reject('close')
      },
      confirm() {
        this.$refs['patientForm'].validate((valid) => {
          if (valid) {
            this.isSaving = true
            if (this.patient.username === '') {
              this.patient.username = null
            }
            if (this.patientId) {
              updatePatient(this.patient).then(res => {
                this.isSaving = false
                this.display = false
                this.resolve(res.data)
              }, () => {
                this.isSaving = false
              })
            } else {
              createPatient(this.patient).then(res => {
                this.isSaving = false
                this.display = false
                this.resolve(res.data)
              }, () => {
                this.isSaving = false
              })
            }
          }
        })
      },
      querySearchAsync(queryString, cb) {
        if (queryString) {
          getUsersByLoginStartingWith(queryString).then(response => {
            cb(response.data.map(
              u => {
                return {
                  'value': u.login
                }
              })
            )
          })
        } else {
          cb([])
        }
      },
      handleSelect(item) {
      },
      getMembers() {
        getProjectChargedByMembers(this.projectId).then((members) => {
          this.members = members
        })
      }
    }
  }
</script>

<style scoped>

</style>
