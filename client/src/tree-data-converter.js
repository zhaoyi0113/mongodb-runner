const _ = require('lodash');
const mongodbUri = require('mongodb-uri');

/**
 * convert database to tree structure
 * 
 * @param {*} dbChildren 
  [
    {
      name: "SampleCollections",
      type: "database",
      collections: [
        {
          name: "DBEnvyLoad_customers",
          type: "collection",
          dbName: "SampleCollections",
          indexes: [
            { name: "{a:1}_1", type: "index" },
            { name: '"{a:1}"_1', type: "index" },
            { name: "a_10", type: "index" },
            { name: "b_1", type: "index" },
            { name: "c_-1", type: "index" },
            { name: "a_-1", type: "index" }
          ]
        }
      }
  ]
 */
const convertDatabaseChildren = (dbChildren, uuid) => {
  const children = dbChildren.map(db => {
    db.dbName = db.name;
    db.uuid = uuid;
    if (db.collections && db.collections.length > 0) {
      // loop collections
      db.collections = db.collections.map(col => {
        col.dbName = db.dbName;
        col.colName = col.name;
        col.uuid = uuid;
        // loop indexes
        if (col.indexes && col.indexes.length > 0) {
          col.indexes = col.indexes.map(index => {
            index.dbName = db.name;
            index.colName = col.name;
            return index;
          });
        }
        return col;
      });
      if (db.users && db.users) {
        db.users = db.users.map(user => {
          user.dbName = db.name;
          user.uuid = uuid;
          return user;
        });
      }
    }
    return db;
  });
  return children;
};

const getConnectionName = config => {
  const uriObject = mongodbUri.parse(config.url);
  if (uriObject.options && uriObject.options.replicaSet) {
    return uriObject.options.replicaSet;
  }
  if (uriObject.hosts && uriObject.hosts.length > 0) {
    return uriObject.hosts[0].host;
  }
  return 'MongoServer';
};

const convertToTreeData = alldata => {
  console.log('convert tree data ', alldata);
  const treeData = [];
  const {uuid} = alldata.mongoConfig;
  _.forOwn(alldata.tree, (v, k) => {
    let name;
    if (k === 'roles') {
      return;
    }
    let children = v;
    switch (k) {
      case 'databases':
        name = 'Databases';
        children = convertDatabaseChildren(v, uuid);
        break;
      case 'replicaset':
        name = 'Replica Set';
        break;
      default:
        name = k;
    }
    treeData.push({ name, type: k, children, uuid });
  });
  return { tree: treeData, name: getConnectionName(alldata.mongoConfig) };
};

module.exports = { convertToTreeData };
