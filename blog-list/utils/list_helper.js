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

const mostBlogs = (blogs) => {
    if(!blogs.length) return null;
    const authors = blogs.map(b => {return {author: b.author, blogs: 0}});
    authors.forEach(a => {
        authors.forEach(auth => {
            if(auth.author === a.author) a.blogs += 1;
        })
    })
    const max = Math.max(...authors.map(a => a.blogs));
    return authors.find(a => a.blogs === max);
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs};