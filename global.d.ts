declare module "node:fs/promises" {
  import * as fsPromises from "fs/promises";
  export = fsPromises;
}
