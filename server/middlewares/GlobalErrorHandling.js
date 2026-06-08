


const GlobalErrorHandling = (error , req , res , next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if(process.env.NODE_ENV === "dev") {
    DevError(error , res);
  } else {
    ProductionError(error , res);
  }
}


const DevError = (error , res) => {
  return res.status(400).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  })
}

const ProductionError = (error , res) => {
  return res.status(400).json({
    status: error.status,
    message: error.message,
  })
}

export default GlobalErrorHandling;