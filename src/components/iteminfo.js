import React from "react";
import styled from "styled-components";

const ItemInfo = ({ item, onDelete }) => {
  // console.log("[ItemInfo]item:", item);
  return (
    <Info
      top={item.startXY[1]}
      left={item.startXY[0]}
      width={item.boxSize.width}
      height={item.boxSize.height}
      zindex={item.zindex}
    >
      <span>{item.text}</span>
      <DeleteButton onClick={() => onDelete(item)}>X</DeleteButton>
    </Info>
  );
};

const Info = styled.li`
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  z-index: ${(props) => props.zindex};
  background: #d9ead370;
  position: absolute;
  padding-left: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 2px solid #d9ead3;
  word-break: break-all;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  span {
    padding-right: 25px;
    font-size: 15px;
    font-weight: 600;
  }
`;

const DeleteButton = styled.button`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 5px;
  top: 2px;
  border: none;
  background: #2f485850;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
`;

export default ItemInfo;
