var EntitySchema = require('typeorm').EntitySchema;

const PurchasedCourse = new EntitySchema({
    name: 'PurchasedCourse',
    tableName: 'purchased_courses',
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
        purchasedCourseInfo: {
            target: 'Course',
            type: 'one-to-one',
            joinColumn: {
                name: 'courseId',
                referenceColumnName: 'id',
            },
        },
    },
});

module.exports = { PurchasedCourse };
