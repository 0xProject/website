import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

// tslint:disable boolean-naming

const AnimationLoaderLazy = React.lazy(async () =>
    import('ts/components/animations/animation_loader').then(({ AnimationLoader }) => ({
        default: AnimationLoader,
    })),
);

interface IUnlockAnimationProps {
    isWaiting: boolean;
    isUnlocked: boolean;
}

const AnimationContainer = styled.div`
    position: relative;
    width: 120px;
    height: 50px;
`;

const UnlockAnimation: React.FC<IUnlockAnimationProps> = ({ isWaiting, isUnlocked, ...rest }) => {
    const [isLoadingAnimationDirty, setIsLoadingAnimationDirty] = useState<boolean>(false);

    const [hasUnlockAnimationBeenLoaded, setHasUnlockAnimationBeenLoaded] = useState<boolean>(false);

    const handleOnUnlockAnimationLoaded = useCallback(() => {
        setHasUnlockAnimationBeenLoaded(true);
    }, []);

    useEffect(() => {
        if (isWaiting) {
            setIsLoadingAnimationDirty(true);
        }
    }, [isWaiting]);

    // There's a short period between loading and unlock animations where
    // the unlock animation is lazy loading -- keep showing the spinner for that gap.
    const loadingGap = isLoadingAnimationDirty && !hasUnlockAnimationBeenLoaded;
    const showLoading = !hasUnlockAnimationBeenLoaded || loadingGap;

    return (
        <React.Suspense fallback={<AnimationContainer />}>
            <AnimationContainer {...rest}>
                {showLoading && (
                    <AnimationLoaderLazy autoplay={false} loop={true} play={isWaiting} name={'switchSpinner'} />
                )}
                {isUnlocked && (
                    <AnimationLoaderLazy
                        onLoaded={handleOnUnlockAnimationLoaded}
                        play={isUnlocked}
                        loop={false}
                        autoplay={false}
                        name={'switchUnlock'}
                    />
                )}
            </AnimationContainer>
        </React.Suspense>
    );
};

export { UnlockAnimation };
