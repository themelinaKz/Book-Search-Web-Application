// DAO module

var favorites = [];

/** Represents a work from Penguin Random House API */
class Work{
    constructor(id, title, author){
        this.id = id;
        this.title = title;
        this.author = author;
    }
    set setComments(comments) {
        this.comments = comments;
    }
}

/** Returns favorites list (list of Work objects) */
function getFavorites() {
    console.log("DAO: REQUEST FOR FAVORITES LIST");
    return favorites;
}

/** Returns favorite work by id (null if not found) */
function getFavorite(id) {
    let index = searchFavorite(id);
    if(index==-1) return null;
    console.log("DAO: REQUEST TO GET SPECIFIC FAVORITE WORK");
    return favorites[index];
}

/** Returns true if item was successfully removed from favorites list */
function removeFavorite(id){
    console.log("DAO: REQUEST TO REMOVE A FAVORITE WORK");
    let index = searchFavorite(id);
    if(index==-1) return false;
    favorites.splice(index,1);
    return true;
}

/** Returns true if item was successfully added to favorites list */
function addFavorite(id, title, author) {
    console.log("DAO: REQUEST TO ADD A FAVORITE WORK");
    let index = searchFavorite(id);
    if(index!=-1) return false;
    favorites.push(new Work(id, title, author));
    return true;
}

/** Updates title and author of work based on user's input */
function updateFavorite(id, title, author, comments) {
    console.log("DAO: UPDATE EDITED FAVORITE WORK");
    let index = searchFavorite(id);
    if(index==-1) return false;
    let fav = favorites[index];
    fav.title = title;
    fav.author = author;
    fav.comments = comments;
    return true;
}

/** Searches item by id in favorites list and returns its index 
 *  Returns -1 if item doesn't exists in list */
function searchFavorite(id) {
    console.log("DAO: SEARCHING FAVORITES LIST");
    if(favorites == []) return -1;
    for(let i=0; i<favorites.length; i++) {
        if(favorites[i].id==id) return i;
    }
    return -1;
}

module.exports = {
    getFavorites: getFavorites,
    addFavorite: addFavorite, 
    removeFavorite: removeFavorite,
    getFavorite: getFavorite,
    updateFavorite: updateFavorite,
    Work: Work
}
