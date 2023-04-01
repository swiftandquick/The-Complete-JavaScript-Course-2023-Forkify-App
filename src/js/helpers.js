// Import async from regenerator-runtime package.  
import { async } from 'regenerator-runtime';

// Import TIMEOUT_SEC from 'config.js'.  
import { TIMEOUT_SEC } from './config.js';

// Takes in a number and return a rejected promise after a delay (based on number of seconds).  
const timeout = function (s) {
    return new Promise(function (_, reject) {
          setTimeout(function () {
                reject(new Error(`Request took too long! Timeout after ${s} second`));
          }, s * 1000);
    });
};

// Set uploadData initially to undefined.  If uploadData has a value, sending data to the API, I use POST request as method in fetch() method, 
// data are sent in JSON format.  If uploadData remained undefined, retrieve data from Forkify API, then return a Promise.  
// If fetch() method takes more than 10 seconds to return a promise, timeout(10) wins the race and a rejected promise is returned.  
// Use json() method to retrieve the data from the Promise.  
// Throw an error if res.ok is false, which means Promise is failed.  
export const AJAX = async function(url, uploadData = undefined) {
    try {
        const fetchPro = uploadData ? fetch(url, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify(uploadData)
            }) : fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if(!res.ok) {
            throw new Error(`${data.message} (${res.status})`);
        }
        return data;
    }
    catch(err) {
        throw err;
    }
}

/*
// Create and export a getJSON() async function that takes the url then returns the data.   
// Retrieve data from Forkify API, then return a Promise.  
// If fetch() method takes more than 10 seconds to return a promise, timeout(10) wins the race and a rejected promise is returned.  
// Use json() method to retrieve the data from the Promise.  
// Throw an error if res.ok is false, which means Promise is failed.  
export const getJSON = async function(url) {
    try {
        const fetchPro = fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if(!res.ok) {
            throw new Error(`${data.message} (${res.status})`);
        }
        return data;
    }
    catch(err) {
        throw err;
    }
}

// Since I am sending data to the API, I use POST request as method in fetch() method, data are sent in JSON format.  
// If fetch() method takes more than 10 seconds to return a promise, timeout(10) wins the race and a rejected promise is returned.  
// Use json() method to retrieve the data from the Promise.  
// Throw an error if res.ok is false, which means Promise is failed.  
export const sendJSON = async function(url, uploadData) {
    try {
        const fetchPro = fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(uploadData)});
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if(!res.ok) {
            throw new Error(`${data.message} (${res.status})`);
        }
        return data;
    }
    catch(err) {
        throw err;
    }
}
*/