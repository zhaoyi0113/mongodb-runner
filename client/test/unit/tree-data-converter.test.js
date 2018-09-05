const assert = require("assert");

const { singleServerData } = require("../data/mongo-tree-sample-data");
const { convertToTreeData } = require("../../src/tree-data-converter");

const expectedData = [
  {
    name: "Databases",
    type: "databases",
    children: [
      {
        name: "SampleCollections",
        dbName: "SampleCollections",
        type: "database",
        collections: [
          {
            name: "DBEnvyLoad_customers",
            type: "collection",
            dbName: "SampleCollections",
            colName: "DBEnvyLoad_customers",
            indexes: [
              {
                name: "{a:1}_1",
                type: "index",
                dbName: "SampleCollections",
                colName: "DBEnvyLoad_customers"
              },
              {
                name: '"{a:1}"_1',
                type: "index",
                dbName: "SampleCollections",
                colName: "DBEnvyLoad_customers"
              },
              {
                name: "a_10",
                type: "index",
                dbName: "SampleCollections",
                colName: "DBEnvyLoad_customers"
              },
              {
                name: "b_1",
                type: "index",
                dbName: "SampleCollections",
                colName: "DBEnvyLoad_customers"
              },
              {
                name: "c_-1",
                type: "index",
                dbName: "SampleCollections",
                colName: "DBEnvyLoad_customers"
              },
              {
                name: "a_-1",
                type: "index",
                dbName: "SampleCollections",
                colName: "DBEnvyLoad_customers"
              }
            ]
          },
          {
            name: "DBEnvyLoad_orders",
            colName: "DBEnvyLoad_orders",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "DBEnvyLoad_products",
            colName: "DBEnvyLoad_products",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "GraphTest_smallGTest",
            colName: "GraphTest_smallGTest",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "Sakila_actors",
            colName: "Sakila_actors",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "Sakila_customers",
            colName: "Sakila_customers",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "Sakila_films",
            colName: "Sakila_films",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "and_sorted_test",
            colName: "and_sorted_test",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "crunchbase_database",
            colName: "crunchbase_database",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "enron_messages",
            colName: "enron_messages",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "mongomart_cart",
            colName: "mongomart_cart",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "mongomart_item",
            colName: "mongomart_item",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "samples_friends",
            colName: "samples_friends",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "samples_pokemon",
            colName: "samples_pokemon",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "savedPlans",
            colName: "savedPlans",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "video_movieDetails",
            colName: "video_movieDetails",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "video_movies",
            colName: "video_movies",
            type: "collection",
            dbName: "SampleCollections"
          },
          {
            name: "video_reviews",
            colName: "video_reviews",
            type: "collection",
            dbName: "SampleCollections"
          }
        ]
      },
      {
        name: "admin",
        type: "database",
        dbName: "admin",
        collections: [
          {
            name: "system.roles",
            colName: "system.roles",
            type: "collection",
            dbName: "admin",
            indexes: [
              {
                name: "role_1_db_1",
                type: "index",
                dbName: "admin",
                colName: "system.roles"
              }
            ]
          },
          {
            name: "system.users",
            colName: "system.users",
            type: "collection",
            dbName: "admin",
            indexes: [
              {
                name: "user_1_db_1",
                type: "index",
                dbName: "admin",
                colName: "system.users"
              }
            ]
          },
          {
            name: "system.version",
            colName: "system.version",
            type: "collection",
            dbName: "admin"
          }
        ]
      },
      {
        name: "config",
        dbName: "config",
        type: "database",
        collections: [
          {
            name: "system.sessions",
            colName: "system.sessions",
            type: "collection",
            dbName: "config",
            indexes: [
              {
                name: "lsidTTLIndex",
                type: "index",
                dbName: "config",
                colName: "system.sessions"
              }
            ]
          }
        ]
      },
      {
        name: "local",
        dbName: "local",
        type: "database",
        collections: [
          { name: "startup_log", colName: "startup_log", type: "collection", dbName: "local" }
        ]
      },
      {
        name: "report",
        dbName: "report",
        type: "database",
        collections: [
          {
            name: "test",
            colName: "test",
            type: "collection",
            dbName: "report",
            indexes: [
              { name: "a_1", type: "index", dbName: "report", colName: "test" }
            ]
          }
        ]
      },
      {
        name: "test",
        dbName: "test",
        type: "database",
        collections: [
          {
            name: "test",
            colName: "test",
            type: "collection",
            dbName: "test",
            indexes: [
              { name: "name_1", type: "index", dbName: "test", colName: "test" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "users",
    type: "users",
    children: [
      {
        name: "admin.admin",
        user: "admin",
        db: "admin",
        type: "users"
      },
      {
        name: "admin.test",
        user: "test",
        db: "admin",
        type: "users"
      }
    ]
  }
];

describe("tree data converter test", () => {
  test("test database data", () => {
    const data = {
      databases: [
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
          ]
        }
      ]
    };
    const expected = {
      databases: [
        {
          name: "SampleCollections",
          dbName: "SampleCollections",
          type: "database",
          collections: [
            {
              name: "DBEnvyLoad_customers",
              type: "collection",
              dbName: "SampleCollections",
              colName: "DBEnvyLoad_customers",
              indexes: [
                {
                  name: "{a:1}_1",
                  type: "index",
                  dbName: "SampleCollections",
                  colName: "DBEnvyLoad_customers"
                },
                {
                  name: '"{a:1}"_1',
                  type: "index",
                  dbName: "SampleCollections",
                  colName: "DBEnvyLoad_customers"
                },
                {
                  name: "a_10",
                  type: "index",
                  dbName: "SampleCollections",
                  colName: "DBEnvyLoad_customers"
                },
                {
                  name: "b_1",
                  type: "index",
                  dbName: "SampleCollections",
                  colName: "DBEnvyLoad_customers"
                },
                {
                  name: "c_-1",
                  type: "index",
                  dbName: "SampleCollections",
                  colName: "DBEnvyLoad_customers"
                },
                {
                  name: "a_-1",
                  type: "index",
                  dbName: "SampleCollections",
                  colName: "DBEnvyLoad_customers"
                }
              ]
            }
          ]
        }
      ]
    };
    const treeData = convertToTreeData(data);
    console.log(treeData);
  });

  test("test data convert on single server", () => {
    const treeData = convertToTreeData(singleServerData);
    assert.deepEqual(treeData, expectedData);
  });
});
