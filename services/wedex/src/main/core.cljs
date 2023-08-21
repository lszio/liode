(ns core
  (:require [goog.dom :as gdom]
            ;; [cljs.pprint :as pp]
            [reagent.core :as r]
            [reagent.dom.client :as rdom]
            ;; [shadow.cljs.modern :refer (js-await)]
            [components.clock :refer (Clock)]))

(defonce root (rdom/create-root (gdom/getElement "app")))
(def ws (r/atom []))
(def ts (r/atom []))
(def bs (r/atom []))
(def gs (r/atom {}))

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

(defn BookmarkList [l] 
  (let [length (count l)]
    [:div.bookmark-list
     [:span length]
     [:ul 
      (for [b l]
           [:li {:key (get b "id")}  
            [:a {:href (get b "url") :target "_blank"} (get b "title")]])]]))

(defn App []
  (let [window-list @ws
        bookmark-list @bs]
    [:main.w-screen.min-h-screen
      [Clock]
      [WindowList window-list]
      [BookmarkList bookmark-list]]))

(defn update-bookmarks [l]
  (reset! bs [])
  (reset! gs [])
  (doseq [i l]
    (if (bookmark-group? i)
      (swap! gs conj i)
      (swap! bs conj i))))

(defn update-windows [l]
  (reset! ws l))

(defn update-tabs [t]
  (reset! ts t))

(defn ^:dev/after-load render []
  (js/chrome.windows.getAll #(-> % js->clj update-windows))
  (js/chrome.bookmarks.search #js {} #(-> % js->clj update-bookmarks)) 
  (js/chrome.tabs.query #js {} #(-> % js->clj update-tabs))
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
