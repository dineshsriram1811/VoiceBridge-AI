export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err.message || err);
  
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: 'Audio upload error',
      details: err.message
    });
  }

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    details: err.response?.data || null
  });
};

