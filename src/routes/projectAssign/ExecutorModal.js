import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Transfer,
  Modal,
  Icon,
  message,
  Popover,
  Tree,
  Button,
} from 'antd';
import { connect } from 'dva';
import moment from "moment/moment";
import StandardTable from '../../components/ExecutorTable';
import styles from './style.less';



const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const mockData = [];
for (let i = 0; i < 10; i += 1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
}
const { TreeNode } = Tree;
const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  visitors: '拜访对象',
  visitType: '拜访方式',
  connectBusiness: '关联商机',
  visitDate: '拜访日期',
  communication: '交流内容',
  participants: '参与人员',
  remarks: '备注',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

class ExecutorModal extends PureComponent {
  state = {
    width: '90%',
    selectedRows: [], // 获取选中的行的集合
    data:{
      list:[{name:"部门经理",number:15857112486}, {name:"分管领导",number:18888888888}, {name:"职员",number:16666666666}],
      pagination: {},
      total:'',
    },
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.props.dispatch({
      type: 'person/fetch',
      payload: {},
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  // 分页器上一页下一页方法，刷新页面
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'person/fetch',
      payload: params,
    });
  };

  // 获取当前选中的行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 查询方法
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'person/fetch',
        payload: values,
        callback: (res) => {
          if(res.meta.status !== '000000'){
            message.error(res.meta.errmsg);  // 返回错误信息
          } else {
            this.setState({
              selectedRows: [],
            });
            message.success('查询完成!');
          }
        },
      });
    });
  };

  // 搜索(重置)方法
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'person/fetch',
      payload: {},
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          message.success('重置完成!');
        }
      },
    });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="关键字">
              {getFieldDecorator('keyWord')(
                <Input placeholder="请输入关键字" />
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                清空
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { person:{ data }, loading, executorVisible, handleExecutorVisible, inputParamName } = this.props;
    const { selectedRows } = this.state;
    const validate = () => {
     const nameVal =  selectedRows.map(row => row.name);
     const numberVal =  selectedRows.map(row => row.number);
     const arrayList = [];
     for (let i =0; i<nameVal.length; i+=1) {
       arrayList.push({
         name: Object.values(nameVal)[0],
         number: Object.values(numberVal)[0],
       })
     }
     if (inputParamName === 'partner') {
       this.props.handleGetExecutorMsg(arrayList);
     } else if (inputParamName === 'leaderId'){
       this.props.handleDeptMsg(arrayList);
     } else if (inputParamName === 'proManagerId') {
       this.props.handleProMsg(arrayList);
     }
     handleExecutorVisible(false);
    };
    const columns = [
      {
        title: '人员编号',
        dataIndex: 'number',
        width: 150,
        fixed: 'left',
      },
      {
        title: '人员名称',
        dataIndex: 'name',
      },
      {
        title: '职能',
        dataIndex: 'post',
      },
      {
        title: '负责公司',
        dataIndex: 'company',
      },
      {
        title: '项目费用',
        dataIndex: 'fee',
      },
      {
        title: '客户名称',
        dataIndex: 'cusName',
      },
      {
        title: '客户联系人',
        dataIndex: 'cusLinkmen',
      },
      {
        title: '执行时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="人员组织列表"
        style={{ top: 20 }}
        // 对话框是否可见
        visible={executorVisible}
        width="80%"
        // 点击蒙层是否允许关闭
        maskClosable={false}
        onOk={validate}
        onCancel={() => handleExecutorVisible(false)}
      >
        <div>
          <Card>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <StandardTable
                scroll={{ x: 1500 }}
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
      </Modal>
    );
  }
}

export default connect(({ person, loading }) => ({
  person,
  loading: loading.models.person,
}))(Form.create()(ExecutorModal));
