const tokenExtractor = (req, res, next) => {
    const token = req.get("authorization");
    if(token && token.toLowerCase().startsWith("bearer")) {
        req.token = token.substring(7);
    }
    next();
}

const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError") return res.status(400).json({error: "malformed id"});

    if(error.name === "ValidationError") return res.status(400).json({error: error.mesaage});

    if(error.name === "JsonWebTokenError") {
        return res.status(401).json({error: "invalid token"});
    }

    if(error.name === "TokenExpiredError") return res.status(401).json({error: "token expired"});

    next();
}

const unknownEndpoint = (req, res) => res.status(400).json({error: "not found"})

module.exports = {errorHandler, unknownEndpoint, tokenExtractor};