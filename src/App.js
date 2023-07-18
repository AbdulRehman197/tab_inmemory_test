import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  let [state, setState] = useState({
    string: "",
    fileCount: 0,
    stringCount: 0,
    method: "Object",
  });
  let bc = useRef(new BroadcastChannel("test_memory"));
  let [tabs, setTabs] = useState([]);
  let [ids, setIds] = useState([]);

  useEffect(() => {
    console.log("something...", ids);
    bc.current.onmessage = (e) => {
      debugger;
      // The data type of the tab is a tab created by the user.
      switch (e.data.type) {
        case "createTab":
          setTabId(e.data.id);
          setIds((preIds) => [...preIds, e.data.id]);

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
      // Returns a new tab with the same id as the tab.
      if (tab.id === id) return { ...tab, netTime: netTime };
      return tab;
    });
    setTabs(updateTabs);
  };
  const setTabId = (id) => {
    debugger;
    setTabs((preTabs) => [...preTabs, { id: id }]);
    // console.log("tabs", tabs);
  };

  const handleSaveFileCount = (e) => {
    let { string, fileCount, stringCount, method } = state;
    // count the number of items in the oldtab
    window.open("/newTab", "_blank", "noopener");

    setTimeout(() => {
      bc.current.postMessage({
        type: "startProcess",
        ids,
        string,
        fileCount,
        stringCount,
        method,
      });
    }, 1000);
  };
  const handleCloseTab = ({ id }) => {
    // setTabs(newlist);
    // tab.close();
    tabs.forEach((oldtab) => {
      // oldtab.onload = () => {
      // Close the oldtab. id if oldtab. id is oldtab. id
      if (oldtab.id === id) {
        bc.current.postMessage({
          type: "close",
          id,
        });
      }
      // };
    });
  };

  const handleOnChange = (e) => {
    setState((preState) => ({
      ...preState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="App">
      <h1>Inmemory App </h1>
      {console.log("tabs", tabs)}
      {/* <button onClick={handleOpenTab}>Open Tab</button> */}

      <>
        <div id="tabs">
          <table>
            <thead>
              <tr>
                {/* <th>Tab ID</th> */}
                <th>String</th>
                <th>String Repeat Count</th>
                <th>File Repeat Count</th>
                <th>Data Structure</th>
                {/* <th>Net Time</th> */}
                <th>File Save Method</th>
                {/* <th>Tab Close</th> */}
              </tr>
            </thead>

            <tbody>
              <tr>
                {/* <td>{tab.id}</td> */}
                <td>
                  {" "}
                  <input name="string" onChange={handleOnChange} type="text" />
                </td>
                <td>
                  <input
                    name="stringCount"
                    onChange={handleOnChange}
                    type="number"
                  />
                </td>
                <td>
                  <input
                    name="fileCount"
                    onChange={handleOnChange}
                    type="number"
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    value="Object"
                    onChange={handleOnChange}
                    name="method"
                    checked={state.method === "Object"}
                  />
                  <lable>Object</lable>
                  <input
                    type="radio"
                    value="Array"
                    onChange={handleOnChange}
                    name="method"
                    checked={state.method === "Array"}
                  />
                  <lable>Array</lable>
                  <input
                    type="radio"
                    value="Map"
                    onChange={handleOnChange}
                    name="method"
                    checked={state.method === "Map"}
                  />
                  <lable>Map</lable>
                  <input
                    type="radio"
                    value="Set"
                    onChange={handleOnChange}
                    name="method"
                    checked={state.method === "Set"}
                  />
                  <lable>Set</lable>
                </td>
                {/* <td>{tab.netTime ? tab.netTime : "waiting..."}</td> */}
                <td>
                  <button onClick={handleSaveFileCount}>
                    Start Processing
                  </button>
                </td>
                {/* <td>
                          <button onClick={() => handleCloseTab(tab)}>
                            Close Tab
                          </button>
                        </td> */}
              </tr>
              {/* })
                : null} */}
            </tbody>
          </table>
          <br />
          <br />
          <table>
            <thead>
              <tr>
                <th>Tab ID</th>
                <th>File Size (Bytes)</th>
                <th>File Target Count</th>
                <th>File Current Count</th>
                <th>Data Structure</th>
                <th>Status</th>
                <th>RAM Usage</th>
                <th>Net Time</th>
                <th>Tab Close</th>
              </tr>
            </thead>
            {tabs.length &&
              tabs.map((tab) => {
                return (
                  <tbody>
                    <tr>
                      <td>{tab.id}</td>
                      <td>{tab?.fileSize}</td>
                      <td>{tab?.targetCount}</td>
                      <td>{tab?.currentCount}</td>
                      <td>{tab?.Smethod}</td>
                      <td>{tab?.status}</td>
                      <td>{tab?.ram / 1024 / 1024}</td>
                      <td>{tab?.netTime}</td>
                      <td>
                        <button onClick={() => handleCloseTab()}>
                          Close Tab
                        </button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
          </table>
        </div>
      </>
    </div>
  );
}

export default App;
