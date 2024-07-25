const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    error: message
  };

  // Check for a DEBUG flag in .env, defaulting to false if not set
  const isDebug = process.env.DEBUG === 'true';

  if (isDebug) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
 //It's still created but not use on time with project
module.exports = errorHandler;