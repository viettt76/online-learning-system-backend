const { AppDataSource } = require('../data-source');
const { Chapter } = require('../entity/Chapter');

class ChapterController {
    constructor() {
        this.chapterRepository = AppDataSource.getRepository(Chapter);
    }

    // [POST] /chapter/post
    async post(req, res, next) {
        try {
            const data = req.body;
            const chapter = await this.chapterRepository.save({
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
