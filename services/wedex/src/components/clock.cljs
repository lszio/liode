(ns components.clock
  (:require [reagent.core :as r] 
            [reagent.dom :as rdom]
            [clojure.string :as str])) 

(defonce timer (r/atom (js/Date.)))
(defonce time-updater (js/setInterval #(reset! timer (js/Date.)) 1000))

(defn Clock []
  (let [time-str (-> @timer .toTimeString (str/split " ") first)]
    [:div.clock {:style {:color "#f34"}} time-str]))
