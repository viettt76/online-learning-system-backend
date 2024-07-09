var EntitySchema = require('typeorm').EntitySchema;

const Lesson = new EntitySchema({
    name: 'Lesson',
    tableName: 'lessons',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        chapterId: {
            type: 'uuid',
        },
        lessonNumber: {
            type: 'smallint',
        },
        name: {
            type: 'varchar',
        },
        video: {
            type: 'text',
        },
        time: {
            type: 'int',
        },
        createdAt: {
            type: 'datetime',
        },
        updatedAt: {
            type: 'datetime',
        },
    },
    relations: {
        lessonInfo: {
            target: 'Chapter',
            type: 'many-to-one',
            joinColumn: {
                name: 'chapterId',
                referenceColumnName: 'id',
            },
        },
    },
});
module.exports = { Lesson };
