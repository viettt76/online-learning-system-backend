const { AppDataSource } = require('../data-source');
const { getYoutubeId, parseDuration } = require('../utils/commonUtils');
const { Lesson } = require('../entity/Lesson');

class LessonController {
    constructor() {
        this.lessonRepository = AppDataSource.getRepository(Lesson);
    }

    // [POST] /lesson/post
    async post(req, res, next) {
        const data = req.body;
        console.log(data);
        const apiKey = process.env.API_KEY_YOUTUBE;
        const videoId = getYoutubeId(data?.video);

        const time = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`,
        )
            .then((res) => res.json())
            .then((res) => {
                return parseDuration(res?.items[0]?.contentDetails?.duration);
            });

        await this.lessonRepository.save({
            chapterId: data?.chapterId,
            lessonNumber: data?.lessonNumber,
            name: data?.name,
            video: data?.video,
            time,
        });

        return {
            errCode: 0,
        };
    }

    // [GET] /lesson/video
    async video(req, res, next) {
        const id = req.query.id;

        const lesson = await this.lessonRepository.findOne({
            where: { id },
            select: {
                lessonNumber: true,
                name: true,
                video: true,
            },
        });

        return {
            errCode: 0,
            data: lesson,
        };
    }
}

module.exports = new LessonController();
