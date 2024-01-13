export {};
// import axios, { AxiosResponse } from 'axios';

// import {
//     ApiOwner,
//     Uri,
//     Mapping,
//     ApiSample,
//     ApiSampleNode,
//     ApiSampleConvertorNode,
//     SaveWorkflowRequestPayload,
//     ExecuteMirrorRequestPayload,
//     ApiResponseChain,
//     RecordApiChains,
//     OverRidingKeyValue,
//     ComparisonConfig,
//     ReplayApiSampleNode,
//     ReplayApiChain,
//     ReplayApiChains,
//     ExecuteWorkflowRequestPayload,
//     TrafficDetailsResponse
// } from '../models/interfaceUtil';

// // Functions
// function recordApiCall(data: RecordApiChains): Promise<any> {
//     const config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'http://ec2-15-206-116-54.ap-south-1.compute.amazonaws.com:8080/api/v1/mirror/workflow/pr/record',
//         headers: {
//             'X-API-KEY': 'm2p123',
//             'X-PARTNER-ID': 'm2p',
//             'Content-Type': 'application/json'
//         },
//         data: data
//     };

//     return axios(config)
//         .then((response: AxiosResponse) => {
//             console.log(JSON.stringify(response.data));
//             return response.data;
//         })
//         .catch(error => {
//             console.error(error);
//             throw error;
//         });
// }

// function replayApiCall(data: ReplayApiChains): Promise<any> {
//     const config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'http://localhost:8080/api/v1/mirror/workflow/pr/replay',
//         headers: {
//             'X-API-KEY': 'm2p123',
//             'X-PARTNER-ID': 'm2p',
//             'Content-Type': 'application/json',
//             'Cookie': 'JSESSIONID=C11B606840C2BE329031060010A2F9E5'
//         },
//         data: data
//     };

//     return axios(config)
//         .then((response: AxiosResponse) => {
//             console.log(JSON.stringify(response.data));
//             return response.data;
//         })
//         .catch(error => {
//             console.error(error);
//             throw error;
//         });
// }

// // Example usage:
// // const recordData: RecordApiChains = {...};
// // recordApiCall(recordData);

// // const replayData: ReplayApiChains = {...};
// // replayApiCall(replayData);
