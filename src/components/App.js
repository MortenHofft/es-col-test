import React, { Component } from 'react';
import { ThemeProvider } from 'react-jss';
import { Route, Switch } from 'react-router-dom';
// translation of the Antd components - not all languages supported. to support more do pull requests for antd
import { LocaleProvider } from 'antd';
// load the locales needed - notice that this is only for formatting.
// The messages need of course to be loaded as well. These are placed in the public folder and loaded on demand.
// English is default and should have its own file so that it isn't in code only (as defaultMessage)
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import DocumentTitle from 'react-document-title';

import { JWT_STORAGE_NAME } from '../api/util/axiosInstance';

import { CollectionSearch } from './search/collectionSearch';

import Home from './Home';
import Exception404 from './exception/404';

import Layout from './Layout';

import './App.css';

import { AuthRoute } from './auth';
import { roles } from './auth';

import withContext from './hoc/withContext';
import Notifications from './Notifications';
import Collection from './Collection';
import { getCookie } from './util/helpers';

addLocaleData(en);

// Exporting other languages that we potentially have in the app to be able to lazy load them
export const languages = {
  da: import('react-intl/locale-data/da'),
  kk: import('react-intl/locale-data/kk'),
  he: import('react-intl/locale-data/he')
};

const theme = {
  paperWidth: '1800px'
};

class App extends Component {

  componentWillReceiveProps(nextProps, nextContext) {
    const jwt = getCookie(JWT_STORAGE_NAME);
    // Every time there is an update in APP we should check if the session cookie is still exist
    // If the cookie was removed in another tab but user still exist, we should log user out
    // to avoid showing restricted pages
    if (!jwt && this.props.user) {
      this.props.logout();
    }
  }

  render() {
    const { isRTL, locale } = this.props;
    theme.direction = isRTL ? 'rtl' : 'ltr';

    return (
      <IntlProvider locale={locale.locale || 'en'} messages={locale.messages}>
        <LocaleProvider locale={locale.antLocale}>
          <ThemeProvider theme={theme}>

            <React.Fragment>
              <Notifications/>
              <Layout>
                <DocumentTitle title={'GBIF Registry'}>
                  <Switch>
                    {/* <Route exact path="/" component={Home}/> */}
                    <Route exact path="/" component={CollectionSearch}/>
                    <AuthRoute
                      exact
                      path="/collection/create"
                      key="createCollection"
                      component={Collection}
                      roles={[roles.REGISTRY_ADMIN, roles.GRSCICOLL_ADMIN]}
                    />
                    <Route
                      path="/collection/:key"
                      render={props => <Collection key={props.match.params.key} {...props}/>}
                    />
                    <Route component={Exception404}/>
                  </Switch>
                </DocumentTitle>
              </Layout>
            </React.Fragment>
          </ThemeProvider>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}

const mapContextToProps = ({ locale, isRTL, user, logout }) => ({ locale, isRTL, user, logout });

export default withContext(mapContextToProps)(App);