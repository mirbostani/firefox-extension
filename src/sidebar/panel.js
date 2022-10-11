/**
 * Background script will handle sidebar panel.
 *
 * - `console.log()` output is displayed in the debug window (Inspect)
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
 */
((_) => {
    class Background {
        constructor() {
            this._currentWindowInfo = null;

            // Inject scripts
            browser.tabs
                .executeScript({ file: "/content_scripts/jobmarker.js" })
                .then(this.script.bind(this))
                .catch((error) => {
                    console.error(`Failed to execute content script.`);
                    console.error(error.message);
                });

            // Get currently active window
            browser.windows
                .getCurrent({ populate: true })
                .then((windowInfo) => {
                    this._currentWindowInfo = windowInfo;
                });

            // Messages received from content scripts.
            browser.runtime.onMessage.addListener(
                (message, sender, sendResponse) => {
                    switch (message.command) {
                        case "background_test":
                            console.log("Background testing...");
                            // sendResponse("Background testing...");
                            break;
                    }
                }
            );
        }

        get currentWindowId() {
            return this._currentWindowInfo.id;
        }

        script() {
            document.addEventListener("click", (e) => {
                switch (e.target.id) {
                    case "button_test":
                        browser.tabs
                            // .query({ windowId: currentWindowInfo.id, active: true })
                            .query({ active: true, currentWindow: true })
                            .then((tabs) => {
                                browser.tabs
                                    .sendMessage(tabs[0].id, {
                                        command: "content_test",
                                    })
                                    .then((response) => {})
                                    .catch((error) => {
                                        console.error(
                                            `Run the extension on an online website with a valid URL.`
                                        );
                                        console.error(error.message);
                                    });
                            })
                            .catch((error) => {
                                console.error(error.message);
                            });
                        break;
                }
            });
        }
    }

    const background = new Background();
})();
