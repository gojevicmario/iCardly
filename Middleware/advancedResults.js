const _ = require('lodash');
const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  const requestQuery = { ...req.query };

  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach(param => delete requestQuery[param]);

  let queryString = JSON.stringify(requestQuery);

  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|regex|in)\b/g,
    match => `$${match}`
  );

  // queryString = queryString.replace()
  // console.log(queryString);
  //make regex to work for name

  query = model.find(JSON.parse(queryString));

  //Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('departure');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);
  console.log(populate);
  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  //Pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
