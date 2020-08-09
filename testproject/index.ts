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
