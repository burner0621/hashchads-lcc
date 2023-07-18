import { useState, useRef, useEffect } from 'react';
import PropTypes from "prop-types";
import styled, { keyframes } from 'styled-components'
// Wrapper
const WrapperContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #ccc;
`;

const Wrapper = ({ children }) => {
  return <WrapperContainer>{children}</WrapperContainer>;
};

// Marquee
const moveLeft = keyframes`
  from {
    transform: translateX(0);
  }
`;

const MarqueeContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 10px 0;
  overflow: hidden;
  &:hover {
    animation-play-state: paused;
  }
  &::after {
    position: absolute;
    content: "";
    width: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }
`;

const MarqueeArea = styled.div`
  display: flex;
  white-space: nowrap;
  transform: translateX(-${(props) => props.move}px);
  animation: ${moveLeft} ${(props) => props.time}s linear infinite
    ${(props) => (props.toRight ? " reverse" : "")};
  animation-play-state: inherit;
`;

const MarqueeItem = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 2em;
`;

const getFillList = (list, copyTimes = 1) => {
  let newlist = [];
//   for (let i = 0; i < copyTimes; i++) {
    newlist.push(...list);
//   }
  return newlist;
};

const Marquee = ({ list, time, toRight, ...props }) => {
  const marqueeContainer = useRef(null);
  const marqueeArea = useRef(null);
  const [moveLeft, setMoveLeft] = useState(0);
  const [showList, setShowList] = useState(list);
  const [realTime, setRealTime] = useState(time);

  useEffect(() => {
    const containerWidth = Math.floor(marqueeContainer.current.offsetWidth);
    const areaWidth = Math.floor(marqueeArea.current.scrollWidth);
    const copyTimes = Math.max(2, Math.ceil((containerWidth * 2) / areaWidth));
    const newMoveLeft = areaWidth * Math.floor(copyTimes / 2);
    const newRealTime =
      time * parseFloat((newMoveLeft / containerWidth).toFixed(2));
    setShowList(getFillList(list, copyTimes));
    setMoveLeft(newMoveLeft);
    setRealTime(newRealTime);

  }, [list]);

  return (
    <MarqueeContainer ref={marqueeContainer} {...props}>
      <MarqueeArea
        ref={marqueeArea}
        move={moveLeft}
        time={realTime}
        toRight={toRight}
      >
        {showList.map((item) => {
          // eslint-disable-next-line react/jsx-key
          return <MarqueeItem>
            <a href={item.href} target="_blank">
                <img className="ads-banner" src={item.src} />
            </a>    
        </MarqueeItem>;
        })}
      </MarqueeArea>
    </MarqueeContainer>
  );
};

Marquee.propTypes = {
  list: PropTypes.array,
  time: PropTypes.number,
  toRight: PropTypes.bool
};

Marquee.defaultProps = {
  list: [],
  time: 10
};

export default Marquee