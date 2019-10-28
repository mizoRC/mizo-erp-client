import React from 'react';

const useDisplayBreakpoints = () => {
    const [breakpoint, setBreakpoint] = React.useState('sm');

    const updateSize = () => {
        if (window.innerWidth < 600) {
            setBreakpoint('xs');
        } else if (window.innerWidth < 960) {
            setBreakpoint('sm');
        }else if (window.innerWidth < 1200) {
            setBreakpoint('md');
        }else if (window.innerWidth < 1600) {
            setBreakpoint('lg');
        } else {
            setBreakpoint('xl');
        }
    };

    React.useEffect(() => {
        updateSize();
        window.addEventListener("resize", updateSize);

        return () => {
            window.removeEventListener("resize", updateSize);
        };
    });

    return breakpoint;
}
export default useDisplayBreakpoints;