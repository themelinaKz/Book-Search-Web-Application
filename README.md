# Book Search Web Application
A web application serving as an online library. The books collection is retrieved from the <b>[Penguin Random House API](http://www.penguinrandomhouse.biz/webservices/rest/)</b>, using the <b>JS Fetch API</b>. 

Favorites list is also available, stored in a local database, with the ability to add, remove and edit each work in this list. A <i>last-review</i> field is also available, but not mandatory and is shown only if it's not blank. The list is managed by a <b>Node.js</b> server using the <b>Express Framework</b>, and the HTML content to view the list and to edit a work is dynamically produced with <b>Express HandleBars</b>.

In both index and favoriteslist pages, a search input field appears. This field filters the works appearing in each page, searching the input's words in title and author fields. In favorites page the filter is applied while user is typing (every 500ms).

## How to run
First, the Node.js server has to run before visiting localhost:8080 in browser. 

Personally, I used the nodemon tool with the following command <br>
><code> nodemon index.js </code>

to automatically restart the server every time I made a change.
