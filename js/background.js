// Generated by CoffeeScript 1.12.7
(function() {
  var activities, favorites, localDB, onMessageHandler, selectDate, selectHour, tabUidList;

  favorites = {};

  selectDate = {};

  selectHour = {};

  chrome.extension.onConnect.addListener(function(port) {
    var portCtoB;
    if (port.name === "CtoB") {
      portCtoB = port;
      portCtoB.onMessage.addListener(onMessageHandler);
      return portCtoB.onDisconnect.addListener(function() {
        return portCtoB.onMessage.removeListener(onMessageHandler);
      });
    }
  });

  onMessageHandler = function(msg) {
    switch (msg.command) {
      case "sendFavorites":
        chrome.tabs.getSelected(null, function(tab) {
          var tabId;
          tabId = tab.id;
          return chrome.pageAction.show(tabId);
        });
        favorites = msg.favorites;
        return $.ajax({
          method: "GET",
          url: "https://share.timescar.jp/view/station/search.jsp"
        }).done(function(resp) {
          var resp$;
          resp$ = $(resp);
          selectDate = resp$.find("#takeDate").find("option:first").remove().end().find("option:first").attr("selected", "selected").end();
          selectHour = resp$.find("#takeHour").find("option:first").remove().end().find("option:first").attr("selected", "selected").end();
          return Array.prototype.forEach.call(selectHour.find("option"), function(option) {
            var option$, text;
            text = (option$ = $(option)).text();
            return option$.text(text + ":00");
          });
        });
    }
  };

  activities = {};

  tabUidList = {};

  localDB = localStorage.tpstations ? JSON.parse(localStorage.tpstations) : {};

  window.tp = {
    mapView: {},
    tabidScdSeach: 0,
    tabidFavorite: 1,
    createNewTab: function(activity) {
      var uid, url;
      uid = (new Date()).getTime().toString();
      url = "newtab.html?uid=" + uid;
      activities[uid] = activity;
      chrome.tabs.getSelected(null, function(tab) {
        return chrome.tabs.create({
          index: tab.index + 1,
          url: url
        }, function(tab) {
          tabUidList[tab.id] = uid;
          return chrome.pageAction.show(tab.id);
        });
      });
      return chrome.tabs.onRemoved.addListener(function(tabId) {
        uid = tabUidList[tabId];
        if (uid) {
          return delete activities[uid];
        }
      });
    },
    bgCloseTab: function(uid) {
      var key, results, value;
      results = [];
      for (key in tabUidList) {
        value = tabUidList[key];
        if (value === uid) {
          results.push(chrome.tabs.remove(parseInt(key, 10)));
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    getFavorites: function() {
      return favorites;
    },
    setActivity: function(uid, activity) {
      return activities[uid] = activity;
    },
    getActivity: function(uid) {
      if (uid) {
        return activities[uid];
      } else {
        return favorites;
      }
    },
    getLocalDB: function(scd) {
      if (scd) {
        return localDB[scd];
      } else {
        return localDB;
      }
    },
    setLocalDB: function(scd, stations) {
      return localDB[scd] = stations;
    },
    saveLocalDB: function(misc) {
      localDB.misc = misc;
      return localStorage.tpstations = JSON.stringify(localDB);
    },
    getSelectDateHour: function(container) {
      container.selectDate = selectDate;
      return container.selectHour = selectHour;
    }
  };

}).call(this);