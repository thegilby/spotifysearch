//Perform a search when the "Search" button is clicked
$('#search').live('click', function(e) {
	e.preventDefault(); //cancel default behavior
	
	var searchType = "";
	var searchText = $("#searchText").val();
	
	//Check which radio button was checked
    if ($("input[name='searchType']:checked").val() == 'Artist') //Artist
		searchType = "artist";
    else if ($("input[name='searchType']:checked").val() == 'Album') //Album
        searchType = "album";
    else //Track
        searchType = "track";

	//If search is blank, don't do anything
	if (searchText == "")
		return false;
	else //search Spotify library
		$('#content').empty();
		searchSpotify(searchText, searchType);
});

/* Open new Chrome tab when search result link is clicked */
$('.result').live('click', function(){
	var tabUrl = $('.result').attr("href");
	chrome.tabs.create({
		url: tabUrl
	});
});

/* 	searchSpotify(query, type)
	1. Get JSON response from Spotify API using the "query" entered
	and the "type" (artist, album , or track) selected
	2. If there's content, append a list of results with links to the content
*/
function searchSpotify(query,type){
	//Query Spotify API
	$.getJSON('http://ws.spotify.com/search/1/'+type+'.json?q='+query, function(data) {
		var types = type + 's' //Plural version of "type" (JSON response uses artists, albums, tracks at the top level)
		
		//If no match is found, prompt the user to try again
		if (data[types].length == 0)
			$('#content').append('<p>No '+types+' matched your search for: <strong>'+ query +'</strong> in the Spotify library.</p>');
		else { //get all entries in JSON of specified search type "type" and create a list of results
		 	var results = "<ul id='searchResults'>";
			$.each(data[types],function(i){
				var spotifyUrl = createUrl(this.href, type);
				results += ('<li><a class="result" href="'+spotifyUrl+'">'+this.name+'</a></li>');
			});
			results += "</ul>";
			$('#content').append(results);
			$('#searchResults li:nth-child(odd)').addClass('alternate'); //add a class to odd rows for styling
		}
	});
}

/*	createUrl(url, type)
	given a Spotify URI -- spotify:[type]:[id] and search type
	return a formatted URI that can be viewed in a browser -- http://open.spotify.com/[type]/[id]
*/
function createUrl(url, type){
	var newUrl = ""
	newUrl = url.substr(url.lastIndexOf(':')+1, url.length-url.lastIndexOf(':')+1);
	newUrl = "http://open.spotify.com/" + type + '/' + newUrl;
	return newUrl
}