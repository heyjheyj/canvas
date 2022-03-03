import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ItemInfo from "./iteminfo";

const Canvas = (props) => {
  const [infoBoxes, setInfoBoxes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [offsetXY, setOffsetXY] = useState([]);
  const [id, setId] = useState(1);
  const [startXY, setStartXY] = useState([]);
  const [boxSize, setBoxSize] = useState({
    width: "",
    height: ""
  });

  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState();

  useEffect(() => {
    let result = canvasRef.current.getContext("2d");
    setCtx(result);

    let canvasOffset = canvasRef.current.getBoundingClientRect();
    let resultoffestx = parseInt(canvasOffset.left);
    let resultoffsety = parseInt(canvasOffset.top);
    setOffsetXY([resultoffestx, resultoffsety]);
  }, [canvasRef]);

  const startDrawing = (e) => {
    e.preventDefault();

    setIsDrawing(true);

    console.log(offsetXY);
    console.log(e.clientX, e.clientY);
    let resultx = parseInt(e.clientX - offsetXY[0]);
    let resulty = parseInt(e.clientY - offsetXY[1]);
    console.log(resultx, resulty);
    setStartXY([resultx, resulty]);
  };

  const drawing = (e) => {
    e.preventDefault();
    if (!isDrawing) {
      return;
    } else {
      let mouseX = parseInt(e.clientX - offsetXY[0]);
      let mouseY = parseInt(e.clientY - offsetXY[1]);

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.strokeStyle = "rgba(244,204,204, 0.5)";
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(244,204,204, 0.3)";
      ctx.fill();

      let width = parseInt(mouseX - startXY[0]);
      let height = parseInt(mouseY - startXY[1]);
      ctx.strokeRect(startXY[0], startXY[1], width, height);
      ctx.fillRect(startXY[0], startXY[1], width, height);
      setBoxSize({ width, height });
    }
  };

  const finishDrawing = (e) => {
    e.preventDefault();

    if (boxSize.width < 30 || boxSize.height < 30) {
      alert("가로, 세로 길이는 최소 30px 이상이어야 합니다.");
      setIsDrawing(false);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      return;
    }

    setIsDrawing(false);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let text = prompt("영역의 이름은 무엇인가요?");
    console.log(text);

    if (
      startXY[0] === undefined ||
      startXY[1] === undefined ||
      text === null ||
      text === ""
    ) {
      return;
    }

    let newInfobox = {
      id,
      startXY,
      boxSize,
      zindex: id,
      text
    };

    setInfoBoxes([...infoBoxes, newInfobox]);
    setId((prev) => prev + 1);
  };

  const deleteItemInfo = (selectedItem) =>
    setInfoBoxes(infoBoxes.filter((item) => item.id !== selectedItem.id));

  return (
    <>
      <CanvasComponent>
        <ShowItems>
          {infoBoxes &&
            infoBoxes?.map((item, index) => <li key={index}>{item.text}</li>)}
        </ShowItems>
        <InfoBoxContainer>
          {infoBoxes &&
            infoBoxes?.map((item, index) => (
              <ItemInfo key={index} item={item} onDelete={deleteItemInfo} />
            ))}
        </InfoBoxContainer>
        <DrawArea
          ref={canvasRef}
          width={700}
          height={874}
          onMouseDown={startDrawing}
          onMouseMove={drawing}
          onMouseUp={finishDrawing}
        ></DrawArea>
      </CanvasComponent>
    </>
  );
};

export default Canvas;

const CanvasComponent = styled.div`
  /* width: 100%;
  height: 100%; */
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;

const DrawArea = styled.canvas`
  width: 700px;
  height: 874px;
  top: 0;
  background-image: url("/images/background.jpeg");
  background-size: 700px 874px;
  position: absolute;
  z-index: 0;
`;

const InfoBoxContainer = styled.ul`
  width: 700px;
  height: 874px;
  position: relative;
`;

const ShowItems = styled.ul`
  width: 120px;
  min-height: 50px;
  height: auto;
  background: #ffffff70;
  z-index: 999;
  top: 10px;
  left: 10px;
  position: absolute;
  padding: 10px 0 30px 30px;
  list-style-position: outside;
  list-style-type: square;
  font-weight: 600;
  li {
    padding-top: 5px;
    max-height: 40px;
    word-break: break-all;
  }
`;
