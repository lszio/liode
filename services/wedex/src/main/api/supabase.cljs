(ns api.supabase
  (:require ["@supabase/supabase-js" :as sb]))

(goog-define SUPABASE_URL "url")
(goog-define SUPABASE_ANON_KEY "key")

(defonce client 
  (sb/createClient 
   SUPABASE_URL 
   SUPABASE_ANON_KEY 
   #js {:auth {:persistSession false}}))

(js/console.log client)

(defn login-with-github []
  (-> client .-auth (.signInWithOAuth #js {:provider "github"})))
