/**
 * Content script will be injected into the current active page.
 *
 * - `window` is the active page object.
 * - `document.body` is the `<body>` tag of the active page.
 * - `console.log()` output is displayed inside active page's console.
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
 */
((_) => {
    // Prevent multiple script injection
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    class Content {
        constructor() {
            // Send a test message from the content to the background script.
            browser.runtime
                .sendMessage({
                    command: "background_test",
                })
                .then((response) => {})
                .catch((error) => {
                    console.error(error.message);
                });

            // Messages received from background scripts
            browser.runtime.onMessage.addListener(
                (message, sender, sendResponse) => {
                    switch (message.command) {
                        case "content_test":
                            console.log("Content testing...");
                            // sendResponse("Content testing...");
                            break;
                    }
                }
            );
        }
    }

    const content = new Content();
})();
