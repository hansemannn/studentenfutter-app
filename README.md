# Studentenfutter-App

[![Contact](http://hans-knoechel.de/shields/shield-twitter.svg)](http://twitter.com/hansemannnn)

The Studentenfutter App is a cross-platform Titanium app initially made to check the lunches of the German based 
Universities in Osnabrück, Vechta and Lingen. It is open source to share the concepts behind making an advanced 
Titanium application and is still work-in-progress due to migrations from the classic structure to an Alloy based concept.

Also check out the Swift 3 based tvOS-version of this app in [hansemannn/studentenfutter-tvos](https://github.com/hansemannn/studentenfutter-tvos) :rocket:.

<img alt="App Store" src="https://abload.de/img/screenshot2017-01-12aybs4e.png" width="900" />

### Download

You can download the app for free from the iOS App Store and Android Play Store:

<a href="https://itunes.apple.com/de/app/studentenfutter-die-mensa/id722993370?l=de" target="_blank"><img alt="App Store" src="https://abload.de/img/appstoreihsxg.png" height="40" /></a> <a href="https://play.google.com/store/apps/details?id=de.ncn.mensaapp" target="_blank"><img alt="Play Store" src="https://abload.de/img/playstoreres91.png" height="40" /></a>

### Features (Selection)

- [x] Cross-Platform native App
- [x] Multi-Language Support (en, de, es, pt)
- [x] Advanced List Views
- [x] Multi-Navigation Flows
- [x] Image Capturing, Processing & Upload
- [x] REST-API Handling
- [x] Star-based Rating System

### Used Titanum API's (Selection)

#### Core API's
`Ti.Media.Camera`, `Ti.App.iOS.ApplicationShortcuts`, `Ti.App.iOS.PreviewContext`, `Ti.Filesystem`,
`Ti.UI.iOS.TabbedBar`, `Ti.UI.iOS.NavigationWindow`, `Ti.UI.ListView`, `Ti.App.iOS.PreviewContext`,
`Ti.UI.iOS.BlurView`, `Ti.UI.ProgressBar`, `Ti.UI.Switch`, `Ti.UI.Slider`, `Ti.UI.RefreshControl`, ...

#### Modules
[Ti.Map](github.com/appcelerator-modules/ti.map), [Ti.StoreView](https://github.com/dezinezync/TiStoreView) and [Ti.ImageFactory](https://github.com/appcelerator-modules/ti.imagefactory)

### Running the App

#### Via Appcelerator Studio

1. Import it via *Dashboard* if available.
2. Or import it via *File > Import... > Git > Git Repository as New Project* with *URI*:

		https://github.com/hansemannn/studentenfutter-app

3. Select a Simulator or Device to build to via *Run > Run As*.

#### Via CLI

1. Clone the repository:

		git clone https://github.com/hansemannn/studentenfutter-app

2. To run it with `appc run` first import it to the platform:

		appc new --import --no-services

3. Build to Simulator or Device:

		[appc run | ti build] -p ios [-T device]

### Author

Hans Knoechel ([@hansemannnn](https://twitter.com/hansemannnn) / [Web](http://hans-knoechel.de))

### License 

MIT

### Contribution

Code contributions are greatly appreciated, please submit a new [pull request](https://github.com/hansemannn/studentenfutter-app/pull/new/master)!
