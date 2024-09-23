import React from "react";

const useWindowSize = () => {
    const [width, setWidth] = React.useState<number>(window.innerWidth);
    const [height, setHeight] = React.useState<number>(window.innerHeight);

    React.useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight);
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return {width, height}
}

export default useWindowSize;