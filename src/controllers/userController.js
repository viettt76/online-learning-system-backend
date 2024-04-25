const { Op } = require('sequelize');
var crypto = require('crypto');
const db = require('../models');
const jwtSecret = require('../utils/jwtSecret');
const { base64url } = require('../utils/commonUtils');

class UserController {
    // [POST] /user/login
    async login(req, res, next) {
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
            const header = {
                alg: 'HS256',
                typ: 'JWT',
            };
            const payload = {
                id: user.id,
            };

            const encodedHeader = base64url(JSON.stringify(header));
            const encodedPayload = base64url(JSON.stringify(payload));
            const signature = crypto
                .createHmac('sha256', jwtSecret)
                .update(`${encodedHeader}.${encodedPayload}`)
                .digest('base64url');

            res.setHeader(
                'Set-Cookie',
                `token=${encodedHeader}.${encodedPayload}.${signature}; httpOnly; path=/; max-age=${
                    365 * 24 * 60 * 60
                }`,
            )
                .status(200)
                .json({
                    errCode: 0,
                });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /user/logout
    logout(req, res, next) {
        res.clearCookie('token').json({});
    }

    // [GET] /user/personal-info
    async personalInfo(req, res, next) {
        try {
            const tokenData = req.cookies.token;
            if (tokenData) {
                const [encodedHeader, encodedPayload, signatureData] = tokenData.split('.');
                const payload = JSON.parse(atob(encodedPayload));
                const signature = crypto
                    .createHmac('sha256', jwtSecret)
                    .update(`${encodedHeader}.${encodedPayload}`)
                    .digest('base64url');

                if (signature === signatureData) {
                    const user = await db.User.findOne({
                        where: {
                            id: payload?.id,
                        },
                        attributes: [
                            'id',
                            'email',
                            'familyName',
                            'givenName',
                            'introduction',
                            'job',
                            'picture',
                            'isTeacher',
                        ],
                    });
                    if (user) {
                        return res.status(200).json({
                            errCode: 0,
                            data: user,
                        });
                    }
                    return res.status(404).json({ errCode: 2 });
                }
                return res.status(400).json({
                    errCode: 3,
                });
            }
            res.status(400).json({
                errCode: 4,
            });
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
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /user/teacher/search
    async searchTeacher(req, res, next) {
        try {
            let keyword = req.query.keyword;

            let user = await db.User.findAll({
                where: {
                    [Op.or]: [
                        {
                            familyName: {
                                [Op.like]: '%' + keyword + '%',
                            },
                        },
                        {
                            givenName: {
                                [Op.like]: '%' + keyword + '%',
                            },
                        },
                    ],
                },
            });

            res.status(200).json({
                errCode: 0,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /user/teacher/detail
    async teacherDetail(req, res, next) {
        try {
            let id = req.query.id;

            let courses = await db.User.findAll({
                where: { id },
                include: [{ model: db.Course, as: 'authorInfo' }],
                raw: true,
                nest: true,
            });

            let totalParticipants = 0;
            let totalReviews = 0;

            let user = {
                email: courses[0]?.email,
                familyName: courses[0]?.familyName,
                givenName: courses[0]?.givenName,
                job: courses[0]?.job,
                introduction: courses[0]?.introduction,
                picture: courses[0]?.picture,
                courseList: courses?.map((course) => {
                    totalParticipants += course?.authorInfo?.numberOfParticipants;
                    totalReviews += course?.authorInfo?.numberOfReviews;
                    return {
                        id: course?.authorInfo?.id,
                        name: course?.authorInfo?.name,
                        description: course?.authorInfo?.description,
                        img: course?.authorInfo?.img,
                        level: course?.authorInfo?.level,
                        price: course?.authorInfo?.price,
                        numberOfParticipants: course?.authorInfo?.numberOfParticipants,
                        rated:
                            course?.authorInfo?.numberOfReviews === 0
                                ? 0
                                : (course?.authorInfo?.totalStars / course?.authorInfo?.numberOfReviews).toFixed(1),
                    };
                }),
            };

            user.totalParticipants = totalParticipants;
            user.totalReviews = totalReviews;

            res.status(200).json({
                errCode: 0,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
