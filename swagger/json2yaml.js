import fs from "fs";
import YAML from "json-to-pretty-yaml";
import json from "../swagger-output.json";

const data = YAML.stringify(json);

fs.writeFileSync("swagger-output.yaml", data);

fs.unlink("swagger-output.json", function (err) {
  if (err) {
    console.log("Error : ", err);
  }
});
