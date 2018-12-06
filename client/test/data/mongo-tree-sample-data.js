const singleServerData = {
  mongoConfig: {
    url: 'mongodb://localhost'
  },
  tree: {
    databases: [
      {
        name: 'SampleCollections',
        type: 'database',
        collections: [
          {
            name: 'DBEnvyLoad_customers',
            type: 'collection',
            dbName: 'SampleCollections',
            indexes: [
              { name: '{a:1}_1', type: 'index' },
              { name: '"{a:1}"_1', type: 'index' },
              { name: 'a_10', type: 'index' },
              { name: 'b_1', type: 'index' },
              { name: 'c_-1', type: 'index' },
              { name: 'a_-1', type: 'index' }
            ]
          },
          {
            name: 'DBEnvyLoad_orders',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'DBEnvyLoad_products',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'GraphTest_smallGTest',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'Sakila_actors',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'Sakila_customers',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'Sakila_films',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'and_sorted_test',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'crunchbase_database',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'enron_messages',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'mongomart_cart',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'mongomart_item',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'samples_friends',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'samples_pokemon',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'savedPlans',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'video_movieDetails',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'video_movies',
            type: 'collection',
            dbName: 'SampleCollections'
          },
          {
            name: 'video_reviews',
            type: 'collection',
            dbName: 'SampleCollections'
          }
        ]
      },
      {
        name: 'admin',
        type: 'database',
        collections: [
          {
            name: 'system.roles',
            type: 'collection',
            dbName: 'admin',
            indexes: [{ name: 'role_1_db_1', type: 'index' }]
          },
          {
            name: 'system.users',
            type: 'collection',
            dbName: 'admin',
            indexes: [{ name: 'user_1_db_1', type: 'index' }]
          },
          { name: 'system.version', type: 'collection', dbName: 'admin' }
        ]
      },
      {
        name: 'config',
        type: 'database',
        collections: [
          {
            name: 'system.sessions',
            type: 'collection',
            dbName: 'config',
            indexes: [{ name: 'lsidTTLIndex', type: 'index' }]
          }
        ]
      },
      {
        name: 'local',
        type: 'database',
        collections: [
          { name: 'startup_log', type: 'collection', dbName: 'local' }
        ]
      },
      {
        name: 'report',
        type: 'database',
        collections: [
          {
            name: 'test',
            type: 'collection',
            dbName: 'report',
            indexes: [{ name: 'a_1', type: 'index' }]
          }
        ]
      },
      {
        name: 'test',
        type: 'database',
        collections: [
          {
            name: 'test',
            type: 'collection',
            dbName: 'test',
            indexes: [{ name: 'name_1', type: 'index' }]
          }
        ]
      }
    ],
    users: [
      { name: 'admin.admin', user: 'admin', db: 'admin', type: 'users' },
      { name: 'admin.test', user: 'test', db: 'admin', type: 'users' }
    ],
    roles: [
      {
        db: 'admin',
        roles: [
          {
            name: 'Built-In',
            roles: [
              {
                name: '__queryableBackup',
                db: 'admin',
                type: 'default_role'
              },
              { name: '__system', db: 'admin', type: 'default_role' },
              { name: 'backup', db: 'admin', type: 'default_role' },
              { name: 'clusterAdmin', db: 'admin', type: 'default_role' },
              { name: 'clusterManager', db: 'admin', type: 'default_role' },
              { name: 'clusterMonitor', db: 'admin', type: 'default_role' },
              { name: 'dbAdmin', db: 'admin', type: 'default_role' },
              {
                name: 'dbAdminAnyDatabase',
                db: 'admin',
                type: 'default_role'
              },
              { name: 'dbOwner', db: 'admin', type: 'default_role' },
              { name: 'enableSharding', db: 'admin', type: 'default_role' },
              { name: 'hostManager', db: 'admin', type: 'default_role' },
              { name: 'read', db: 'admin', type: 'default_role' },
              {
                name: 'readAnyDatabase',
                db: 'admin',
                type: 'default_role'
              },
              { name: 'readWrite', db: 'admin', type: 'default_role' },
              {
                name: 'readWriteAnyDatabase',
                db: 'admin',
                type: 'default_role'
              },
              { name: 'restore', db: 'admin', type: 'default_role' },
              { name: 'root', db: 'admin', type: 'default_role' },
              { name: 'userAdmin', db: 'admin', type: 'default_role' },
              {
                name: 'userAdminAnyDatabase',
                db: 'admin',
                type: 'default_role'
              }
            ]
          }
        ],
        type: 'roles'
      },
      {
        db: 'test',
        roles: [{ name: 'role1', db: 'test', type: 'role' }],
        type: 'roles'
      }
    ]
  }
};

module.exports = { singleServerData };
