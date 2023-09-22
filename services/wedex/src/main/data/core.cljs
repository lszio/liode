(ns ^:dev/once data.core
  (:require [malli.core :as m]
            [cljs.reader :refer (read-string)]
            [malli.generator :as mg]
            [datascript.core :as d]))

(def actions (d/create-conn {}))

(def window-schema
  [:map
   {:title "Window"}
   [:id int?]
   [:type string?]

   [:state string?]
   [:focused boolean?]

   [:incognito boolean?]
   [:alwaysOnTop boolean?]

   [:top int?]
   [:left int?]
   [:width int?]
   [:height int?]])

(def tab-schema
  [:map
   {:title "Tab"}
   [:id int?]
   [:index int?]
   [:groupId  int?]
   [:windowId int?]

   [:url string?]
   [:status string?]
   [:title string?]
   [:favIconUrl {:optional true} string?]

   [:pinned boolean?]
   [:active boolean?]
   [:audible boolean?]
   [:incognito boolean?]
   [:autoDiscardable boolean?]
   [:discarded boolean?]
   [:highlighted boolean?]
   [:selected boolean?]

   [:mutedInfo [:map [:muted boolean?]]]

   [:width int?]
   [:height int?]])

(def bookmark-schema
  [:map
   {:title "Bookmark"}

   [:id [:or string? int?]]
   [:index int?]
   [:parentId [:or string? int?]]
   [:dateAdded int?]
   [:dateLastUsed {:optional true} int?]

   [:url string?]
   [:title string?]])

(def group-schema
  [:map
   {:title "Group"}

   [:id [:or int? string?]]
   [:index int?]
   [:parentId [:or string? int?]]

   [:dateAdded int?]
   [:dateGroupModified {:optional true} int?]

   [:title string?]])

(def history-schema
  [:map
   {:title "History"}
   [:id [:or int? string?]]

   [:typedCount int?]
   [:visitCount int?]

   [:lastVisitTime float?]

   [:url string?]
   [:title string?]])

(def tab? (m/validator tab-schema))
(def group? (m/validator group-schema))
(def window? (m/validator window-schema))
(def history? (m/validator history-schema))
(def bookmark? (m/validator bookmark-schema))

(defn reset-actions [] 
  (d/reset-conn! actions (d/empty-db (d/schema (d/db actions)))))

(defn insert-actions [as]
  (d/transact! actions as))

(defn remove-actions [as])

(defn mark-action [a]
  (assoc a :kind (cond 
                   (bookmark? a) :bookmark
                   (tab? a) :tab
                   (group? a) :group
                   (history? a) :history
                   (window? a) :window
                   :else :unknown)))

(defn mark-actions [as] (map mark-action as))

(defn query-actions [q]
  (d/q (if (string? q) 
         (read-string q) 
         q) 
       @actions))

(defn query-kind [k]
  (d/q '[:find (count ?e). :in $ ?k :where [?e :kind ?k]] @actions k))

(defn summarize []
  (let [[wc bc tc uc gc hc] (map query-kind [:window :bookmark :tab :unknown :group :history])]
    {:window wc
     :history hc
     :bookmark bc
     :unknown uc
     :group gc
     :tab tc
     :count (+ wc hc bc uc tc)}))

(comment
  (mg/generate window-schema)
  (read-string
    (str 
      (read-string "[:find (pull ?e [*]) :where [?e :a :b]]"))) 
  (def cb (atom #(prn %)))

  (count '[1 2 3])

  (prn "asdf"))
