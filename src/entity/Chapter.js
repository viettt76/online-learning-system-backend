var EntitySchema = require('typeorm').EntitySchema;

const Chapter = new EntitySchema({
    name: 'Chapter',
    tableName: 'chapters',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        courseId: {
            type: 'uuid',
        },
        chapterNumber: {
            type: 'smallint',
        },
        title: {
            type: 'varchar',
        },
        createdAt: {
            type: 'datetime',
        },
        updatedAt: {
            type: 'datetime',
        },
    },
    relations: {
        course: {
            target: 'Course',
            type: 'many-to-one',
            joinColumn: {
                name: 'courseId',
                referenceColumnName: 'id',
            },
        },
        lessonList: {
            target: 'Lesson',
            type: 'one-to-many',
            inverseSide: 'lessonInfo',
        },
    },
});

module.exports = { Chapter };
