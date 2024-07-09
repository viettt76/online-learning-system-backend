const { ILike } = require('typeorm');
const { AppDataSource } = require('../data-source');
const { Course } = require('../entity/Course');
const { LikedCourse } = require('../entity/LikedCourse');
const { CourseCart } = require('../entity/CourseCart');
const { PurchasedCourse } = require('../entity/PurchasedCourse');

const { checkSignature } = require('../utils/commonUtils');

class CourseController {
    constructor() {
        this.courseRepository = AppDataSource.getRepository(Course);
        this.likedCourseRepository = AppDataSource.getRepository(LikedCourse);
        this.courseCartRepository = AppDataSource.getRepository(CourseCart);
        this.purchasedCourseRepository = AppDataSource.getRepository(PurchasedCourse);
    }

    // [GET] /course/all
    async getAll(req, res, next) {
        let courseList = await this.courseRepository.find({
            relations: {
                authorInfo: true,
                chapterList: {
                    lessonList: true,
                },
            },
            select: {
                id: true,
                img: true,
                name: true,
                price: true,
                level: true,
                description: true,
                numberOfParticipants: true,
                numberOfReviews: true,
                totalStars: true,
                authorInfo: {
                    id: true,
                    familyName: true,
                    givenName: true,
                    picture: true,
                },
                chapterList: {
                    id: true,
                    lessonList: {
                        time: true,
                    },
                },
            },
        });

        courseList = courseList?.map((course) => {
            let time = 0;
            course.rate = course.numberOfReviews === 0 ? 0 : (course.totalStars / course.numberOfReviews).toFixed(1);
            delete course.numberOfReviews;
            delete course.totalStars;

            course?.chapterList?.map((chapter) =>
                chapter?.lessonList?.map((lesson) => {
                    time += lesson?.time;
                }),
            );

            course.time = time;
            delete course?.chapterList;

            return course;
        });

        return {
            errCode: 0,
            data: courseList,
        };
    }

    // [GET] /course/detail
    async getDetail(req, res, next) {
        const id = req.query.id;
        const courses = await this.courseRepository.find({
            where: { id },
            relations: {
                authorInfo: true,
                chapterList: {
                    lessonList: true,
                },
            },
            select: {
                img: true,
                name: true,
                price: true,
                level: true,
                description: true,
                numberOfParticipants: true,
                numberOfReviews: true,
                totalStars: true,
                authorInfo: {
                    familyName: true,
                    givenName: true,
                    picture: true,
                },
                chapterList: {
                    id: true,
                    chapterNumber: true,
                    title: true,
                    lessonList: {
                        id: true,
                        lessonNumber: true,
                        name: true,
                        video: true,
                        time: true,
                    },
                },
            },
            order: {
                chapterList: {
                    chapterNumber: 'ASC',
                },
            },
        });

        let totalNumberOfLessons = 0;
        let time = 0;

        courses.forEach((course) =>
            course?.chapterList?.forEach((chapter) => {
                chapter.numberOfLessons = chapter?.lessonList?.length;
                chapter?.lessonList?.forEach((lesson) => {
                    time += lesson?.time;
                    totalNumberOfLessons++;
                });
            }),
        );

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
            numberOfLessons: totalNumberOfLessons,
            time,
            chapterList: courses[0]?.chapterList,
        };

