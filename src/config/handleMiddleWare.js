const errorHandler = (err, req, res, next) => {
    res.status(500).json({
        errCode: -1,
        message: err?.message,
    });
};

module.exports = {
    errorHandler,
};
