const jwtSecret = require('../utils/jwtSecret');
const crypto = require('crypto');

const parseDuration = (durationString) => {
    const matches = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = matches[1] ? parseInt(matches[1], 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
    const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

    return hours * 3600 + minutes * 60 + seconds;
};

const getYoutubeId = (url) => {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
};

const base64url = (str) => {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '-').replace(/\=/g, '');
};

const checkSignature = (tokenData) => {
    const [encodedHeader, encodedPayload, signatureData] = tokenData.split('.');
    const payload = JSON.parse(atob(encodedPayload));
    const signature = crypto
        .createHmac('sha256', jwtSecret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');

    return {
        valid: signature === signatureData,
        payload,
    };
};

module.exports = {
    parseDuration,
    getYoutubeId,
    base64url,
    checkSignature,
};
