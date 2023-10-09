(ns components.action
  (:require [clojure.string :as s]
            [reagent.core :as r]))

;; (defn do-query 
;;   ([db] (do-query db ""))
;;   ([db s] (do-query db s '[*]))
;;   ([db s p]
;;    (let [q '[:find [(pull ?e p) ...]
;;              :in $ ?s p
;;              :where
;;              [?e :url ?u]
;;              [?e :title ?t]
;;              (or [(clojure.string/includes? ?u ?s)]
;;                  [(clojure.string/includes? ?t ?s)])]
;;          cs (d/q q db s (or p '[*]))]
;;      cs)))

(defn on-action-click [a e]
  (let [{k :kind} a]
    (case k
      "bookmark" (js/window.open (:url a) "_blank"))))

(defn ActionIcon [action]
  [:span.min-w-8.min-h-8.rounded-full.bg-slate-100.px-3 (-> action :kind first s/upper-case)])

(defn CommandItem [action]
  (let [{title :title
         url :url
         group :group } action]
    [:li.h-8.flex.flex-row.align-middle.cursor-pointer
     {:title url
      :on-click #(on-action-click action %)}
     [ActionIcon action]
     [:span.h-full.inline-block.grow.truncate {} title]
     [:div.h-full.groups {} group]]))


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
            ^{:key key} [CommandItem c]))]])))
