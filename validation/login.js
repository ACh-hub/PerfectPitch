const validator = require("validator");
const isEmpty = require("../validation/is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // isEmpty requires string so the point is to make sure it is one
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is not valid";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
