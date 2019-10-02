import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

import { collectionSearch } from '../../api/collection';
import CollectionList from '../Collection/Search/CollectionList';
import DataQuery from '../DataQuery';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name" />,
    dataIndex: 'name',
    width: '400px',
    render: (text, record) => <Link to={`/collection/${record.key}`}>{text}</Link>
  },
  ..._cloneDeep(standardColumns)
];
// Attaching filters to the last column
columns[columns.length - 1].filters = [
  { text: <FormattedMessage id="listType.deleted" defaultMessage="Deleted" />, value: 'deleted' }
];
// Setting filter type as radio - can choose only one option
columns[columns.length - 1].filterMultiple = false;

const pageTitle = { id: 'title.collections', defaultMessage: 'Collections | GBIF Registry' };
const listName = <FormattedMessage id="collections" defaultMessage="Collections" />;

const getType = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="listType.deleted" defaultMessage="Deleted" />;
    default:
      return <FormattedMessage id="listType.search" defaultMessage="Search" />;
  }
};

const getTitle = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="menu.collection.deleted" defaultMessage="Deleted collections" />;
    default:
      return <FormattedMessage id="menu.collection.search" defaultMessage="Search collections" />;
  }
};

export const CollectionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <CollectionList />
};