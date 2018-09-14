// This array is to keep track of the loaded libraries
const loadedLibraries = []

/**
 * Record the libs (id) only if the array doesn't contain the same already
 *
 * @param  {String} id of the script DOM element
 */
function registerLibraryLoaded(id) {
  if (loadedLibraries.indexOf(id) < 0) {
    loadedLibraries.push(id)
  }
}

/**
 * Check if the script.id exist already on the page
 * to add a listener because the library you asked to load
 * might be on the loading process
 * and after is loaded register the lib to avid this process twice
 *
 * @param  {HTMLElement}
 * @param  {Function}
 * @return {[type]}
 */
function appendUnique(script, next) {
  const appendedScript = document.getElementById(script.id)
  if (appendedScript) {
    appendedScript.addEventListener('load', function onLoadScript() {
      appendedScript.removeEventListener('load', onLoadScript)
      registerLibraryLoaded(script.id)
      next()
    })
    return
  }

  // this will only add a new script tag if the lib is not already on the DOM
  // the above part of this function will handle the scenario where
  // even tho is already on the DOM might be still loading
  document.body.appendChild(script)
}

/**
 * @param  {Object} with 'id' and 'src' as the html id and source
 * @return {Promise} is resolved in multiple scenarios
 *
 * @scenario 1: load one external script
 * @scenario 2: attempt to load one external script multiple times
 * without the first attempt completed so the second call will
 * get a listener and when is loaded first and second will be completed.
 * @scenario 3: attempt load the same external script after is completed.
 */
function loadScript(args) {
  const src =  args.src
  const id = args.id
  const script = document.createElement('script')

  return new Promise((resolve, reject) => {
    // once the lib is registered you can resolve immediatelly
    // because it means that is fully loaded
    if (loadedLibraries.indexOf(id) > -1) {
      resolve(`${id} was loaded before`)
    }

    script.addEventListener('load', function onLoadScript() {
      script.removeEventListener('load', onLoadScript)
      registerLibraryLoaded(id)
      resolve(id)
    })

    script.onerror = function onErrorLoadingScript() {
      reject()
    }

    script.id = id
    script.src = src
    appendUnique(script, resolve)
  })
}

module.exports = loadScript