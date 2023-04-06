import React, { useState } from "react";
import lessStyles from "./app.less";
import scssStyles from "./app.scss";
import stylStyles from "./app.styl";
import "@/App.css";
import smallImage from "@/assets/imgs/8kb_image.jpg";
import largeImage from "@/assets/imgs/13kb_image.jpg";
import smallJsonExample from "./small_example.json";
import largeJsonExample from "./large_example.json";
import { TreeShakingOne, TreeShakingTwo } from "./components";

import "./unusedCss.css";
import "./unusedScss.scss";

function App() {
  const json = atob((smallJsonExample as unknown as string).substring(29));
  const result = JSON.parse(json);
  console.log("from base64 string to array", result);
  fetch(largeJsonExample as unknown as string)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
  console.log(smallJsonExample, largeJsonExample);

  const [count, setCount] = useState(0);
  return (
    <div>
      <h2>webpack5-react-ts</h2>
      <div className={lessStyles["lessBox"]}>
        <div className={lessStyles["box"]}>lessBox</div>
        <img src={smallImage} alt="8kb small image" />
        <img src={largeImage} alt="13kb large image" />
        <div className={lessStyles["smallImage"]}>
          background of small image
        </div>
        <div className={lessStyles["bigImage"]}>background of large image</div>
      </div>
      <div className={scssStyles["scssBox"]}>
        <div className={scssStyles["box"]}>scssBox</div>
      </div>
      <div className={stylStyles["stylBox"]}>
        <div className={stylStyles["box"]}>stylBox</div>
      </div>

      <h3>check whether hot loading is working</h3>
      <h4>{count}</h4>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +1
      </button>

      <h2>Tree shaking</h2>
      <TreeShakingOne />
    </div>
  );
}

export default App;
