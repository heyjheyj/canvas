import React, { useRef } from "react";

export default function ItemInfo({
  item,
  onDelete,
  onChangeText,
  onChangeCoordinate,
  isEditingID,
  setIsEditingID
}) {
  const boxRef = useRef();
  const changeText = (e) => {
    if (e.keyCode === 13) {
      onChangeText(e.target.value, item);
      boxRef.current.style.resize = "both";
      setIsEditingID(0);
    }
  };

  const onBlur = (e) => {
    onChangeText(e.target.value, item);
    boxRef.current.style.resize = "both";
    setIsEditingID(0);
  };

  const coordiante = (nativeEvent, e) => {
    e.stopPropagation();
    if (e.target.nodeName === "SPAN" || isEditingID) {
      return;
    }
    let coordinate = {
      width: nativeEvent.layerX,
      height: nativeEvent.layerY
    };
    onChangeCoordinate(coordinate, item);
  };

  const startChangeCoordinate = (e) => {
    e.stopPropagation();
    if (isEditingID || e.target.nodeName === "SPAN") {
      boxRef.current.style.resize = "none";
    }
  };

  return (
    <li
      ref={boxRef}
      onMouseDown={(e) => startChangeCoordinate(e)}
      onMouseUp={(e) => coordiante(e.nativeEvent, e)}
      style={{
        top: `${item.startXY[1]}px`,
        left: `${item.startXY[0]}px`,
        width: `${item.boxSize.width}px`,
        height: `${item.boxSize.height}px`,
        borderColor: "#d9ead3",
        backgroundColor: "#d9ead370",
        resize: "both"
      }}
      className="absolute z-30 flex flex-row justify-between pl-1 overflow-auto break-all border-2"
    >
      {isEditingID === item.id ? (
        <input
          className="w-3/4 pl-1 mt-1 text-sm h-7"
          style={{ backgroundColor: "rgba(244,204,204, 0.5)" }}
          type="text"
          defaultValue={item.text}
          onKeyUp={(e) => changeText(e)}
          onBlur={(e) => onBlur(e)}
          autoFocus
        />
      ) : (
        <span
          className="w-full h-auto pt-1 pr-6 text-sm font-semibold"
          onClick={() => {
            console.log("click");
            setIsEditingID(item.id);
          }}
        >
          {item.text}
        </span>
      )}
      <button
        className="absolute w-5 h-5 border-0 cursor-pointer top-1 right-1 hover:scale-105"
        style={{
          backgroundColor: "#2f485850"
        }}
        onClick={() => onDelete(item)}
      >
        X
      </button>
    </li>
  );
}
