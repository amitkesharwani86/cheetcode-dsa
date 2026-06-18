const fs = require('fs');

const query = `
query questionTags($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    topicTags {
      name
    }
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
    console.log("Two Sum Tags:", d.data.question.topicTags.map(t => t.name));
})
.catch(console.error);
