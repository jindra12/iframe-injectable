# iframe-injectable documentation

Simple typescript function allowing one to inject into iframe any javascript, styles, css that is desired.

## Example of use

```typescript

import iframe from 'iframe-injectable';

const successDiv = document.createElement('div');
successDiv.setAttribute('name', 'success');
successDiv.appendChild(document.createTextNode('Success!'));

const successSpan = document.createElement('span');
successSpan.appendChild(document.createTextNode('Span success'));

// Load iframe
const frame = iframe('#frame') // Access iframe by query selector (can access it by index of iframe on page (n-th iframe), or by passing HTMLIFrameElement)
    .dom(successDiv) // Add div to body
    .dom(successSpan, '[name="success"]') // Add span to element named success
    .style('body { background-color: pink; }') // Add styles to within iframe
    .css('style.css') // Add css link with this rel
    .js((window, document) => { // on load execute this javascript with 'window' and 'document' being from within iframe
        console.log(window.innerWidth); // reads 640 in testproject
        document.body.appendChild(document.createTextNode('Success!!'));
    });

(async () => {
    console.log((await frame.head())?.baseURI); // gets iframe <head> tag and reads base uri
    console.log((await frame.body())?.className); // gets iframe <body> tag and reads its classname
    console.log(await iframe(1).test()); // Will return false since iframe cannot access document.body of wikipedia iframe
})();

```

## Addendum

This package may throw CORS errors if you try and edit an iframe which is from cross-domain without proper policy.

## Changes since 0.1.0

Can now test CORS accessibility with .test() method, which returns a boolean promise

## Footer

If you discover any bugs, or have ideas about improving this package, do not hesitate to file in an issue or create a pull request.