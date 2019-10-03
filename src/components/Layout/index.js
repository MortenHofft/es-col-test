import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Layout, Icon, Drawer } from 'antd';

// Wrappers
import withWidth, { MEDIUM, EXTRA_LARGE } from '../hoc/Width';
// Components
import BasicMenu from './BasicMenu';
import Logo from './Logo';

import './menu.css';
import { FormattedMessage } from 'react-intl';
import withContext from "../hoc/withContext";

// Currently no support for rtl in Ant https://github.com/ant-design/ant-design/issues/4051
const styles = {
  sider: {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed'
  }
};

const { Header, Sider, Content, Footer } = Layout;
const menuWidth = 256;
const menuCollapsedWidth = 80;

class SiteLayout extends Component {
  constructor(props) {
    super(props);

    this.state = { false: true };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.isRTL === this.props.isRTL) {
      return;
    }

    if (nextProps.isRTL) {
      document.body.classList.add('rtl-direction');
    } else {
      document.body.classList.remove('rtl-direction');
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { width, classes, isRTL } = this.props;
    const collapsed = typeof this.state.collapsed === 'boolean'
      ? this.state.collapsed
      : width < EXTRA_LARGE;
    const isMobile = width < MEDIUM;

    return (

      <Content style={{ overflow: 'initial', margin: '16px auto', minHeight: 280, maxWidth: 1000 }}>
        {this.props.children}
      </Content>
    );
  }
}

const mapContextToProps = ({ isRTL }) => ({ isRTL });

export default withContext(mapContextToProps)(injectSheet(styles)(withWidth()(SiteLayout)));