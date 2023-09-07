(ns crx.sw
  [:require [shadow.cljs.modern :refer (js-await)]])

(defn onMessage [event]
  (js/console.log event))

(defn get-windows []
  #_{:clj-kondo/ignore [:unresolved-symbol]}
  (js-await [windows (js/chrome.windows.getAll)]
            (js/console.log windows)))

(defn open-index-tab []
  (js/chrome.runtime.onInstalled.addListener
    #(js/chrome.tabs.create #js {:url "wrapper.html" :pinned true :active true :index 0})))

(defn start []
  (open-index-tab)
  (get-windows)
  (js/addEventListener "message" onMessage))

(defn init []
  (start))
