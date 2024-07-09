var EntitySchema = require('typeorm').EntitySchema;

const LikedCourse = new EntitySchema({
    name: 'LikedCourse',
    tableName: 'liked_courses',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        userId: {
            type: 'uuid',
        },
        courseId: {
            type: 'uuid',
        },
        createdAt: {
            type: 'datetime',
        },
        updatedAt: {
            type: 'datetime',
        },
    },
    relations: {
        likedCourseInfo: {
            target: 'Course',
            type: 'one-to-one',
            joinColumn: {
                name: 'courseId',
                referenceColumnName: 'id',
            },
        },
    },
});

module.exports = { LikedCourse };
