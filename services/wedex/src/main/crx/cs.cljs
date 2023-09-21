(ns ^:dev/once crx.cs
  (:require [goog.dom :as gdom]))

;; (defn createCommandPalette []
;;   (let [e (js/document.createElement "div")]
;;     (aset e "id" "wedex-command-palette")
;;     (aset e "innerHTML" "")
;;     (js/document.body.appendChild e)
;;     e))

(defonce wedex? (not (nil? (js/document.getElementById "wedex"))))

(defn send-to-worker [m c] (js/chrome.runtime.sendMessage m c))

;; (defn on-runtime-message [m s r]
;;   (js/console.log m s r)
;;   (r "response"))

;; (defn update-bookmarks []
;;   (js/chrome.runtime.sendMessage
;;    #js {:type "update-bookmarks"}
;;    (fn [res] (js/window.postMessage #js {:type "update-bookmarks" :payload res} "*"))))

;; (defn on-window-message [e s]
;;   (js/console.log e s)
;;   (let [source (.-source e)
;;         data (.-data e)
;;         type (.-type data)] 
;;     (case type
;;       "request-bookmarks" (update-bookmarks)
;;       "unknown")))


(defn send-extension-id-to-webpage []
  (js/document.body.dispatchEvent 
   (new js/CustomEvent 
        "wedex"
        (clj->js {:detail {:brxId js/chrome.runtime.id :kind :ping}}))))

(defn init []
  (js/console.log "[WEDEX CONTENT SCRIPT]: init")
  ;; (when (nil? (js/document.getElementById "wedex-command-palette"))
  ;;   (js/console.log "no command palette")
  ;;   (let []))
  (send-extension-id-to-webpage)
  (when wedex?
    ;; (update-bookmarks)
    ;; (aset (gdom/getElement "wedex-extension-broker") "innerHTML" js/chrome.runtime.id)
    ;; (js/window.addEventListener "message" on-window-message)
    ))
