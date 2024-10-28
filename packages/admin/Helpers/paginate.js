/* eslint-disable no-param-reassign */

/**
 * @typedef {Object} QueryResult
 * @property {Document[]} results - Results found
 * @property {number} page - Current page
 * @property {number} limit - Maximum number of results per page
 * @property {number} totalPages - Total number of pages
 * @property {number} totalResults - Total number of documents
 */
/**
 * Query for documents with pagination
 * @param {Object} [Model] - Mongo model
 * @param {Object} [filter] - Mongo filter
 * @param {Object} [options] - Query options
 * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @param {number} [options.search] - Search data from non-priv fields
 * @param {number} [options.select] - Select spesific fields from data
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
module.exports = async function (Model, filter, options) {
  let sort = "";
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(",").forEach((sortOption) => {
      const [key, order] = sortOption.split(":");
      sortingCriteria.push((order === "desc" ? "-" : "") + key);
    });
    sort = sortingCriteria.join(" ");
  } else {
    sort = "createdAt";
  }

  if (options.search) {
    if (!options.searchFields || !Array.isArray(options.searchFields)) {
      options.searchFields = Object.keys(Model.modelSchema.schema).filter(
        (path) => Model.modelSchema.schema[path].type !== "model"
      );
    }

    filter.$or = options.searchFields.map((field) => ({
      [field]: { $regex: options.search.trim(), $options: "i" },
    }));
  }

  const limit =
    options.limit && parseInt(options.limit, 10) > 0
      ? parseInt(options.limit, 10)
      : 10;
  const page =
    options.page && parseInt(options.page, 10) > 0
      ? parseInt(options.page, 10)
      : 1;
  const skip = (page - 1) * limit;

  const countPromise = Model.count(filter);

  let docsPromise = Model.sort(sort).skip(skip).limit(limit);

  if (options.select) {
    docsPromise.select(options.select);
  }

  if (options.populate) {
    options.populate.split(",").forEach((populateOption) => {
      const splited = populateOption.split(".");
      docsPromise = docsPromise.populate(splited[0], splited[2]);

      /* options.populate.split(",").forEach(async (populateOption) => {
      const splited = populateOption.split(".");

      for (var doc of docsPromise) {
        doc = await doc.populate(splited[0]);
      } */
      /* docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b, c) => ({ path: b, populate: a, select: c }))
        ); */
    });
  }

  docsPromise = await docsPromise.find(filter);

  return Promise.all([countPromise, docsPromise]).then((values) => {
    const [totalResults, results] = values;
    const totalPages = Math.ceil(totalResults / limit);
    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
    return Promise.resolve(result);
  });
};
