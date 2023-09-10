(ns crx.sw
  [:require 
   [shadow.cljs.modern :refer (js-await)]
   [clojure.string :as s]])

(goog-define REDIRECT_URL "localhost")

(defonce tabs (atom #js []))
(defonce windows (atom #js []))
(defonce bookmarks (atom #js []))
(defonce bookmark-tree (atom []))

(defn get-windows-from-chrome []
  (js-await [windows (js/chrome.windows.getAll)]
    (js/console.log windows)))

(defn get-tabs-from-chrome []
  (js-await [ts (js/chrome.tabs.query #js {})]
            (reset! tabs ts)))

(defn get-bookmarks-from-chrome []
  (js/chrome.bookmarks.search #js {} #(reset! bookmarks %)))

(defn get-bookmark-tree-from-chrome [])

;; TODO: use onMessageExternal or onConnectExternal
(defn on-message [m s c]
  (js/console.log m s c)
  (c (case (.-type m)
       "update-bookmarks" @bookmarks
       "unknown")))

(defn on-installed []
  (js/chrome.scripting.registerContentScripts
   (clj->js [{:id "message-broker"
              :js ["js/cs.js"]
              :matches ["*://*/*"]}])))

(defn init []
  (get-bookmarks-from-chrome)
  (js/chrome.bookmarks.onMoved.addListener get-bookmarks-from-chrome)
  (js/chrome.bookmarks.onChanged.addListener get-bookmarks-from-chrome)
  (js/chrome.bookmarks.onCreated.addListener get-bookmarks-from-chrome)
  (js/chrome.bookmarks.onRemoved.addListener get-bookmarks-from-chrome)
  (js/chrome.bookmarks.onImportEnded.addListener get-bookmarks-from-chrome)

  (js/chrome.runtime.onMessage.addListener on-message)
  (js/chrome.runtime.onInstalled.addListener on-installed))
