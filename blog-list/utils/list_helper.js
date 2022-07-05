const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    if(!blogs.length) return 0;
    return blogs.reduce((first, {likes}) => first + likes, 0)
}

const favoriteBlog = (blogs) => {
    if(!blogs.length) return null;
    const maxLikes = blogs.reduce((max, {likes}) => likes > max ? likes : max, 0);
    console.log(maxLikes);
    return blogs.find(({likes}) => likes === maxLikes);
}

module.exports = {dummy, totalLikes, favoriteBlog};