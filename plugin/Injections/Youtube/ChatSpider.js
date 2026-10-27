//Delete this line when you go live
//browser.storage.local.set({NoCommentChick:null})


var port = chrome.runtime.connect();

const observerLive = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
	setTimeout(()=>{ColorMutation(mutation)},10);
  });
})
const observerLiveList = new MutationObserver((mutations) => {
  document.body.style.backgroundColor="red"
  mutations.forEach((mutation) => {
	//console.log(mutation.type, mutation.target, mutation.target.tagName);
	if(mutation.target.id == "item-list"){
		// call `observe()`, passing it the element to observe, and the options object
		observerLive.observe(document.getElementById("items"), {
		  subtree: true,
		  childList: true,
		});
		setTimeout(()=>{
		Array.from(document.getElementsByTagName("YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER")).forEach((e)=>{
			mutation = {}
			mutation.target = e
			ColorMutation(mutation)
		});
		console.log("redoing whole list")
		},100)
	}
  });
})

// call `observe()`, passing it the element to observe, and the options object
observerLiveList.observe(document.getElementById("item-list"), {
  subtree: true,
  childList: true,
});
//list[list.length-5].querySelector("[id=message-container]").querySelector("[id=message]").style.textShadow = "0 0 5px #000, 0 0 10px #020, 0 0 15px #0a0, 0 0 20px #0f0, 0 0 60px #0f0, 0 0 25px #050"
window.ytExtensions={}
window.ytExtensions.FocusedName = ""
function ColorMutation(mutation){
	//window.ytExtensions.channel
	if(mutation.target.tagName == "YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER"){
		//console.log(mutation.type, mutation.target, mutation.attributeName);
		len=mutation.target.querySelector("[id=message-container]").querySelector("[id=message]").innerText.length
		if(len>255){len=255}
		//mutation.target.querySelector("[id=message-container]").querySelector("[id=message]").style.backgroundColor = "rgb("+len+",0,0)"
		len = mutation.target.getElementsByTagName("yt-live-chat-author-chip")[0].innerText.length*3
		if(len>255){len=255}
		//mutation.target.getElementsByTagName("yt-live-chat-author-chip")[0].style.backgroundColor = "rgb(0,"+len+",0)"
		let authorName = mutation.target.getElementsByTagName("yt-live-chat-author-chip")[0].querySelector("[id=author-name]").innerText
		mutation.target.getElementsByTagName("yt-live-chat-author-chip")[0].querySelector("[id=author-name]").removeEventListener("click", clickAct)
		mutation.target.getElementsByTagName("yt-live-chat-author-chip")[0].querySelector("[id=author-name]").addEventListener("click", clickAct)
		
		if(window.ytExtensions.FocusedName!="" && window.ytExtensions.FocusedName != mutation.target.getElementsByTagName("yt-live-chat-author-chip")[0].querySelector("[id=author-name]").innerText){
			mutation.target.style.display="none"
		}
		else{
			mutation.target.style.display=""
		}			
		if(window.ytExtensions.channel == null || window.ytExtensions.channel == ""){
			loadChannelName()			
			return;
		}
		
		if(window.ytExtensions.channel.startsWith("https://")){
			console.log("reloading to get channel")
			window.top.location.reload()
		}
		//window.ytExtensions.channel
			neverSeen = false
			browser.storage.local.get("users").then((e)=>{
				if(e.users == null){
					e.users = {}
				}
				console.log(e);
				console.log(e);
				mutation.target.style.border = ""
				mutation.target.querySelector("[id=message-container]").querySelector("[id=message]").style.textShadow = ""
				mutation.target.style.margin = "2px 6px"
				mutation.target.style.padding = "5px 5px"
				authorObj = { name : authorName, channels : {}, friend : false, foe : false }
				if(e.users[authorName]!=null){
					authorObj = e.users[authorName]
				}
				if(window.ytExtensions.channel != null && window.ytExtensions.channel != ""){
					if(authorObj.channels[window.ytExtensions.channel]==null){
						authorObj.channels[window.ytExtensions.channel]=1
						mutation.target.style.border = "1px #770 solid"
					}
					else{
						authorObj.channels[window.ytExtensions.channel]++
					}
					if(authorObj.channels[window.ytExtensions.channel]>50){
						authorObj.channels[window.ytExtensions.channel]=50
					}
					len = (50-authorObj.channels[window.ytExtensions.channel])*4
					
					mutation.target.querySelector("[id=message-container]").querySelector("[id=message]").style.textShadow = "0 0 2px #000, 0 0 10px rgb(0,"+Math.round(len)+",0), 0 0 15px rgb(0,"+Math.round(len/2)+",0), 0 0 20px rgb(0,"+Math.round(len/3)+",0), 0 0 25px rgb(0,"+Math.round(len/4)+",0)"
				}
				numberOfChannels = 0;
				mutation.target.getElementsByTagName("yt-live-chat-author-chip")[0].querySelector("[id=author-name]").title = ""
				for(var propertyName in authorObj.channels) {
					numberOfChannels++;
					mutation.target.getElementsByTagName("yt-live-chat-author-chip")[0].querySelector("[id=author-name]").title += propertyName+"\n"
				}
				if(numberOfChannels>1){
					mutation.target.style.border = "1px #06f solid"
				}
				if(authorObj.foe){
					mutation.target.style.border = "1px #a00 solid"
					//mutation.target.querySelector("[id=message-container]").querySelector("[id=message]").style.fontFamily = "wingdings"
				}
				if(authorObj.friend){
					mutation.target.style.border = "1px #0a0 solid"
					
				}
				e.users[authorName]=authorObj
				users = e
				browser.storage.local.set(users)
			})
			
		console.log("Channle:", window.ytExtensions.channel)
	}
}

