<template>
    <div class="share-investigation">
        <survey-view :info="survey" @dataChange="save"></survey-view>
    </div>
</template>

<script>
  import { InvestigationSurvey } from './investigation-survey'
  import { getInvestigation, saveInvestigation } from '../../api/InvestigationService'
  import SurveyView from '@/components/survey/SurveyView'
  import { getQuestionnaireReport } from '../../api/QuestionnaireService'
  export default {
    name: 'SharedInvestigationDetail',
    components: {
      SurveyView
    },
    data() {
      return {
        projectId: this.$route.params.projectId,
        questionnaireId: this.$route.params.questionnaireId,
        investigationId: this.$route.params.investigationId,
        report: {},
        investigation: {},
        survey: {},
        isSaving: false
      }
    },
    created() {
      this.findInvestigationSurvey()
    },
    methods: {
      mode() {
        return this.$hasAnyAuthority[`PROJECT_ADMIN_${this.projectId}`] ? 'share' : null
      },
      findQuestionnaireReport() {
        return getQuestionnaireReport(this.questionnaireId)
      },
      findInvestigation() {
        if (this.investigationId) {
          return getInvestigation(this.investigationId)
        } else {
          return new Promise((resolve, reject) => {
            resolve({
              data: {
                questionnaireId: this.questionnaireId,
                content: null
              }
            })
          })
        }
      },
      findInvestigationSurvey() {
        const vm = this
        vm.$axios.all([vm.findQuestionnaireReport(), vm.findInvestigation()])
          .then(vm.$axios.spread(function(report, investigation) {
            vm.report = report.data
            vm.investigation = investigation.data
            vm.survey = new InvestigationSurvey(vm.report, vm.investigation, 'share')
          }))
      },
      save(data, state) {
        this.isSaving = true
        this.investigation = this.survey.complete(data, state)
        saveInvestigation(this.investigation).then((res) => {
          this.isSaving = false
        }, () => {
          this.isSaving = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
