(ns core
  (:require [goog.dom :as gdom]
            [datascript.core :as d]
            ;; [reagent.core :as r]
            [clojure.string :as s]
            [reagent.dom.client :as rdom]
            [components.action :refer (CommandPalette)]
            [components.clock :refer (Clock)]))

(defonce port (atom nil))
(defonce brx-id (atom ""))
(defonce root (rdom/create-root (gdom/getElement "app")))
(defonce chrome? (not (nil? js/chrome)))

(defonce actions (atom []))
(defonce search (atom '[]))

(defn App []
  [:main.min-h-screen.px-10
   [Clock]
  ;;  [CommandPalette actions]
   ])

;; (defn update-bookmarks [l]
;;   (d/reset-conn! conn (d/empty-db (d/schema (d/db conn))))
;;   (d/transact! conn (map #(assoc % :kind :bookmark) l))
;;   (js/console.log (str "update-bookmarks: ")))

(defn on-message [e]
  (let [data (.-data e)
        type (.-type data)]
    (case type
      ;; "update-bookmarks" (update-bookmarks (js->clj (.-payload data) :keywordize-keys true))
      ;; "wedex-boardcast" "TODO: use postMessageExternal"
      "unknown")))

(defn- refresh-style []
  (js/setTimeout
   (fn []
     (-> (js/document.querySelectorAll "link[rel=stylesheet]")
         (.forEach (fn [l]
                     (let [href (-> l .-href (.replace #"\?.*|$", (str "?t=" (.now js/Date))))
                           h (-> l .-href (.replace #"\?.*|$", ""))]
                       (aset l "href" href)
                       (aset l "href" h)
                       (prn (.now js/Date))))))) 1000))

(defn post-connect [port]
  (js/console.log "connect to" port)
  )

(defn ^:dev/after-load render []
  (js/window.addEventListener "message" on-message)
  (reset! brx-id @brx-id)
  (rdom/render root [App]))

(defn ^:dev/before-load stop [] 
  (js/window.removeEventListener "message" on-message))

(defn on-wedex-event [^js e]
  (let [detail (.-detail e)
        kind (.-kind detail)
        id (.-brxId detail)]
    (case kind
      "ping"  (reset! brx-id id))))

(defn init []
  (js/document.body.addEventListener "wedex" on-wedex-event)
  (add-watch port :reset
             (fn [_ _ ^js o ^js n]
               (when (not (nil? o)) (.disconnect o))
               (when (not (nil? n)) (post-connect port))))
  (add-watch brx-id :reset 
             (fn [_ _ o n]
               (when (not (= o n))
                 (when (and (not (s/blank? o))
                            (not (nil? @port)))
                   (reset! port nil))
                 (when (not (s/blank? n))
                   (if chrome?
                     (reset! port (js/chrome.runtime.connect n))
                     (js/console.error "TODO: firefox?"))))))
  (render))
