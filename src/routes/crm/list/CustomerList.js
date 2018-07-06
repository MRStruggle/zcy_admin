import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import CustomerAddModal from '../add/CustomerAddModal';
import CustomerViewTabs from './CustomerViewTabs.js';
import EditableTable from '../EditableTable/EditableTable';
import ContactsAddModal from '../add/ContactsAddModal';
import CustomerEditModal from '../edit/CustomerEditModal';



const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['success', 'error'];
const status = ['启用', '停用'];


// 设置业务员
const SalesManage = Form.create()(props => {
  const { salesVisible, handleSalesVisible } = props;
  const okHandle = () => {
    handleSalesVisible();
  };
  return (
    <Modal
      title="业务员基本信息管理"
      style={{ top: 20 }}
      visible={salesVisible}
      width="40%"
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleSalesVisible()}
    >
      <EditableTable />
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class CustomerList extends PureComponent {
  state = {
    // 客户增加状态
    customerAddVisible: false,

    // 客户编辑状态
    customerEditVisible: false,

    // 联系人状态
    contactsVisible: false,

    // 客户查看状态
    tabsViewVisible: false,

    // 业务员状态
    salesVisible: false,

    // 高级搜索是否隐藏状态
    expandForm: false,

    // 选中的行
    selectedRows: [],

    formValues: {},

    // 当前操作行的数据
    rowInfo:{},

    // 左边菜单树的起始状态
    openKeys: ['sub1'],
  };

  // 生命周期方法 加载页面
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  // 搜索重置方法
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  // 展开高级搜索方法
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  // 选中行删除方法
  handleDeleteClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'rule/remove',
      payload: {
        no: selectedRows.map(row => row.no).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  // 获取选中的行
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
        // ??
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      console.log(fieldsValue);

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  // 隐藏和显示客户增加界面
  handleCustomerAddVisible = flag => {
    this.setState({
      customerAddVisible: !!flag,
    });
  };

  // 隐藏和显示客户编辑界面
  handleCustomerEditVisible = (flag) => {
    this.setState({
      customerEditVisible: !!flag,
    });
  };

  // 隐藏和显示联系人增加界面
  handleContactsVisible = flag => {
    this.setState({
      contactsVisible: !!flag,
    });
  };


  handleTabsViewVisible = flag => {
    this.setState({
      tabsViewVisible: !!flag,
    });
  };
  handleSalesVisible = flag => {
    this.setState({
      salesVisible: !!flag,
    });
  };

  // 添加表单数据
  handleCustomerAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      customerAddVisible: false,
    });
  };
  handleAddContact = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });
    message.success('添加成功');
    this.setState({
      contactsVisible: false,
    });
  };


  // 左边菜单树
  rootSubmenuKeys = ['sub1'];
  treeMenu() {
    const SubMenuTree = Menu.SubMenu;
    return (
      <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 130 }}
      >
        <SubMenuTree
          key="sub1"
          title={
            <span>
              <span>客户等级</span>
            </span>
          }
        >
          <Menu.Item key="1">贵宾客户</Menu.Item>
          <Menu.Item key="2">一般客户</Menu.Item>
          <Menu.Item key="3">重要客户</Menu.Item>
          <Menu.Item key="4">潜在客户</Menu.Item>
        </SubMenuTree>
      </Menu>
    );
  }

  // 弹窗展示当前行的数据
  showCurRowMessage =(flag, record)=> {
    this.setState({
      customerEditVisible: !!flag,
      rowInfo: record,
    });
  };

  showCurRowMessage2 =(flag, record)=> {
    this.setState({
      tabsViewVisible: !!flag,
      rowInfo: record,
    });
  };


  // 高级搜索
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编码名称">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="拼音码">
              {getFieldDecorator('pinyin')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="电话号码">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="业务员">
              {getFieldDecorator('customer')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="xiao">请选择</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 13 }} label="行业">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="xiao">请选择</Option>
                  <Option value="z">制造业</Option>
                  <Option value="f">服务业</Option>
                  <Option value="fd">房地产建筑</Option>
                  <Option value="sn">三农业务</Option>
                  <Option value="zf">政府购买</Option>
                  <Option value="sy">商业</Option>
                  <Option value="jr">金融</Option>
                  <Option value="fyl">非营利组织</Option>
                  <Option value="other">其他</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ paddingLeft: 24 }} label="地址">
              {getFieldDecorator('address')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('date', {
                rules: [{ required: false, message: '请选择创建日期' }],
              })(<RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起
            </Button>
          </span>
        </div>
      </Form>
    );
  }

  // 判断简单 还是 高级搜索
  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  // 简单查询
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('customerCode')(<Input placeholder="请输入客户编码和名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="行业">
              {getFieldDecorator('industry')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="制造业">制造业</Option>
                  <Option value="服务业">服务业</Option>
                  <Option value="房地产建筑">房地产建筑</Option>
                  <Option value="三农业务">三农业务</Option>
                  <Option value="政府购买">政府购买</Option>
                  <Option value="商业">商业</Option>
                  <Option value="金融">金融</Option>
                  <Option value="非营利组织">非营利组织</Option>
                  <Option value="其他">其他</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                高级搜索
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const {
      selectedRows,
      customerAddVisible,
      customerEditVisible,
      contactsVisible,
      tabsViewVisible,
      salesVisible,
      rowInfo,
    } = this.state;

    const columns = [
      {
        title: '客户编码',
        dataIndex: 'customerCode',
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
      },
      {
        title: '地址',
        dataIndex: 'address',
      },
      {
        title: '所属公司',
        dataIndex: 'company',
      },
      {
        title: '手机',
        dataIndex: 'mobilePhone',
      },
      {
        title: '行业',
        dataIndex: 'industry',
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() =>this.showCurRowMessage2(true, record)} >查看</a>
            <Divider type="vertical" />
            <a onClick={() =>this.showCurRowMessage(true, record)} >编辑</a>
            <Divider type="vertical" />
            <a onClick={() =>this.showCurRowMessage(true, record)} >删除</a>
          </Fragment>
        ),
      },
    ];

    const CustomerAddMethods = {
      handleCustomerAddVisible: this.handleCustomerAddVisible,
      handleCustomerAdd: this.handleCustomerAdd,
    };
    const CustomerEditMethods = {
      handleCustomerEditVisible: this.handleCustomerEditVisible,
    };
    const ContactsAddMethods = {
      handleContactsVisible: this.handleContactsVisible,
    };
    const parentMethods = {
      handleTabsViewVisible: this.handleTabsViewVisible,
      handleSalesVisible: this.handleSalesVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <div className={styles.tableList}>
              <div className={styles.leftBlock}>{this.treeMenu()}</div>
              <div className={styles.rightBlock}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.handleCustomerAddVisible(true)}
                  >
                    新建客户
                  </Button>
                  {selectedRows.length > 0 && (
                    <span>
                      <Button type="primary" onClick={() => this.handleSalesVisible(true)}>
                        设置业务员
                      </Button>
                      <Button type="primary" onClick={() => this.handleContactsVisible(true)}>
                        设置联系人
                      </Button>
                      <Button type="primary" onClick={() => this.handleDeleteClick(true)}>
                        批量删除
                      </Button>
                    </span>
                  )}
                </div>
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </div>
          </div>
        </Card>
        <CustomerAddModal {...CustomerAddMethods} customerAddVisible={customerAddVisible} />
        <CustomerEditModal {...CustomerEditMethods} customerEditVisible={customerEditVisible} rowInfo={rowInfo} />
        <ContactsAddModal {...ContactsAddMethods} contactsVisible={contactsVisible} />
        <CustomerViewTabs {...parentMethods} tabsViewVisible={tabsViewVisible} rowInfo={rowInfo} />
        <SalesManage {...parentMethods} salesVisible={salesVisible} />
      </PageHeaderLayout>
    );
  }
}