function clickAct(e){
			if(window.ytExtensions.FocusedName == e.target.innerText){
				window.ytExtensions.FocusedName = ""				
			}
			else{
				window.ytExtensions.FocusedName = e.target.innerText
			}
			console.log("nameClicked ",e.target.innerText, window.ytExtensions.FocusedName )
			
			document.getElementById("items").childNodes.forEach((e)=>{		
				if(e.getElementsByTagName("yt-live-chat-author-chip").length>0){
					if(window.ytExtensions.FocusedName!="" && window.ytExtensions.FocusedName != e.getElementsByTagName("yt-live-chat-author-chip")[0].querySelector("[id=author-name]").innerText){
						e.style.display="none"
					}
					else{
						e.style.display=""
					}
				}
			})			

		}

window.ytExtensions.channel = null

function loadChannelName(){
	console.log("gettingChannelname");
	try{
		if(window.self !== window.top){
			console.log("nottopmost");
			window.ytExtensions.channel = window.top.document.querySelector("[itemprop=author]").childNodes[0].href.replace("http://www.youtube.com/","").replace("@","").toLowerCase()
		}
		else{
			a = b.c
		}
	}
	catch(e){
		if(document.getElementsByClassName("ytAttributedStringHost ytAttributedStringEllipsisTruncate").length>0){
			console.log("foundpay");
			window.ytExtensions.channel = document.getElementsByClassName("ytAttributedStringHost ytAttributedStringEllipsisTruncate")[0].innerText.replace("Show support for @","").toLowerCase()
		}
		else{
			try{
				console.log(window.location.toString());	
				if(window.location.toString().indexOf("live_chat")!=-1){
				console.log("fetchbyurl");	
				fetchURLAuthor(window.location.toString().match("(?<=v=).{11}")[0])
				}
			}
			catch(e){			
				console.log("failed to find channel");	
			}
		}
		
	}
}

function fetchURLAuthor (url) {
	regex = /\<span itemprop="author" itemscope itemtype="http:\/\/schema.org\/Person"\>\<link itemprop="url" href="http:\/\/www.youtube.com\/@[\w\d\-\_]+">/g
	fetch("https://www.youtube.com/watch?v="+url).then(function(response) {
		 return response.text();
	  }).then(function(data) {
		window.ytExtensions.channel = data.match(regex)[0].match(/(?<=http:\/\/www.youtube.com\/@)[\w\d\-\_]+/g)[0].toLowerCase();
		return window.ytExtensions.channel
	  }).then(console.log);
}
