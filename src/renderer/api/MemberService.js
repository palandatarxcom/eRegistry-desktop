import axios from 'axios'

export function getProjectMembers(projectId, params) {
  return axios({
    url: `api/projects/${projectId}/members`,
    method: 'get',
    params: params
  })
}

export function getProjectChargedByMembers(projectId) {
  return new Promise((resolve, reject) => {
    getProjectMembers(projectId).then(res => {
      const chargedByMembers = res.data.filter(m => m.task !== 'VIEW')
      resolve(chargedByMembers)
    }, error => {
      reject(error)
    })
  })
}

export function getMember(id) {
  return axios({
    url: `api/members/${id}`,
    method: 'get'
  })
}

export function deleteMember(id) {
  return axios({
    url: `api/members/${id}`,
    method: 'delete'
  })
}

export function createBatchMember(batchMember) {
  return axios({
    url: `api/members/batch`,
    method: 'post',
    data: batchMember
  })
}

export function createMember(member) {
  return axios({
    url: `api/members`,
    method: 'post',
    data: member
  })
}

export function updateMember(member) {
  return axios({
    url: `api/members`,
    method: 'put',
    data: member
  })
}
