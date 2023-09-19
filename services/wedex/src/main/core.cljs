(ns core
  (:require [goog.dom :as gdom]
            [datascript.core :as d]
            ;; [reagent.core :as r]
            [reagent.dom.client :as rdom]
            [components.action :refer (CommandPalette)]
            [components.clock :refer (Clock)]))

(defonce conn (d/create-conn {}))
(defonce root (rdom/create-root (gdom/getElement "app")))

(defn App []
  [:main.min-h-screen.px-10
   [Clock]
   [CommandPalette conn]])

(defn update-bookmarks [l]
  (d/reset-conn! conn (d/empty-db (d/schema (d/db conn))))
  (d/transact! conn (map #(assoc % :kind :bookmark) l))
  ;; (prn (d/q '[:find (pull ?e [*])
  ;;             :in $ ?url ?title
  ;;             :where
  ;;             [?e :url ?u]
  ;;             [?e :title ?t]
  ;;             [(or (clojure.string/includes? ?u ?url)
  ;;                  (clojure.string/includes? ?t ?title))]
  ;;               ;; [?e "title" ?title]
  ;;             ]
  ;;           @conn
  ;;           "emacs"
  ;;           "emacs"))
  (js/console.log (str "update-bookmarks: ")))

(defn on-message [e]
  (let [data (.-data e)
        type (.-type data)]
    (case type
      "update-bookmarks" (update-bookmarks (js->clj (.-payload data) :keywordize-keys true))
      "wedex-boardcast" "TODO: use postMessageExternal"
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

(defn ^:dev/after-load render []
  (js/window.addEventListener "message" on-message)
  (js/window.postMessage (clj->js {:type "request-bookmarks"} "*"))
  (rdom/render root [App]))

(defn ^:dev/before-load stop []
  (js/window.removeEventListener "message" on-message))

(defn init []
  (render))
