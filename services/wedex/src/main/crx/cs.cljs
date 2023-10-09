(ns ^:dev/once crx.cs
  (:require [promesa.core :as p]))

(defonce wedex? (not (nil? (js/document.getElementById "wedex"))))
(defonce chrome? (not (nil? js/chrome)))

(def brx-id "")
(def tab-info {})

(defn set-tab-info [t]
  (set! tab-info t))

(defn get-tab-info []
  (p/-> (js/chrome.runtime.sendMessage #js {:type "request-tab-info"})
        (js->clj :keywordize-keys true)
        set-tab-info))

(defn send-extension-id-to-webpage []
  (js/document.body.dispatchEvent 
   (js/CustomEvent. 
    "wedex" 
    (clj->js {:detail {:brxId js/chrome.runtime.id 
                       :kind :ping 
                       :tabId (:id tab-info)
                       :tab tab-info}}))))

(defn init []
  (js/console.log "[WEDEX CONTENT SCRIPT]: init")
  (get-tab-info) 
  (send-extension-id-to-webpage))
