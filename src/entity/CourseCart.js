var EntitySchema = require('typeorm').EntitySchema;

const CourseCart = new EntitySchema({
    name: 'CourseCart',
    tableName: 'courses_carts',
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
        courseCartInfo: {
            target: 'Course',
            type: 'one-to-one',
            joinColumn: {
                name: 'courseId',
                referenceColumnName: 'id',
            },
        },
    },
});
module.exports = { CourseCart };
