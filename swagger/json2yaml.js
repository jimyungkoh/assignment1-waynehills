const fs = require("fs");
const YAML = require("json-to-pretty-yaml");
const json = require("../swagger-output.json");

const data = YAML.stringify(json);
fs.writeFileSync("swagger-output.yaml", data);
fs.unlink("swagger-output.json", function (err) {
  if (err) {
    console.log("Error : ", err);
  }
});
