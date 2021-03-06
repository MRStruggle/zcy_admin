import request from '../utils/request';

// 申请单查询
export async function queryCusApplication(params) {
  return request('/api/cusApplication/getCusApplicationByCondition', {
    method: 'POST',
    body: params,
  });
}

// 申请单新增
export async function addCusApplication(params) {
  return request('/api/cusApplication/saveCusApplication', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 申请单修改
export async function updateCusApplication(params) {
  return request('/api/cusApplication/updateCusApplication', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 申请单删除
export async function deleteCusApplication(params) {
  return request('/api/cusApplication/deleteCusApplication', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 申请单状态提交审核
export async function statusCancelCancel(params) {
  return request('/api/cusApplication/statusCancelCancel', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 树形
export async function getDictByCondition(params) {
  return request('/api/dict/getDictByCondition', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 通过id查info
export async function getInfoById(params) {
  return request('/api/cusApplication/getInfoById', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}





