import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { Card, Form, Icon, Menu, Layout, Steps } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './style.less';
import NotFound from '../../Exception/404';
import { getRoutes } from '../../../utils/utils';

const { Step } = Steps;
const { Content, Sider } = Layout;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class ProjectStart extends PureComponent {
  state = {
    choiceTypeValue: '',
    formValues: {},
    openKeys: ['sub1'],
    choiceTypeKey: ``,
    stepVisible: false,
  };

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
  }; // 左边树的父节点展开方法

  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info':
        return 0;
      case 'confirm':
        return 1;
      case 'result':
        return 2;
      case 'process':
        return 3;
      case 'projectStart':
        return 0;
      case 'createContract':
        return 0;
      case 'examineReport':
        return 1;
      case 'createReportCode':
        return 2;
      case 'signature':
        return 0;
      case 'projectFile':
        return 1;
      case 'createKnowledgeSystem':
        return 2;
      case 'approvalMessage':
        return 3;
      case 'bignessAbstract':
        return 3;
      default:
        return 0;
    }
  } // 步骤条根据path解析流程执行到哪一步，然后改变步骤条的序号显示
  getCurrentTree() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info':
        return 0;
      case 'confirm':
        return 1;
      case 'result':
        return 2;
      case 'process':
        return 3;
      case 'projectStart':
        return 4;
      case 'createContract':
        return 5;
      case 'examineReport':
        return 6;
      default:
        return 0;
    }
  } // 步骤条根据path解析流程执行到哪一步，然后改变步骤条的序号显示

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
      type: 'company/fetch',
      payload: params,
    });
  }; // 分页器方法

  handleGetMenuValue = MenuValue => {
    this.setState({
      stepVisible: MenuValue.key,
    });
    switch (MenuValue.key) {
      case '0':
        this.props.dispatch(routerRedux.push('/project/projectStart/info'));
        break;
      case '1':
        this.props.dispatch(routerRedux.push('/project/projectStart/createContract'));
        break;
      case '2':
        this.props.dispatch(routerRedux.push('/project/projectStart/signature'));
        break;
      default:
        break;
    } // 获取左边树点击时，它的值和key
    /*this.setState({
      choiceTypeKey: MenuValue.key,
      choiceTypeValue: MenuValue.item.props.children,
    });*/
  };

  rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

  treeMenu() {
    const { SubMenu } = Menu;
    return (
      <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 140 }}
        onClick={this.handleGetMenuValue}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <span>项目步骤</span>
            </span>
          }
        >
          <Menu.Item key="0">信息管理</Menu.Item>
          <Menu.Item key="1">实施管理</Menu.Item>
          <Menu.Item key="2">成果管理</Menu.Item>
        </SubMenu>
      </Menu>
    );
  } // 左边树

  render() {
    const { match, routerData } = this.props;
    const { rule: { data }, loading } = this.props;
    const { stepVisible } = this.state;
    const onStep1 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/info'));
    };
    const onStep2 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/confirm'));
    };
    const onStep3 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/result'));
    };
    const onStep4 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/process'));
    };
    const onStep6 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/createContract'));
    };
    const onStep7 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/examineReport'));
    };
    const onStep8 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/createReportCode'));
    };
    const onStep9 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/signature'));
    };
    const onStep10 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/projectFile'));
    };
    const onStep11 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/createKnowledgeSystem'));
    };
    const onStep12 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/approvalMessage'));
    };
    const onStep13 = () => {
      this.props.dispatch(routerRedux.push('/project/projectStart/bignessAbstract'));
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
              {this.treeMenu()}
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Card hoverable="true">
                <Fragment>
                  {stepVisible === `0` && (
                    <Steps current={this.getCurrentStep()} className={styles.steps}>
                      <Step title="项目信息" onClick={onStep1} />
                      <Step title="人员分配" onClick={onStep2} />
                      <Step title="资料上传" onClick={onStep3} />
                      <Step title="实施方案" onClick={onStep4} />
                    </Steps>
                  )}
                  {stepVisible === `1` && (
                    <Steps current={this.getCurrentStep()} className={styles.steps}>
                      <Step title="项目进度管理" onClick={onStep6} />
                      <Step title="项目函件管理" onClick={onStep7} />
                      <Step title="现场踏勘管理" onClick={onStep8} />
                      <Step title="重大会审纪要" onClick={onStep13} />
                    </Steps>
                  )}
                  {stepVisible === `2` && (
                    <Steps current={this.getCurrentStep()} className={styles.steps}>
                      <Step title="报告文印/盖章" onClick={onStep9} />
                      <Step title="项目归档" onClick={onStep10} />
                      <Step title="生成知识体系" onClick={onStep11} />
                      <Step title="审批信息" onClick={onStep12} />
                    </Steps>
                  )}
                  <Switch>
                    {getRoutes(match.path, routerData).map(item => (
                      <Route
                        key={item.key}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                      />
                    ))}
                    {/* <Redirect exact from="/project/projectInfo" to="/project/projectInfo/info" />*/}
                  </Switch>
                </Fragment>
              </Card>
            </Content>
          </Layout>
        </Card>
      </PageHeaderLayout>
    );
  }
}
