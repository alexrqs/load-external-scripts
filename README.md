# Load External Scripts
Small utility to load external libs.
Say you need to dynamically create a script tag to load your analytics or other vendor libraries that don't belong to your app code base.

## Usage
```sh
$ npm install --save load-external-scripts
```

## why
Mainly for 3 reasons

### Scenario 1
You try to load a vendor that pollutes the window with a variable that you need later. say window.analytics.
```js
import loadScript from 'load-external-scripts'

loadScript({ src: 'http://...', id: 'uniqueid' })
  .then(/* Contnue with your app */)
```

### Scenario 2
Two instances of the same class try to load the same script, like when you need a vendor for a video and you're supposed to load 2 videos on the same page.

```js
import loadScript from 'load-external-scripts'

Promise.all([
  loadScript({ src: 'http://sameurl.com/vendor.js', id: 'sameID' }),
  loadScript({ src: 'http://sameurl.com/vendor.js', id: 'sameID' }),
])

```

### Scenario 3
Your vendor is already loaded but 2 minutes later you try to load the same script, so you don't want to duplicate the tag nor actually load it again.

```js
import loadScript from 'load-external-scripts'

loadScript({ src: 'http://sameurl.com/vendor.js', id: 'sameID' }),
setTimeout(function() {
  loadScript({ src: 'http://sameurl.com/vendor.js', id: 'sameID' }),
}, 5000)
```
