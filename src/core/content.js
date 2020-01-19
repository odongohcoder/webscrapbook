/******************************************************************************
 *
 * Shared utilities for most content scripts.
 *
 * @require {Object} scrapbook
 * @public {Object} core
 *****************************************************************************/

(function (root, factory) {
  // Browser globals
  root.core = factory(
    root.isDebug,
    root.browser,
    root.scrapbook,
    window,
    console,
  );
}(this, function (isDebug, browser, scrapbook, window, console) {

  const core = {};

  /**
   * Return true to confirm that content script is loaded.
   *
   * @kind invokable
   */
  core.isScriptLoaded = async function (params) {
    return true;
  };

  /**
   * Return frameId of the frame of this content script.
   */
  window.addEventListener("message", async (event) => {
    if (event.data !== browser.runtime.getURL('')) { return; }

    event.ports[0].postMessage({frameId: core.frameId});
  }, false);

  browser.runtime.onMessage.addListener((message, sender) => {
    const {cmd, args} = message;
    isDebug && console.debug(cmd, "receive", args);

    const [mainCmd, subCmd] = cmd.split(".");

    const object = window[mainCmd];
    if (!object) { return; }

    const fn = object[subCmd];
    if (!fn) { return; }

    return fn(args);
  });

  return core;

}));
