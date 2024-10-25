import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, '12058080');
            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }
    } else {
        return res.status(403).json({
            message: "Unauthorized",
        });
    }
}