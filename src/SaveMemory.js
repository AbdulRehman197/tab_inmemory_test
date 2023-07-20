import { useState, useEffect, useRef } from "react";
const SaveMemory = () => {
  let [tabId, setTabId] = useState("");
  let [storeObject, setStoreObject] = useState({});
  let [storeArray, setStoreArray] = useState([]);
  let [storeMap, setStoreMap] = useState(new Map());
  let [storeSet, setStoreSet] = useState(new Set());
  let [fileSize, setFileSize] = useState(0);
  // let [fileCount, setFileCount] = useState(0);
  let bc = useRef(new BroadcastChannel("test_memory"));

  // useEffect(() => {
  //   console.log("fileSize chnage");

  //   let ObjectLenght = Object.keys(storeObject);
  //   if (tabId !== "") {
  //   }
  // }, [fileCount, fileSize, storeObject, tabId]);
  useEffect(() => {
    const handleTabClose = (event) => {
      event.preventDefault();
      bc.current.postMessage({
        type: "tabClosed",
        id: tabId,
      });

      return (event.returnValue = "");
    };
    window.onbeforeunload = handleTabClose;

    return () => {
      window.onbeforeunload = handleTabClose;
    };
  }, [tabId]);
  useEffect(() => {
    let id = crypto.randomUUID();
    bc.current.postMessage({
      type: "createTab",
      id: id,
    });
    setTabId(id);
    console.log("newid", id);
    bc.current.onmessage = (e) => {
      switch (e.data.type) {
        case "startProcess":
          if (tabId !== "") {
            // setTimeout(() => {
            handleFunction(e.data, tabId);
            // }, 1500);
          } else {
            setTabId((id) => {
              // setTimeout(() => {
              handleFunction(e.data, id);
              // }, 1500);
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
  const handleFunction = async (data, tabID) => {
    let { ids, inputstring, fileCount, stringCount, method } = data;
    setTabId(tabID);
    console.log("id", data);
    let getValue = getTheid(ids, tabID);
    console.log("getValue", getValue);

    if (getValue) {
      console.log("this is tab", tabID);
      let t0 = performance.now();
      let userString = "";
      for (let i = 0; i < stringCount; i++) {
        userString += inputstring;
      }
      console.log("1", inputstring);

      let fileS = new Blob([userString]).size;
      let props = {
        id: tabID,
        fileSize: fileS,
        targetCount: fileCount,
        status: "open",
        method,
      };

      switch (method) {
        case "Object":
          // let obj = {};
          // let no = recursiveFunction(fileCount, userString, tabID, props, obj);
          // console.log("object trigerd", no);
          // let object = {};

          for (let i = 0; i < fileCount; i++) {
            // obj = { ...obj, [userString + i]: userString };
            setStoreObject((oldStoreObject) => {
              handleCalculate(
                Object.keys(oldStoreObject).length,
                props,
                tabID,
                t0
              );
              return {
                ...oldStoreObject,
                [userString + i]: userString,
              };
            });
          }

          break;
        case "Array":
          for (let i = 0; i < fileCount; i++) {
            setStoreArray((oldStoreArray) => {
              handleCalculate(oldStoreArray.length, props, tabID, t0);
              // oldStoreArray.push(userString)
              return [...oldStoreArray, userString + i];
            });
          }
          break;
        case "Map":
          for (let i = 0; i < fileCount; i++) {
            setStoreMap((oldStoreMap) => {
              handleCalculate(oldStoreMap.size, props, tabID, t0);
              return oldStoreMap.set(userString + i, userString);
            });
          }
          break;
        case "Set":
          for (let i = 0; i < fileCount; i++) {
            setStoreSet((oldStoreSet) => {
              handleCalculate(oldStoreSet?.size, props, tabID, t0);
              return oldStoreSet.add(userString + i);
            });
          }
          break;

        default:
          break;
      }

      // console.log("new string", userString);
      // console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    }
  };
  const handleCalculate = (methodStore, props, tabID, t0) => {
    let { targetCount } = props;
    let obj = methodStore + 2;
    let percentage = Math.ceil((obj * 100) / targetCount);
    console.log("obj", targetCount);

    // console.log("percetage", percentage);
    if (Math.floor(percentage % 5) == 0) {
      bc.current.postMessage({
        type: "updateProps",
        id: tabID,
        props: {
          ...props,
          currentCount: percentage,
        },
      });
    }
    if (obj == targetCount) {
      // console.log("cled", obj);
      let t1 = performance.now();

      // setTimeout(() => {
      bc.current.postMessage({
        type: "nettime",
        id: tabID,
        netTime: t1 - t0,
      });
      // }, 1000);

      // return methodStore;
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
    console.log("store", store);
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
      <p>{tabId}</p>
      <p>
        Size:{" "}
        {Object.keys(storeObject).length ||
          storeArray.length ||
          storeMap.size ||
          storeSet.size}
      </p>
      {/* {storeArray.length > 0 ? renderString(storeArray) : null} */}
      {/* {storeObject !== {} ? renderString(Object.values(storeObject)) : null}
      {storeMap.size > 0 ? renderString(getValues(storeMap)) : null}
      {storeSet.size > 0 ? renderString(getValues(storeSet)) : null} */}
    </div>
  );
};
export default SaveMemory;
