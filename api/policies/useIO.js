module.exports = function useIO (req, res, next) {
    res.locals.io = true;
    return next();
};