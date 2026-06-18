const fs = require('fs');

const query = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      frontendQuestionId: questionFrontendId
      title
      titleSlug
      difficulty
      topicTags {
        name
      }
    }
  }
}`;

async function fetchAllProblems() {
  const limit = 100;
  let skip = 0;
  let allProblems = [];
  let total = Infinity;

  console.log("Fetching all problems with tags...");

  while (skip < total && skip < 3500) {
    console.log(`Fetching from ${skip}...`);
    try {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: { categorySlug: "", limit, skip, filters: {} }
        })
      });

      const d = await res.json();
      
      if (!d.data || !d.data.problemsetQuestionList) {
        console.error("Error fetching data:", d);
        break;
      }

      const list = d.data.problemsetQuestionList;
      total = list.total;
      
      const cleanList = list.questions.map(q => ({
        id: q.frontendQuestionId,
        title: q.title,
        slug: q.titleSlug,
        difficulty: q.difficulty,
        tags: q.topicTags.map(t => t.name)
      }));

      allProblems.push(...cleanList);
      skip += limit;

      // Small delay
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error("Fetch error:", e);
      break;
    }
  }

  // Deduplicate and sort by ID just in case
  const unique = [];
  const ids = new Set();
  for (let p of allProblems) {
    if (!ids.has(p.id)) {
      unique.push(p);
      ids.add(p.id);
    }
  }

  unique.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  fs.writeFileSync('src/data/problems_with_tags.json', JSON.stringify(unique, null, 2));
  console.log(`Saved ${unique.length} problems with tags.`);
}

fetchAllProblems();
