import { bootstrap } from "./app.js";

bootstrap().catch((e) => {
  console.error("Internal Server Error!!", e);
});
