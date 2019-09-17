import _getDeep from 'lodash/get';
import _uniq from 'lodash/uniq';
// APIs
// Currently we do only have node and organizations in scope - at some point i assume me must ask for dataset, collections etc. Or better yet, update the API to return the type.


/**
 * Decorate user with rights and more info about the type of the UUIDs in scope (dataset or organization etc)
 * @param {*} user
 */
export const decorateUser = async user => {
  const _editorRoleScopeItems = await getScopes(user);
  const _scopeTypes = _uniq(_editorRoleScopeItems.map(item => item.type));
  const _rights = getRights(user, _scopeTypes);
  return {
    ...user,
    _editorRoleScopeItems,
    _scopeTypes,
    _rights
  };
};

/**
 * Requesting user items by keys from editorRoleScopes list
 * @param editorRoleScopes - list of keys (UUIDs) which indicates users scope
 */
const getScopes = async () => {
  const items = [];
  // no scopes in this project
  return items;
};

function getRights(user, _scopeTypes) {
  let userRights = [];
  // no custom rights in this project
  return _uniq(userRights);
}
