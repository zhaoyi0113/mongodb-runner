const path = require("path");

const getItemIcon = type => {
  switch (type) {
    case "databases":
      return {
        light: path.join(
          __filename,
          "..",
          "..",
          "resources/light/database.svg"
        ),
        dark: path.join(__filename, "..", "..", "resources/dark/database.svg")
      };
    case "users":
      return {
        light: path.join(__filename, "..", "..", "resources/light/user.svg"),
        dark: path.join(__filename, "..", "..", "resources/dark/user.svg")
      };
    case "roles":
      return {
        light: path.join(__filename, "..", "..", "resources/light/role.svg"),
        dark: path.join(__filename, "..", "..", "resources/dark/role.svg")
      };
    case "collection":
      return {
        light: path.join(
          __filename,
          "..",
          "..",
          "resources/light/collection.svg"
        ),
        dark: path.join(__filename, "..", "..", "resources/dark/collection.svg")
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
