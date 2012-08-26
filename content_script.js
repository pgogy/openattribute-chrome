triplesHtml = "";

var n = document;
var rootNode = n;
var triple_store = new Array();
var license_found = false;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	
	chrome.extension.sendMessage({wanting:"url_please", data_url:document.location.href});
	
});  

function add_triple(data_triple){
		
	if (triple_store.length == 0) {
	
		triple_store.push(data_triple);
		if(data_triple[1]=="license"){
				
			license_found = true;
			chrome.extension.sendMessage({license: "namespace", url: data_triple[2], site:data_triple[0]});
			
		}
				
		
	}
	else {
		
		var triple_not_found = false;
	
		for (var x = 0; x < triple_store.length; x++) {
			
			if (triple_store[x][0] != data_triple[0]) {
		
				triple_store.push(data_triple);
				triple_not_found = false;
				break;
			
			}
		
			if(triple_store[x][1]!=data_triple[1]){
				
				triple_not_found = true;
				
			}else{
				
				triple_not_found = false;
				break;
				
			}
			
		}
		
		if(triple_not_found){
	
			triple_store.push(data_triple);
			if(data_triple[1]=="license"){
			
				license_found = true;
				chrome.extension.sendMessage({license: "namespace", url: data_triple[2], site:data_triple[0]});
			
			}
			
		}
		
	}
	
}

namespace_data = "";

chrome.extension.sendMessage({data: "url", url: document.location.href});
chrome.extension.sendMessage({data: "title", title: document.title, url: document.location.href});

if($('[about]')){

	url = $('[about]').attr("about");
	
	if(url!=undefined){
	
		if(url.indexOf("http")==-1){
	
			url = document.location.href;
	
		}
	
	}else{
	
		url = document.location.href;
		
	}

	if($('[about] > [rel*="license"]')[0]){
		
		add_triple(Array(url,"license",$('[about] > [rel*="license"]')[0].href));
		license_found = true;
		
	}
		
	if($('[about] > [rel="cc:attributionURL"]')[0]){
		
		add_triple(Array(url,"attributionName",$('[about] > [rel="cc:attributionURL"]')[0].href));
		
	}
		
	if($('[about] > [property="cc:attributionName"]')[0]){
	
		add_triple(Array(url,"attributionName",$('[about] > [property="cc:attributionName"]')[0].innerHTML));
		
	}

}

if($('[rel*="license"]')[0]){

	if(document.location.href.indexOf("wikipedia.org")!=-1){

		add_triple(Array(document.location.href,"license",$('[rel*="license"]')[1].href));
		
	}else{
	
		add_triple(Array(document.location.href,"license",$('[rel*="license"]')[0].href));
			
	}
	
	license_found = true;
	
}

if($('[rel="cc:attributionURL"]')[0]){

	if($('[rel="cc:attributionURL"]')[0].href){

		add_triple(Array(document.location.href,"attributionURL",$('[rel="cc:attributionURL"]')[0].href));
		
	}

}

if($('[property="cc:attributionName"]')[0]){

	if($('[property="cc:attributionName"]')[0].innerHTML){		

		add_triple(Array(document.location.href,"attributionName",$('[property="cc:attributionName"]')[0].innerHTML));
		
	}
	
}

switch(document.location.href.split(".")[1]){
	
	case "flickr": 	var photo_by = document.body.innerHTML.split('<strong class="username">By <a href="/photos/');
	
					if(photo_by.length!=1){
						
						photo_by_user = photo_by[1].split('>')[1];
							
						photo_by_author = photo_by_user.split('<');	
							
						triple_array = Array(document.location.href, "author", photo_by_author[0]);
						add_triple(triple_array)
						triple_array = Array();
						break;
						
					}
					
					if(logged_in_user==photo_by_author[0]){
						
							triple_array = Array(window.location.toString(), "author", logged_in_user);
							add_triple(triple_array)
							triple_array = Array();
						
					}
					
 					break;
	default: break;
	
}

if(license_found){	
	chrome.extension.sendMessage({url_to_show: document.location.href, show: "icon", html: triple_store});
	console.log("LICENCE");
}    