import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  // TimePicker,
  Input,
  InputNumber,
  Select,
  Popover,
  Modal,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const optionshz = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
const CustomerOption = ['贵宾', '重要客户', '一般客户', '潜在客户'];
const IndustryOption = ['制造业','服务业','房地产建筑','三农业务','政府购买','商业','金融','非营利组织','其他'];
const IncomeTaxOption = ['查账征收','核定征收'];
const statusOption = ['启用','禁用'];


const fieldLabels = {
  customerCode: '客户编码',
  customerLevel: '客户等级',
  industry: '所属行业',
  customerName: '客户名称',
  dateRange: '生效日期',
  simpleName: '简称',
  pinyin: ' 拼 音 码 ',
  url: '网站主页',
  taxCode: '税务登记号',
  mobilePhone: '移动手机',
  email: '电子邮箱',
  companyPhone: '公司电话',
  postalCode: '邮政编码',
  region: '所在区域',
  incomeTax: '所得税征收方式',
  company: '所属公司',
  address: '详细地址',
  remark: '备注',
  status: '状态',
};
const cnumcol = {
  style: {
    paddingLeft: 10,
  },
};
const cpinyincol = {
  style: {
    paddingLeft: 13,
  },
};
const simplenamecol = {
  style: {
    paddingLeft: 72,
  },
};
const companyphonecol = {
  style: {
    paddingLeft: 37,
  },
};
const addresscol = {
  style: {
    paddingLeft: 10,
  },
};
const urlcol = {
  style: {
    paddingLeft: 10,
  },
};
const remarkcol = {
  style: {
    paddingLeft: 34,
  },
};
const companycol = {
  style: {
    paddingLeft: 10,
  },
};
const statuscol = {
  style: {
    paddingLeft: 27,
  },
};
const formhz11 = {
  wrapperCol: {
    style: {
      width: '91.66666667%',
    },
  },
  style: {
    width: '105%',
  },
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
function onChange(value) {
  console.log(value);
}


class CustomerAddmodal extends PureComponent {
  state = {
    width: '100%',
    levelOptionData: [],
    industryOptionData:[],
    incomeTaxOptionData:[],
    statusOptionData:[],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleLevelChange = () => {
    this.setState({
      levelOptionData: CustomerOption.map((data) => {
        const value = `${data}`;
        return <Option value={value}>{value}</Option>;
      }),
    });
  };

  handleIndustryChange = () => {
    this.setState({
      industryOptionData: IndustryOption.map((data) => {
        const value = `${data}`;
        return <Option value={value}>{value}</Option>;
      }),
    });
  };

  handleIncomeTaxChange = () => {
    this.setState({
      incomeTaxOptionData: IncomeTaxOption.map((data) => {
        const value = `${data}`;
        return <Option value={value}>{value}</Option>;
      }),
    });
  };

  handleStatusChange = () => {
    this.setState({
      statusOptionData: statusOption.map((data) => {
        const value = `${data}`;
        return <Option value={value}>{value}</Option>;
      }),
    });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form, dispatch, submitting , customerAddVisible, handleCustomerAddVisible} = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { levelOptionData, industryOptionData, incomeTaxOptionData, statusOptionData } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          form.resetFields();
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          handleCustomerAddVisible(false);
        }
      });
    };
    const onCancel = () => {
      form.resetFields();
      handleCustomerAddVisible(false);
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    return (
      <Modal
        title="客户基本信息新增"
        style={{ top: 20 }}
        visible={customerAddVisible}
        width="90%"
        maskClosable={false}
        onOk={validate}
        onCancel={onCancel}
      >
        <div>
          <Card>
            <Form layout="inline">
              <Row className={styles['fn-mb-15']}>
                <Col>
                  <Form.Item {...formhz11} label={fieldLabels.customerName}>
                    {getFieldDecorator('customerName', {
                      rules: [{ required: true, message: '请输入客户名称' }],
                    })(<Input placeholder="请输入客户名称" className={styles['ant-input-lg']} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.customerLevel}>
                    {getFieldDecorator('customerLevel', {
                      rules: [{ required: false, message: '请选择客户等级' }],
                    })(
                      <Select onMouseEnter={this.handleLevelChange} placeholder="请选择客户等级" style={{ width: 200 }}>
                        {levelOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.industry}>
                    {getFieldDecorator('industry', {
                      rules: [{ required: false, message: '请选择行业' }],
                    })(
                      <Select onMouseEnter={this.handleIndustryChange} placeholder="请选择行业" style={{ width: 200 }}>
                        {industryOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.incomeTax}>
                    {getFieldDecorator('incomeTax', {
                      rules: [{ required: false, message: '请选择所得税征收方式' }],
                    })(
                      <Select onMouseEnter={this.handleIncomeTaxChange} placeholder="请选择所得税征收方式" style={{ width: 200 }}>
                        {incomeTaxOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item {...cnumcol} label={fieldLabels.customerCode}>
                    {getFieldDecorator('customerCode', {
                      rules: [{ required: false, message: '请输入客户编码' }],
                    })(<Input placeholder="请输入客户编码" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...cpinyincol} label={fieldLabels.pinyin}>
                    {getFieldDecorator('pinyin', {
                      rules: [{ required: false, message: '请输入拼音码' }],
                    })(<Input placeholder="请输入拼音码" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...simplenamecol} label={fieldLabels.simpleName}>
                    {getFieldDecorator('simpleName', {
                      rules: [{ required: false, message: '请输入简称' }],
                    })(<Input placeholder="请输入简称" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.mobilePhone}>
                    {getFieldDecorator('mobilePhone', {
                      rules: [{ required: false, message: '请输入手机号码' }],
                    })(<Input placeholder="请输入手机号码" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.email}>
                    {getFieldDecorator('email', {
                      rules: [{ required: false, message: '请输入电子邮箱' }],
                    })(<Input placeholder="请输入电子邮箱" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...companyphonecol} label={fieldLabels.companyPhone}>
                    {getFieldDecorator('companyPhone', {
                      rules: [{ required: false, message: '请输入公司电话' }],
                    })(<Input placeholder="请输入公司电话" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.postalCode}>
                    {getFieldDecorator('postalCode', {
                      rules: [{ required: false, message: '请输入邮政编码' }],
                    })(<Input placeholder="请输入邮政编码" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item label={fieldLabels.region}>
                    {getFieldDecorator('region', {
                      rules: [{ required: false, message: '请选择所在区域' }],
                    })(
                      <Cascader
                        options={optionshz}
                        onChange={onChange}
                        placeholder="请选择所在区域"
                        style={{ width: 603 }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item {...urlcol} label={fieldLabels.url}>
                    {getFieldDecorator('url', {
                      rules: [{ required: false, message: '请输入网站主页' }],
                    })(<Input placeholder="请输入网站主页" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item {...addresscol} label={fieldLabels.address}>
                    {getFieldDecorator('address', {
                      rules: [{ required: false, message: '请输入详细地址' }],
                    })(<Input placeholder="请输入详细地址" style={{ width: 603 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.taxCode}>
                    {getFieldDecorator('taxCode', {
                      rules: [{ required: false, message: '请输入税务登记号' }],
                    })(<Input placeholder="请输入税务登记号" style={{ width: 200 }} />)}
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item {...remarkcol} label={fieldLabels.remark}>
                    {getFieldDecorator('remark', {
                      rules: [{ required: false, message: '请输入备注' }],
                    })(<Input placeholder="请输入备注" style={{ width: 603 }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['row-h']}>
                <Col span={8}>
                  <Form.Item {...statuscol} label={fieldLabels.status}>
                    {getFieldDecorator('status', {
                      rules: [{ required: false, message: '请选择状态' }],
                    })(
                      <Select onMouseEnter={this.handleStatusChange} placeholder="请选择状态" disable style={{ width: 200 }}>
                        {statusOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item {...companycol} label={fieldLabels.company}>
                    {getFieldDecorator('company', {
                      rules: [{ required: false, message: '请输出所属公司' }],
                    })(
                      <Input placeholder="请输出所属公司" style={{ width: 603 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </Modal>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(CustomerAddmodal));
