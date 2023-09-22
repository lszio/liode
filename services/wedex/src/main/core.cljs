(ns core
  (:require [goog.dom :as gdom]
            ;; [reagent.core :as r]
            [clojure.string :as s]
            [reagent.dom.client :as rdom]
            [components.action :refer (CommandPalette)]
            [components.clock :refer (Clock)]))

(defonce port (atom nil))
(defonce brx-id (atom ""))
(defonce root (rdom/create-root (gdom/getElement "app")))
(defonce chrome? (not (nil? js/chrome)))

(defonce query-pattern (atom '[:find [(pull ?e [* :db/id :as :key]) ...]  :where [?e :kind :bookmark]]))
(defonce update-actions (atom #(prn "update actions: count = " (count %))))

(defn App []
  [:main.min-h-screen.px-10
   [Clock]
   [CommandPalette update-actions]])

(defn send-request [r] (.postMessage @port (clj->js r)))

(defn query-actions []
  (send-request 
   {:type "query-actions" 
    :data (str @query-pattern)}))

(defn on-message [e]
  (let [data (.-data e)
        type (.-type data)]
    (case type
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

(defn on-port-message [m]
  (let [{type :type data :data} (js->clj m :keywordize-keys true)]
    (prn "Message from port: " type data)
    (case type
      "ping" (prn "ping from worker")
      "update-actions" (@update-actions data))))

(defn initialize-connect [^js port]
  (js/console.log "connect to" port)
  (.addListener (.-onMessage port) on-port-message)
  (query-actions))

(defn ^:dev/after-load render []
  (js/window.addEventListener "message" on-message)
  ;; (reset! brx-id @brx-id)
  (rdom/render root [App]))

(defn ^:dev/before-load stop [] 
  (js/window.removeEventListener "message" on-message))

(defn on-wedex-event [^js e]
  (let [detail (.-detail e)
        kind (.-kind detail)
        id (.-brxId detail)] 
    (case kind
      "ping" (reset! brx-id id))))

(defn on-port-changed [_ _ ^js o ^js n]
  (when (not (nil? o)) (.disconnect o))
  (when (not (nil? n)) (initialize-connect @port)))

(defn on-brx-id-changed [_ _ o n]
  (when (not (= o n))
    (when (and (not (s/blank? o)) (not (nil? @port)))
      (reset! port nil))
    (when (not (s/blank? n))
      (if chrome?
        (reset! port (js/chrome.runtime.connect n))
        (js/console.error "TODO: firefox?")))))

(defn init []
  (js/document.body.addEventListener "wedex" on-wedex-event)
  (add-watch port :reset on-port-changed)
  (add-watch brx-id :reset on-brx-id-changed)
  (render))
