var EntitySchema = require('typeorm').EntitySchema;

const RatedCourse = new EntitySchema({
    name: 'RatedCourse',
    tableName: 'rated_courses',
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
        star: {
            type: 'tinyint',
        },
        createdAt: {
            type: 'datetime',
        },
        updatedAt: {
            type: 'datetime',
        },
    },
});

module.exports = { RatedCourse };
