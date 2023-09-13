(ns ^:dev/once crx.sp
  (:require [goog.dom :as gdom]
            [reagent.dom.client :as rdom]))

(defonce root (rdom/create-root (gdom/getElement "app")))

(defn- app []
  [:main.container 
   [:h1 "Hello Side Panel"]])

(defn render []
  (js/console.log "render")
  (rdom/render root [app]))

(defn init []
  (js/console.log "init side panel")
  (render))

