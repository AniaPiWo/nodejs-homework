import dotenv from "dotenv";

module.exports = () => {
  dotenv.config({ path: ".test.env" });
};
