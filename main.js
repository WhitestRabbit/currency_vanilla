// The apparent purpose of this project is very simple: An image of 50 Cent is displayed, with his rapper alias on top. Every time we press the button "Get Name", we get a different name for 50 Cent, in a random currency of the world, along with the converted value.
// Essentially, the real purpose of the project is to practice url requests with fetch and chained functions for promises, learn how to interact with a foreign API and how to deal with objects and arrays. The API used is Currency Layer, in its free version, which is why I couldn't use their "convert" endpoint.

function getRates(e) {
    e.preventDefault();

    const endpoint = ['live', 'list'];
    const access_key = '7300826c03bd8d9be0c274982b46a81f';
    let output = '';

    // The first request to the currency layer API is made, so that we can get the list of all available currencies and their descriptive names. Imagine that we are basically getting a JSON file with the results of the request, where an object literal called 'currencies' is held. The keys of currencies are the coded currency names and the values are the descriptive currency names.
    fetch(`http://api.currencylayer.com/${endpoint[1]}?access_key=${access_key}`)
    .then(res => res.json()) // the response of the request is converted into a JSON and passed into the parameters of the next callback
    .then(data => { 
        // converting the keys and values of 'currencies' into arrays with respective names
        keys = Object.keys(data.currencies);
        values = Object.values(data.currencies);
        // a random number is picked within the range of 0 to the length of the keys array, which is essentially the maximum number of currencies we have retrieved from the API
        const index = Math.ceil(Math.random()*keys.length);
        // passing the appropriate data as the results parameter of the next callback
        return {keys, values, index};
    }).then(results => {
        // another fetch request is made within this callback, now to the 'live' endpoint so that we can get the current exchange rate, just for the random currency we have picked
        fetch(`http://api.currencylayer.com/${endpoint[0]}?access_key=${access_key}&currencies=${results.keys[results.index]}`)
        .then(res => res.json())
        .then(data => {
            // the data we retrieved is a JSON file in which the 'quotes' field is an object that holds the exchange rates for every currency we requested, here we only have one item within that object, based on the way we restricted the request query
            const amount = Object.values(data.quotes)[0];
            // picking the proper currency name for the currency we picked
            const currency = results.values[results.index];
            // converting 0.5 USD to the currency we picked with two decimal digits and making it into a string followed by the currency name
            output = 0.5*amount.toFixed(2) + ' ' + currency.toUpperCase();
            // manipulating the DOM to pass output in the proper element
            document.getElementById('output').innerHTML = output;
        });
    });
}

document.getElementById('rate').addEventListener('click', getRates);