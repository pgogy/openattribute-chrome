triplesHtml = "";

var n = document;
var rootNode = n;
var triple_store = new Array();
var license_found = false;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	
	chrome.extension.sendRequest({wanting:"url_please", data_url:document.location.href});
	
});  

function add_triple(data_triple){
		
	if (triple_store.length == 0) {
	
		triple_store.push(data_triple);
		if(data_triple[1]=="license"){
			
			license_found = true;
			chrome.extension.sendRequest({license: "namespace", url: data_triple[2], site:data_triple[0]});
			
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
				chrome.extension.sendRequest({license: "namespace", url: data_triple[2], site:data_triple[0]});
			
			}
			
		}
		
	}
	
}

namespace_data = "";

chrome.extension.sendRequest({data: "url", url: document.location.href});
chrome.extension.sendRequest({data: "title", title: document.title, url: document.location.href});

while (n) {

	if (n.nodeName != "LINK") {
	
		if (n.hasAttributes()) {
		
			temp_attr = {};
			
			if (n.attributes.length != 1) {
			
				var attr_names = ['license cc:license', 'about', 'src', 'resource', 'href', 'instanceof', 'typeof', 'rel', 'rev', 'property', 'content', 'datatype'];
				rdfa_found = 0;
				
				for (var i = 0; i < attr_names.length; i++) {
				
					if (n.getAttribute(attr_names[i]) != null) {
					
						temp_attr[attr_names[i]] = n.getAttribute(attr_names[i]);
						
						if (n.getAttribute(attr_names[i]) != "nofollow") {
						
							asset = "";
							attribute = "";
							value = "";
							
							if (n.getAttribute(attr_names[i]).indexOf(":") == 2) {
							
								attribute = n.getAttribute(attr_names[i]).substring(3);
								
							}
							
							if (attr_names[i] == "property") {
							
								value = n.innerHTML;
								
							}
							
							if (n.getAttribute(attr_names[i]) == "dc:type") {
							
								break;
								
							}
														
							if (attr_names[i] == "rel" && n.getAttribute(attr_names[i]).indexOf("license") != -1) {
							
								value = n.getAttribute("href");
								attribute = "license";
								
							}
							
							if (attr_names[i] == "href" && n.getAttribute(attr_names[i]).indexOf("http://") != -1) {
							
								value = n.getAttribute("href");
								
							}
							
							if (asset == "") {
							
								asset = document.location.href;
								
								if (attribute == "") {
								
									if(n.getAttribute("property")=="cc:attributionName"&&n.getAttribute("rel")=="cc:attributionURL"){
										
										attribute = n.getAttribute(attr_names[i]);
										triple_array = Array(asset, "cc:attributionName", n.innerHTML);
										add_triple(triple_array);
										attribute = "attributionURL";
										
										
									}else{
										
										attribute = n.getAttribute(attr_names[i]);	
										
									}
																		
								}
								
							}
							
							if (attribute == "type") {
							
								value = n.getAttribute("href")
								
							}
							
							if (attribute == "attributionURL") {
							
								value = n.getAttribute("href")
								
							}
							
							if (attribute == "attributionName") {
							
								value = n.innerHTML;
								
							}
							
							if (value != attribute) {
							
								if (asset != null && attribute != null && value != null) {
								
									if (asset.length != 0 && attribute.length != 0 && value.length != 0) {
									
										base = document.location.href.split("/")[2];
										if (value.indexOf("http://") == 0) {
										
											if (base != value.split("/")[2]) {
											
												triple_array = Array(asset, attribute, value);
												add_triple(triple_array)
												triple_array = Array();
												
											}
											
										}
										else {
										
											triple_array = Array(asset, attribute, value);
											add_triple(triple_array)
											triple_array = Array();
											
										}
										
									}
									
								}
								
							}
							
						}
						
					}
					
				}
				
			}
			
		}
		
	}
	
	if (n.v) {
		n.v = false;
		if (n == rootNode) {
			break;
		}
		if (n.nextSibling) {
			n = n.nextSibling;
		}
		else {
			n = n.parentNode;
		}
	}
	else {
		if (n.firstChild) {
			n.v = true;
			n = n.firstChild;
		}
		else 
			if (n.nextSibling) {
				n = n.nextSibling;
			}
			else {
				n = n.parentNode;
			}
	}
	
	
}

if(license_found){	
	
	chrome.extension.sendRequest({url_to_show: document.location.href, show: "icon", html: triple_store});
	
}    