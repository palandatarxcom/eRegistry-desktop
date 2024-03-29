import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/account/Registry'), hidden: true },
  { path: '/reset/request', component: () => import('@/views/account/password-reset/init'), hidden: true },
  { path: '/reset/finish', component: () => import('@/views/account/password-reset/finish'), hidden: true },
  { path: '/activate', component: () => import('@/views/account/activate'), hidden: true },
  { path: '/invitation', component: () => import('@/views/account/invitation'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/401', component: () => import('@/views/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: 'settings',
    component: Layout,
    name: 'Settings',
    hidden: true,
    meta: { title: '个人设置', icon: 'el-icon-setting' },
    children: [{
      path: '/settings',
      component: () => import('@/views/settings/Settings')
    }]
  },
  {
    path: 'management',
    component: Layout,
    name: 'management',
    hidden: true,
    children: [{
      path: '/management',
      component: () => import('@/views/management/management')
    }]
  },
  {
    path: '/report',
    component: Layout,
    name: 'Report',
    redirect: '/report/',
    meta: {
      title: 'CRF', icon: 'el-icon-word'
    },
    children: [
      {
        path: '',
        name: 'ReportList',
        component: () => import('@/views/report/Report')
      },
      {
        path: 'new',
        name: 'ReportNew',
        component: () => import('@/views/report/ReportDetail')
      },
      {
        path: ':reportId',
        name: 'ReportDetail',
        component: () => import('@/views/report/ReportDetail')
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/',
    name: 'Project',
    meta: {
      title: '研究项目', icon: 'el-icon-bangzhu'
    },
    children: [
      {
        path: '',
        name: 'ProjectList',
        component: () => import('@/views/project/ProjectList'),
        hidden: true
      },
      {
        path: ':projectId',
        name: 'ProjectDetail',
        component: () => import('@/views/project/ProjectDetail'),
        children: [
          {
            path: 'home',
            component: () => import('@/views/project/ProjectHome')
          },
          {
            path: 'patient',
            component: () => import('@/views/project/ProjectPatient')
          },
          {
            path: 'patient/:patientId',
            name: 'patientDetail',
            component: () => import('@/views/patient/PatientDetail')
          },
          {
            path: 'report',
            component: () => import('@/views/project/ProjectReport')
          },
          {
            path: 'questionnaire',
            component: () => import('@/views/project/ProjectQuestionnaire')
          },
          {
            path: 'questionnaire/manage',
            component: () => import('@/views/questionnaire/Questionnaire')
          },
          {
            path: 'questionnaire-new',
            component: () => import('@/views/questionnaire/QuestionnaireDetail')
          },
          {
            path: 'questionnaire/:questionnaireId',
            component: () => import('@/views/questionnaire/QuestionnaireDetail')
          },
          {
            path: 'questionnaire/:questionnaireId/investigation',
            component: () => import('@/views/project/ProjectInvestigation')
          },
          {
            path: 'questionnaire/:questionnaireId/investigation-result',
            component: () => import('@/views/questionnaire/QuestionnaireInvestigation')
          },
          {
            path: 'questionnaire/:questionnaireId/investigation-input',
            component: () => import('@/views/investigation/InvestigationDetail')
          },
          {
            path: 'questionnaire/:questionnaireId/investigation/:investigationId',
            component: () => import('@/views/investigation/InvestigationDetail')
          },
          {
            path: 'questionnaire/:questionnaireId/alert',
            component: () => import('@/views/alert/AlertSetting')
          },
          {
            path: 'event',
            component: () => import('@/views/alert/index')
          },
          {
            path: 'event/:eventId',
            component: () => import('@/views/alert/AlertEvent')
          },
          {
            path: 'member',
            component: () => import('@/views/project/ProjectMember')
          },
          {
            path: 'center',
            component: () => import('@/views/project/ProjectCenter')
          },
          {
            path: 'plan',
            component: () => import('@/views/plan/plan')
          },
          {
            path: 'plan/:planId/report',
            component: () => import('@/views/plan/PlanReport')
          },
          {
            path: 'calendar',
            component: () => import('@/views/calendar/index')
          },
          {
            path: 'log',
            component: () => import('@/views/logging/logging')
          },
          {
            path: 'meeting',
            component: () => import('@/views/video-meeting/meeting')
          },
          {
            path: 'attachment-setting',
            component: () => import('@/views/project/ProjectAttachmentSetting')
          },
          {
            path: 'informed-consent',
            component: () => import('@/views/project/ProjectInformedConsent')
          },
          {
            path: 'article',
            component: () => import('@/views/project/ProjectArticle')
          },
          {
            path: 'article-new',
            component: () => import('@/views/project/ArticleDetail')
          },
          {
            path: 'article/:articleId',
            component: () => import('@/views/project/ArticleDetail')
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true },
  {
    name: 'patient-incorporation',
    path: '/patient/incorporation',
    component: () => import('@/views/h5/PatientIncorporation'),
    meta: {
      title: '入组确认'
    }
  },
  {
    name: 'patient-case',
    path: '/patient/case',
    component: () => import('@/views/h5/PatientCase')
  },
  {
    name: 'patient-follow',
    path: '/patient/follow',
    component: () => import('@/views/h5/PatientFollow')
  },
  {
    name: 'patient-investigation',
    path: '/patient/investigation',
    component: () => import('@/views/h5/PatientInvestigation')
  },
  {
    path: '/questionnaire/:questionnaireId/investigation-new',
    component: () => import('@/views/investigation/SharedInvestigationDetail')
  },
  {
    path: '/patient-attachment',
    name: 'PatientAttachment',
    component: () => import('@/views/patient/PatientAttachment')
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

