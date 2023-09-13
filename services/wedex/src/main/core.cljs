(ns core
  (:require [goog.dom :as gdom]
            ;; [cljs.pprint :as pp]
            ;; [react :as react]
            ;; [api.supabase :as sb]
            [crx.apis :as api]
            [clojure.string :as s]
            [reagent.core :as r]
            [reagent.dom.client :as rdom]
            ;; [shadow.cljs.modern :refer (js-await)]
            [components.clock :refer (Clock)]))

(defonce root (rdom/create-root (gdom/getElement "app")))
(def ws (r/atom []))
(def ts (r/atom []))
(def bs (r/atom []))
(def gs (r/atom {}))
(def hs (r/atom []))

(defn WindowBox [w]
  (let [id (get w "id")]
    [:div.window-box
     {:key (get w id)
      :style {:width (get w "width")}}
     [:span id]]))

(defn bookmark-group? [i]
  (nil? (get i "url" nil)))

(defn match-with-text [b t]
  (let [title (get b "title")
        groups (get b "groups" [])
        url (get b "url")]
    (or (contains? groups t) 
        (s/includes? title t)
        (s/includes? url t))))

(defn BookmarkList []
  (let [search (r/atom "")]
    (fn []
      [:div.bookmark-list
       [:input.w-full.h-8.border-zinc-200.border-2
        {:default-value @search 
         :on-change #(->> % .-target .-value (reset! search))}]
       [:ul.divide-y.divide-dashed
         (for [b (doall (filter #(match-with-text % @search) @bs))]
           [:li.h-8.flex.flex-row.align-middle.cursor-pointer 
            {:key (get b "id") 
             :on-click #(js/window.open (get b "url") "_blank")}
            [:span.h-full.inline-block.grow.truncate {} (get b "title")]
            [:div.h-full.groups (get b "group")]])]])))

(defn App []
  [:main.min-h-screen.px-10
   [Clock]
   [BookmarkList]])

(defn with-groups [b]
  b)

(defn update-bookmarks [l]
  (let [gl (doall (filter bookmark-group? l))
        bl (doall (filter #(not (bookmark-group? %)) l))] 
    (js/console.log (str "update-bookmarks: "))
    (reset! bs bl)
    (reset! gs gl)))

(defn update-windows [l]
  (reset! ws l))

(defn update-tabs [t]
  (reset! ts t))

(defn update-histories [h]
  (reset! hs h))

(defn on-message [e]
  (let [data (.-data e)
        type (.-type data)]
    (case type
      "update-bookmarks" (update-bookmarks (js->clj (.-payload data)))
      "wedex-boardcast" "TODO: use postMessageExternal"
      "unknown")))

(defn ^:dev/after-load render []
  (js/window.addEventListener "message" on-message)
  (js/window.postMessage (clj->js {:type "request-bookmarks"} "*"))
  ;; (js/setTimeout 
  ;;  (fn []
  ;;    (-> (js/document.querySelectorAll "link[rel=stylesheet]")
  ;;        (.forEach (fn [l]
  ;;                    (let [href (-> l .-href (.replace #"\?.*|$", (str "?t=" (.now js/Date))))
  ;;                          h (-> l .-href (.replace #"\?.*|$", ""))]
  ;;                      (aset l "href" href)
  ;;                      (aset l "href" h)
  ;;                      (prn (.now js/Date))
  ;;                      ))))) 1000)
  (rdom/render root [App]))

(defn ^:dev/before-load stop []
  (js/window.removeEventListener "message" on-message))

(defn init []
  (render))
