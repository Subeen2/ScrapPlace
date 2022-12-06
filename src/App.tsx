import React from "react";
import Home from "./components/Home";
import "./css/global.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddPlace from "./components/AddPlace";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route
            path="/add-place"
            element={
              <AddPlace />
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}
