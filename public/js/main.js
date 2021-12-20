// Client-side

window.onload = function () {
    let favorites = requestFavorites(); // called first to have the time to get response 
    let search_btn = document.getElementById("search_btn");
    if(search_btn!=null) search_btn.addEventListener("click",search);
    for(let remove of document.querySelectorAll(".removeButton")){
        remove.addEventListener("click", removeFavorite);
    }
    let favoriteSearch = document.getElementById("favoriteSearch");
    if(favoriteSearch!=null) favoriteSearch.addEventListener("input", function(){
        setTimeout(function(){searchFavorites(favorites)}, 500);
    });
}

/** Filters favorites while user is typing in search field in favorites page. */
function searchFavorites(favorites) {
    let input = document.getElementById("favoriteSearch").value.toUpperCase();

    for(let fav of favorites) {
        let row = document.getElementById("row_"+fav.id);
        let row_comments = document.getElementById("row_"+fav.id+"_com");
        if(fav.title.toUpperCase().indexOf(input) > -1 || fav.author.toUpperCase().indexOf(input) > -1) {
            row.style.display = "";
            if(row_comments!=null) row_comments.style.display = "";
        }
        else {
            row.style.display = "none";
            if(row_comments!=null) row_comments.style.display = "none";
        }
    }
}

/** Using the Fetch API, it requests from Peguin Random House API to get all relative to the user's input works */
function search() {
    // get favorite works list
    var favorites = requestFavorites();

    // create URL and header for fetch
    let input = document.getElementById("search").value;
    let url = "https://reststop.randomhouse.com/resources/works/?start=0&max=0&expandLevel=1&search="+input;
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let init = {
        method: "GET",
        headers: headers
    }

    var tbody = document.querySelector("tbody");

    // send request to AppServer and receive response
    fetch(url, init)
    .then(response => response.json())
    .then(results => {
        let rows = "";
        // add each work in a row of HTML table
        results.work.forEach(work => {
            let row = "<tr id='row_"+work.workid+"'><td>"+work.workid+"</td>";
            row += "<td>"+work.titleweb+"</td>";
            row += "<td>"+work.authorweb+"</td>";

            // decide what button to put based on whether work exists in favorites or not
            row += "<td><button type='button' value='submit' id='"+work.workid+"' class='addButton'>Προσθήκη</button>";
            if(favorites.length==0) {
                row += "<button type='button' value='submit' class='removeButton' id='"+work.workid+"' disabled>Αφαίρεση</button>";
            }
            else {
                let flag = false;
                for(let fav of favorites){
                    if(parseInt(fav.id) == parseInt(work.workid)) {
                        flag = true;
                        row += "<button type='button' value='submit' id='"+work.workid+"' class='removeButton'>Αφαίρεση</button>";
                        break;
                    }
                }
                if(!flag) row += "<button type='button' value='submit' class='removeButton' id='"+work.workid+"' disabled>Αφαίρεση</button>";
            }
            
            row += "</td></tr>";
            rows += row;
        });
        // update tbody tag's content
        tbody.innerHTML = rows;

        // add onclick listeners
        for(let button of document.querySelectorAll(".addButton")) {
            button.addEventListener("click", addFavorite);
        }
        for(let button of document.querySelectorAll(".removeButton")) {
            button.addEventListener("click", removeFavorite);
        }
    })
    .catch(error => {
        tbody.innerHTML = "<tr><td colspan='4'>Δεν βρέθηκαν αποτελέσματα</td></tr>";
    })
}


/** Sends request to AppServer to get the list of favorite works and returns it*/ 
function requestFavorites(){
    let favorites = [];
    // create URL and header for fetch
    var url = "http://localhost:8080/getFavorites"
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let init = {
        method: "GET",
        headers: headers
    }
    // send request to AppServer and receive response
    fetch(url, init)
    .then(results => results.json())
    .then(results => {
        if(results!='undefined') {
            for(let fav of results){
                favorites.push(fav);
            }
        } 
    })
    .catch(error => {
        console.log("requestFavorites gone wrong");
        console.error(error);
    })
    return favorites;
}


/** Sends request to AppServer to add a work in favorites list. Called by listener.*/
function addFavorite(event){
    // prepare parameters
    let row = document.getElementById("row_"+event.target.id);
    let params = {id: row.childNodes[0].innerHTML,
                  title: row.childNodes[1].innerHTML,
                  author: row.childNodes[2].innerHTML};

    // create URL and header for fetch
    let url = "http://localhost:8080/addFavorite";
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let init = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params)
    }
    // send request to AppServer and receive response
    fetch(url, init)
    .then(response => {
        if(response.status==201) {   
            // enable remove button         
            row.lastChild.lastChild.disabled = false;
        }else{
            alert("Το έργο υπάρχει ήδη στα αγαπημένα σας!");
        }
    })
    .catch(error => {
        console.log("addFavorites gone wrong");
        console.error(error);
    })
}

/** Sends request to AppServer to save an edited favorite work */
function saveFavorite(){
    // prepare parameters
    let id = document.querySelector("#id").value;
    let title = document.querySelector("#title").value;
    let author = document.querySelector("#author").value;
    let comments = document.querySelector("#comments").value;

    let params = {id: id,
                  title: title,
                  author: author,
                  comments: comments};

    // create URL and header for fetch
    let url = "http://localhost:8080/saveFavorite";
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let init = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params)
    }
    // send request to AppServer and receive response
    fetch(url, init)
    .then(response => {
        if(response.status==200) {
            return true;
        }else{
            alert("Υπήρξε κάποιο πρόβλημα με τον server. Παρακαλώ προσπαθήστε αργότερα.");
            return false;
        }
    })
    .catch(error => {
        console.log("saveFavorite gone wrong");
        console.error(error);
    })
    return false;
}

/** Sends request to AppServer to remove a work from favorites list. Called by two listeners.*/
function removeFavorite(event){
    // prepare parameters
    let row = document.querySelectorAll("#row_"+event.target.id+" td");
    let params = {id: row[0].innerHTML};

    // create URL and header for fetch
    let url = "http://localhost:8080/removeFavorite";
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let init = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params)
    }
    // send request to AppServer and receive response
    fetch(url, init)
    .then(response => {
        if(response.status==200) {
            // remove/disable remove button (and edit button if on favorites page) 
            row[3].querySelector(".removeButton").disabled = true;
            if(row[3].querySelector(".editButton") != null) {
                row[3].innerHTML = "ΔΙΕΓΡΑΦΗΚΕ";
            }
        }else{
            alert("Υπήρξε κάποιο πρόβλημα με τον server. Παρακαλώ προσπαθήστε αργότερα.");
            row[3].lastChild.disabled = true;
        }
    })
    .catch(error => {
        console.log("removeFavorites gone wrong");
        console.error(error);
    })
}