(ns components.clock
  (:require [reagent.core :as r] 
            [clojure.string :as str])) 

(defonce timer (r/atom (js/Date.)))
(defonce time-updater (js/setInterval #(reset! timer (js/Date.)) 1000))

(defn Clock []
  (let [time-str (-> @timer .toTimeString (str/split " ") first)]
    [:div.font-mono.text-3xl.text-blue-300
     [:div.border-solid.text-center time-str]]))
