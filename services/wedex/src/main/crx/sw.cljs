(ns ^:dev/once crx.sw
  [:require 
   [data.core :as data]
   [promesa.core :as p]])

;; (goog-define REDIRECT_URL "localhost")
(defonce chrome? (not (nil? js/chrome)))

(defonce ports (atom #{}))

(defn query-all []
  (if chrome? [(js/chrome.windows.getAll)
               (js/chrome.tabs.query #js {})
               (js/chrome.bookmarks.search #js {})
               (js/chrome.history.search #js {:text "" :maxResults 2000})]
      [])) ;; TODO: firefox?

(defn refresh-actions []
  (data/reset-actions)
  (p/-> (p/all (query-all))
        (js->clj :keywordize-keys true)
        flatten
        data/mark-actions
        data/insert-actions
        prn)
  )

(defn on-port-message [m p]
  (js/console.log "Port Message: " m p))

(defn on-port-disconnect [p]
  (js/console.log "Port Disconnect" p)
  (swap! ports disj p))

(defn on-external-message [m s c]
  (js/console.log "external message" m s c)
  (c "back result"))

(defn on-connect [^js port]
  (js/console.log "New port connection: " port)
  (swap! ports conj port)
  (-> port .-onMessage (.addListener on-port-message))
  (-> port .-onDisconnect (.addListener on-port-disconnect)))

(defn on-installed []
  (js/chrome.scripting.registerContentScripts
   (clj->js [{:id "message-broker"
              :js ["js/csw.js"]
              :matches ["*://*/*"]}])))

(defn init []
  (prn "init")
  (refresh-actions)
  ;; (js/chrome.bookmarks.onMoved.addListener get-bookmarks-from-chrome)
  ;; (js/chrome.bookmarks.onChanged.addListener get-bookmarks-from-chrome)
  ;; (js/chrome.bookmarks.onCreated.addListener get-bookmarks-from-chrome)
  ;; (js/chrome.bookmarks.onRemoved.addListener get-bookmarks-from-chrome)
  ;; (js/chrome.bookmarks.onImportEnded.addListener get-bookmarks-from-chrome)

  ;; (js/chrome.runtime.onMessage.addListener on-message)

  (js/chrome.runtime.onMessageExternal.addListener on-external-message)

  (js/chrome.runtime.onConnectExternal.addListener on-connect)
  (js/chrome.runtime.onInstalled.addListener on-installed))
