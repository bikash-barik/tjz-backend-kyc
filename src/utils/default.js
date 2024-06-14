function addDefaultValues(data) {
  Object.keys((key) => {
    data[key] = data[key] ?? "NA";
  });
  return data;
}
module.exports = { addDefaultValues };
