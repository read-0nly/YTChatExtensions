chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action && request.action == "addChatter") {
      console.log('hello received');
    }
    if (request.action && request.action == "addChatter2") {
      console.log('hello received');
    }
});


browser.storage.local.get("users").then((e)=>{
	for(var author in e.users) {
		for(var channelName in e.users[author].channels) {
			if(channelName.startsWith("https://")){
				delete e.users[author].channels[channelName]
				console.log("flushing bad id "+channelName);
			}
		}
	}
	users = e
	browser.storage.local.set(users)
})