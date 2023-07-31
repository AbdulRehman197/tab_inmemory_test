import { useState, useEffect, useRef } from "react";
import "./App.css";
function App({ wk }) {
  let [state, setState] = useState({
    string: "",
    fileCount: "0",
    stringCount: 0,
    method: "Object",
  });

  let worker = useRef("");
  let [tabs, setTabs] = useState([]);

  useEffect(() => {
    worker.current = wk;
    worker.current.port.onmessage = function (e) {
      // console.log("Message received from worker", e);
      switch (e.data.type) {
        case "createTab":
          // setTimeout(() => {
          // console.log("2");
          setState((preState) => {
            worker.current.port.postMessage({
              type: "startProcess",
              state: preState,
            });
            return preState;
          });
          // }, 1000);

          break;
        case "reaceviedTab":
          // console.log(e.data);
          setTabs((preState) => [...preState, e.data.state]);
          break;
        case "updateTabInfo":
          debugger;
          // console.log("updateTabInfo", e.data);
          updateInfo(e.data);
          break;
        default:
          break;
      }
      // console.log("e", e);
    };
    const updateInfo = ({ id, prop }) => {
      setTabs((updateTabs) => {
        return updateTabs.map((tab) => {
          // Returns a new tab with the same id as the tab.
          // console.log("tab111", tab);
          if (tab.id === id) return { ...tab, ...prop };

          return tab;
        });
      });
    };
  }, []);

  const handleSaveFileCount = async (e) => {
    e.preventDefault();
    // count the number of items in the oldtab
    // window.open(
    //   "/newTab",
    //   "_blank",
    //   "noopener,top=100,left=100,width=300,height=300"
    // );
    // eslint-disable-next-line no-undef
    await CefSharp.BindObjectAsync("Headless");
    // eslint-disable-next-line no-undef
    let isOpen = await Headless.createTab();
    console.log("isoepn", isOpen);
  };
  const handleCloseTab =async (id) => {
    // eslint-disable-next-line no-undef
    await CefSharp.BindObjectAsync("Headless");
    // eslint-disable-next-line no-undef
    let isOpen = await Headless.closeTab(id);
    console.log("isoepn", isOpen);
    // tabs.forEach((oldtab) => {
    //   if (oldtab.id === id) {
    //     worker.current.port.postMessage({
    //       type: "close",
    //       id,
    //     });
    //   }
    //   // };
    // });
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
      {/* {console.log("tabs", tabs)}
      {console.log("state", state)} */}
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
              tabs.map((tab, i) => {
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
                        <button onClick={() => handleCloseTab(i)}>
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
