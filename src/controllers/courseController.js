import db from '../models';

class CourseController {
    // [GET] /course/all
    async getAll(req, res, next) {
        try {
            let courseList = await db.Course.findAll({
                attributes: ['id', 'img', 'name', 'price', 'level', 'description'],
                include: [{ model: db.User, as: 'authorInfo' }],
                raw: false,
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

    // [GET] /course/detail
    async getDetail(req, res, next) {
        try {
            let id = req.query.id;
            let course = await db.Course.findOne({
                where: { id },
                attributes: ['img', 'name', 'price', 'level', 'description'],
                include: [{ model: db.User, attributes: ['familyName', 'givenName', 'picture'], as: 'authorInfo' }],
                raw: false,
                nest: true,
            });
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
            let courseInfo = req.body;
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
            let id = req.query.id;
            let courseList = await db.Course.findAll({
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
}

module.exports = new CourseController();
