import { React, createContext } from "react";
import "./App.css";
import UpLoader from "./components/UpLoader";
import DownLoader from "./components/DownLoader";
import DeleteFile from "./components/DeleteFile";
import PutUpload from "./components/PutUpload";

const App = () => {
  return (
    <>
      <div>
        <UpLoader />
      </div>
      <br />
      <div>
        <DownLoader />
      </div>
      <br />
      <div>
        <DeleteFile />
      </div>
      {/* <br />
      <div>
        <PutUpload />
      </div> */}
    </>
  );
};

export default App;
