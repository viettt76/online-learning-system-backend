var EntitySchema = require('typeorm').EntitySchema;

const LessonBeingViewed = new EntitySchema({
    name: 'LessonBeingViewed',
    tableName: 'lesson_being_viewed',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        userId: {
            type: 'uuid',
        },
        lessonId: {
            type: 'uuid',
        },
        timeStamp: {
            type: 'time',
        },
        createdAt: {
            type: 'datetime',
        },
        updatedAt: {
            type: 'datetime',
        },
    },
});

module.exports = { LessonBeingViewed };
