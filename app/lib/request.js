var Request = function(_args) {
	var base = "https://api.studentenfutter-os.de";
	var c;
	var args = _args;
	var url = (args.url) ? (args.external === true) ? args.url : base + args.url : null;
	var reqType = (args.type) ? args.type.toUpperCase() : "GET";
	var _this = this;

	function dataHasChanged(input) {
		var data1 = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationCacheDirectory(), args.cacheName);
		var data2 = input;

		if(!data1.exists()) {
			return true;
		} else {
			data1 = data1.read().text;
		}

		return (JSON.stringify(data1) != JSON.stringify(data2));
	}

	function getUserAgent() {
		return (Ti.App.getName() + " (" + Ti.App.getVersion() + "), " + Ti.Platform.getName() + " (" + Ti.Platform.getVersion() + ")");
	}

	function getCacheDir() {
		return Ti.Filesystem.getApplicationCacheDirectory();
	}

	function parseJsonFile(name) {
		var jsonFile = Titanium.Filesystem.getFile(getCacheDir() + Titanium.Filesystem.getSeparator() + name);

		if (jsonFile.exists()) {

			try {
				var f = jsonFile.read();

				var returnValue = (f.text.length > 0) ? JSON.parse(f) : null;
				return returnValue;
			} catch(e) {
				Ti.API.error("JSON-Parse-Error: " + e);
			}
		}

		return false;
	}

	function showNoNetworkWarning() {
		Ti.UI.createAlertDialog({
			title : "No Internet Connection",
			message: "You are currently not connected to the internet.",
			buttonNames: ["OK"]
		}).show();

		if(args.anyway)
			args.anyway();

		if (args.error) {
			args.error("-> [" + JSON.stringify({
				code : 0,
				message : "No Internet Connection"
			}) + "]");
		}
	};
	
	function getCredentials() {		
		// Don't try to call this method, it will fail
		return require('/auth').getCredentials();
	};

	function refreshCache() {
		c = Titanium.Network.createHTTPClient({
			cache: false,
			timeout: 10000,
			validatesSecureCertificate: false,
			onload: function(e) {
				Ti.API.info("[" + this.getStatus() + " " + url + "]");

				if(args.clearContentType) {
					args.success(this.responseData);
					return;
				}

				var json = this.responseText;
				var response = (json) ? JSON.parse(json) : null;

				var file = (parseJsonFile(args.cacheName)) ? parseJsonFile(args.cacheName) : null;

				if (args.cacheName) {
					if (dataHasChanged(this.responseText)) {
						var f = Titanium.Filesystem.getFile(getCacheDir(), args.cacheName);
						f.write(this.responseText);

						Ti.API.info("-> [Cache updated - " + args.cacheName + "]");

						// Neue Daten -> Callback
						args.success(response);
					} else {
						Ti.API.info("-> [Cache not updated - No change]");
					}
				} else {
					// Neue Daten -> Callback
					args.success(response);
				}

				if(args.anyway)
					args.anyway();
			},
			onerror: function(e) {
				var response;
				var status = this.getStatus();

				Ti.API.error("[" + status + " " + url + "]");

				try {
					response = JSON.parse(this.responseText);
				} catch(e) {
					response = null;
				}

				if(status == 400 && response && response.error && response.error.code == 104) {
					var api = require('/api');
					api.reauth(function() {
						_this.load();
					});
					return;
				}

				var errorResponse = {
					code : e.code,
					response : response,
					evt : e
				};

				if (args.error) {
					args.error(errorResponse);
				}
				
				try {
					Ti.API.error("-> [Error: " + JSON.stringify(errorResponse) + "]");
				} catch(e) {}

				// Cache? => alte datei zurückliefern als Fallback
				if (args.cacheName) {
					var file = parseJsonFile(args.cacheName);
					if (file) {
						Ti.API.info("-> [Cache available - " + args.cacheName + "]");
						args.success(file);
					}
				}

				if(args.anyway)
					args.anyway();
			}
		});

		if(args.process) {
			c.onsendstream = function(e) {
				if(args.process) {
					args.process(e.progress);
				}
			};
		}

		c.open(reqType, url);
		
		c.setRequestHeader('Authorization', 'Basic ' + getCredentials());
				
		_.each(args.headers, function(header) {
			if (header.length != 2) {
				Ti.API.error("request header needs to have 2 arguments ");
				return;
			}
			c.setRequestHeader(header[0], header[1]);
		});

		if(args.contentType) {
			c.setRequestHeader('Content-Type', args.contentType);
		}

		c.setRequestHeader('User-Agent', getUserAgent());

		if (args.data) {
			Ti.API.info("[DATA - " + JSON.stringify(args.data) + "]");
			c.send(args.data);
		} else {
			c.send();
		}
	}

	this.load = function() {
		var post = (args.data) ? " ~ "+JSON.stringify(args.data) : "";
		Ti.API.info("["+reqType+" "+url+post+"]");

		if(args.cacheName && (!args.forceRefresh || !Ti.Network.online)) {

			var file = Titanium.Filesystem.getFile(Ti.Filesystem.getApplicationCacheDirectory(), args.cacheName);
			if(file.exists() && (file.modificationTimestamp() >= Ti.App.Properties.getInt('starttime') * 1000 || !Ti.Network.online) && !args.clearContentType) {
				Ti.API.info("-> [Cache available - "+args.cacheName+"]");
				var f = file.read();
				args.success((f.text.length > 0) ? JSON.parse(f) : null);

				if(Ti.Network.online)
					refreshCache();
			} else {
				(Ti.Network.online) ? refreshCache() : showNoNetworkWarning();
			}
		} else {
			if(Ti.Network.online) {
				refreshCache();
			} else {
				showNoNetworkWarning();
			}
		}
	};

	this.setBaseUrl = function(_base) {
		base = _base;
	};

	this.setRequestPath = function(_url) {
		url = base + _url;
	};

	this.abort = function() {
		if(c != null){
			c.abort();
			Ti.API.info("-> [Request abgebrochen]");
		}
	};
};

module.exports = Request;
