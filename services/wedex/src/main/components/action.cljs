(ns components.action
  (:require [datascript.core :as d]
            [reagent.core :as r]))

(defn do-query 
  ([db] (do-query db ""))
  ([db s] (do-query db s '[*]))
  ([db s p]
   (let [q '[:find [(pull ?e p) ...]
             :in $ ?s p
             :where
             [?e :url ?u]
             [?e :title ?t]
             (or [(clojure.string/includes? ?u ?s)]
                 [(clojure.string/includes? ?t ?s)])]
         cs (d/q q db s (or p '[*]))]
     cs)))

(defn BookmarkAction [action]
  (let [{url :url
         title :title
         group :group } action] 
    ;; (prn action key title)
    [:li.h-8.flex.flex-row.align-middle.cursor-pointer
     {:title url
      :on-click #(js/window.open url "_blank")}
     [:span {} "B: "]
     [:span.h-full.inline-block.grow.truncate {} title]
     [:div.h-full.groups {} group]]))

(defn WindowAction [action]
  (let [{url :url
         title :title
         group :group
         key :db/id } action]
    [:li.h-8.flex.flex-row.align-middle.cursor-pointer
     {:title url
      :on-click #(js/window.open url "_blank")}
     [:span {} "W: "]
     [:span.h-full.inline-block.grow.truncate {} title]
     [:div.h-full.groups {} group]]))

(defn UnknownAction [action]
  [:li.h-8.flex.flex-row.align-middle.cursor-pointer
     {:key key}
     [:span {} "U: "]
     [:span.h-full.inline-block.grow.truncate {} "Unknown"]])

(defn ^:export CommandPalette [update-actions]
  (let [search (r/atom "")
        ;; current (r/atom -1)
        actions (r/atom [])] 
    (reset! update-actions #(reset! actions %))
    (fn []
      [:div.command-palette
       [:input.w-full.h-8.border-zinc-200.border-2
        {:default-value @search
         :on-change #(->> % .-target .-value (reset! search))}]
       [:ul.divide-y.divided-dashed
        (for [c @actions]
          (let [{kind :kind
                 key :id} c] 
            ^{:key key} [(case kind "bookmark" BookmarkAction "window" WindowAction UnknownAction) c]))]])))
