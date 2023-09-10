(ns crx.cs)

(defonce wedex? (not (nil? (js/document.getElementById "wedex"))))

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
  (when wedex?
    (update-bookmarks)
    (js/window.addEventListener "message" on-window-message)))
