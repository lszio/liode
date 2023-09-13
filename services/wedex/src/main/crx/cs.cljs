(ns ^:dev/once crx.cs)

(defn createCommandPalette []
  (let [e (js/document.createElement "div")]
    (aset e "id" "wedex-command-palette")
    (aset e "innerHTML" "")
    (js/document.body.appendChild e)
    e))

(defonce wedex? (not (nil? (js/document.getElementById "wedex"))))
(defonce element (createCommandPalette))

(defn send-to-worker [m c] (js/chrome.runtime.sendMessage m c))

(defn on-runtime-message [m s r]
  (js/console.log m s r)
  (r "response"))

(defn update-bookmarks []
  (js/chrome.runtime.sendMessage
   #js {:type "update-bookmarks"}
   (fn [res] (js/window.postMessage #js {:type "update-bookmarks" :payload res} "*"))))

(defn on-window-message [e]
  (let [source (.-source e)
        data (.-data e)
        type (.-type data)] 
    (case type
      "request-bookmarks" (update-bookmarks)
      "unknown")))

(defn init []
  (js/console.log "inject wedex content script")
  (when (nil? (js/document.getElementById "wedex-command-palette"))
    (js/console.log "no command palette")
    (let [cp ()]))
  (when wedex?
    (update-bookmarks)
    (js/window.addEventListener "message" on-window-message)))
