// src/utils/boilerplateGenerator.js

// Safely formats string to replace array brackets for C++ / Java if needed
const formatValue = (lang, type, valStr) => {
  if (!valStr) return '""';
  if (lang === 'cpp') {
    if (type.includes('[]')) {
      return valStr.replace(/\[/g, '{').replace(/\]/g, '}');
    }
  } else if (lang === 'java') {
    if (type === 'integer[]') return `new int[]${valStr.replace(/\[/g, '{').replace(/\]/g, '}')}`;
    if (type === 'string[]') return `new String[]${valStr.replace(/\[/g, '{').replace(/\]/g, '}')}`;
    if (type === 'boolean[]') return `new boolean[]${valStr.replace(/\[/g, '{').replace(/\]/g, '}')}`;
  }
  return valStr;
};

const getCppType = (type) => {
  const map = {
    'integer': 'int',
    'string': 'string',
    'boolean': 'bool',
    'double': 'double',
    'character': 'char',
    'integer[]': 'vector<int>',
    'string[]': 'vector<string>',
    'boolean[]': 'vector<bool>',
    'integer[][]': 'vector<vector<int>>'
  };
  return map[type] || 'auto';
};

const getJavaType = (type) => {
  const map = {
    'integer': 'int',
    'string': 'String',
    'boolean': 'boolean',
    'double': 'double',
    'character': 'char',
    'integer[]': 'int[]',
    'string[]': 'String[]',
    'boolean[]': 'boolean[]',
    'integer[][]': 'int[][]'
  };
  return map[type] || 'Object';
};

const isSupportedType = (type) => {
  const unsupported = ['ListNode', 'TreeNode', 'Node'];
  return !unsupported.some(u => type.includes(u));
};

export const generateBoilerplate = (lang, snippet, metaDataStr, testcases) => {
  const fallback = buildFallback(lang, snippet, testcases);

  if (!metaDataStr || !testcases || testcases.length === 0) {
    return fallback;
  }

  let meta;
  try {
    meta = JSON.parse(metaDataStr);
  } catch (e) {
    return fallback;
  }

  // Check if we support all parameter types and return type
  if (!meta.params || !meta.return) return fallback;
  const allTypesSupported = meta.params.every(p => isSupportedType(p.type)) && isSupportedType(meta.return.type);
  if (!allTypesSupported) return fallback;

  if (lang === 'cpp') return buildCpp(snippet, meta, testcases);
  if (lang === 'python') return buildPython(snippet, meta, testcases);
  if (lang === 'java') return buildJava(snippet, meta, testcases);
  if (lang === 'javascript') return buildJs(snippet, meta, testcases);

  return fallback;
};

// ================= C++ Builder =================
const buildCpp = (snippet, meta, testcases) => {
  let mainBody = `int main() {\n    Solution sol;\n`;

  testcases.forEach((tc, i) => {
    const inputs = tc.split('\n');
    mainBody += `\n    // --- Test Case ${i + 1} ---\n`;
    
    let callArgs = [];
    meta.params.forEach((param, j) => {
      const val = formatValue('cpp', param.type, inputs[j]);
      const cppType = getCppType(param.type);
      const varName = `${param.name}_${i + 1}`;
      mainBody += `    ${cppType} ${varName} = ${val};\n`;
      callArgs.push(varName);
    });

    const outVar = `result_${i + 1}`;
    mainBody += `    ${getCppType(meta.return.type)} ${outVar} = sol.${meta.name}(${callArgs.join(', ')});\n`;
    
    // Very simple output printing (just prints raw arrays or values natively if possible, or warns)
    if (meta.return.type.includes('[]')) {
      mainBody += `    cout << "Test Case ${i + 1} Output: [";\n`;
      mainBody += `    for(int i=0; i<${outVar}.size(); i++) cout << ${outVar}[i] << (i == ${outVar}.size()-1 ? "" : ", ");\n`;
      mainBody += `    cout << "]" << endl;\n`;
    } else {
      mainBody += `    cout << "Test Case ${i + 1} Output: " << ${outVar} << endl;\n`;
    }
  });

  mainBody += `\n    return 0;\n}`;

  return `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\n${snippet || '// Write your code here'}\n\n${mainBody}`;
};

