const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging purposes
  
    // Default status code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
  
    // Customize error messages and status codes based on specific errors
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error: ' + err.message;
    } else if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
    } else if (err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate key error';
    }
  
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message
    });
  };
  
  module.exports = errorHandler;
  