import lottie from 'lottie-web';
import React from 'react';

interface IAnimationLoaderProps {
    name: string;
}

export const AnimationLoader: React.FC<IAnimationLoaderProps> = ({ name }) => {
    const container = React.useRef(null);

    React.useEffect(() => {
        void loadAnimationAsync(name);
    }, [name]);

    const loadAnimationAsync = async (_name: string) => {
        try {
            const animationData = await import(/* webpackChunkName: "animation/[request]" */ `../../../public/animations/${_name}.json`);

            lottie.loadAnimation({
                container: container.current, // the dom element that will contain the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData,
            });
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error('Error loading animation');
        }
    };

    return <div ref={container} />;
};