// ================= Python Builder =================
const buildPython = (snippet, meta, testcases) => {
  let mainBody = `\n# --- Test Cases ---\nsol = Solution()\n`;

  testcases.forEach((tc, i) => {
    const inputs = tc.split('\n');
    mainBody += `\n# Test Case ${i + 1}\n`;
    
    let callArgs = [];
    meta.params.forEach((param, j) => {
      const val = inputs[j] || 'None';
      const varName = `${param.name}_${i + 1}`;
      mainBody += `${varName} = ${val}\n`;
      callArgs.push(varName);
    });

    mainBody += `result_${i+1} = sol.${meta.name}(${callArgs.join(', ')})\n`;
    mainBody += `print(f"Test Case ${i + 1} Output: {result_${i+1}}")\n`;
  });

  return `${snippet || '# Write your code here'}\n${mainBody}`;
};

// ================= Java Builder =================
const buildJava = (snippet, meta, testcases) => {
  let mainBody = `    public static void main(String[] args) {\n        Solution sol = new Solution();\n`;

  testcases.forEach((tc, i) => {
    const inputs = tc.split('\n');
    mainBody += `\n        // --- Test Case ${i + 1} ---\n`;
    
    let callArgs = [];
    meta.params.forEach((param, j) => {
      const val = formatValue('java', param.type, inputs[j]);
      const jType = getJavaType(param.type);
      const varName = `${param.name}_${i + 1}`;
      mainBody += `        ${jType} ${varName} = ${val};\n`;
      callArgs.push(varName);
    });

    const outVar = `result_${i + 1}`;
    mainBody += `        ${getJavaType(meta.return.type)} ${outVar} = sol.${meta.name}(${callArgs.join(', ')});\n`;
    
    if (meta.return.type.includes('[]')) {
      mainBody += `        System.out.println("Test Case ${i + 1} Output: " + java.util.Arrays.toString(${outVar}));\n`;
    } else {
      mainBody += `        System.out.println("Test Case ${i + 1} Output: " + ${outVar});\n`;
    }
  });

  mainBody += `    }\n`;

  // We must inject the Solution class inside a Main file, or make Solution static inside Main, OR just leave Solution outside.
  // In Java, public classes must match file name. Judge0 wraps it usually, but let's just make Solution non-public or append Main.
  let cleanSnippet = (snippet || '').replace('public class Solution', 'class Solution');
  
  return `import java.util.*;\n\n${cleanSnippet}\n\npublic class Main {\n${mainBody}}`;
};

// ================= JS Builder =================
const buildJs = (snippet, meta, testcases) => {
  let mainBody = `\n// --- Test Cases ---\n`;

  testcases.forEach((tc, i) => {
    const inputs = tc.split('\n');
    mainBody += `\n// Test Case ${i + 1}\n`;
    
    let callArgs = [];
    meta.params.forEach((param, j) => {
      const val = inputs[j] || 'null';
      const varName = `${param.name}_${i + 1}`;
      mainBody += `const ${varName} = ${val};\n`;
      callArgs.push(varName);
    });

    mainBody += `const result_${i+1} = ${meta.name}(${callArgs.join(', ')});\n`;
    mainBody += `console.log("Test Case ${i + 1} Output:", result_${i+1});\n`;
  });

  return `${snippet || '// Write your code here'}\n${mainBody}`;
};

// ================= Fallback =================
const buildFallback = (lang, snippet, testcases) => {
  const casesText = testcases ? testcases.map((tc, i) => `// Test Case ${i + 1}:\n// ${tc.replace(/\\n/g, ' ')}`).join('\n\n') : '';

  if (lang === 'cpp') {
    return `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\n${snippet || '// Write your code here'}\n\nint main() {\n    // --- Sample Test Cases ---\n${casesText}\n\n    // Write your test execution here\n    \n    return 0;\n}`;
  } else if (lang === 'python') {
    return `${snippet || '# Write your code here'}\n\n# --- Sample Test Cases ---\n${casesText.split('//').join('#')}\n\n# Write your test execution here\n`;
  } else if (lang === 'java') {
    let cleanSnippet = (snippet || '').replace('public class Solution', 'class Solution');
    return `import java.util.*;\n\n${cleanSnippet}\n\npublic class Main {\n    public static void main(String[] args) {\n        // --- Sample Test Cases ---\n${casesText}\n\n        // Write your test execution here\n    }\n}`;
  } else if (lang === 'javascript') {
    return `${snippet || '// Write your code here'}\n\n// --- Sample Test Cases ---\n${casesText}\n\n// Write your test execution here\n`;
  }
  return snippet || '';
};
