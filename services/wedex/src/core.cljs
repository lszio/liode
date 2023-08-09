(ns core
  (:require [goog.dom :as gdom]
            ["react-dom/client" :refer [createRoot]]))

(defonce root (createRoot (gdom/getElement "app")))

;; (defn- main []
;;   [:main.container 
;;    [:h1 "Hello World!"]])

;; (defn main []
;;   (prn "index")
;;   (js/console.log (.-version react))
;;   (let [node (.getElementById js/document "app")]
;;     (.render react-dom "Hello world!" node)))

(defn init []
  (js/console.log "init")
  (.render root "Hello World!"))

(defn ^:dev/after-load re-render []
  (js/console.log "re-render")
  (init))
