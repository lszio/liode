(ns core
  (:require [goog.dom :as gdom]
            ;; [cljs.pprint :as pp]
            ;; [react :as react]
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

(defn WindowList [ws]
  (let [length (count ws)]
    [:div.window-list
     [:span length]
     (for [w ws] [WindowBox w])]))

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
      [:input.w-full.h-6 {:default-value @search :on-change #(->> % .-target .-value (reset! search))}]
      [:ul.divide-y.divide-dashed
        (for [b (filter #(match-with-text % @search) @bs)]
          [:li.h-8.flex.flex-row.align-middle.cursor-pointer
          {:key (get b "id") :on-click #(js/window.open (get b "url") "_blank")}
          [:span.h-full.inline-block.grow.truncate {} (get b "title")]
          [:div.h-full.groups "groups"]])]])))

(defn App []
  (let [bookmark-list @bs]
    [:main.min-h-screen.px-10
     [Clock]
      ;; [WindowList window-list]
     [BookmarkList bookmark-list]]))

(defn update-bookmarks [l]
  (let [bl (atom [])
        gl (atom [])]
    (doseq [i l]
      (if (bookmark-group? i)
        (swap! gl conj i)
        (swap! bl conj i))) 
    ;; (swap! gl (map #(prn)))
    (reset! bs @bl)
    (reset! gs @gl)))

(defn update-windows [l]
  (reset! ws l))

(defn update-tabs [t]
  (reset! ts t))

(defn update-histories [h]
  (reset! hs h))

(defn ^:dev/after-load render []
  (js/chrome.bookmarks.search #js {} #(-> % js->clj update-bookmarks))
  (js/chrome.windows.getAll #(-> % js->clj update-windows))
  (js/chrome.tabs.query #js {} #(-> % js->clj update-tabs))
  (js/chrome.history.search #js {:text ""} #(-> % js->clj update-histories))
  (rdom/render root [App]))

(defn on-create-window [w] (js/console.log w))
(defn on-remove-window [w] (js/console.log w))
(defn on-focus-window [w] (js/console.log w))

(defn attach-handlers []
  (js/chrome.windows.onCreated.addListener on-create-window)
  (js/chrome.windows.onRemoved.addListener on-remove-window)
  (js/chrome.windows.onFocusChanged.addListener on-focus-window))

(defn init []
  (attach-handlers)
  (render))
