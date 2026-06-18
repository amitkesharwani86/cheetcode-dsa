
const query = `
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    codeSnippets {
      lang
      langSlug
      code
    }
    exampleTestcaseList
    metaData
  }
}`;

async function test() {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { titleSlug: 'two-sum' }
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
