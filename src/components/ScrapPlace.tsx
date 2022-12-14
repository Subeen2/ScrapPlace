/*global kakao */
import React, { ReactElement, useEffect, useState } from "react";
import "../css/ScrapPlace.scss";
import { Place } from "../type";
import Detail from "./Detail";

interface Props {
  isShow: boolean;
  placeArr: Place[] | [];
  deletePlace: any;
  setIsShow: (e: boolean) => void;
}

function ScrapPlace({ isShow, placeArr, deletePlace, setIsShow }: Props): ReactElement {
  const [isPlaceClicked, setIsPlaceClicked] = useState<boolean>(false);
  const [className, setClassName] = useState<string>("show");
  const [indexOfItem, setIndexOfItem] = useState<number>(-1);
  const [isAddPlaceClicked, setIsAddPlaceClicked] = useState<boolean>(false);

  useEffect(() => {
    if (isShow) {
      setClassName("show");
    } else {
      setClassName("hidden");
    }
  }, [isShow]);

  const detailPlace = (e: any) => {
    setIsPlaceClicked(!isPlaceClicked);
    for (let i: number = 0; i < placeArr.length; i++) {
      if (placeArr[i].placename === e.target.innerText) {
        console.log(i);
        setIndexOfItem(i);
      }
    }
  };

  const addPlace = () => {
    setIsShow(!isShow);
  };

  const placeList: JSX.Element[] = placeArr.map((name, index) => (
    <div key={index} className="place-list">
      <div className="place-name" onClick={(e) => detailPlace(e)}>
        {name.placename}
      </div>
      <div className="place-address" onClick={(e) => detailPlace(e)}>
        {name.address}
      </div>
      <div className="x-box" onClick={(e) => deletePlace(e)}></div>
    </div>
  ));

  return (
    <div className={className}>
      {isPlaceClicked ? (
        <Detail place={placeArr[indexOfItem]} setIsPlaceClicked={setIsPlaceClicked} />
      ) : (
        <div className="scrap-list-box">
          <span className="star-text">★</span>
          <h2 className="scrap-text">스크랩한 목록</h2>
          <p className="content">해당 장소를 클릭하시면 장소에 대한 세부 내용이 출력됩니다!</p>
          <div className="place-list-box">
            {placeList}
            {/* <Link to={"/add-place"}> */}
            <div className="place-list last" onClick={addPlace}>
              +
            </div>
            {/* </Link> */}
          </div>
          {/* <Detail place={props.placeArr[indexOfItem]} /> */}
          <div id="road-view"></div>
        </div>
      )}
    </div>
  );
}

export default ScrapPlace;
