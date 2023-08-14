(ns crx.sw
  [:require [shadow.cljs.modern :refer (js-await)]])

(defn onMessage [event]
  (js/console.log event))

;; (defn ^:dev/before-load stop []
;;   (js/removeEventListener onMessage))

;; (defn open-side-panel [windowId])

(defn get-windows []
  #_{:clj-kondo/ignore [:unresolved-symbol]}
  (js-await [windows (js/chrome.windows.getAll)]
            (js/console.log windows)))

(defn open-index-tab []
  (js/chrome.runtime.onInstalled.addListener
   (fn []
     (js/chrome.tabs.create #js {:url "index.html" :pinned true :active true :index 0}))))

(defn start []
  (open-index-tab)
  (get-windows)
  (js/addEventListener "message" onMessage))

(defn init []
  (prn "sw")
  (start))
