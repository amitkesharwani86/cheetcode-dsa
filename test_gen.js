import { generateBoilerplate } from './src/utils/boilerplateGenerator.js';

const snippet = `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`;
const metaStr = `{"name":"twoSum","params":[{"name":"nums","type":"integer[]"},{"name":"target","type":"integer"}],"return":{"type":"integer[]","size":2},"manual":false}`;
const testcases = ["[2,7,11,15]\n9", "[3,2,4]\n6"];

console.log(generateBoilerplate('cpp', snippet, metaStr, testcases));
console.log(generateBoilerplate('javascript', "var twoSum = function(nums, target) {}", metaStr, testcases));
