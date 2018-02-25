var PlayServices = require('ti.playservices'),
	playServicesResult = PlayServices.isGooglePlayServicesAvailable(),
	playServicesVersion = PlayServices.GOOGLE_PLAY_SERVICES_VERSION_CODE;

if (playServicesResult == PlayServices.RESULT_SUCCESS) {
	alert('Google Play Services: ' + playServicesVersion);
} else {
	alert('Google Play Services: ' + PlayServices.getErrorString(playServicesResult));
}
