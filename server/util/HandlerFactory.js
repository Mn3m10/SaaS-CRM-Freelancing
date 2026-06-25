import ApiError from "../errors/ApiError.js";
import ApiFeatures from "./ApiFeatures.js";

const CreateOne = (model) => {
  return async (req, res, next) => {
    try {
      req.body.user = req.user._id;

      const document = await model.create(req.body);

      return res.status(201).json({
        message: "Document created successfully",
        data: document,
      });
    } catch (error) {
      return next(new ApiError(error.message, 500));
    }
  };
};

const GetAllDocuments = (model, populateFields = []) => {
  return async (req, res, next) => {
    try {
      const filter = { user: req.user._id };

      const documentCount = await model.countDocuments(filter);

      const apifeature = new ApiFeatures(model.find(filter), req.query);

      apifeature
        .filter()
        .sort()
        .limitingFields()
        .search()
        .pagination(documentCount);

      let query = apifeature.mongooseQuery;

      populateFields.forEach((field) => {
        query = query.populate(field);
      });

      const documents = await query;

      return res.status(200).json({
        message: "All documents",
        paginationResult: apifeature.paginationResult,
        totalDocuments: documentCount,
        data: documents,
      });
    } catch (error) {
      return next(new ApiError(error.message, 500));
    }
  };
};

const GetOne = (model, populateFields = []) => {
  return async (req, res, next) => {
    try {
      let query = model.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      populateFields.forEach((field) => {
        query = query.populate(field);
      });

      const document = await query;

      if (!document) {
        return next(new ApiError("Document not found", 404));
      }

      return res.status(200).json({
        message: "Document found",
        data: document,
      });
    } catch (error) {
      return next(new ApiError(error.message, 500));
    }
  };
};

const UpdateOne = (model) => {
  return async (req, res, next) => {
    try {
      delete req.body.user;

      const document = await model.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!document) {
        return next(new ApiError("Document not found", 404));
      }

      return res.status(200).json({
        message: "Document updated successfully",
        data: document,
      });
    } catch (error) {
      return next(new ApiError(error.message, 500));
    }
  };
};

const DeleteOne = (model) => {
  return async (req, res, next) => {
    try {
      const document = await model.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!document) {
        return next(new ApiError("Document not found", 404));
      }

      return res.status(200).json({
        message: "Document deleted successfully",
        data: document,
      });
    } catch (error) {
      return next(new ApiError(error.message, 500));
    }
  };
};

export { CreateOne, GetAllDocuments, GetOne, UpdateOne, DeleteOne };
