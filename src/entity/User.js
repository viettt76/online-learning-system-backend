var EntitySchema = require('typeorm').EntitySchema;

const User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        email: {
            type: 'varchar',
        },
        introduction: {
            type: 'text',
        },
        job: {
            type: 'varchar',
        },
        familyName: {
            type: 'varchar',
        },
        givenName: {
            type: 'varchar',
        },
        picture: {
            type: 'longblob',
        },
        isTeacher: {
            type: 'boolean',
        },
        createdAt: {
            type: 'datetime',
        },
        updatedAt: {
            type: 'datetime',
        },
    },
    relations: {
        courseList: {
            target: 'Course',
            type: 'one-to-many',
            inverseSide: 'authorInfo',
        },
        likedCourse: {
            target: 'LikedCourse',
            type: 'one-to-many',
        },
    },
});

module.exports = { User };
