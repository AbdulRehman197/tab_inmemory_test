import { useState, useEffect } from "react";
import "./App.css";

function App({ bc }) {
  let [count, setCount] = useState(0);
  let [ch, setChannel] = useState("");
  let [tabs, setTabs] = useState([]);

  useEffect(() => {
    console.log("something...", tabs);
    bc.onmessage = (e) => {
      switch (e.data.type) {
        case "createTab":
          setTabId(e.data.id);
          break;
        case "nettime":
          netTimeSet(e.data);
          break;
        case "tabClosed":
          handleTabClosed(e.data);
          break;
        default:
          break;
      }
    };
    setChannel(bc);
    // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  }, [bc, tabs]);

  const handleTabClosed = ({ id }) => {
    let newlist = tabs.filter((oldtab) => {
      return oldtab.id !== id;
    });
    setTabs(newlist);
  };
  const netTimeSet = ({ id, netTime }) => {
    let updateTabs = tabs.map((tab) => {
      if (tab.id === id) return { ...tab, netTime: netTime };
      return tab;
    });
    setTabs(updateTabs);
  };
  const setTabId = (id) => {
    let newtablist = tabs.map((tab) => {
      if (tab.id === undefined) return { ...tabs[tabs.length - 1], id: id };
      return tab;
    });

    setTabs(newtablist);
    // console.log("tabs", tabs);
  };
  const handleOpenTab = () => {
    let tab = window.open("/newTab", "_blank", "noopener");
    setTabs((tabs) => [...tabs, { tab }]);
    // console.log("tab", tab);
  };

  const handleSaveFileCount = (
    e,
    { id, inputstring, fileCount, stringCount, method }
  ) => {
    // e.preventDefault();
    console.log("wind", window);
    // console.log("e", e);
    tabs.forEach((oldtab) => {
      // oldtab.onload = () => {
      if (oldtab.id === id) {
        bc.postMessage({
          type: "count",
          id,
          inputstring,
          fileCount,
          stringCount,
          method,
        });
      }
      // };
    });
  };
  const handleCloseTab = ({ id }) => {
    // setTabs(newlist);
    // tab.close();
    tabs.forEach((oldtab) => {
      // oldtab.onload = () => {
      if (oldtab.id === id) {
        ch.postMessage({
          type: "close",
          id,
        });
      }
      // };
    });
  };

  const handleFileCount = (e, id, type) => {
    // e.preventDefault();
    let newTbList = [...tabs];
    let newlist = newTbList.map((oldtab) => {
      if (type === "filecount" && oldtab.id === id) {
        return { ...oldtab, fileCount: e.target.value };
      } else if (type === "stringcount" && oldtab.id === id) {
        return { ...oldtab, stringCount: e.target.value };
      } else if (type === "radio" && oldtab.id === id) {
        return { ...oldtab, method: e.target.value };
      } else if (type === "string" && oldtab.id === id) {
        return { ...oldtab, inputstring: e.target.value };
      } else {
        return oldtab;
      }
    });
    setTabs(newlist);
  };
  return (
    <div className="App">
      <h1>App</h1>
      {/* {console.log("state", tabs)} */}
      <button onClick={handleOpenTab}>Open Tab</button>

      <>
        <div id="tabs">
          <table>
            {tabs.length > 0 ? (
              <thead>
                <tr>
                  <th>Tab ID</th>
                  <th>String</th>
                  <th>String Repeat Count</th>
                  <th>File Repeat Count</th>
                  <th>Data Structure</th>
                  <th>Net Time</th>
                  <th>File Save Method</th>
                  <th>Tab Close</th>
                </tr>
              </thead>
            ) : null}

            <tbody>
              {tabs.length > 0
                ? tabs.map((tab, i) => {
                    return (
                      <tr key={i}>
                        <td>{tab.id}</td>
                        <td>
                          {" "}
                          <input
                            onChange={(e) =>
                              handleFileCount(e, tab.id, "string")
                            }
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            onChange={(e) =>
                              handleFileCount(e, tab.id, "stringcount")
                            }
                            type="number"
                          />
                        </td>
                        <td>
                          <input
                            onChange={(e) =>
                              handleFileCount(e, tab.id, "filecount")
                            }
                            type="number"
                          />
                        </td>
                        <td>
                          <input
                            type="radio"
                            value="Object"
                            onChange={(e) =>
                              handleFileCount(e, tab.id, "radio")
                            }
                            name={tab.id}
                            checked={tab.method === "Object"}
                          />
                          <lable>Object</lable>
                          <input
                            type="radio"
                            value="Array"
                            onChange={(e) =>
                              handleFileCount(e, tab.id, "radio")
                            }
                            name={tab.id}
                            checked={tab.method === "Array"}
                          />
                          <lable>Array</lable>
                          <input
                            type="radio"
                            value="Map"
                            onChange={(e) =>
                              handleFileCount(e, tab.id, "radio")
                            }
                            name={tab.id}
                            checked={tab.method === "Map"}
                          />
                          <lable>Map</lable>
                          <input
                            type="radio"
                            value="Set"
                            onChange={(e) =>
                              handleFileCount(e, tab.id, "radio")
                            }
                            name={tab.id}
                            checked={tab.method === "Set"}
                          />
                          <lable>Set</lable>
                        </td>
                        <td>{tab.netTime ? tab.netTime : "waiting..."}</td>
                        <td>
                          <button onClick={(e) => handleSaveFileCount(e, tab)}>
                            Start Processing
                          </button>
                        </td>
                        <td>
                          <button onClick={() => handleCloseTab(tab)}>
                            Close Tab
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
}

export default App;
