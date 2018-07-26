const _ = require("lodash");

const convertToTreeData = data => {
  console.log("convert tree data ", data);
  const treeData = [];
  _.forOwn(data, (v, k) => {
    let name;
    if (k === "roles") {
      return;
    }
    switch (k) {
      case "databases":
        name = "Databases";
        break;
      case "replicaset":
        name = "Replica Set";
        break;
      default:
        name = k;
    }
    treeData.push({ name, type: k, children: v });
  });
  return treeData;
};

module.exports = { convertToTreeData };
