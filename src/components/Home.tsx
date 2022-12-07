/*global kakao */
import React from "react";
import { useState, useEffect } from "react";
import "../css/global.scss";
import AddPlace from "./AddPlace";
import ScrapPlace from "./ScrapPlace";
import Logo from "../logo.png";
import { Place } from "../type";

function Home() {
  const [isShow, setIsShow] = useState<boolean>(true);
  const placeItems = localStorage.getItem("place");
  const [placeArr, setPlaceArr] = useState<Place[]>([]);

  useEffect(() => {
    if (typeof placeItems === "string") {
      setPlaceArr(JSON.parse(placeItems));
    }
  }, [isShow]);

  const scrapListClicked = () => {
    if (typeof placeItems === "string") {
      setPlaceArr(JSON.parse(placeItems));
    }
    setIsShow(true);
  };

  const addPlaceClicked = () => {
    setIsShow(false);
  };

  const deletePlace = (e: any) => {
    const targetText = e.target.previousElementSibling.previousElementSibling.innerText;
    if (confirm("삭제하시겠습니까 ?") === true) {
      for (var i: number = 0; i < placeArr.length; i++) {
        if (placeArr[i].placename === targetText) {
          const newPlaceArr = placeArr.filter(function (list) {
            return list.placename !== placeArr[i].placename;
          });
          setPlaceArr(newPlaceArr);
          localStorage.removeItem("place");
          localStorage.setItem("place", JSON.stringify(newPlaceArr));
        }
      }
    }
  };

  return (
    <div className="home">
      <header className="header">
        <img className="logo" src={Logo} />
      </header>

      <div className="nav-bar">
        <button onClick={scrapListClicked}>스크랩한 목록</button>
        <button onClick={addPlaceClicked}>장소 추가하기</button>
      </div>
      <main className="main">
        <ScrapPlace
          placeArr={placeArr}
          deletePlace={deletePlace}
          isShow={isShow}
          setIsShow={setIsShow}
        />
        <AddPlace placeArr={placeArr} isShow={isShow} setIsShow={setIsShow} />
      </main>
      <footer className="footer">
        <p>made by SB</p>
        <p>contact : snb0768@naver.com</p>
      </footer>
    </div>
  );
}

export default Home;
