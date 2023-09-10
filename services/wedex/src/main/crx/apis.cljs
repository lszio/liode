(ns crx.apis)

(defonce chrome? (not (nil? js/chrome.runtime)))

;; (defonce chrome-port (when chrome? (js/chrome.runtime.connect)))
