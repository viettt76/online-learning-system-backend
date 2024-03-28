import db from '../models';

class UserController {
    // [POST] /user/create
    async create(req, res, next) {
        try {
            const [user, created] = await db.User.findOrCreate({
                where: { email: req.body.email },
                defaults: {
                    email: req.body.email,
                    familyName: req.body.familyName,
                    givenName: req.body.givenName,
                    picture: req.body.picture,
                },
            });
            if (created) {
                res.status(200).json({
                    errCode: 0,
                    message: 'Register account successful',
                    data: {
                        id: user?.id,
                        isTeacher: user?.isTeacher,
                    },
                });
            } else {
                res.status(200).json({
                    errCode: 0,
                    message: 'Login successful',
                    data: {
                        id: user?.id,
                        isTeacher: user?.isTeacher,
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // [PATCH] /user/is_teacher
    async isTeacher(req, res, next) {
        try {
            let id = req.body.id;
            let user = await db.User.findOne({ where: { id }, raw: false });
            user.isTeacher = true;
            await user.save();
            res.status(200).json({
                errCode: 0,
                message: 'Register as a teacher successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
