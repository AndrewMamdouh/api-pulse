// import React, { useState } from 'react';
// import { toNodeFetch } from 'curlconverter';

// function CurlGenerator() {
//     const [language, setLanguage] = useState('cURL'); // default to cURL
//     const [output, setOutput] = useState('');

//     const data = [
//         {
//             "id": "64f38f0f9ac54901e270c21f",
//             "rawUri": "/api/greet/darwinbox-dev",
//             "applicationName": "darwinbox",
//             "hostName": "localhost",
//             "port": 8081,
//             "scheme": "http",
//             "method": "GET",
//             "parameters": {},
//             "requestHeaders": {
//                 "cookie": "🔒MASKED🔒",
//                 "postman-token": "56f357ec-d607-4a26-8482-2f4f3ee497e6",
//                 "host": "localhost:8081",
//                 "connection": "keep-alive",
//                 "cache-control": "no-cache",
//                 "accept-encoding": "gzip, deflate, br",
//                 "user-agent": "PostmanRuntime/7.31.1",
//                 "accept": "*/*"
//             },
//             "responseHeaders": {
//                 "Keep-Alive": "timeout=60",
//                 "Connection": "keep-alive",
//                 "Content-Length": "21",
//                 "Date": "Sat, 02 Sep 2023 19:37:47 GMT",
//                 "Content-Type": "text/plain;charset=UTF-8"
//             },
//             "statusCode": 200,
//             "requestPayload": null,
//             "responsePayload": null,
//             "uncaughtExceptionMessage": null,
//             "payloadCaptureAttempted": false,
//             "requestPayloadCaptureAttempted": null,
//             "responsePayloadCaptureAttempted": null,
//             "latency": null,
//             "uri": {
//                 "uriPath": "/api/greet/{name}",
//                 "hasPathVariable": true,
//                 "size": 3
//             },
//             "timestamp": "2023-09-02T19:37:51.168+00:00",
//             "apiOwner": {
//                 "env": "dev",
//                 "team": "salesforce",
//                 "serviceName": "darwinbox"
//             }
//         },
//         {
//             "id": "64f39e569b689a01184b21e2",
//             "rawUri": "/api/greet/freshworks",
//             "applicationName": "zoho",
//             "hostName": "localhost",
//             "port": 8081,
//             "scheme": "http",
//             "method": "GET",
//             "parameters": {},
//             "requestHeaders": {
//                 "cookie": "🔒MASKED🔒",
//                 "postman-token": "c256417b-0a68-4457-a1fd-3dc1367f0e4c",
//                 "host": "localhost:8081",
//                 "connection": "keep-alive",
//                 "cache-control": "no-cache",
//                 "accept-encoding": "gzip, deflate, br",
//                 "user-agent": "PostmanRuntime/7.31.1",
//                 "accept": "*/*"
//             },
//             "responseHeaders": {
//                 "Keep-Alive": "timeout=60",
//                 "Connection": "keep-alive",
//                 "Content-Length": "18",
//                 "Date": "Sat, 02 Sep 2023 20:43:02 GMT",
//                 "Content-Type": "text/plain;charset=UTF-8"
//             },
//             "statusCode": 200,
//             "requestPayload": null,
//             "responsePayload": null,
//             "uncaughtExceptionMessage": null,
//             "payloadCaptureAttempted": false,
//             "requestPayloadCaptureAttempted": null,
//             "responsePayloadCaptureAttempted": null,
//             "latency": null,
//             "uri": {
//                 "uriPath": "/api/greet/{name}",
//                 "hasPathVariable": true,
//                 "size": 3
//             },
//             "timestamp": "2023-09-02T20:43:02.693+00:00",
//             "apiOwner": {
//                 "env": "dev",
//                 "team": "freshworks",
//                 "serviceName": "zoho"
//             }
//         }
//     ];

//     const generateCurl = (item) => {
//         const fetchCode = `
//             fetch('${item.scheme}://${item.hostName}:${item.port}${item.rawUri}', {
//                 method: '${item.method}',
//                 headers: ${JSON.stringify(item.requestHeaders, null, 2)}
//             })
//         `;

//         try {
//             const generatedCurl = toNodeFetch(fetchCode);
//             console.log('cURL command generated successfully:', generatedCurl);
//             return generatedCurl;
//         } catch (error) {
//             console.error('Error generating cURL command:', error);
//             return 'Error generating cURL command.';
//         }
//     };

//     const handleGenerate = () => {
//         // For simplicity, we're generating cURL for the first item in the data array.
//         // You can modify this to generate for all items or based on some selection.
//         const result = generateCurl(data[0]);
//         setOutput(result);
//     };

//     return (
//         <div>
//             <button onClick={handleGenerate}>Generate cURL</button>
//             <h3>Output:</h3>
//             <pre>{output}</pre>
//         </div>
//     );
// }

// export default CurlGenerator;
