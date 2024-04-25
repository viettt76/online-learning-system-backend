const parseDuration = (durationString) => {
    const matches = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = matches[1] ? parseInt(matches[1], 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
    const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

    return hours * 3600 + minutes * 60 + seconds;
};

const getYoutubeId = (url) => {
    let regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
};

const base64url = (str) => {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '-').replace(/\=/g, '');
};

module.exports = {
    parseDuration,
    getYoutubeId,
    base64url,
};
