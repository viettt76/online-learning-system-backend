const db = require('../models');
const { getYoutubeId, parseDuration } = require('../utils/commonUtils');

class LessonController {
    // [POST] /lesson/post
    async post(req, res, next) {
        try {
            const data = req.body;
            const apiKey = process.env.API_KEY_YOUTUBE;
            const videoId = getYoutubeId(data?.video);

            const time = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`,
            )
                .then((res) => res.json())
                .then((res) => {
                    return parseDuration(res?.items[0]?.contentDetails?.duration);
                });

            await db.Lesson.create({
                chapterId: data?.chapterId,
                lessonNumber: data?.lessonNumber,
                name: data?.name,
                video: data?.video,
                time,
            });

            res.status(200).json({
                errCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /lesson/video
    async video(req, res, next) {
        try {
            const id = req.query.id;

            const lesson = await db.Lesson.findOne({
                where: { id },
                attributes: ['lessonNumber', 'name', 'video'],
            });

            res.status(200).json({
                errCode: 0,
                data: lesson,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LessonController();
