export default function Request (_args) {
	const args = _args;
	const reqType = (args.type) ? args.type.toUpperCase() : 'GET';
	const _this = this;

	let base = 'https://api.studentenfutter-os.de';
	let httpClient;
	let url = (args.url) ? (args.external === true) ? args.url : base + args.url : null;

	function dataHasChanged(input) {
		let data1 = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationCacheDirectory(), args.cacheName);
		const data2 = input;

		if (!data1.exists()) {
			return true;
		} else {
			data1 = data1.read().text;
		}

		return (JSON.stringify(data1) !== JSON.stringify(data2));
	}

	function getUserAgent() {
		return (Ti.App.getName() + ' (' + Ti.App.getVersion() + '), ' + Ti.Platform.getName() + ' (' + Ti.Platform.getVersion() + ')');
	}

	function getCacheDir() {
		return Ti.Filesystem.getApplicationCacheDirectory();
	}

	function parseJsonFile(name) {
		const jsonFile = Titanium.Filesystem.getFile(getCacheDir() + Titanium.Filesystem.getSeparator() + name);

		if (jsonFile.exists()) {

			try {
				const f = jsonFile.read();

				const returnValue = (f.text.length > 0) ? JSON.parse(f) : null;
				return returnValue;
			} catch (e) {
				Ti.API.error('JSON-Parse-Error: ' + e);
			}
		}

		return false;
	}

	function showNoNetworkWarning() {
		Ti.UI.createAlertDialog({
			title: 'No Internet Connection',
			message: 'You are currently not connected to the internet.',
			buttonNames: [ 'OK' ]
		}).show();

		if (args.anyway) {
			args.anyway();
		}

		if (args.error) {
			args.error('-> [' + JSON.stringify({
				code: 0,
				message: 'No Internet Connection'
			}) + ']');
		}
	}

	function getCredentials() {
		// Don't try to call this method, it will fail
		return require('auth').encodedCredentials();
	}

	function refreshCache() {
		httpClient = Titanium.Network.createHTTPClient({
			cache: false,
			timeout: 10000,
			validatesSecureCertificate: false,
			onload: () => {
				Ti.API.debug('[' + httpClient.getStatus() + ' ' + url + ']');

				if (args.clearContentType) {
					args.success(httpClient.responseData);
					return;
				}

				const json = httpClient.responseText;
				let response = null;

				try {
					response = (json) ? JSON.parse(json) : null;
				} catch (e) {
					response = [];
				}

				if (args.cacheName) {
					if (dataHasChanged(httpClient.responseText)) {
						const f = Titanium.Filesystem.getFile(getCacheDir(), args.cacheName);
						f.write(httpClient.responseText);

						Ti.API.debug('-> [Cache updated - ' + args.cacheName + ']');

						// Neue Daten -> Callback
						args.success(response);
					} else {
						Ti.API.debug('-> [Cache not updated - No change]');
					}
				} else {
					// Neue Daten -> Callback
					args.success(response);
				}

				if (args.anyway) {
					args.anyway();
				}
			},

			onerror: (e) => {
				let response;
				const status = httpClient.getStatus();

				Ti.API.error('[' + status + ' ' + url + ']');

				try {
					response = JSON.parse(httpClient.responseText);
				} catch (err) {
					Ti.API.error(err);
					response = null;
				}

				if (status === 400 && response && response.error && response.error.code === 104) {
					const api = require('api');
					api.reauth(function () {
						_this.load();
					});
					return;
				}

				const errorResponse = {
					code: e.code,
					response: response,
					evt: e
				};

				if (args.error) {
					args.error(errorResponse);
				}

				try {
					Ti.API.error('-> [Error: ' + JSON.stringify(errorResponse) + ']');
				} catch (err) {
					Ti.API.error('Error parsing error response: ' + err);
				}

				// Cache? => alte datei zurückliefern als Fallback
				if (args.cacheName) {
					const file = parseJsonFile(args.cacheName);
					if (file) {
						Ti.API.debug('-> [Cache available - ' + args.cacheName + ']');
						args.success(file);
					}
				}

				if (args.anyway) {
					args.anyway();
				}
			}
		});

		if (args.process) {
			httpClient.onsendstream = function (e) {
				if (args.process) {
					args.process({ value: e.progress });
				}
			};
		}

		httpClient.open(reqType, url);

		if (!args.external) {
			httpClient.setRequestHeader('Authorization', 'Basic ' + getCredentials());
		}

		args.headers && args.headers.forEach(header => {
			if (header.length !== 2) {
				Ti.API.error('request header needs to have 2 arguments ');
				return;
			}
			httpClient.setRequestHeader(header[0], header[1]);
		});

		if (args.contentType) {
			httpClient.setRequestHeader('Content-Type', args.contentType);
		}

		httpClient.setRequestHeader('User-Agent', getUserAgent());

		if (args.isFileUpload) {
			httpClient.setRequestHeader('enctype', 'multipart/form-data');
		}

		if (args.data) {
			Ti.API.debug('[DATA - ' + JSON.stringify(args.data) + ']');
			httpClient.send(args.data);
		} else {
			httpClient.send();
		}
	}

	this.load = function () {
		const post = (args.data) ? ' ~ ' + JSON.stringify(args.data) : '';
		Ti.API.debug('[' + reqType + ' ' + url + post + ']');

		if (args.cacheName && (!args.forceRefresh || !Ti.Network.online)) {

			const file = Titanium.Filesystem.getFile(Ti.Filesystem.getApplicationCacheDirectory(), args.cacheName);
			if (file.exists() && (file.modificationTimestamp() >= Ti.App.Properties.getInt('starttime') * 1000 || !Ti.Network.online) && !args.clearContentType) {
				Ti.API.debug('-> [Cache available - ' + args.cacheName + ']');
				const f = file.read();
				args.success((f.text.length > 0) ? JSON.parse(f) : null);

				if (Ti.Network.online) {
					refreshCache();
				}
			} else {
				(Ti.Network.online) ? refreshCache() : showNoNetworkWarning();
			}
		} else if (Ti.Network.online) {
			refreshCache();
		} else {
			showNoNetworkWarning();
		}
	};

	this.setBaseUrl = function (_base) {
		base = _base;
	};

	this.setRequestPath = function (_url) {
		url = base + _url;
	};

	this.abort = function () {
		if (httpClient !== null) {
			httpClient.abort();
			Ti.API.debug('-> [Request cancelled]');
		}
	};
}
