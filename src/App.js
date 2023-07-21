import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  let [state, setState] = useState({
    string: "",
    fileCount: "0",
    stringCount: 0,
    method: "Object",
  });
  let bc = useRef(new BroadcastChannel("test_memory"));

  let worker = useRef("");

  let [tabs, setTabs] = useState([]);
  let [ids, setIds] = useState([]);

  useEffect(() => {
    // console.log(" worker", worker.current);
    worker.current = new SharedWorker("worker.js");
    // worker.current.port.postMessage("app");
    worker.current.port.onmessage = function (e) {
      console.log("Message received from worker", e);
      switch (e.data.type) {
        case "createTab":
          setState((preState) => {
            worker.current.port.postMessage({
              type: "startProcess",
              state: preState,
            });
            return preState;
          });

          break;
        case "reaceviedTab":
          console.log(e.data);
          setTabs((preState) => [...preState, e.data.state]);
          break;
        case "updateTabInfo":
          debugger;
          console.log("updateTabInfo", e.data);
          updateInfo(e.data);
          break;
        default:
          break;
      }
      // console.log("e", e);
    };
    // worker.port.start();
    const updateInfo = ({ id, prop }) => {
      setTabs((updateTabs) => {
        return updateTabs.map((tab) => {
          // Returns a new tab with the same id as the tab.
          console.log("tab111", tab);
          if (tab.id === id) return { ...tab, ...prop };

          return tab;
        });
      });
    };
    // // console.log("something...", ids);
    // bc.current.onmessage = (e) => {
    //   // The data type of the tab is a tab created by the user.
    //   switch (e.data.type) {
    //     case "createTab":
    //       setState((preState) => {
    //         let { string, fileCount, stringCount, method } = preState;
    //         bc.current.postMessage({
    //           type: "startProcess",
    //           ids,
    //           inputstring: string,
    //           fileCount,
    //           stringCount,
    //           method,
    //         });
    //         return preState;
    //       });
    //       setTabId(e.data.id);
    //       setIds((preIds) => [...preIds, e.data.id]);
    //       break;
    //     // case "createTabHandler":
    //     //   // createTab(e.data);
    //     //   debugger;
    //     //   console.log("trigerr");
    //     //   break;
    //     case "updateProps":
    //       debugger;
    //       handleChangeProps(e.data);
    //       break;
    //     case "nettime":
    //       netTimeSet(e.data);
    //       break;
    //     case "tabClosed":
    //       handleTabClosed(e.data);
    //       break;

    //     default:
    //       break;
    //   }
    // };

    // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  }, []);
  const createTab = ({ props }) => {
    let { id } = props;
    setIds((preIds) => [...preIds, id]);
    setTabs((pretabs) => [...pretabs, props]);
  };
  const handleChangeProps = ({ props, id }) => {
    // setTabId(e.data.id);

    let updateTabs;
    if (tabs.length > 0) {
      updateTabs = tabs.map((tab) => {
        // Returns a new tab with the same id as the tab.
        if (tab.id === id) return { ...tab, ...props };
        setTabs((preTbas) => [...preTbas, { id: id, ...props }]);
        return tab;
      });
    } else {
      updateTabs = [props];
    }

    setTabs(updateTabs);
  };

  const handleTabClosed = ({ id }) => {
    let updateTabs = tabs.map((tab) => {
      // Returns a new tab with the same id as the tab.
      if (tab.id === id) return { ...tab, status: "closed" };
      return tab;
    });
    setTabs(updateTabs);
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
    e.preventDefault();
    // let { string, fileCount, stringCount, method } = state;
    // count the number of items in the oldtab
    window.open("/newTab", "_blank", "noopener");
    // setTimeout(() => {
    //   worker.current.port.postMessage({
    //     type: "startProcess",
    //     state,
    //   });
    // }, 1000);
    // setTimeout(() => {

    // }, 1500);
  };
  const handleCloseTab = (id) => {
    // setTabs(newlist);
    // tab.close();
    tabs.forEach((oldtab) => {
      // oldtab.onload = () => {
      // Close the oldtab. id if oldtab. id is oldtab. id
      if (oldtab.id === id) {
       worker.current.port.postMessage({
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
      {console.log("state", state)}
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
                    checked={state?.method === "Object"}
                  />
                  <lable>Object</lable>
                  <input
                    type="radio"
                    value="Array"
                    onChange={handleOnChange}
                    name="method"
                    checked={state?.method === "Array"}
                  />
                  <lable>Array</lable>
                  <input
                    type="radio"
                    value="Map"
                    onChange={handleOnChange}
                    name="method"
                    checked={state?.method === "Map"}
                  />
                  <lable>Map</lable>
                  <input
                    type="radio"
                    value="Set"
                    onChange={handleOnChange}
                    name="method"
                    checked={state?.method === "Set"}
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
                      <td>{tab?.fileCount}</td>
                      <td>{tab?.currentCount}</td>
                      <td>{tab?.method}</td>
                      <td>{tab?.status}</td>
                      <td>{tab?.ram}</td>
                      <td>{tab?.netTime}</td>
                      <td>
                        <button onClick={() => handleCloseTab(tab.id)}>
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
