<template>
  <el-dialog title="会议邀请" :visible.sync="display" @close="close">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div class="personnel">
            <span class="user">{{ name }}</span>
            <el-tag
              v-if="checkedPatient"
              class="tag"
              closable
              @close="remove"
              size="medium"
              type="info">
              {{ checkedPatient.name }}
            </el-tag>
            <el-autocomplete
              class="inline-input"
              v-model="searchPatients"
              :fetch-suggestions="querySearch"
              placeholder="搜索患者"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
          </div>
          <el-row class="btn_foot">
            <el-button type="primary" class="confirm" :disabled="!checkedPatient" @click="save">确定</el-button>
            <el-button type="info" plain class="cancel" @click="cancel">取 消</el-button>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12" style="border-left: 1px solid #f0f2f5;height: 400px;">
        <div class="grid-content bg-purple-light" v-show="showHide">
          <div class="grouping" @click="patientShow">
              <img style="width: 50px;height: 50px;margin: 15px 10px 15px 25px" src="../../assets/user.png" alt="">
            <span class="patient">我的患者</span>
          </div>
        </div>
        <div v-show="!showHide">
          <div class="personnel" >
            <div style="color: #000;font-size: 15px;margin: 10px 15px;cursor: pointer;" @click="showHide=!showHide">
              <i class="el-icon-arrow-left"></i>
              我的患者
            </div>
            <div style="margin: 5px 15px;overflow: auto;height: 310px;">
              <el-radio-group v-model="checkedPatient" @change="changeRadio">
                <div v-for="(item, index) in patients" :key="index" style="margin: 10px 5px;">
                  <el-radio :label="item" >{{ item.name }}</el-radio>
                </div>
              </el-radio-group>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
  import { getProjectPatients } from '@/api/PatientService'
  import { mapGetters } from 'vuex'
  import { createMeeting } from '../../api/MeetingService'
  import { Message } from 'element-ui'
export default {
    name: 'MeetingInvitationDialog',
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId,
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        display: false,
        resolve: null,
        reject: null,
        isSaving: false,
        confirm: true,
        showHide: true,
        checkedPatient: null,
        patients: [],
        queryName: null,
        searchPatients: '',
        patientName: null
      }
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    methods: {
      show() {
        this.display = true
        this.showHide = true
        this.checkedPatient = null
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      close() {
        this.display = false
        this.reject('close')
      },
      cancel() {
        this.display = false
        this.reject('cancel')
      },
      save() {
        if (!this.checkedPatient.username) {
          Message.error('该患者还没有认入组，请把入组二维码发送给患者进行确认入组')
          return
        }
        this.isSaving = true
        createMeeting({
          projectId: this.projectId,
          title: `${this.name}发起的视频随访`,
          participants: [
            this.checkedPatient.username
          ]
        }).then(res => {
          this.isSaving = false
          this.display = false
          this.searchPatients = ''
          this.resolve(res.data)
        }, () => {
          this.isSaving = false
        })
      },
      querySearch(queryString, cb) {
        var patients = this.patients
        var results = queryString ? patients.filter(this.createFilter(queryString)) : patients
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      changeRadio(item) {
        this.searchPatients = item.name
      },
      patientShow() {
        this.showHide = !this.showHide
      },
      queryPatient() {
        getProjectPatients(this.projectId, {
          'LIKE_patient.name': (this.queryName ? `%${this.queryName}%` : null)
        }).then((res) => {
          this.patients = [...this.patients, ...res.data].map((i) => { return { ...i, value: i.name } })
          this.total = Number(res.headers['x-total-count'])
        })
      },
      handleSelect(item) {
        this.checkedPatient = item
      },
      searchPatient() {
        this.showHide = false
        if (this.queryName === '') {
          this.queryName = null
        }
        this.queryPatient()
      },
      remove() {
        this.searchPatients = ''
        this.checkedPatient = null
      }
    },
    mounted() {
      this.queryPatient()
    }
  }
</script>

<style lang="scss" scoped>
  .personnel{
    height: 400px;
    .tag{
      margin: 2px 3px;
      height: 32px;
      line-height: 32px;
    }
  }
  .user{
    border: 1px dashed #000;
    border-radius: 5px;
    padding: 5px;
  }

  .btn_foot{
    margin-top: 15px;
    display: flex;
    align-items: flex-end;
    .confirm{
      width: 117px;
      height: 36px;
      font-size: 15px;
    }
    .cancel{
      height: 36px;
      font-size: 15px;
      color: #000;
    }
  }
  .bg-purple-light{
    .grouping{
      border-bottom: 1px solid #f0f2f5;
      flex-wrap:wrap;
      display: flex;
      .patient{
        line-height: 80px;
        color: #000;
        font-size: 15px;
      }
    }
  }
</style>
