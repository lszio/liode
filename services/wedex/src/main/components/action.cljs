(ns components.action
  (:require [datascript.core :as d ]
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
         group :group
        } action]
    [:li.h-8.flex.flex-row.align-middle.cursor-pointer
     { :title url
      :on-click #(js/window.open url "_blank")}
     [:span {} "B: "]
     [:span.h-full.inline-block.grow.truncate {} title]
     [:div.h-full.groups {} group]]))

(defn ^:export CommandPalette [conn]
  (let [search (r/atom "")
        ;; current (r/atom -1)
        cs (r/atom [])] 
    (add-watch conn :watcher #(reset! cs (do-query @conn @search)))
    (add-watch search :watcher #(reset! cs (do-query @conn @search)))
    (fn []
      [:div.command-palette
       [:input.w-full.h-8.border-zinc-200.border-2
        {:default-value @search
         :on-change #(->> % .-target .-value (reset! search))}]
       [:ul.divide-y.divided-dashed
        (for [c @cs]
          (let [{kind :kind
                 key :db/id }
                 c]
            (case kind
              :bookmark ^{:key key} [BookmarkAction c])))]])))
