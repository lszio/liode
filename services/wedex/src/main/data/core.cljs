(ns ^:dev/once data.core
  (:require [malli.core :as m]
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
   [:height int?]]
  )

(def tab-schema
  [:map
   {:title "Tab"}
   [:id int?]
   [:index int?]
   [:groudId int?]
   [:windowId int?]

   [:url string?]
   [:status string?]
   [:title string?]
   [:favIconUrl string?]

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

   [:id int?]
   [:index int?]
   [:parentId int?]
   [:dateAdded int?]
   [:dateLastUsed int?]

   [:url string?]
   [:title string?]])

(def group-schema
  [:map
   {:title "Group"}

   [:id int?]
   [:index int?]
   [:parentId int?]

   [:dateAdded int?]
   [:dateGroupModified int?]

   [:title string?]])

(def history-schema
  [:map
   {:title "History"}
   [:id int?]

   [:typedCount int?]
   [:visitCount int?]

   [:lastVisitTime float?]

   [:url string?]
   [:title string?]])

(def tab? (m/validator tab-schema))
(def window? (m/validator window-schema))
(def history? (m/validator history-schema))
(def group? (m/validator group-schema))
(def bookmark? (m/validator bookmark-schema))

(defn reset-actions [] 
  (d/reset-conn! actions (d/empty-db (d/schema (d/db actions)))))

(defn insert-actions [as]
  (d/transact! actions as))

(defn remove-actions [as])

(defn mark-action [a]
  (assoc a :kind (cond 
                   (tab? a) :tab
                   (bookmark? a) :bookmark
                   (group? a) :group
                   (history? a) :history
                   (window? a) :window
                   :else :unknown)))

(defn mark-actions [as] (map mark-action as))

;; (group? {:id 1 :kind :group :index 0 :title "adf" :parentId 123 :dateAdded 123 :dateGroupModified 2})

(comment
  ;; (d/reset-conn! conn (d/empty-db (d/schema (d/db conn))))

  ;; ;; (d/pull-many db '[*] [1])
  ;; (d/pull @conn '[*] 2)
  ;; (d/transact! conn [{:a 2 :b 3}
  ;;                    {:a 9 :b 1000}])

  ;; (d/transact! conn [{:db/retract 2}])

  ;; (d/q '[:find (pull ?e [*])
  ;;        :in $ ?v
  ;;        :where
  ;;        [?e :b ?b]
  ;;        [?e :a ?a]
  ;;        (or [(= ?b ?v)]
  ;;            [(= ?a ?v)])]
  ;;      @conn
  ;;      1000)


  (defonce action-schema
    [:map
     {:title "Action"}
     [:uuid string?]
     [:name string?]
     [:type string?]
     [:tags [:set string?]]
     [:args [:map]]
     [:time [:map
             [:create int?]
             [:modify int?]
             [:access int?]]]])

  (defn parse-time [i]
    (let [{create "dataAdded"
           access "dataLastUsed"
           :or {create (js/Date.now)}
           :as all} i]
      (prn all)
      {:create create
       :modify (or create)
       :access (or access)}))

  (parse-time (js->clj {"dataAdded" 123416} :keywordize-keys true))

  (defn bookmark-to-action [b]
    (let [{id :id title :title} b]
      {:id id
       :type :bookmark
       :name title
       :kind :group
       :args {}
       :time {}}))

  (let [{:keys [id name]}
        (js->clj #js {:id "qwer" :name "zxcv"})]
    {:id id :name name})
  )


(comment 
  '[1 2 3]
  '[e d]

  (conj '[e d] 'f)

  [1 2 3])
