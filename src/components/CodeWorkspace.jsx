import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { supabase } from '../supabaseClient';
import { generateBoilerplate } from '../utils/boilerplateGenerator';
import './CodeWorkspace.css';

const LANGUAGES = {
  cpp: {
    name: 'C++',
    judge0Id: 54,
    leetCodeLang: 'C++'
  },
  python: {
    name: 'Python',
    judge0Id: 71,
    leetCodeLang: 'Python3'
  },
  java: {
    name: 'Java',
    judge0Id: 62,
    leetCodeLang: 'Java'
  },
  javascript: {
    name: 'JavaScript',
    judge0Id: 63,
    leetCodeLang: 'JavaScript'
  }
};

const CodeWorkspace = ({ problemId }) => {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('// Loading snippet...');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [problemSnippets, setProblemSnippets] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [metaData, setMetaData] = useState('');

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const query = `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              codeSnippets {
                lang
                code
              }
              exampleTestcaseList
              metaData
            }
          }
        `;
        const res = await fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables: { titleSlug: problemId } })
        });
        const data = await res.json();
        
        if (data?.data?.question) {
          const snippets = data.data.question.codeSnippets || [];
          const tcs = data.data.question.exampleTestcaseList || [];
          const metaStr = data.data.question.metaData || '';
          setProblemSnippets(snippets);
          setTestCases(tcs);
          setMetaData(metaStr);
          
          // Set initial code for cpp
          const cppSnippet = snippets.find(s => s.lang === 'C++')?.code;
          setCode(generateBoilerplate('cpp', cppSnippet, metaStr, tcs));
        }
      } catch (err) {
        console.error('Failed to fetch snippets', err);
        setCode(generateBoilerplate('cpp', '', '', []));
      }
    };
    if (problemId) {
      fetchSnippets();
    }
  }, [problemId]);

  // When language changes, update the boilerplate if user hasn't typed much, 
  // or just always set it for now (in a real app, we'd cache code per language)
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    const leetCodeLangName = LANGUAGES[newLang].leetCodeLang;
    const snippet = problemSnippets.find(s => s.lang === leetCodeLangName)?.code;
    setCode(generateBoilerplate(newLang, snippet, metaData, testCases));
    setOutput('');
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput('Running...');

    const langConfig = LANGUAGES[language];

    try {
      const response = await fetch('https://ce.judge0.com/submissions?wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          language_id: langConfig.judge0Id,
          source_code: code
        })
      });

      const data = await response.json();

      if (data.stdout) {
        setOutput(data.stdout);
      } else if (data.stderr) {
        setOutput(`Error: ${data.stderr}`);
      } else if (data.compile_output) {
        setOutput(`Compile Error: ${data.compile_output}`);
      } else if (data.message) {
        setOutput(`Error: ${data.message}`);
      } else {
        setOutput('Execution completed with no output.');
      }
    } catch (err) {
      console.error(err);
      setOutput(`Failed to execute code.\nError: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="code-workspace glass">
      <div className="workspace-header">
        <div className="lang-selector">
          <select value={language} onChange={handleLanguageChange} className="lang-dropdown">
            {Object.keys(LANGUAGES).map(key => (
              <option key={key} value={key}>{LANGUAGES[key].name}</option>
            ))}
          </select>
        </div>
        <div className="workspace-actions">
          <button 
            className="run-btn" 
            onClick={handleRunCode} 
            disabled={isExecuting}
          >
            {isExecuting ? 'Running...' : '▶ Run Code'}
          </button>
        </div>
      </div>

      <div className="editor-container">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        />
      </div>

      <div className="console-container">
        <div className="console-header">
          <span>Console Output</span>
        </div>
        <div className="console-body">
          <pre className={`output-text ${output.includes('Error') ? 'error' : ''}`}>
            {output || 'Run your code to see the output here.'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeWorkspace;
