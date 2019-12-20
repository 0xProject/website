import * as React from 'react';

// Importing a light build (only supporting svg renderer) for lottie (NB: still 40,9K gzipped :O )
import lottie, { AnimationItem } from 'lottie-web/build/player/lottie_light';

interface IAnimationLoaderProps {
    name: string;
    play?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    onComplete?: () => any;
}

// tslint:disable-next-line: boolean-naming
export const AnimationLoader: React.FC<IAnimationLoaderProps> = ({ name, play, autoplay, loop, onComplete }) => {
    const container = React.useRef(null);
    const lottieItem = React.useRef<AnimationItem | null>(null);
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        const onCompleteCb = () => onComplete && onComplete();

        const loadAnimationAsync = async (_name: string) => {
            try {
                const animationData = await import(/* webpackChunkName: "animation/[request]" */ `../../../public/animations/${_name}.json`);

                const item = lottie.loadAnimation({
                    name,
                    container: container.current, // the dom element that will contain the animation
                    renderer: 'svg',
                    loop,
                    autoplay,
                    animationData,
                });
                item.addEventListener('complete', onCompleteCb);

                lottieItem.current = item;
                // lottieItem.current.resize();
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.error('Error loading animation');
            }
        };
        void loadAnimationAsync(name).then(_ => setIsLoaded(true));
        return () => {
            if (lottieItem.current) {
                lottieItem.current.removeEventListener('complete', onCompleteCb);
                lottieItem.current.destroy();
            }
        };
    }, [name, autoplay, loop, onComplete]);

    React.useEffect(() => {
        if (isLoaded && true && lottieItem.current) {
            setTimeout(() => lottieItem.current.play(), 0);
        }
    }, [play, name, isLoaded]);

    return <div ref={container} />;
};
