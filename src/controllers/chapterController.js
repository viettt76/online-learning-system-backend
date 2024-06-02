const db = require('../models');

class ChapterController {
    // [POST] /chapter/post
    async post(req, res, next) {
        try {
            const data = req.body;
            const chapter = await db.Chapter.create({
                courseId: data?.courseId,
                chapterNumber: data?.chapterNumber,
                title: data?.title,
            });
            res.status(200).json({
                errCode: 0,
                data: {
                    chapterId: chapter.id,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ChapterController();
