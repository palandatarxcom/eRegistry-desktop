import axios from 'axios'

export function saveInvestigation(investigation) {
  return axios({
    url: `api/questionnaire-investigations`,
    method: 'post',
    data: investigation
  })
}

export function getInvestigations(projectId, req) {
  return axios({
    url: `api/projects/${projectId}/investigations`,
    method: 'get',
    params: req
  })
}

export function getInvestigation(id) {
  return axios({
    url: `api/investigations/${id}`,
    method: 'get'
  })
}

export function deleteInvestigation(id) {
  return axios({
    url: `api/investigations/${id}`,
    method: 'delete'
  })
}
