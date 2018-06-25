import React, { PureComponent } from 'react';
import { Tabs, Icon, Form } from 'antd';
import { connect } from 'dva';
import ContractCheck from '../../project/select/ContractCheck.js';
import ProjectCheck from '../../project/select/ProjectCheck.js';
import CustomerCheck from '../../crm/select/CustomerCheck.js';
import BusinessOpportunityCheck from '../../crm/select/BusinessOpportunityCheck.js';
import VisitListCheck from '../../crm/select/VisitListCheck.js';



class CheckTabs extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { TabPane } = Tabs;
    return (
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={<span><Icon type="team" />客户</span>
        }
          key="1"
        >
          <CustomerCheck />
        </TabPane>
        <TabPane
          tab={
            <span><Icon type="api" />项目</span>
        }
          key="2"
        >
          <ProjectCheck />
        </TabPane>
        <TabPane
          tab={
            <span><Icon type="switcher" />合同</span>
        }
          key="3"
        >
          <ContractCheck />
        </TabPane>
        <TabPane
          tab={
            <span><Icon type="line-chart" />商机</span>
        }
          key="4"
        >
          <BusinessOpportunityCheck />
        </TabPane>
        <TabPane
          tab={
            <span><Icon type="eye" />拜访</span>
        }
          key="5"
        >
          <VisitListCheck />
        </TabPane>
      </Tabs>
    );
  };
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(CheckTabs));
