export type PiiPatternType = {
  type: string;
  regex: RegExp;
};

// const piiPatterns: PiiPatternType[] = [
//     {
//         type: "email",
//         regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
//     },
//     {
//         type: "phone",
//         regex: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/
//     },
//     {
//         type: "ssn",
//         regex: /\b\d{3}-\d{2}-\d{4}\b/
//     },
//     {
//         type: "aadhar",
//         regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/
//     },
//     {
//         type: "pan",
//         regex: /\b[A-Z]{5}\d{4}[A-Z]{1}\b/
//     },
//     {
//         type: "passport",
//         regex: /^[A-Z]{1}[0-9]{7}$/
//     },
//     {
//         type: "dob",
//         regex: /\b\d{2}[\/.-]\d{2}[\/.-]\d{4}\b/
//     },
//     {
//         type: "indianMobile",
//         regex: /^(?:\+91)?[789]\d{9}$/
//     },
//     {
//         type: "creditCard",
//         regex: /\b(?:\d[ -]*?){13,19}\b/
//     }
//     // Add more PII pattern objects here as needed.
// ];

//need to pass all the samples , then keep checking key in the frequency map, when a user goes to a service then env then any of the api then all the api of that env
//should get scanned for pii data and a frequency map should be made and saved to use further, map should get cleaned when user reload the page
//using map show pii data in the ui of the postman
// const detectPotentialPII = (apiSamples: any[]) => {
//     const potentialPIIKeys = new Map<string, { rawUri: string, keys: string[] }[]>();

//     for (const sample of apiSamples) {
//         piiPatterns.forEach(patternObj => {
//             const keysDetectedInThisSample: Set<string> = new Set();

//             const recursiveSearch = (obj: any, currentPath: string[] = []) => {
//                 for (const [key, value] of Object.entries(obj)) {
//                     if (typeof value === 'object' && value !== null) {
//                         recursiveSearch(value, currentPath.concat(key));
//                     } else if (typeof value === 'string' && patternObj.regex.test(value)) {
//                         keysDetectedInThisSample.add(currentPath.concat(key).join('.'));
//                     }
//                 }
//             };

//             recursiveSearch(sample);

//             if (keysDetectedInThisSample.size > 0) {
//                 const detectedInfo = { rawUri: sample.rawUri, keys: Array.from(keysDetectedInThisSample) };
//                 if (potentialPIIKeys.has(patternObj.type)) {
//                     potentialPIIKeys.get(patternObj.type)!.push(detectedInfo);
//                 } else {
//                     potentialPIIKeys.set(patternObj.type, [detectedInfo]);
//                 }
//             }
//         });
//     }

//     return potentialPIIKeys;
// };
// let apiSamples=[{}];
// const potentialPIIs = detectPotentialPII(apiSamples);
// console.log(potentialPIIs);
