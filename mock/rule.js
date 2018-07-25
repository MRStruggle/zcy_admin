import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    // 数据不能选中
    /*disabled: i % 6 === 0,*/
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    dictID: `这个字段是ID ${i}`,
    dictTypeName: `一个任务名称 ${i}`,
    code: '小杨',
    remarks: '这是一段描述',
    name: '这个字段是名字',
    no: `AAA ${i}`,

    contractCode: `这个字段是合同编码${i}`,
    callNo: Math.floor(Math.random() * 1000),

    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),

    contractTitle:`这个字段是合同标题 ${i}`,
    customerCode:`CMD ${i}`,
    customerName:`杭州至诚 ${i}`,
    linkman: `汪工${i}`,
    address:`清泰街${i}`,
    company: `至诚云${i}`,
    mobilePhone: `手机号码${i}`,
    industry: Math.floor(Math.random() * 10) % 8,
    status: Math.floor(Math.random() * 10) % 2,

    invoiceNumber:`发票号码${i}`,

    businessCode:`商机编号${i}`,
    businessName:`商机名称${i}`,
    customerForBusinessName:`客户名称${i}`,

    projectCode:`项目编号${i}`,

  });
}

export function getRule(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  // 过滤搜索的字段
  if (params.industry) {
    dataSource = dataSource.filter(data => data.industry.indexOf(params.industry) > -1);
  }

  if (params.customerCode) {
    dataSource = dataSource.filter(data => data.customerCode.indexOf(params.customerCode) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function postRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, no, description, customerCode } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => no.indexOf(item.no) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        no: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        customerName: `大新昌`,
        owner: '曲丽丽',
        linkman: '汪工',
        company: '至诚云',
        contractCode: '这个字段是合同编码',
        description,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
        customerCode: ` 客户编码${i} `,
        contractTitle:`这个字段是合同标题 ${i}`,
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getRule,
  postRule,
};
