import { InjectableIframe } from "../types";

/**
 * Create an instance of injectable iframe.
 * @param iframe Can be either a query string, iframe element or a number signifying the n-th iframe on page
 * @returns injectable iframe or throws an exception if iframe could not be found
 */
export const iframe = (frame: HTMLIFrameElement | string | number): InjectableIframe => {
    const realFrame = typeof frame === 'number'
        ? document.getElementsByTagName('iframe').item(frame)
        : (
            typeof frame === 'string'
                ? document.querySelector(frame)
                : frame
        ) as HTMLIFrameElement;
    if (!(realFrame instanceof HTMLIFrameElement)) {
        throw Error('Could not find an iframe element to bind to!');
    }
    const getDocument = (frame: HTMLIFrameElement) => (frame.contentDocument || frame.contentWindow?.document);
    const getLoaded = async (frame: HTMLIFrameElement) => new Promise<HTMLIFrameElement>(
        resolve => getDocument(frame)?.readyState === 'complete'
            ? resolve(frame)
            : frame.addEventListener('load', () => resolve(frame))
    );

    const getBody = async (frame: HTMLIFrameElement) => getDocument((await getLoaded(frame)))?.querySelector('body');
    const getHead = async (frame: HTMLIFrameElement) => getDocument((await getLoaded(frame)))?.querySelector('head');
    
    const injectable: InjectableIframe = {
        body: async () => (await getBody(realFrame)) || null,
        head: async () => (await getHead(realFrame)) || null,
        iframe: realFrame,
        js: injection => {
            getLoaded(realFrame).then(async frame => {
                const doc = getDocument(frame);
                if (frame.contentWindow && doc) {
                    injection(frame.contentWindow, doc);
                }
            });
            return injectable;
        },
        css: injection => {
            getHead(realFrame).then(head => {
                if (head) {
                    const styles = document.createElement('link');
                    styles.rel = 'stylesheet';
                    styles.type = 'text/css';
                    styles.href = injection;
                    head.appendChild(styles);
                }
            });
            return injectable;
        },
        dom: (element, query) => {
            getBody(realFrame).then(body => (query ? body?.querySelector(query) : body)?.appendChild(element));
            return injectable;
        },
        load: async () => {
            await getLoaded(realFrame);
            return injectable;
        },
        style: injection => {
            getHead(realFrame).then(head => {
                if (head) {
                    const styles = document.createElement('style');
                    styles.type = 'text/css';
                    styles.appendChild(document.createTextNode(injection));
                    head.appendChild(styles);
                }
            });
            return injectable;
        },
        error: callback => {
            realFrame.addEventListener('error', callback);
        },
        test: async () => {
            try {
                return Boolean(getDocument(await getLoaded(realFrame)));
            } catch {
                return false
            }
        }
    };

    return injectable;
};