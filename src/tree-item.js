const path = require("path");
const { TreeNodeTypes } = require("mongodb-topology");

const getItemIcon = type => {
  switch (type) {
    case TreeNodeTypes.DATABASES:
      return {
        light: path.join(
          __filename,
          "..",
          "..",
          "resources/light/database.svg"
        ),
        dark: path.join(__filename, "..", "..", "resources/dark/database.svg")
      };
    case TreeNodeTypes.USERS:
      return {
        light: path.join(__filename, "..", "..", "resources/light/user.svg"),
        dark: path.join(__filename, "..", "..", "resources/dark/user.svg")
      };
    case TreeNodeTypes.ROLES:
      return {
        light: path.join(__filename, "..", "..", "resources/light/role.svg"),
        dark: path.join(__filename, "..", "..", "resources/dark/role.svg")
      };
    case TreeNodeTypes.COLLECTION:
      return {
        light: path.join(
          __filename,
          "..",
          "..",
          "resources/light/collection.svg"
        ),
        dark: path.join(__filename, "..", "..", "resources/dark/collection.svg")
      };
    case TreeNodeTypes.PRIMARY:
      return {
        light: path.join(__filename, "..", "..", "resources/light/primary.svg"),
        dark: path.join(__filename, "..", "..", "resources/dark/primary.svg")
      };
    case TreeNodeTypes.SECONDARY:
      return {
        light: path.join(
          __filename,
          "..",
          "..",
          "resources/light/secondary.svg"
        ),
        dark: path.join(__filename, "..", "..", "resources/dark/secondary.svg")
      };
    case TreeNodeTypes.ARBITER:
      return {
        light: path.join(__filename, "..", "..", "resources/light/arbiter.svg"),
        dark: path.join(__filename, "..", "..", "resources/dark/arbiter.svg")
      };
  }
};

class TreeItem {
  constructor(element, collapsibleState) {
    this.label = element.name;
    this.collapsibleState = collapsibleState;
    this.contextValue = element.type;
    this.iconPath = getItemIcon(element.type);
  }
}

module.exports = TreeItem;
