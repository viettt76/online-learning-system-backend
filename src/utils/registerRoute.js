const registerRoute = (router, routes, controller) => {
    routes.forEach(({ method, path, action }) => {
        router[method?.toLowerCase()](path, async (req, res, next) => {
            try {
                const result = await controller[action](req, res, next);
                if (result !== null && result !== undefined) {
                    if (result?.cookies) {
                        const setCookies = Object.keys(result.cookies).map((key) => {
                            const cookie = result.cookies[key];
                            let cookieStr = `${key}=${cookie.value}`;
                            if (cookie.options) {
                                if (cookie.options.httpOnly) cookieStr += '; httpOnly';
                                if (cookie.options.maxAge) cookieStr += `; Max-Age=${cookie.options.maxAge}`;
                                if (cookie.options.path) cookieStr += `; Path=${cookie.options.path}`;
                                if (cookie.options.domain) cookieStr += `; Domain=${cookie.options.domain}`;
                                if (cookie.options.secure) cookieStr += '; Secure';
                                if (cookie.options.sameSite) cookieStr += `; SameSite=${cookie.options.sameSite}`;
                            }
                            return cookieStr;
                        });
                        delete result.cookies;
                        return res.setHeader('Set-Cookie', setCookies).status(200).json(result);
                    }
                    if (result?.clearCookies) {
                        // const clearCookies = result.clearCookies.map((key) => {
                        //     return `${key}=; Max-Age=0`;
                        // });
                        // res.setHeader('Set-Cookie', clearCookies).status(200).json();
                        result.clearCookies.forEach((key) => {
                            res.clearCookie(key).status(200).json();
                        });
                    }
                    res.status(200).json(result);
                } else {
                    res.status(204).send(); // No Content
                }
            } catch (err) {
                if (err?.status) {
                    res.status(err?.status).json({
                        errCode: err.errCode,
                        message: err?.message,
                    });
                } else {
                    next(err);
                }
            }
        });
    });
};

module.exports = registerRoute;
