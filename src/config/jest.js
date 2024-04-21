import dotenv from "dotenv";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default async = () => {
  dotenv.config({ path: ".test.env" }),
    require("esm")(module)({
      cache: false,
      cjs: {
        cache: false,
      },
    });
};
