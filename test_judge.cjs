const execute = async () => {
  const res = await fetch('https://ce.judge0.com/submissions?wait=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language_id: 54, // C++
      source_code: '#include <iostream>\nint main() { std::cout << "Test"; return 0; }'
    })
  });
  const data = await res.json();
  console.log(data);
};
execute();
