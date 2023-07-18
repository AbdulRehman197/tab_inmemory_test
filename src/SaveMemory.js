import { useState, useEffect, useRef } from "react";
const SaveMemory = () => {
  let [tabId, setTabId] = useState("");
  let [storeObject, setStoreObject] = useState({});
  let [storeArray, setStoreArray] = useState([]);
  let [storeMap, setStoreMap] = useState(new Map());
  let [storeSet, setStoreSet] = useState(new Set());
  let [ram, setRam] = useState(0);
  let bc = useRef(new BroadcastChannel("test_memory"));
  useEffect(() => {
    let id = crypto.randomUUID();
    console.log("bc1", bc.current);

    bc.current.postMessage({
      type: "createTab",
      id: id,
    });

    console.log("bc2", bc.current);
    setTabId(id);
    console.log("newid", id);
    bc.current.onmessage = (e) => {
      switch (e.data.type) {
        case "startProcess":
          console.log("start", e.data);
          if (tabId !== "") {
            handleFunction(e.data, tabId);
          } else {
            setTabId((id) => {
              handleFunction(e.data, id);
            });
          }
          break;
        case "close":
          if (tabId !== "") {
            handleCloseFunction(e.data.id, tabId);
          } else {
            setTabId((id) => {
              handleCloseFunction(e.data.id, id);
            });
          }
          break;

        default:
          break;
      }
    };
  }, [bc]);
  const handleCloseFunction = (id, tabID) => {
    setTabId(tabID);
    console.log("tabid", tabID);
    if (id === tabID) {
      bc.current.postMessage({
        type: "tabClosed",
        id,
      });
      setTimeout(() => {
        window.close();
      }, 10);
    }
  };

  const sendMessage = (type, id, props) => {
    bc.current.postMessage({
      type: type,
      id: id,
      props,
    });
  };
  const handleFunction = (
    { ids, inputstring, fileCount, stringCount, method },
    tabID
  ) => {
    debugger;
    setTabId(tabID);
    console.log("id", ids, tabID);
    let getValue = getTheid(ids, tabID);
    console.log("getValue", getValue);

    if (getTheid(ids, tabID)) {
      console.log("this is tab", tabID);
      let t0 = performance.now();
      let userString = "";
      for (let i = 0; i < stringCount; i++) {
        userString += inputstring;
      }
      switch (method) {
        case "Object":
          // sendMessage("updateProps", tabID, props);

          for (let i = 0; i < fileCount; i++) {
            setStoreObject((oldStoreObject) => ({
              ...oldStoreObject,
              [userString + i]: userString,
            }));
          }
          break;
        case "Array":
          for (let i = 0; i < fileCount; i++) {
            setStoreArray((storeFiles) => [...storeFiles, userString]);
          }
          break;
        case "Map":
          for (let i = 0; i < fileCount; i++) {
            setStoreMap((oldStoreMap) =>
              oldStoreMap.set(userString + i, userString)
            );         
          }
          break;
        case "Set":
          for (let i = 0; i < fileCount; i++) {
            setStoreSet((oldStoreSet) => oldStoreSet.add(userString + i));
          }
          break;

        default:
          break;
      }

      // console.log("new string", userString);
      // console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    }
  };


  const getTheid = (ids, tabId) => {
    console.log("getid", ids, tabId);
    if (ids.length > 0) {
      return !ids.includes(tabId);
    } else {
      return true;
    }
  };

  const renderString = (store) => {
    debugger;
    return store.map((str, i) => {
      return <p key={i}>{str}</p>;
    });
  };
  const getValues = (store) => {
    let text = [];
    for (const x of store.values()) {
      text = [...text, x];
    }
    return text;
  };
  return (
    <div>
      <h1>Save Memory Tab</h1>
      <p>
        Size:{" "}
        {Object.keys(storeObject).length ||
          storeArray.length ||
          storeMap.size ||
          storeSet.size}
      </p>
      {/* {storeObject !== {} ? renderString(Object.values(storeObject)) : null}
      {storeArray.length > 0 ? renderString(storeArray) : null}
      {storeMap.size > 0 ? renderString(getValues(storeMap)) : null}
      {storeSet.size > 0 ? renderString(getValues(storeSet)) : null} */}
    </div>
  );
};
export default SaveMemory;
