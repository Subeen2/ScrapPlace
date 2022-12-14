/*global kakao */
import React, { useEffect, useState } from "react";
import "../css/Detail.scss";
import { Place } from "../type";

interface Props {
  place: Place;
  setIsPlaceClicked: (e: boolean) => void;
}

function Detail({ place, setIsPlaceClicked }: Props) {
  const kakao = (window as any).kakao;
  // const [keyword, setKeyword] = useState<string>();
  // const [isAddedMapShow, setIsAddedMapShow] = useState<string>('hidden');
  // const [isChanged, setIsChanged] = useState<boolean>(true);
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();

  const { placename, address, openingHours, breakTime, offDay, contact } = place;

  useEffect(() => {
    const container = document.getElementById("map");

    const options = {
      center: new kakao.maps.LatLng(35.85133, 127.734086),
      level: 3,
    };

    const map = new kakao.maps.Map(container, options);

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, function (result: any, status: any) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        map.setCenter(coords);
        getInfo();
      }
    });

    const markerPosition = new kakao.maps.LatLng(lat, lng);

    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    marker.setMap(map);

    const iwContent =
        '<div style="padding:5px;">' +
        placename +
        '<br><a href="https://map.kakao.com/link/to/' +
        placename +
        ',33.450701,126.570667" style="color:blue" target="_blank">길찾기</a></div>',
      iwPosition = new kakao.maps.LatLng(lat, lng);

    const infowindow = new kakao.maps.InfoWindow({
      position: iwPosition,
      content: iwContent,
    });

    infowindow.open(map, marker);

    function getInfo() {
      const center = map.getCenter();

      let message = "지도 중심좌표는 위도 " + center.getLat() + ", <br>";
      message += "경도 " + center.getLng() + " 이고 <br>";

      setLat(center.getLat());
      setLng(center.getLng());
    }

    let drawingFlag = false;
    let moveLine: any;
    let clickLine: any;
    let distanceOverlay: any;
    let dots: any = {};

    kakao.maps.event.addListener(map, "click", function (mouseEvent: any) {
      const clickPosition = mouseEvent.latLng;

      if (!drawingFlag) {
        drawingFlag = true;
        deleteClickLine();
        deleteDistnce();
        deleteCircleDot();

        clickLine = new kakao.maps.Polyline({
          map: map,
          path: [clickPosition],
          strokeWeight: 3,
          strokeColor: "#db4040",
          strokeOpacity: 1,
          strokeStyle: "solid",
        });

        moveLine = new kakao.maps.Polyline({
          strokeWeight: 3,
          strokeColor: "#db4040",
          strokeOpacity: 0.5,
          strokeStyle: "solid",
        });

        displayCircleDot(clickPosition, 0);
      } else {
        const path = clickLine.getPath();
        path.push(clickPosition);
        clickLine.setPath(path);
        const distance = Math.round(clickLine.getLength());
        displayCircleDot(clickPosition, distance);
      }
    });

    kakao.maps.event.addListener(map, "mousemove", function (mouseEvent: any) {
      if (drawingFlag) {
        const mousePosition = mouseEvent.latLng;
        const path = clickLine.getPath();
        const movepath = [path[path.length - 1], mousePosition];
        moveLine.setPath(movepath);
        moveLine.setMap(map);

        const distance = Math.round(clickLine.getLength() + moveLine.getLength()),
          content =
            '<div class="dotOverlay distanceInfo">총거리 <span class="number">' +
            distance +
            "</span>m</div>";

        showDistance(content, mousePosition);
      }
    });

    kakao.maps.event.addListener(map, "rightclick", function (mouseEvent: any) {
      if (drawingFlag) {
        moveLine.setMap(null);
        moveLine = null;

        const path = clickLine.getPath();

        if (path.length > 1) {
          if (dots[dots.length - 1].distance) {
            dots[dots.length - 1].distance.setMap(null);
            dots[dots.length - 1].distance = null;
          }

          const distance = Math.round(clickLine.getLength()),
            content = getTimeHTML(distance);

          showDistance(content, path[path.length - 1]);
        } else {
          deleteClickLine();
          deleteCircleDot();
          deleteDistnce();
        }

        drawingFlag = false;
      }
    });

    function deleteClickLine() {
      if (clickLine) {
        clickLine.setMap(null);
        clickLine = null;
      }
    }

    function showDistance(content: any, position: any) {
      if (distanceOverlay) {
        distanceOverlay.setPosition(position);
        distanceOverlay.setContent(content);
      } else {
        distanceOverlay = new kakao.maps.CustomOverlay({
          map: map,
          content: content,
          position: position,
          yAnchor: 0,
          zIndex: 3,
        });
      }
    }

    function deleteDistnce() {
      if (distanceOverlay) {
        distanceOverlay.setMap(null);
        distanceOverlay = null;
      }
    }

    function displayCircleDot(position: any, distance: any) {
      var circleOverlay = new kakao.maps.CustomOverlay({
        content: '<span class="dot"></span>',
        position: position,
        zIndex: 1,
      });

      circleOverlay.setMap(map);

      if (distance > 0) {
        var distanceOverlay = new kakao.maps.CustomOverlay({
          content:
            '<div class="dotOverlay">거리 <span class="number">' + distance + "</span>m</div>",
          position: position,
          yAnchor: 1,
          zIndex: 2,
        });

        distanceOverlay.setMap(map);
      }

      dots.push({ circle: circleOverlay, distance: distanceOverlay });
    }

    function deleteCircleDot() {
      for (var i = 0; i < dots.length; i++) {
        if (dots[i].circle) {
          dots[i].circle.setMap(null);
        }

        if (dots[i].distance) {
          dots[i].distance.setMap(null);
        }
      }

      dots = [];
    }

    function getTimeHTML(distance: any) {
      var walkkTime = (distance / 67) | 0;
      var walkHour = "",
        walkMin = "";

      if (walkkTime > 60) {
        walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + "</span>시간 ";
      }
      walkMin = '<span class="number">' + (walkkTime % 60) + "</span>분";

      var bycicleTime = (distance / 227) | 0;
      var bycicleHour = "",
        bycicleMin = "";

      if (bycicleTime > 60) {
        bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + "</span>시간 ";
      }
      bycicleMin = '<span class="number">' + (bycicleTime % 60) + "</span>분";

      var content = '<ul class="dotOverlay distanceInfo">';
      content += "    <li>";
      content +=
        '        <span class="label">총거리</span><span class="number">' + distance + "</span>m";
      content += "    </li>";
      content += "    <li>";
      content += '        <span class="label">도보</span>' + walkHour + walkMin;
      content += "    </li>";
      content += "    <li>";
      content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin;
      content += "    </li>";
      content += "</ul>";

      return content;
    }
  }, []);

  // useEffect(() => {
  //   let centence = props.place.placename + " 근처 " + keyword;
  //   console.log(centence)
  //   const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

  //   const container = document.getElementById("map2");

  //   const options = {
  //     center: new kakao.maps.LatLng(35.85133, 127.734086),
  //     level: 3,
  //   };

  //   const map2 = new kakao.maps.Map(container, options);
  //   var ps = new kakao.maps.services.Places();
  //   ps.keywordSearch(centence, placesSearchCB);

  //   // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  //   function placesSearchCB(data: any, status: any, pagination: any) {
  //     if (status === kakao.maps.services.Status.OK) {

  //       // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
  //       // LatLngBounds 객체에 좌표를 추가합니다
  //       var bounds = new kakao.maps.LatLngBounds();

  //       for (var i = 0; i < data.length; i++) {
  //         displayMarker(data[i]);
  //         bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
  //       }

  //       // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  //       map2.setBounds(bounds);
  //     }
  //   }

  //   // 지도에 마커를 표시하는 함수입니다
  //   function displayMarker(place: any) {

  //     // 마커를 생성하고 지도에 표시합니다
  //     var marker = new kakao.maps.Marker({
  //       map: map2,
  //       position: new kakao.maps.LatLng(place.y, place.x)
  //     });

  //     // 마커에 클릭이벤트를 등록합니다
  //     kakao.maps.event.addListener(marker, 'click', function () {
  //       // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
  //       infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
  //       infowindow.open(map2, marker);
  //     });
  //   }
  // }, [isChanged])

  // const onChange = (e: any) => {
  //   setKeyword(e.target.value);
  // }

  // const searchPlace = () => {
  //   setIsAddedMapShow('show-map');
  //   setIsChanged(!isChanged);
  // }

  return (
    <>
      <div className="detail-box">
        <h2>{placename}</h2>
        <div className="info-box">
          <div>주소 :</div>
          <span>{address}</span>
          <br />
          <div>영업 시간 :</div>
          <span>{openingHours}</span>
          <br />
          <div>브레이크 타임 :</div>
          <span>{breakTime}</span>
          <br />
          <div>휴무일 :</div>
          <span>{offDay}</span>
          <br />
          <div>연락처 :</div>
          <span>{contact}</span>
        </div>
        <div id="map"></div>
        <div className="content">
          마우스 왼쪽 클릭 → 원하는 장소에 옮겨 재클릭 → 오른쪽 마우스 클릭 : 장소 사이의 거리,
          도보/자전거 이동시 소요 시간을 보실 수 있습니다 . !
        </div>
        <button className="go-list" onClick={() => setIsPlaceClicked(false)}>
          목록으로
        </button>
      </div>
      {/* <div>
      <span>근처</span>
      <input value={keyword} onChange={(e) => onChange(e)} />
      <span>보기</span>
      <button onClick={searchPlace}>검색</button>
      <div>ex) 카페, 맛집, 편의점, 주유소</div>
      <div id='map2' className={isAddedMapShow}></div>
    </div> */}
    </>
  );
}

export default Detail;
