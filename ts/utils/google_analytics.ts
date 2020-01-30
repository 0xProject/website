export const trackEvent = (eventName: string, params?: object) => {
    const untypedWindow = window as any;
    if (untypedWindow.gtag) {
        untypedWindow.gtag('event', eventName, params);
    }
};
