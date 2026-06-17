import ApiError from "../errors/ApiError.js";
import ApiFeatures from "./ApiFeatures.js";

const CreateOne = (model) => {
  return async (req, res, next) => {
    try {
      const document = await model.create(req.body);
      return res.status(201).json({
        message: "Document created successfully",
        data: document,
      });
    } catch (error) {
      return next(new ApiError(error, 500));
    }
  };
};

const GetAllDocuments = (model) => {
  return async (req, res, next) => {
    try {
      const documentCount = await model.countDocuments();
      const apifeature = new ApiFeatures(model.find() , req.query);
      apifeature
      .filter()
      .sort()
      .limitingFields()
      .search()
      .pagination(documentCount);
      const {mongooseQuery , paginationResult} = apifeature;
      const documents = await mongooseQuery;
      return res.status(200).json({
        message: "All Documents:",
        paginationResult,
        "total documents":documentCount,
        data: documents,
      });
    } catch (error) {
      return next(new ApiError(error, 500));
    }
  };
};

const GetOne = (model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const document = await model.findById(id);
      if (!document) {
        return next(new ApiError("Document not found", 404));
      }
      return res.status(200).json({
        message: "Dcoumtn found",
        data: document,
      });
    } catch (error) {
      return next(new ApiError(error, 500));
    }
  };
};

const UpdateOne = (model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const document = await model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!document) {
        return next(new ApiError("Document not found", 404));
      }
      return res.status(200).json({
        message: "Document updated successfully",
        data: document,
      });
    } catch (error) {
      return next(new ApiError(error, 500));
    }
  };
};

const DeleteOne = (model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const document = await model.findByIdAndDelete(id);
      if (!document) {
        return next(new ApiError("Document not found", 404));
      }
      return res.status(200).json({
        message: "Document deleted successfully",
        data: document,
      });
    } catch (error) {
      return next(new ApiError(error, 500));
    }
  };
};

export { CreateOne, GetAllDocuments, GetOne, UpdateOne, DeleteOne };
