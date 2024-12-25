import jwt from 'jsonwebtoken';

const auth = async (request, response, next) => {
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split("")[1];
        if (!token) {
            return response.status(401).json({
                message: 'tokan not found',
                error: true,
                success: false
            });
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if (!decoded) {
            return response.status(401).json({
                message: 'Invalid token',
                error: true,
                success: false
            });
        }
        request.userId = decoded.id

        next();


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });

    }

}

export default auth;