        return {
            errCode: 0,
            data: course,
        };
    }

    // [POST] /course/post
    async post(req, res, next) {
        const courseInfo = req.body;
        if (Number(courseInfo?.price) === NaN) {
            throw {
                status: 404,
                message: 'Price must be a number',
            };
        }
        await this.courseRepository.save({
            img: courseInfo?.img,
            name: courseInfo?.name,
            description: courseInfo?.description,
            authorId: courseInfo?.authorId,
            price: courseInfo?.price,
            level: courseInfo?.level,
        });
        return {
            errCode: 0,
        };
    }

    // [GET] /course/teaching
    async teaching(req, res, next) {
        const id = req.query.id;
        const courseList = await this.courseRepository.find({
            where: { authorId: id },
        });
        return {
            errCode: 0,
            data: courseList,
        };
    }

    // [GET] /course/search
    async search(req, res, next) {
        const keyword = req.query.keyword;

        const courseList = await this.courseRepository.find({
            where: {
                name: ILike('%' + keyword + '%'),
            },
            relations: {
                authorInfo: true,
            },
            select: {
                authorInfo: {
                    familyName: true,
                    givenName: true,
                },
            },
        });

        return {
            errCode: 0,
            data: courseList,
        };
    }

    // [PUT] /course/update-info
    async updateInfo(req, res, next) {
        const data = req.body;

        let course = await this.courseRepository.findOne({
            where: { id: data?.id },
        });

        course.img = data?.img;
        course.name = data?.name;
        course.description = data?.description;
        course.authorId = data?.authorId;
        course.price = data?.price;
        course.level = data?.level;

        await this.courseRepository.save(course);

        return {
            errCode: 0,
        };
    }

    // [GET] /course/favorite
    async favorite(req, res, next) {
        const tokenData = req.cookies.token;
        if (tokenData) {
            const check = checkSignature(tokenData);
            if (check.valid) {
                const favoriteCourseList = await this.likedCourseRepository.find({
                    where: {
                        userId: check?.payload?.id,
                    },
                    relations: {
                        likedCourseInfo: true,
                    },
                    select: {
                        courseId: true,
                        likedCourseInfo: {
                            img: true,
                            name: true,
                            price: true,
                        },
                    },
                    order: {
                        updatedAt: 'DESC',
                    },
                });
                return {
                    errCode: 0,
                    data: favoriteCourseList,
                };
            }
        }
    }

    // [POST] /course/favorite/add
    async addFavorite(req, res, next) {
        const courseId = req.body.courseId;
        const tokenData = req.cookies.token;
        if (tokenData) {
            const check = checkSignature(tokenData);
            if (check.valid && courseId) {
                const likedCourse = await this.likedCourseRepository.findOne({
                    where: { userId: check?.payload?.id, courseId },
                });
                if (!likedCourse) {
                    await this.likedCourseRepository.save({
                        userId: check?.payload?.id,
                        courseId,
                    });
                    return {
                        errCode: 0,
                    };
                }
                throw {
                    status: 409,
                    errCode: 1,
                    message: 'This course has been previously added to favorites',
                };
            }
        }
    }

    // [GET] /course/cart
    async cart(req, res, next) {
        const tokenData = req.cookies.token;
        if (tokenData) {
            const check = checkSignature(tokenData);
            if (check.valid) {
                const courseCartList = await this.courseCartRepository.find({
                    where: {
                        userId: check?.payload?.id,
                    },
                    relations: {
                        courseCartInfo: true,
                    },
                    select: {
                        courseId: true,
                        courseCartInfo: {
                            img: true,
                            name: true,
                            price: true,
                        },
                    },
                    order: {
                        updatedAt: 'DESC',
                    },
                });
                return {
                    errCode: 0,
                    data: courseCartList,
                };
            }
        }
    }

    // [POST] /course/cart/add
    async addCart(req, res, next) {
        const courseId = req.body.courseId;
        const tokenData = req.cookies.token;
        if (tokenData) {
            const check = checkSignature(tokenData);
            if (check.valid && courseId) {
                const courseCart = await this.courseCartRepository.findOne({
                    where: { userId: check?.payload?.id, courseId },
                    defaults: {
                        userId: check?.payload?.id,
                        courseId,
                    },
                });
                if (!courseCart) {
                    await this.courseCartRepository.save({
                        userId: check?.payload?.id,
                        courseId,
                    });
                    return {
                        errCode: 0,
                    };
                }
                throw {
                    status: 409,
                    errCode: 1,
                    message: 'This course has been added to your cart',
                };
            }
        }
    }

    // [GET] /course/purchased
    async purchased(req, res, next) {
        const tokenData = req.cookies.token;
        if (tokenData) {
            const check = checkSignature(tokenData);
            if (check.valid) {
                const courseCartList = await this.purchasedCourseRepository.find({
                    where: {
                        userId: check?.payload?.id,
                    },
                    relations: {
                        purchasedCourseInfo: true,
                    },
                    select: {
                        courseId: true,
                        purchasedCourseInfo: {
                            img: true,
                            name: true,
                            price: true,
                        },
                    },

                    order: {
                        updatedAt: 'DESC',
                    },
                });
                return {
                    errCode: 0,
                    data: courseCartList,
                };
            }
        }
    }

    // [POST] /course/purchased/add
    async addPurchased(req, res, next) {
        const courseId = req.body.courseId;
        const tokenData = req.cookies.token;
        if (tokenData) {
            const check = checkSignature(tokenData);
            if (check.valid && courseId) {
                const purchasedCourse = await this.purchasedCourseRepository.find({
                    where: { userId: check?.payload?.id, courseId },
                });
                if (!purchasedCourse) {
                    await this.purchasedCourseRepository.save({
                        userId: check?.payload?.id,
                        courseId,
                    });
                    return {
                        errCode: 0,
                    };
                }
                throw {
                    status: 409,
                    errCode: 1,
                    message: 'You have already purchased this course',
                };
            }
        }
    }
}

module.exports = new CourseController();
