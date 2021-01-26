import { useRef } from 'react';
import { useEffect } from 'react';

function useDebounce(fn, time = 500) {
    const timerRef = useRef(0);

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, [fn]);

    return (args) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            fn(args);
        }, time);
    };
}
export default useDebounce;
