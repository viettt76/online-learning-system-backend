const crypto = require('crypto');
const jwtSecret = require('../utils/jwtSecret');
const { base64url, checkSignature } = require('../utils/commonUtils');
const { AppDataSource } = require('../data-source');
const { User } = require('../entity/User');
const { ILike } = require('typeorm');

class UserController {
    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    // [POST] /user/login
    async login(req, res, next) {
        let dataLogin = req.body;
        const user = await this.userRepository.findOne({
            where: { email: dataLogin.email },
        });
        if (!user) {
            await this.userRepository.save({
                email: dataLogin.email,
                familyName: dataLogin.familyName,
                givenName: dataLogin.givenName,
                picture: dataLogin.picture,
            });
        }

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

        return {
            // cookie: `token=${encodedHeader}.${encodedPayload}.${signature}; httpOnly; path=/; max-age=${
            //     365 * 24 * 60 * 60
            // }`,
            cookies: {
                token: {
                    value: `${encodedHeader}.${encodedPayload}.${signature}`,
                    options: {
                        httpOnly: true,
                        path: '/',
                        maxAge: 365 * 24 * 60 * 60,
                        sameSite: 'None',
                        secure: true,
                    },
                },
            },
            errCode: 0,
        };
    }

    // [POST] /user/logout
    logout(req, res, next) {
        // res.clearCookie('token').status(200).json();
        return {
            clearCookies: ['token'],
        };
    }

    async verifyToken(req, res, next) {
        const tokenData = req.cookies.token;
        if (tokenData) {
            const check = checkSignature(tokenData);

            if (check.valid) {
                const user = await this.userRepository.findOne({
                    where: {
                        id: check?.payload?.id,
                    },
                });
                if (user) {
                    return {
                        errCode: 0,
                    };
                }
                throw {
                    status: 404,
                    errCode: 2,
                };
            }
            throw {
                status: 401,
                errCode: 3,
            };
        }
        throw {
            status: 401,
            errCode: 4,
        };
    }

    // [GET] /user/personal-info
    async personalInfo(req, res, next) {
        const tokenData = req.cookies.token;
        if (tokenData) {
            const check = checkSignature(tokenData);

            if (check.valid) {
                const user = await this.userRepository.findOne({
                    where: {
                        id: check?.payload?.id,
                    },
                    select: {
                        id: true,
                        email: true,
                        familyName: true,
                        givenName: true,
                        introduction: true,
                        job: true,
                        picture: true,
                        isTeacher: true,
                    },
                });
                if (user) {
                    return {
                        errCode: 0,
                        data: user,
                    };
                }
                throw {
                    status: 404,
                    errCode: 2,
                };
            }
            throw {
                status: 401,
                errCode: 3,
            };
        }
        throw {
            status: 401,
            errCode: 4,
        };
    }

    // [PATCH] /user/is_teacher
    async isTeacher(req, res, next) {
        const { id, job, introduction } = req.body;
        let user = await this.userRepository.findOne({ where: { id } });
        if (user) {
            user.job = job;
            user.introduction = introduction;
            user.isTeacher = true;
            await this.userRepository.save(user);
            return {
                errCode: 0,
            };
        }
        throw {
            status: 404,
            errCode: 2,
        };
    }

    // [GET] /user/teacher/search
    async searchTeacher(req, res, next) {
        const keyword = req.query.keyword;

        const teacherList = await this.userRepository.find({
            where: [
                {
                    familyName: ILike('%' + keyword + '%'),
                    isTeacher: true,
                },
                {
                    givenName: ILike('%' + keyword + '%'),
                    isTeacher: true,
                },
            ],
        });

        return {
            errCode: 0,
            data: teacherList,
        };
    }

    // [GET] /user/teacher/detail
    async teacherDetail(req, res, next) {
        const id = req.query.id;

        let teacher = await this.userRepository.findOne({
            where: { id },
            relations: {
                courseList: true,
            },
            select: {
                courseList: {
                    id: true,
                    img: true,
                    name: true,
                    description: true,
                    price: true,
                    level: true,
                    numberOfParticipants: true,
                    numberOfReviews: true,
                    totalStars: true,
                },
            },
        });

        let totalParticipants = 0;
        let totalReviews = 0;

        teacher?.courseList.forEach((course) => {
            totalParticipants += course?.numberOfParticipants;
            totalReviews += course?.numberOfReviews;
            course.rated = course.numberOfReviews === 0 ? 0 : (course.totalStars / course.numberOfReviews).toFixed(1);
        });

        teacher.totalParticipants = totalParticipants;
        teacher.totalReviews = totalReviews;

        return {
            errCode: 0,
            data: teacher,
        };
    }
}

module.exports = new UserController();
