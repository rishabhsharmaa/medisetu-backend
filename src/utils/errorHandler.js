const errorHandler = (err, req, res, next) => {
    // Check for status code in error object (e.g. body-parser sets 400 for bad JSON)
    const statusCode = err.status || err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;
