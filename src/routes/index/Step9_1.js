import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  Divider,
  Layout,
  Steps,
  Collapse,
  Checkbox,
  Upload,
  Tree,
  Card,
  InputNumber,
  message,
  Table,
  Badge,
} from 'antd';
import moment from "moment/moment";
import { routerRedux } from 'dva/router';
import DemoModal from './DemoModal';
import styles from './style.less';

const BillTable = ['建设项目造价咨询工作交办单','委托人提供资料交接清单','工程咨询过程资料交接登记表'];
const { Search } = Input;
const ProTypeOption = {"001":"工程造价业务项目", "002":"可研报告", "003":"招标代理业务项目"};
const BillSourceOption = ['合伙人', '可研报告', '招标代理业务项目'];
const mockData = [];
for (let i = 0; i < 10; i+=1) {
  mockData.push({
    key: i.toString(),
    title: `人员${i + 1}`,
  });
};
const { TextArea } = Input;
const { Option } = Select;
const fileList = [
  {
    uid: -1,
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: -2,
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];
const props2 = {
  action: '//jsonplaceholder.typicode.com/posts/',
  listType: 'text',
  defaultFileList: [...fileList],
  className: styles['upload-list-inline'],
};
const fieldLabels = {
  ProjectCode:'项目编码',
  ReportName: '报告名称',
  type: '项目类别',
  years: '年度',
  name: '项目名称',
  dateRange: '生效日期',
  cuslink: '客户联系人',
  customer: '客户',
  url: '网站主页',
  taxcode: '税务登记号',
  fzcompany: '负责公司',
  fzperson: '项目负责人',
  fee: '项目费用',
  startdate: '开始日期',
  enddate: '结束日期',
  biztype: '业务类别',
  content: '项目内容',
  address: '详细地址',
  remark: '备注',
  status: '状态',
  jfw: '交付物',
  demand: '客户需求',
  attachment: '附件',
  companyName:'单位名称',
  companyAddress:'单位地址',
  taxNumber:'税号',
  openAccountBank:'开户银行',
  bankAccount:'银行账户',
  contractCode: '合同编码',
  contractType: '合同类别',
  projectName: '项目名称',
  contractStatus: '合同性质',
  contractTitle: '合同标题',
  dfCompany: '对方公司',
  authorizedAgent: '客户授权代理人',
  PartyAcompany: '甲方公司',
  PartyBcompany: '乙方公司',
  fatherContract: '父合同',
  signDate: '签订日期',
  paymentMethod: '付款方式',
  businessType: '业务类别',
  contractSignPlace: '合同签订地点',
  contractSubject: '合同标的',
  startDate: '开始日期',
  endDate: '结束日期',
  totalAmount: '合同金额',
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

@Form.create()
class Step6 extends React.PureComponent {
  state = {
    BillSourceOptionData:``,
    BillSourceValue:``,
    ProTypeOptionData:``,
    TestOption:``,
    ProTypeValue:``,
    BillTableOptionTable:``,
    visitAddVisible: false,
    buttonVisible: false,
  };
  componentDidMount() {
    this.handleBillSourceOption();
    this.handleProTypeOption();
    this.handleBillTableOptionTable();
  }
  handleBillSourceOption = () => {
    const optionData = BillSourceOption.map((data, index) => {
      const val = `${data}`;
      const keyNum = `${index}`;
      return <Option key={keyNum} value={val}>{val}</Option>;
    });
    this.setState({
      BillSourceOptionData: optionData,
    });
  }; // 根据数据中的数据，动态加载业务来源的Option

  handleClickButton = () => {
    this.setState({
      buttonVisible: true,
    })
  };

  handleProTypeOption = () => {
    const ProTypeValues = Object.values(ProTypeOption);
    const ProTypeKeys = Object.keys(ProTypeOption);
    const optionData = ProTypeValues.map((data, index) => {
      const val = `${data}`;
      const keyNum = `${index}`;
      return <Option key={keyNum} value={val}>{val}</Option>;
    });
    this.setState({
      ProTypeOptionData: optionData,
    });
  }; // 根据数据中的数据，动态加载业务来源的Option

  handleGetBillSourceValue = (val) =>{
    console.log(val);
    this.setState({
      BillSourceValue: val,
    });
  }; // 获取业务来源的Option的值

  handleProTypeSourceValue = (val) =>{
    this.setState({
      ProTypeValue: val,
    });
  }; // 获取业务来源的Option的值

  handleVisitAddVisible = (flag) => {
    this.setState({
      visitAddVisible: !!flag,
    });
  };

  handleBillTableOptionTable = () => {
    const optionData = BillTable.map((data, index) => {
      const val = `${data}`;
      const keyNum = `${index}`;
      return <Option key={keyNum} value={val}>{val}</Option>;
    });
    this.setState({
      BillTableOptionTable: optionData,
    });
  }; // 根据数据中的数据，动态加载业务来源的Option


  render() {
    const { form, dispatch, loading, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { BillSourceOptionData, BillSourceValue, ProTypeOptionData, ProTypeValue, BillTableOptionTable, buttonVisible, visitAddVisible } = this.state;
    const data = [{number: "函_001",name:"项目001"}];
    const parentMethods = {
      handleVisitAddVisible: this.handleVisitAddVisible,
    };
    const rowSelection = {
      type: "checkbox",
    };
    const expandedRowRender = () => {
      const columns1= [
        { title: '标题', dataIndex: 'title', key: 'title' },
        { title: '文件名', dataIndex: 'fileName', key: 'fileName' },
      ];

      const data1 = [{title:"首页"},{title:"扉页"},{title:"报告"},{title:"定案表"},{title:"结算/预算书（根据项目的业务类别自动判断）"},{title:"其他说明材料"}];
      return (
        <Table
          columns={columns1}
          dataSource={data1}
          pagination={false}
          rowSelection={rowSelection}
        />
      );
    };

    const columns = [
      {
        title: '编号',
        dataIndex: 'number',
        render:(val) => (
          <a onClick={() => this.handleVisitAddVisible(true)}>{val}</a>
        ),
      },
      {
        title: '打印份数',
        dataIndex: 'name',
        render(val) {
          return (
            <span>
              <Input style={{ width:20 }} />++<Input style={{ width:20 }} />
            </span>
          );
        },
      },
      {
        title: '打印次数',
        dataIndex: 'remake',
      },
      {
        title: '操作',
        dataIndex: 'action',
        render() {
          return (
            <Checkbox>
              重新打印
            </Checkbox>
          )
        },
      },
    ];
    const onValidateForm = () => {
      validateFields((err, values) => {

      });
    };
    return (
      <Card>
        <Form layout="horizontal">
          <Row>
            <Col>
              <Table
                pagination={false}
                dataSource={data}
                columns={columns}
                rowSelection={rowSelection}
                expandedRowRender={expandedRowRender}
              />
              <p>前面框是送出份数，后面框是存档份数，函件子表默认展开</p>
            </Col>
          </Row>
          {/*<Row className={styles['fn-mb-15']}>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="报告名称">
                {getFieldDecorator('ReportName', {
                  rules: [{ required: false, message: '报告名称' }],
                })(<Input placeholder="自动带出" className={styles['fn-mb-15']} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="申请（盖章）时间">
                {getFieldDecorator('ApplyData', {
                  rules: [{ required: false, message: '申请（盖章）时间' }],
                  initialValue:this.state.applyDate,
                })(
                  <DatePicker
                    placeholder="申请时间"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles['fn-mb-15']}>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="报告事由">
                {getFieldDecorator('ReportCause', {
                  rules: [{ required: false, message: '报告事由' }],
                })(<Input placeholder="报告事由" className={styles['fn-mb-15']} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="文印份数">
                {getFieldDecorator('PrintingCopies', {
                  rules: [{ required: false, message: '文印份数' }],
                  initialValue:`1`,
                })(
                  <InputNumber placeholder="文印份数" min={1} max={99} />,
                )}
              </Form.Item>
            </Col>
          </Row>*/}
          <Form.Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Checkbox onChange={this.onChange}>有其他材料需要合并装订</Checkbox>
            <Button type="primary" onClick={this.handleClickButton} loading={submitting} style={{ marginLeft: 8}}>
              提交打印
            </Button>
            <Button type="primary" onClick={onValidateForm} loading={submitting} style={{ marginLeft: 8 }}>
              修改报告
            </Button>
          </Form.Item>
        </Form>
        <DemoModal {...parentMethods} visitAddVisible={visitAddVisible} />
      </Card>
    );
  }
}

export default connect(({ person, loading }) => ({
  submitting: loading.effects['person/add'],
}))(Step6);
