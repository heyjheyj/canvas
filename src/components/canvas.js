import React, { useState, useRef, useEffect } from "react";
import ItemInfo from "./ItemInfo";

const setItem = (infoBox) => {
  window.localStorage.setItem("infoBox", JSON.stringify(infoBox));
};

const getItem = () => {
  return JSON.parse(window.localStorage.getItem("infoBox"));
};

const getPos = (event) => {
  return {
    x: event.nativeEvent.offsetX,
    y: event.nativeEvent.offsetY
  };
};

export default function Canvas() {
  const [infoBoxes, setInfoBoxes] = useState([]);
  const [isEditingID, setIsEditingID] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  console.log(isEditingID);

  const [startXY, setStartXY] = useState([]);
  const [boxSize, setBoxSize] = useState({
    width: "",
    height: ""
  });

  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState();

  useEffect(() => {
    if (canvasRef.current) {
      let result = canvasRef.current.getContext("2d");
      setCtx(result);
    }
  }, []);

  const startDrawing = (e) => {
    e.preventDefault();
    if (isEditingID) {
      return;
    }
    setIsDrawing(true);
    const pos = getPos(e);
    const startX = pos.x;
    const startY = pos.y;

    setStartXY([startX, startY]);
  };

  const drawing = (e) => {
    e.preventDefault();
    if (!isDrawing || isEditingID) {
      return;
    } else {
      const pos = getPos(e);
      const nowX = pos.x;
      const nowY = pos.y;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.strokeStyle = "rgba(244,204,204, 0.5)";
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(244,204,204, 0.3)";
      ctx.fill();

      const width = nowX - startXY[0];
      const height = nowY - startXY[1];
      ctx.strokeRect(startXY[0], startXY[1], width, height);
      ctx.fillRect(startXY[0], startXY[1], width, height);
      setBoxSize({ width, height });
    }
  };

  const finishDrawing = (e) => {
    e.preventDefault();
    if (isEditingID) {
      return;
    }

    if (Math.abs(boxSize.width) < 30 || Math.abs(boxSize.height) < 30) {
      alert("가로, 세로 길이는 최소 30px 이상이어야 합니다.");
      setIsDrawing(false);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      return;
    }

    setIsDrawing(false);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let text = prompt("영역의 이름은 무엇인가요?");

    if (
      startXY[0] === undefined ||
      startXY[1] === undefined ||
      text === null ||
      text === ""
    ) {
      return;
    }

    const endXY = [...startXY];
    if (boxSize.width < 0) {
      endXY[0] = startXY[0] - Math.abs(boxSize.width);
    }
    if (boxSize.height < 0) {
      endXY[1] = startXY[1] - Math.abs(boxSize.height);
    }

    const id = Date.now();
    let newInfobox = {
      id,
      startXY: endXY,
      boxSize: {
        width: Math.abs(boxSize.width),
        height: Math.abs(boxSize.height)
      },
      zindex: id,
      text
    };

    const newInfoBoxes = [...infoBoxes, newInfobox];
    setInfoBoxes(newInfoBoxes);
    setItem(newInfoBoxes);
  };

  const deleteItemInfo = (selectedItem) => {
    const newInfoBoxes = infoBoxes.filter(
      (item) => item.id !== selectedItem.id
    );
    setInfoBoxes(newInfoBoxes);
    setItem(newInfoBoxes);
  };

  const onChangeText = (text, selectedItem) => {
    // console.log(text, selectedItem);
    let result = [];
    for (let i = 0; i < infoBoxes.length; i++) {
      // console.log(infoBoxes[i]);
      if (infoBoxes[i].id === selectedItem.id) {
        infoBoxes[i].text = text;
        result.push(infoBoxes[i]);
      } else {
        result.push(infoBoxes[i]);
      }
    }
    setInfoBoxes(result);
    setItem(result);
  };

  const changeCoordiante = (newCoordinate, item) => {
    if (newCoordinate.width < 30 || newCoordinate.height < 30) {
      setInfoBoxes([...infoBoxes]);
      setItem([...infoBoxes]);
    } else {
      let result = [];
      for (let i = 0; i < infoBoxes.length; i++) {
        if (infoBoxes[i].id === item.id) {
          infoBoxes[i].boxSize.width = newCoordinate.width;
          infoBoxes[i].boxSize.height = newCoordinate.height;
          result.push(infoBoxes[i]);
        } else {
          result.push(infoBoxes[i]);
        }
      }
      setInfoBoxes(result);
      setItem(result);
    }
  };

  useEffect(() => {
    const newInfoBoxes = getItem();
    if (newInfoBoxes !== null) setInfoBoxes(newInfoBoxes);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <div className="w-2/3 m-auto">
          <span style={{ display: "block" }}>
            1. 각 상품정보 박스 Title은 클릭해서 수정하고 Enter를 누르면 수정이
            반영됩니다.
          </span>
          <span style={{ display: "block" }}>
            2. 각 상품정보 박스 오른쪽 하단 모서리를 드래그해 크기를 조정할 수
            있습니다.
          </span>
        </div>
        <div className="relative">
          <div
            className="absolute z-50 h-auto font-semibold list-outside bg-white w-52 bg-opacity-70 top-3 left-3 p-7"
            style={{ listStyleType: "square" }}
          >
            {infoBoxes &&
              infoBoxes?.map((item, index) => <li key={index}>{item.text}</li>)}
          </div>
          <div className="absolute top-0 left-0 z-10 w-0 h-0 space-y-1 break-all">
            {infoBoxes &&
              infoBoxes?.map((item, index) => (
                <ItemInfo
                  key={index}
                  item={item}
                  onDelete={deleteItemInfo}
                  onChangeText={onChangeText}
                  onChangeCoordinate={changeCoordiante}
                  isEditingID={isEditingID}
                  setIsEditingID={setIsEditingID}
                />
              ))}
          </div>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={drawing}
            onMouseUp={finishDrawing}
            width={700}
            height={874}
            style={{
              backgroundImage: "url('/images/background.jpeg')",
              backgroundSize: "700px 874px"
            }}
          />
        </div>
      </div>
    </>
  );
}
