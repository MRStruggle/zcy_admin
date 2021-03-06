import { updateCompany, queryCompany, removeCompanyById, addCompany, removeCompanyByCondition, statusCancelCancel,getLeftTreeMenu, getInfoById } from '../services/company';

export default {
  namespace: 'company',

  state: {
    data: {
      list: [],
      pagination: {},
      total:'',
    },
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(queryCompany, payload);
      if (response.meta.status === '000000') {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getLeftTreeMenu({ callback }, { call}) {
      const response = yield call(getLeftTreeMenu);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *update({ payload ,callback}, { call }) {
      const response = yield call(updateCompany, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *add({ payload, callback }, { call}) {
      const response = yield call(addCompany, payload);
      if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
      }
    },

    *remove({ payload, callback }, { call }) {
      const response = yield call(removeCompanyById, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *removeMore({ payload, callback }, { call }) {
      const response = yield call(removeCompanyByCondition, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *cancelCancel({ payload, callback }, { call }) {
      const response = yield call(statusCancelCancel, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *cancel({ payload, callback }, { call }) {
      const response = yield call(statusCancelCancel, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getInfoById({ payload, callback }, { call }) {
      const response = yield call(getInfoById, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
        /*data: {
          list: action.payload.data.items,
          pagination: action.payload.data.pagination,
          total:action.payload.data.num_items,
        },*/
      };
    },
  },
};
