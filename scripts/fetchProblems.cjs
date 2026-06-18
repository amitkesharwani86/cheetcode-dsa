const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'problems.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log('Fetching problems from LeetCode API...');

https.get('https://leetcode.com/api/problems/algorithms/', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      const problems = parsedData.stat_status_pairs;
      
      // Transform data to a cleaner format for our app
      const cleanProblems = problems.map(p => ({
        id: p.stat.frontend_question_id,
        title: p.stat.question__title,
        slug: p.stat.question__title_slug,
        difficulty: p.difficulty.level === 1 ? 'Easy' : p.difficulty.level === 2 ? 'Medium' : 'Hard',
        paidOnly: p.paid_only
      })).sort((a, b) => a.id - b.id);
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(cleanProblems, null, 2));
      console.log(`Successfully saved ${cleanProblems.length} problems to ${DATA_FILE}`);
    } catch (e) {
      console.error('Error parsing JSON!', e);
    }
  });

}).on('error', (err) => {
  console.error('Error fetching data: ', err.message);
});
