// This array is to keep track of the loaded libraries
window.__loadedLibraries = window.__loadedLibraries || []

/**
 * Record the libs (id) only if the array doesn't contain the same already
 *
 * @param  {String} id of the script DOM element
 */
function registerLibraryLoaded(id) {
  if (window.__loadedLibraries.indexOf(id) < 0) {
    window.__loadedLibraries.push(id)
  }
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
function getScriptLoadingPromise({ src, id, data }) {
  const script = document.createElement('script')

  script.id = id
  script.src = src
  script.setAttribute(`data-${data ? data : 'vendor'}`, id)

  return new Promise((resolve, reject) => {
    // once the lib is registered you can resolve immediatelly
    // because it means that is fully loaded

    if (window.__loadedLibraries.indexOf(src) > -1) {
      resolve(`${id} was loaded before`)
    }

    script.addEventListener('load', function onLoadScript() {
      script.removeEventListener('load', onLoadScript)
      registerLibraryLoaded(src)
      resolve(id)
    })

    script.onerror = function onErrorLoadingScript() {
      // Remove the element from the body in case of error
      // to give the possibility to try again later
      // calling the same function
      // document.body.removeChild(script)
      reject(`error loading ${src}`)
    }

    document.body.appendChild(script)
  })
}

function loadScript({ id, src, data }) {
    return getScriptLoadingPromise({ id, src, data });
}

function loadScripts(scripts) {
    let chain = Promise.resolve();
    for (let script of scripts) {
        chain = chain.then(() => getScriptLoadingPromise(script))
    }
    return chain;
}


export { loadScript, loadScripts }
