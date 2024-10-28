const { data, post } = require("@gefion/worker");

function calculator(data) {
  return data;
}

const result = calculator(data);
post(result);
