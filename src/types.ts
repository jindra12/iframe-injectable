export interface InjectableIframe {
    /**
     * Instance of found iframe
     */
    iframe: HTMLIFrameElement,
    /**
     * Add a link with css styles to iframe
     * @param injection css link
     */
    css: (injection: string) => InjectableIframe;
    /**
     * Inject css string directly to iframe head
     * @param injection styles
     */
    style: (injection: string) => InjectableIframe;
    /**
     * Run a js function within iframe context
     * @param injection with params: window - contentWindow of iframe, document - contentDocument of iframe
     */
    js: (injection: (window: Window, document: Document) => void) => InjectableIframe;
    /**
     * Inject directly into iframe DOM
     * @param injection element to be injected
     * @param query where should the injection be
     */
    dom: (injection: Node, query?: string) => InjectableIframe;
    /**
     * Get <head> of iframe content
     */
    head: () => Promise<HTMLHeadElement | null>;
    /**
     * Get <body> of iframe content
     */
    body: () => Promise<HTMLBodyElement | null>;
    /**
     * Wait until iframe loads
     */
    load: () => Promise<InjectableIframe>;
    /**
     * On loading error callback. Needs to be setup before page loads
     * @param callback will be triggered if load of iframe fails. Callback has error event as param
     */
    error: (callback: (e: ErrorEvent) => void) => void;
}