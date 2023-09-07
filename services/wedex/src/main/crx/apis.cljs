(ns crx.apis)

(defn request-bookmarks [] 
  (js/window.parent.postMessage #js {:command "request-bookmarks"} "*"))

(defn send-request [value]
  (js/window.parent.postMessage #js {:command "request" :value value} "*"))
