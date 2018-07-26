const assert = require('assert');

const {singleServerData} = require('../data/mongo-tree-sample-data');
const {convertToTreeData} = require('../../src/tree-data-converter');

const expectedData = [
  {
    "name": "Databases",
    "type": "databases",
    "children": [
      {
        "name": "SampleCollections",
        "type": "database",
        "collections": [
          {
            "name": "DBEnvyLoad_customers",
            "type": "collection",
            "dbName": "SampleCollections",
            "indexes": [
              { "name": "{a:1}_1", "type": "index" },
              { "name": "\"{a:1}\"_1", "type": "index" },
              { "name": "a_10", "type": "index" },
              { "name": "b_1", "type": "index" },
              { "name": "c_-1", "type": "index" },
              { "name": "a_-1", "type": "index" }
            ]
          },
          {
            "name": "DBEnvyLoad_orders",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "DBEnvyLoad_products",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "GraphTest_smallGTest",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "Sakila_actors",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "Sakila_customers",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "Sakila_films",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "and_sorted_test",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "crunchbase_database",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "enron_messages",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "mongomart_cart",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "mongomart_item",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "samples_friends",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "samples_pokemon",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "savedPlans",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "video_movieDetails",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "video_movies",
            "type": "collection",
            "dbName": "SampleCollections"
          },
          {
            "name": "video_reviews",
            "type": "collection",
            "dbName": "SampleCollections"
          }
        ]
      },
      {
        "name": "admin",
        "type": "database",
        "collections": [
          {
            "name": "system.roles",
            "type": "collection",
            "dbName": "admin",
            "indexes": [{ "name": "role_1_db_1", "type": "index" }]
          },
          {
            "name": "system.users",
            "type": "collection",
            "dbName": "admin",
            "indexes": [{ "name": "user_1_db_1", "type": "index" }]
          },
          { "name": "system.version", "type": "collection", "dbName": "admin" }
        ]
      },
      {
        "name": "config",
        "type": "database",
        "collections": [
          {
            "name": "system.sessions",
            "type": "collection",
            "dbName": "config",
            "indexes": [{ "name": "lsidTTLIndex", "type": "index" }]
          }
        ]
      },
      {
        "name": "local",
        "type": "database",
        "collections": [
          { "name": "startup_log", "type": "collection", "dbName": "local" }
        ]
      },
      {
        "name": "report",
        "type": "database",
        "collections": [
          {
            "name": "test",
            "type": "collection",
            "dbName": "report",
            "indexes": [{ "name": "a_1", "type": "index" }]
          }
        ]
      },
      {
        "name": "test",
        "type": "database",
        "collections": [
          {
            "name": "test",
            "type": "collection",
            "dbName": "test",
            "indexes": [{ "name": "name_1", "type": "index" }]
          }
        ]
      }
    ]
  },
  {
    "name": "users",
    "type": "users",
    "children": [
      {
        "name": "admin.admin",
        "user": "admin",
        "db": "admin",
        "type": "users"
      },
      { "name": "admin.test", "user": "test", "db": "admin", "type": "users" }
    ]
  }
];

describe('tree data converter test', () => {
  test('test data convert on single server', () => {
    const treeData = convertToTreeData(singleServerData);
    assert.deepEqual(treeData, expectedData);
  });
});
