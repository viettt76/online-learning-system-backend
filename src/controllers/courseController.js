const db = require('../models');
const { Op } = require('sequelize');
const { checkSignature } = require('../utils/commonUtils');

class CourseController {
    // [GET] /course/all
    async getAll(req, res, next) {
        try {
            let courseList = await db.Course.findAll({
                attributes: [
                    'id',
                    'img',
                    'name',
                    'price',
                    'level',
                    'description',
                    'numberOfParticipants',
                    'numberOfReviews',
                    'totalStars',
                ],
                include: [
                    { model: db.User, attributes: ['id', 'familyName', 'givenName', 'picture'], as: 'authorInfo' },
                ],
                raw: true,
                nest: true,
            });
            courseList = courseList.map((course) => {
                course.rate =
                    course.numberOfReviews === 0 ? 0 : (course.totalStars / course.numberOfReviews).toFixed(1);
                delete course.numberOfReviews;
                delete course.totalStars;

                return course;
            });
            res.status(200).json({
                errCode: 0,
                data: courseList,
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /course/detail
    async getDetail(req, res, next) {
        try {
            const id = req.query.id;
            const courses = await db.Course.findAll({
                where: { id },
                attributes: [
                    'img',
                    'name',
                    'price',
                    'level',
                    'description',
                    'numberOfParticipants',
                    'numberOfReviews',
                    'totalStars',
                ],
                include: [
                    { model: db.User, attributes: ['familyName', 'givenName', 'picture'], as: 'authorInfo' },
                    {
                        model: db.Chapter,
                        attributes: ['id', 'chapterNumber', 'title'],
                        as: 'chapterInfo',
                        include: [{ model: db.Lesson, attributes: ['id', 'name', 'video', 'time'], as: 'lessonInfo' }],
                    },
                ],
                order: [[{ model: db.Chapter, as: 'chapterInfo' }, 'chapterNumber', 'ASC']],
                raw: true,
                nest: true,
            });

            let chapterList = [];
            let numberOfLessons = 0;
            let time = 0;

            courses
                .map((course) => ({ ...course?.chapterInfo }))
                .forEach((chapter) => {
                    time += chapter?.lessonInfo?.time;
                    const chapterExisting = chapterList.find((i) => i?.chapterId === chapter?.id);
                    if (chapterExisting) {
                        if (chapter.lessonInfo.id !== null) {
                            numberOfLessons++;
                            chapterExisting.numberOfLessons++;
                            chapterExisting.lessonList.push(chapter.lessonInfo);
                        }
                    } else if (chapter?.id) {
                        let obj = {
                            chapterId: chapter?.id,
                            chapterNumber: chapter?.chapterNumber,
                            title: chapter?.title,
                        };
                        if (chapter?.lessonInfo?.id === null) {
                            obj.numberOfLessons = 0;
                            obj.lessonList = [];
                        } else {
                            numberOfLessons++;
                            obj.numberOfLessons = 1;
                            obj.lessonList = [chapter?.lessonInfo];
                        }
                        chapterList.push(obj);
                    }
                });

            const course = {
                name: courses[0]?.name,
                img: courses[0]?.img,
                author: courses[0]?.authorInfo,
                description: courses[0]?.description,
                level: courses[0]?.level,
                price: courses[0]?.price,
                numberOfReviews: courses[0]?.numberOfReviews,
                rate:
                    courses[0]?.numberOfReviews === 0
                        ? 0
                        : (courses[0]?.totalStars / courses[0]?.numberOfReviews).toFixed(1),
                numberOfParticipants: courses[0]?.numberOfParticipants,
                numberOfLessons,
                time,
                chapterList,
            };

            res.status(200).json({
                errCode: 0,
                data: course,
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /course/post
    async post(req, res, next) {
        try {
            const courseInfo = req.body;
            if (Number(courseInfo?.price) === NaN) {
                return res.status(404).json({
                    errCode: 2,
                    message: 'Price must be a number',
                });
            }
            await db.Course.create({
                img: courseInfo?.img,
                name: courseInfo?.name,
                description: courseInfo?.description,
                authorId: courseInfo?.authorId,
                price: courseInfo?.price,
                level: courseInfo?.level,
            });
            res.status(200).json({
                errCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /course/teaching
    async teaching(req, res, next) {
        try {
            const id = req.query.id;
            const courseList = await db.Course.findAll({
                where: { authorId: id },
            });
            res.status(200).json({
                errCode: 0,
                data: courseList,
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /course/search
    async search(req, res, next) {
        try {
            const keyword = req.query.keyword;

            const courseList = await db.Course.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: '%' + keyword + '%',
                            },
                        },
                        {
                            description: {
                                [Op.like]: '%' + keyword + '%',
                            },
                        },
                    ],
                },
                include: [{ model: db.User, attributes: ['familyName', 'givenName'], as: 'authorInfo' }],
                raw: true,
                nest: true,
            });

            res.status(200).json({
                errCode: 0,
                data: courseList,
            });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /course/update-info
    async updateInfo(req, res, next) {
        try {
            const data = req.body;

            let course = await db.Course.findOne({
                where: { id: data?.id },
                raw: false,
            });

            course.img = data?.img;
            course.name = data?.name;
            course.description = data?.description;
            course.authorId = data?.authorId;
            course.price = data?.price;
            course.level = data?.level;

            await course.save();

            res.status(200).json({
                errCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /course/favorite
    async favorite(req, res, next) {
        try {
            const tokenData = req.cookies.token;
            if (tokenData) {
                const check = checkSignature(tokenData);
                if (check.valid) {
                    const favoriteCourseList = await db.Liked_Course.findAll({
                        where: {
                            userId: check?.payload?.id,
                        },
                        attributes: ['courseId'],
                        include: [{ model: db.Course, attributes: ['img', 'name', 'price'], as: 'likedCourseInfo' }],
                        raw: true,
                        nest: true,
                        order: [['updatedAt', 'DESC']],
                    });
                    return res.json({
                        errCode: 0,
                        data: favoriteCourseList,
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    }

    // [POST] /course/favorite/add
    async addFavorite(req, res, next) {
        try {
            const courseId = req.body.courseId;
            const tokenData = req.cookies.token;
            if (tokenData) {
                const check = checkSignature(tokenData);
                if (check.valid && courseId) {
                    const [likedCourse, created] = await db.Liked_Course.findOrCreate({
                        where: { userId: check?.payload?.id, courseId },
                        defaults: {
                            userId: check?.payload?.id,
                            courseId,
                        },
                    });
                    if (created) {
                        res.status(200).json({
                            errCode: 0,
                        });
                    } else {
                        res.status(200).json({
                            errCode: 1,
                        });
                    }
                }
            }
        } catch (error) {
            next(error);
        }
    }

    // [GET] /course/cart
    async cart(req, res, next) {
        try {
            const tokenData = req.cookies.token;
            if (tokenData) {
                const check = checkSignature(tokenData);
                if (check.valid) {
                    const courseCartList = await db.Courses_Cart.findAll({
                        where: {
                            userId: check?.payload?.id,
                        },
                        attributes: ['courseId'],
                        include: [{ model: db.Course, attributes: ['img', 'name', 'price'], as: 'courseCartInfo' }],
                        raw: true,
                        nest: true,
                        order: [['updatedAt', 'DESC']],
                    });
                    return res.json({
                        errCode: 0,
                        data: courseCartList,
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    }

    // [POST] /course/cart/add
    async addCart(req, res, next) {
        try {
            const courseId = req.body.courseId;
            const tokenData = req.cookies.token;
            if (tokenData) {
                const check = checkSignature(tokenData);
                if (check.valid && courseId) {
                    const [courseCart, created] = await db.Courses_Cart.findOrCreate({
                        where: { userId: check?.payload?.id, courseId },
                        defaults: {
                            userId: check?.payload?.id,
                            courseId,
                        },
                    });
                    if (created) {
                        res.status(200).json({
                            errCode: 0,
                        });
                    } else {
                        res.status(200).json({
                            errCode: 1,
                        });
                    }
                }
            }
        } catch (error) {
            next(error);
        }
    }

    // [GET] /course/purchased
    async purchased(req, res, next) {
        try {
            const tokenData = req.cookies.token;
            if (tokenData) {
                const check = checkSignature(tokenData);
                if (check.valid) {
                    const courseCartList = await db.Purchased_Course.findAll({
                        where: {
                            userId: check?.payload?.id,
                        },
                        attributes: ['courseId'],
                        include: [
                            { model: db.Course, attributes: ['img', 'name', 'price'], as: 'purchasedCourseInfo' },
                        ],
                        raw: true,
                        nest: true,
                        order: [['updatedAt', 'DESC']],
                    });
                    return res.json({
                        errCode: 0,
                        data: courseCartList,
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    }

    // [POST] /course/purchased/add
    async addPurchased(req, res, next) {
        try {
            const courseId = req.body.courseId;
            const tokenData = req.cookies.token;
            if (tokenData) {
                const check = checkSignature(tokenData);
                if (check.valid && courseId) {
                    const [purchasedCourse, created] = await db.Purchased_Course.findOrCreate({
                        where: { userId: check?.payload?.id, courseId },
                        defaults: {
                            userId: check?.payload?.id,
                            courseId,
                        },
                    });
                    if (created) {
                        res.status(200).json({
                            errCode: 0,
                        });
                    } else {
                        res.status(200).json({
                            errCode: 1,
                        });
                    }
                }
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CourseController();
