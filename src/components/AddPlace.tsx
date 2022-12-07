/*global kakao */
import React, { ReactElement, useEffect, useState } from "react";
import "../css/AddPlace.scss";
import { Place } from "../type";

interface Props {
  setIsShow: (e: boolean) => void;
  isShow: boolean;
  placeArr: Place[] | [];
}

function AddPlace({ setIsShow, isShow, placeArr }: Props): ReactElement {
  const [className, setClassName] = useState<string>("show");
  let place: Place[] = [...placeArr];

  const [inputs, setInputs] = useState<Place>({
    placename: "",
    address: "",
    openingHours: "",
    breakTime: "",
    offDay: "",
    contact: "",
  });

  const { placename, address, openingHours, breakTime, offDay, contact } = inputs;

  useEffect(() => {
    if (isShow) {
      setClassName("hidden");
    } else {
      setClassName("show");
    }
  }, [isShow]);

  const onChange = (e: any) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const setLocalStorage = (
    e: /*global kakao */
    React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (placename !== "" && address !== "") {
      place.push(inputs);
      localStorage.setItem("place", JSON.stringify(place));
      alert("등록 완료되었습니다 !");
      setInputs({
        placename: "",
        address: "",
        openingHours: "",
        breakTime: "",
        offDay: "",
        contact: "",
      });
      setIsShow(true);
    } else {
      alert("가게 이름과 주소는 필수 값 입니다.");
    }
  };

  return (
    <div className={className}>
      <h2>장소 추가하기</h2>
      <div className="add-place-box">
        <form className="set-block">
          <label htmlFor="placename">* 가게 이름 :</label>
          <input name="placename" onChange={(e) => onChange(e)} value={placename} required />
          <br />
          <label htmlFor="address">* 주소 :</label>
          <input name="address" onChange={(e) => onChange(e)} value={address} required />
          <br />
          <label htmlFor="openingHours">영업 시간 :</label>
          <input name="openingHours" onChange={(e) => onChange(e)} value={openingHours} />
          <br />
          <label htmlFor="breakTime">브레이크 타임 :</label>
          <input name="breakTime" onChange={(e) => onChange(e)} value={breakTime} />
          <br />
          <label htmlFor="offDay">휴무일 :</label>
          <input name="offDay" onChange={(e) => onChange(e)} value={offDay} />
          <br />
          <label htmlFor="contact">연락처 :</label>
          <input name="contact" onChange={(e) => onChange(e)} value={contact} />
        </form>
        <div className="content">가게 이름과 주소는 필수 입력 값 입니다 !</div>
        <button onClick={(e) => setLocalStorage(e)} type="submit" className="add-button">
          등록
        </button>
      </div>
    </div>
  );
}

export default AddPlace;
