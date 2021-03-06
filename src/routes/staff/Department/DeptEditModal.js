import React, { PureComponent } from 'react';
import { Card, Form, Icon, Col, Row, DatePicker, Input, Select, Popover, Modal, message,TreeSelect } from 'antd';
import { connect } from 'dva';

import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
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

class DepartmentEditModal extends PureComponent {
  state = {
    width: '100%',
    treeData: [],
    deptOptionData: []
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    const { dispatch } = this.props;
    dispatch({
      type: 'company/getLeftTreeMenu',
      callback: (res) => {
        if(res.meta.status === '000000' ) {
          this.setState({treeData : res.data.list});
        } else {
          message.error(res.meta.errmsg);
        }
      },
    });
    dispatch({
      type: 'dept/fetch', // 接口
      payload: {},
      callback: (res) => {
        if(res.meta.status !== "000000"){
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            deptOptionData: res.data.list, // 返回结果集给对应的状态
          });
        }
      },
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  onOrgTreeSelectChange = (value) => {
    console.log(value);

  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const {
      form,
      dispatch,
      submitting,
      DepartmentEditVisible,
      handleDepartmentEditVisible,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'dept/update',
            payload: {
              id: rowInfo.id,
              key: rowInfo.key,
              ...values,
            },
            callback: res => {
              if (res.meta.status !== '000000') {
               message.error(res.data.alert_msg);
              } else {
                dispatch({
                  type: 'dept/fetch',
                  payload: {},
                });
                handleDepartmentEditVisible(false);
              }
            },
          });
        }
      });
    };
    const cancelDate = () => {
      form.resetFields();
      handleDepartmentEditVisible(false);
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="部门基本信息编辑"
        style={{ top: 20 }}
        visible={DepartmentEditVisible}
        width="55%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText="提交"
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="部门名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入组织名称' }],
                    initialValue: rowInfo.name,
                  })(
                    <Input placeholder="请输入组织编码" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item {...formItemLayout} label="上级部门">
                  {getFieldDecorator('parentId', {
                    rules: [{ required: true, message: '请选择上级部门' }],
                    initialValue: rowInfo.parentId,
                  })(
                    <Select
                      onChange={this.handleDeptSourceValue}
                      placeholder="请选择上级部门"
                      style={{ width: 150 }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {this.state.deptOptionData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                    </Select>

                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="部门编码">
                  {getFieldDecorator('number', {
                    rules: [{ required: true, message: '请输入组织编码' }],
                    initialValue: rowInfo.number,
                  })(<Input placeholder="请输入组织编码" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="所属组织">
                  {getFieldDecorator('orgId', {
                    rules: [{ required: true, message: '所属组织' }],
                    initialValue: rowInfo.orgId,
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={this.state.treeData}
                      placeholder="请选择上级组织"
                      treeDefaultExpandAll
                      onChange={this.onOrgTreeSelectChange}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="简称">
                  {getFieldDecorator('simpleName', {
                    rules: [{ required: false, message: '请输入简称' }],
                  })(<Input placeholder="请输入简称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="英文名称">
                  {getFieldDecorator('englishName', {
                    rules: [{ required: false, message: '请输入英文名称' }],
                  })(<Input placeholder="请输入英文名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="负责人">
                  {getFieldDecorator('principal', {
                    rules: [{ required: false, message: '请选择负责人' }],
                    initialValue: `请选择`,
                  })(
                    <Select>
                      <Option value="0">请选择</Option>
                      <Option value="1">员工A</Option>
                      <Option value="2">员工B</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="联系人">
                  {getFieldDecorator('linkMan', {
                    rules: [{ required: false, message: '请输入联系人' }],
                  })(<Input placeholder="请输入联系人" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="移动电话">
                  {getFieldDecorator('mobilePhone', {
                    rules: [{ required: false, message: '请输入移动电话' }],
                  })(<Input placeholder="请输入移动电话" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电话">
                  {getFieldDecorator('phone', {
                    rules: [{ required: false, message: '请输入电话' }],
                  })(<Input placeholder="请输入电话" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电子邮箱">
                  {getFieldDecorator('email', {
                    rules: [{ required: false, message: '请输入电子邮箱' }],
                  })(<Input placeholder="请输入电子邮箱" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="邮政编码">
                  {getFieldDecorator('postalCode', {
                    rules: [{ required: false, message: '请输入邮政编码' }],
                  })(<Input placeholder="请输入邮政编码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="传真">
                  {getFieldDecorator('fax', {
                    rules: [{ required: false, message: '请输入传真' }],
                  })(<Input placeholder="请输入传真" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="海关编码">
                  {getFieldDecorator('customsCode', {
                    rules: [{ required: false, message: '请输入海关编码' }],
                  })(<Input placeholder="请输入海关编码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="EDI编码">
                  {getFieldDecorator('ediCode', {
                    rules: [{ required: false, message: '请输入EDI编码' }],
                  })(<Input placeholder="请输入EDI编码" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="税务编码">
                  {getFieldDecorator('taxCode', {
                    rules: [{ required: false, message: '请输入税务编码' }],
                  })(<Input placeholder="请输入税务编码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="详细地址">
                  {getFieldDecorator('address', {
                    rules: [{ required: false, message: '请输入详细地址' }],
                  })(<TextArea placeholder="请输入详细地址" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="网站首页">
                  {getFieldDecorator('url', {
                    rules: [{ required: false, message: '请输入网站首页' }],
                  })(<Input placeholder="请输入网站首页" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={21} pull={3}>
                <Form.Item {...formItemLayout} label="备注">
                  {getFieldDecorator('remark')(<TextArea placeholder="请输入备注信息" rows={2} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['dept/updateDept'],
}))(Form.create()(DepartmentEditModal));
