import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    hieght: undefined
  }); 

  useEffect(() => {

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        hieght: window.innerHeight
      })
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    const cleanUp = () => {
      console.log('runs');
      window.removeEventListener('resize', handleResize);
    }

    return cleanUp;
  }, [])

  return windowSize;
}

export default useWindowSize;