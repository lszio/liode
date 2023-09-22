(ns ^:dev/once crx.sw
  [:require 
   [data.core :as d]
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
  (d/reset-actions)
  (p/-> (p/all (query-all))
        (js->clj :keywordize-keys true)
        flatten
        d/mark-actions
        d/insert-actions
        prn
        (prn (d/summarize))))

(defn on-message [m ^js s c]
  (let [type (.-type m)]
    (case type
      "request-tab-info" (c (.-tab s)))))

(defn send-response [m ^js p] (.postMessage p (clj->js m)))

(defn on-port-message [m p]
  (prn m p)
  (let [{type :type
         data :data} (js->clj m :keywordize-keys true)]
    (prn "Port Message: " type data p)
    (case type
      "query-actions" (send-response {:type "update-actions" :data (d/query-actions data)} p))))

(defn on-port-disconnect [p]
  (js/console.log "Port Disconnect" p)
  (swap! ports disj p))

(defn on-external-message [m s c]
  (js/console.log "external message" m s c)
  (c "back result"))

(defn on-connect [^js port]
  (js/console.log "New port connection: " port)
  (swap! ports conj port)
  (send-response {:type :ping :data [1 2 3]} port)
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

  (js/chrome.runtime.onMessage.addListener on-message)
  (js/chrome.runtime.onMessageExternal.addListener on-external-message)
  (js/chrome.runtime.onConnectExternal.addListener on-connect)
  (js/chrome.runtime.onInstalled.addListener on-installed))
