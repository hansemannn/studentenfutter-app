
var safariDialog = require('ti.safaridialog');
Ti.API.info("module is => " + safariDialog);

var win = Titanium.UI.createWindow({  
    title:'Demo', backgroundColor:'#fff',layout:'vertical'
});

var btnOpenDialog = Ti.UI.createButton({
	top:20, title:'Open Safari Dialog',
	height:60, width:Ti.UI.FILL
});
win.add(btnOpenDialog);

btnOpenDialog.addEventListener('click',function(d){
	safariDialog.open({
		url:"http://appcelerator.com",
		title:"Hello World",
		tintColor:"red"
	});
});

safariDialog.addEventListener("open",function(e){
	console.log("open: " + JSON.stringify(e));
});

safariDialog.addEventListener("close",function(e){
	console.log("close: " + JSON.stringify(e));
});

win.open();
