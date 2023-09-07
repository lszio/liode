(ns crx.wrapper
  (:require [shadow.cljs.modern :refer (js-await)]
            [clojure.string :as s]))

(defn- send-to-wedex [msg]
  (-> (js/document.getElementById "wedex")
      .-contentWindow
      (.postMessage msg "*")))

(defn- update-bookmarks []
  (js/chrome.bookmarks.search #js {} 
   #(send-to-wedex #js {:command "update-bookmarks" :value %})))

(defn- update-windows []
  (js/chrome.windows.getAll
   #(send-to-wedex #js {:command "update-windows" :value %})))

(defn- update-tabs []
  (js/chrome.tabs.query #js {}
   #(send-to-wedex #js {:command "update-tabs" :value %})))

(defn- update-histories []
  (js/chrome.history.search #js {:text ""}
   #(send-to-wedex #js {:command "update-histories" :value %})))

(defn- on-message [e]
  (let [data (js->clj (.-data e))
        command (get data "command")] 
    (js/console.log (str "[wrapper]receive message with command: " command))
    (case command
      "request" (case (get data "value")
                  "bookmarks" (update-bookmarks))
      "unknown")))

(defn init []
  (prn "wrapper")
  (js/window.addEventListener "message" on-message))
