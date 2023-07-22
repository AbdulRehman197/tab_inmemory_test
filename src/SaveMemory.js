import { useState, useEffect, useRef } from "react";
const SaveMemory = () => {
  let [state, setState] = useState({});
  let [storeObject, setStoreObject] = useState({});
  let [storeArray, setStoreArray] = useState([]);
  let [storeMap, setStoreMap] = useState(new Map());
  let [storeSet, setStoreSet] = useState(new Set());
  let worker = useRef("");

  useEffect(() => {
    worker.current = new SharedWorker("worker.js");
    worker.current.port.onmessage = function (e) {
      console.log("Message received from worker", e);
      switch (e.data.type) {
        case "startProcess":
          setState(e.data.state);
          console.log("datat recetved", e.data);
          handleFunction(e.data.state);
          break;
        case "close":
          window.close();
          break;
        default:
          break;
      }
    };
    const handleTabClose = (event) => {
      setState((Prestate) => {
        worker.current.port.postMessage({
          type: "closeTab",
          id: Prestate.id,
          prop: {
            status: "closed",
          },
        });
      });

      return (event.returnValue = "");
    };
    window.onbeforeunload = handleTabClose;

    return () => {
      window.onbeforeunload = handleTabClose;
    };
  }, []);

  const handleFunction = async (data) => {
    let { id, string, fileCount, stringCount, method } = data;
    let t0 = performance.now();
    let userString = "";
    for (let i = 0; i < stringCount; i++) {
      userString += string;
    }

    let fileS = new Blob([userString]).size;

    console.log("1", fileS);

    worker.current.port.postMessage({
      type: "reaceviedTab",
      state: {
        id,
        fileCount,
        method,
        fileSize: fileS,
        status: "open",
      },
    });

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
              fileCount,
              id,
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
            console.log("new Object", oldStoreArray);
            handleCalculate(oldStoreArray.length, fileCount, id, t0);
            // oldStoreArray.push(userString)
            return [...oldStoreArray, { [userString + i]: userString }];
          });
        }
        break;
      case "Map":
        for (let i = 0; i < fileCount; i++) {
          setStoreMap((oldStoreMap) => {
            handleCalculate(oldStoreMap.size, fileCount, id, t0);
            return oldStoreMap.set(userString + i, userString);
          });
        }
        break;
      case "Set":
        for (let i = 0; i < fileCount; i++) {
          setStoreSet((oldStoreSet) => {
            handleCalculate(oldStoreSet?.size, fileCount, id, t0);
            return oldStoreSet.add(userString + i);
          });
        }
        break;

      default:
        break;
    }

    // console.log("new string", userString);
    // console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
  };
  const handleCalculate = (methodStore, fileCount, id, t0) => {
    let obj = methodStore + 1;
    let percentage = Math.ceil((obj * 100) / fileCount);
    console.log("obj", fileCount);
    // console.log("percetage", percentage);
    // if (Math.floor(percentage % 5) == 0) {
    worker.current.port.postMessage({
      type: "updateTabInfo",
      id,
      prop: {
        currentCount: obj,
      },
    });
    // }
    if (obj == fileCount) {
      let t1 = performance.now();
      worker.current.port.postMessage({
        type: "updateTabInfo",
        id,
        prop: {
          netTime: t1 - t0,
        },
      });
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
      <p>{state.id}</p>
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
