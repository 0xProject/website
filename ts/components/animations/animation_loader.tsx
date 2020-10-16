import lottie from 'lottie-web';
import React, { useCallback } from 'react';

interface IAnimationLoaderProps {
    name: string;
    loop?: boolean;
}

export const AnimationLoader: React.FC<IAnimationLoaderProps> = ({ name, loop }) => {
    const container = React.useRef(null);


    const loadAnimationAsync = useCallback(async (_name: string) => {
        try {
            const animationData = await import(/* webpackChunkName: "animation/[request]" */ `../../../public/animations/${_name}.json`);

            lottie.loadAnimation({
                container: container.current, // the dom element that will contain the animation
                renderer: 'svg',
                loop: loop ?? true,
                autoplay: true,
                animationData,
            });
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error('Error loading animation');
        }
    }, [loop]);

    React.useEffect(() => {
        void loadAnimationAsync(name);
    }, [loadAnimationAsync, name]);


    return <div ref={container} />;
};
