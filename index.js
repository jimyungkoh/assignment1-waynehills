import { bootstrap } from "./app";

bootstrap().catch((e) => {
  console.error("Internal Server Error!!", e);
});
