class ApiFeatures {
  constructor(mongooseQuery , queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const reqQueryObject = {...this.queryString};
    const excludedFields = ["pages","limit","fields","sort"];
    excludedFields.forEach((field) => delete reqQueryObject[field]);
    let queryStr = JSON.stringify(reqQueryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);
    this.mongooseQuery = this.mongooseQuery.find(parsedQuery);
    return this;
  }

  sort() {
    if(this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitingFields() {
    if(this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    }
    return this;
  }

  search() {
    if(this.queryString.keyword) {
      const query = {};
      query.$or = [
        {name: {$regex: this.queryString.keyword , $options: "i"}},
        {description: {$regex: this.queryString.keyword , $options: "i"}}
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(countDocuments) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 5;
    const skip = (page - 1) * limit;
    const endPageIndex = page * limit;
    const paginationData = {};
    paginationData.currentPage = page;
    paginationData.limit = limit;
    paginationData.pageCount = Math.ceil(countDocuments / limit);
    if(endPageIndex < countDocuments) {
      paginationData.nextPage = page + 1;
    }
    if(skip > 0) {
      paginationData.prevPage = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.find().skip(skip).limit(limit);
    this.paginationResult = paginationData;
    return this;
  }
}

export default ApiFeatures;