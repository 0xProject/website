import * as React from 'react';

// Importing a light build (only supporting svg renderer) for lottie (NB: still 40,9K gzipped :O )
import lottie, { AnimationItem } from 'lottie-web/build/player/lottie_light';

interface IAnimationLoaderProps {
    name: string;
    play?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    onComplete?: () => any;
    onLoaded?: () => any;
}

// tslint:disable-next-line: boolean-naming
export const AnimationLoader: React.FC<IAnimationLoaderProps> = ({ name, play, autoplay, loop, onComplete, onLoaded }) => {
    const container = React.useRef(null);
    const lottieItem = React.useRef<AnimationItem | null>(null);
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        const onCompleteCb = () => onComplete && onComplete();
        const onLoadedCb = () => onLoaded && onLoaded();

        const loadAnimationAsync = async (_name: string) => {
            try {
                const animationData = await import(/* webpackChunkName: "animation/[request]" */ `../../../public/animations/${_name}.json`);

                const item = lottie.loadAnimation({
                    name,
                    container: container.current, // the dom element that will contain the animation
                    renderer: 'svg',
                    loop,
                    autoplay: autoplay || play, // can we coallsce this?
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

        void loadAnimationAsync(name)
            .then(_ => setIsLoaded(true))
            .then(_ => onLoadedCb());

        return () => {
            if (lottieItem.current) {
                lottieItem.current.removeEventListener('complete', onCompleteCb);
                lottieItem.current.destroy();
            }
        };
    // Ignore play
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, autoplay, loop, onComplete, onLoaded]);

    React.useEffect(() => {
        if (!play) {
            lottieItem.current.stop();
        }
        if (play && isLoaded) {
            lottieItem.current.play();
        }
    }, [play, isLoaded]);

    return <div ref={container} />;
};
