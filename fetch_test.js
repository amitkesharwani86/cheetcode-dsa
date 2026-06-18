const query = `
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    questionFrontendId
    title
    titleSlug
    content
    difficulty
    topicTags { name }
  }
}`;

fetch('https://leetcode.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: query,
    variables: { titleSlug: 'two-sum' }
  })
})
.then(r => r.json())
.then(d => {
    console.log(d.data.question.title);
    console.log(d.data.question.content.substring(0, 100));
})
.catch(console.error);
