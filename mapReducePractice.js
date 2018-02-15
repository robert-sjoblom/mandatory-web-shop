const movies = [
    { name: "Serenity", rating: 7.9, price: 120, genre: ["scifi"], home: false, minAge: 15 },
    { name: "Terminator 2", rating: 8.5, price: 140, genre: ["scifi"], home: true, minAge: 18 },
    { name: "The room", rating: 3.6, price: 15, genre: ["drama"], home: true, minAge: 35 },
    { name: "Ghost dog", rating: 7.5, price: 95, genre: ["action","drama"], home: false, minAge: 13 },
    { name: "Inception", rating: 8.8, price: 220, genre: ["action","scifi"], home: true, minAge: 15 }
];

const prices = movies.map(x => x.price); /*?*/
    
const movieNames = movies.map(x => x.name); /*?*/

const availableMovies = movies.filter(x => x.home === true); /*?*/

const pg15 = movies.filter(x => x.minAge <= 15); /*?*/

const goodMovies = movies;

const totalPrice = movies.reduce(function(acc, cur) {return acc + cur.price; }, 0); /*?*/

const totalPrice2 = movies.reduce((acc, cur) => acc + cur.price, 0 ); /*?*/

const scifiMovies = movies.filter(x => x.genre.indexOf("scifi") > -1); /*?*/

const averageRating = movies.reduce((acc, cur) => acc + cur.rating, 0)/movies.length; /*?*/

const averageSciFiRating = movies.filter(x => x.genre.indexOf("scifi") > -1).reduce((acc, cur, n, list) => acc + cur.rating/list.length, 0); /*?*/

const genres = movies.reduce((acc, cur) => acc.concat(cur.genre), []).filter((item, pos, list) => {
    return list.indexOf(item) === pos;
}); /*?*/