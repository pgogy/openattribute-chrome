  var first_run = true;
  var RDFa_cache = "";
  var cached_namespaces = new Array("http://purl.org/dc/terms/",
  									"http://creativecommons.org/#ns");
									
  var open_urls = {}; 									
  
  function RDFA_get(url){
  	
	url_cached = false;
  	
	for(var x=0;x<cached_namespaces.length;x++){
		
		if(cached_namespaces[x]==url){
			
			url_cached = true;
			
		}
		
	}
  
    if (!url_cached) {
	
		var req = new XMLHttpRequest();
		
		req.open("GET", url, true);
		
		req.onload = function(){
		
			if (req.readyState == 4) {
			
				RDFa_cache += req.responseText;
				cached_namespaces.push(url)
				
			}
			
		}
		
		req.send(null);
		
	}
  	
  }   
  
  
  function get_cc(url,site){
  	
		attribute_info.license_link = url;
  	
		var req = new XMLHttpRequest();
		
		req.open("GET", url, true);
		
		req.onload = function(){
		
			if (req.readyState == 4) {
			
				var data = req.responseText;
				
				data = data.split("</title>");
				
				data = data[0].split("<title>")
				
				data = data[1].split("&mdash;");	
				
				url_cache[site]["license_link"] = url;
				url_cache[site]["license"] = data[1];
				url_cache[site]["license_shorthand"] = data[2].split("\n").join("");
				
			}
			
		}
		
		req.send(null);
	
  }
	  
  if(first_run){
  	
		RDFA_get("http://dublincore.org/2010/10/11/dcterms.rdf#");
		RDFA_get("http://creativecommons.org/#ns");
		first_run = false;

  }
  	
	
	
  var html = '';
  
  var attribute_info = {
  	
	title : "",
	url : "",
	author : "",
	license : "",
	license_link : "",
	type : "",
	attribution_url : "",
	license_shorthand : ""	
	
  };
  
  var url_cache = {};
  
  var active_data = "";
  
  var request_url = false;
  
  chrome.extension.onMessage.addListener(
  
    function(request, sender, sendResponse) {
	
	  if(request.data == "title"){
		
		url_cache[request.url]["title"] = request.title;
	  	
	  }else if(request.data == "url"){
	  	
		url_cache[request.url] = {
			
			title : "",
			url : "",
			author : "",
			license : "",
			license_link : "",
			type : "",
			attribution_url : "",
			license_shorthand : ""
			
		};
		
		url_cache[request.url]["url"] = request.url;
		
		url_cache[request.url]["tab_no"] = curr_tab;
	  	
	  }else if(request.license == "namespace"){
	  	
		request_url = true;
		
		get_cc(request.url, request.site);	
	  	
	  }else if(request.wanting == "url_please"){
	  	
		curr_tab=sender.tab.id;
		
		chrome.pageAction.show(sender.tab.id);	
	  	
	  }else if(request.wanting == "tab_id"){
	  
		console.log("tab id");
		
		chrome.windows.getCurrent(function(window){
			
			for(x in url_cache){
				
				if(url_cache[x]["tab_id"]==curr_tab){
					
					active_data = url_cache[x];		
					break;		
					
				}
				
			}
			
		})
			
	  	
	  }else if (request.show == "icon") {
 
		for (x in request.html) {
		
			switch (request.html[x][1]) {
			
				case "title":
					url_cache[request.url_to_show]["title"] = request.html[x][2];
					break;
				case "license":
					url_cache[request.url_to_show]["license"] = request.html[x][2];
					break;
				case "attributionName":
					url_cache[request.url_to_show]["attributionName"] = request.html[x][2];
					break;
				case "attributionURL":
					url_cache[request.url_to_show]["attributionURL"] = request.html[x][2];
					break;
				case "author":
					url_cache[request.url_to_show]["author"] = request.html[x][2];
					break;
					
			}
			
		}
		
		for(x in url_cache){
				
			if(url_cache[x]["tab_id"]==sender.tab.id){
					
				url_cache[x]["tab_id"] = "";		
				break;		
					
			}
				
		}
		
		url_cache[request.url_to_show]["tab_id"] = sender.tab.id;
		
		active_data = url_cache[request.url_to_show];	
		
		if (localStorage["firstrun_pagedisplay"]==undefined) {
		
			localStorage["firstrun_pagedisplay"] = true;
		
			chrome.tabs.create({
				url: "http://openattribute.com/first-run-chrome/"
			});		
			
		}
		
		chrome.tabs.connect(sender.tab.id)
		
		chrome.tabs.sendMessage(sender.tab.id, "url_gimme_gimme", function(){
			
			}
			
		);		
		
      }     
      sendResponse({});
  });
  
  var curr_tab = "";
  
  chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
  	
		curr_tab = tabId;	
	
  });  
  