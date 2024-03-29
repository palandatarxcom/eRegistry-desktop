<template>
	<div>
		<el-row>
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item label="调查问卷">
					<el-select @change="getEvents"
							   v-model="questionnaireId" placeholder="调查问卷" clearable>
						<el-option
								v-for="questionnaire in questionnaires"
								:key="questionnaire.id"
								:label="questionnaire.reportName"
								:value="questionnaire.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="风险程度">
					<el-select @change="getEvents" v-model="type" placeholder="风险程度" clearable>
						<el-option label="中风险" value="WARN"></el-option>
						<el-option label="高风险" value="ERROR"></el-option>
						<el-option label="其他" value="OTHER"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</el-row>
		<el-row>
			<el-table v-loading="loading" stripe :data='events' @sort-change="changeOrder" style='width: 100%'>
				<el-table-column label='风险程度' width="95" align="center" sortable="custom">
				  <template slot-scope="scope">
					<span v-if="scope.row.type === 'OTHER'"><svg-icon icon-class="info" class-name="card-panel-icon"/></span>
					<span v-if="scope.row.type === 'WARN'"><svg-icon icon-class="alert" :class="scope.row.type" class-name="card-panel-icon"/></span>
					<span v-if="scope.row.type === 'ERROR'"><svg-icon icon-class="error" :class="scope.row.type" class-name="card-panel-icon"/></span>
				  </template>
				</el-table-column>
				<el-table-column prop='title' label='标题' sortable="custom" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop='question' label='问题' sortable="custom" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop='content' label='告警内容' sortable="custom" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :class="scope.row.type">{{scope.row.content}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='submitter' label='填写人'>
					<template slot-scope="scope">
						<span v-if="scope.row.patientName">{{scope.row.patientName}}</span>
						<span v-if="!scope.row.patientName">{{scope.row.submitter}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='date' label='填表时间' sortable="custom">
					<template slot-scope="scope">{{scope.row.date | formatDate('YYYY-MM-DD HH:mm')}}</template>
				</el-table-column>
				<el-table-column prop='handleType' label='处理描述' sortable="custom" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop='handleDesc' label='备注' sortable="custom" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop='handleDate' label='处理时间' sortable="custom">
					<template slot-scope="scope">{{scope.row.handleDate | formatDate('YYYY-MM-DD HH:mm')}}</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope" >
						<el-button type="text" @click="view(scope.row)">查看</el-button>
						<el-button type="text" v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId])" @click="remove(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>

		<el-row>
			<el-pagination background
						   layout="total, prev, pager, next, jumper"
						   :total="total"
						   :page-size="pageSize"
						   :current-page="currentPage"
						   @current-change="currentChange"
						   class="pagination">
			</el-pagination>
		</el-row>
	</div>
</template>

<script>
	import {
	  deleteAlertEvent,
	  getProjectAlertEvents
	} from '../../api/AlertService'
	import { getProjectQuestionnaires } from '../../api/QuestionnaireService'

	export default {
	  name: 'AlertIndex',
	  data() {
	    const projectId = this.$route.params.projectId
	    return {
	      projectId: projectId,
	      questionnaires: [],
	      questionnaireId: this.$route.query.questionnaireId,
	      type: this.$route.query.type,
	      loading: false,
	      isSaving: false,
	      predicate: 'id',
	      order: 'descending',
	      events: [],
	      total: 0,
	      pageSize: 10, // 单页数据量
	      currentPage: 1 // 默认开始页面
	    }
	  },
	  mounted() {
	    this.getQuestionnaires()
	    this.getEvents()
	  },
	  methods: {
	    getQuestionnaires() {
	      getProjectQuestionnaires(this.projectId).then(response => {
	        this.questionnaires = response.data
	      })
	    },
	    getEvents() {
	      this.loading = true
	      let params = {
	        page: this.currentPage - 1,
	        size: this.pageSize,
	        sort: this.sort()
	      }
	      if (this.questionnaireId) {
	        params['EQ_alertEvent.questionnaireId'] = this.questionnaireId
	      }
	      if (this.type) {
	        params['EQ_alertEvent.type'] = this.type
	      }
	      getProjectAlertEvents(this.projectId, params).then((response) => {
	        this.loading = false
	        this.events = response.data
	        this.total = Number(response.headers['x-total-count'])
	      })
	    },
	    sort() {
	      return (this.predicate && this.order) ? `alertEvent.${this.predicate}` + ',' + (this.order === 'descending' ? 'desc' : 'asc') : null
	    },
	    changeOrder(sort) {
	      this.predicate = sort.prop
	      this.order = sort.order
	      this.getEvents()
	    },
	    currentChange: function(currentPage) {
	      this.currentPage = currentPage
	      this.getEvents()
	    },
	    view(event) {
	      this.$router.push({
	        path: `/project/${this.projectId}/event/${event.id}`
	      })
	    },
	    remove(event) {
	      this.$confirm('确认要删除告警事件？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(() => {
	        deleteAlertEvent(event.id)
	          .then(() => {
	            this.getEvents()
	          })
	      }).catch(() => {
	      })
	    }
	  }
	}
</script>

<style scoped>

</style>
