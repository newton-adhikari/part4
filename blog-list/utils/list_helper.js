const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    if(!blogs.length) return 0;
    return blogs.reduce((first, {likes}) => first + likes, 0)
}

module.exports = {dummy, totalLikes};