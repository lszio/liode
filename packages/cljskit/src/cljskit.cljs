(ns cljskit)

(def ^:export foo 3.14)

(defn ^:export bar [] (prn "Hello Cljskit!!!"))

(defn generate-exports []
    #js {:foo foo :bar bar}
)
