import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ALL_PROBLEMS from '../data/problems_with_tags.json';
import './TopicPage.css';

const topicData = {
  'arrays-and-hashing': {
    name: 'Arrays & Hashing',
    description: 'Master the fundamentals of array manipulation and the power of Hash Maps for O(1) lookups.',
    count: 124,
    tags: ['Array', 'Hash Table']
  },
  'two-pointers': {
    name: 'Two Pointers',
    description: 'Optimize O(N^2) problems into O(N) by using two pointers converging or moving in the same direction.',
    count: 42,
    tags: ['Two Pointers']
  },
  'sliding-window': {
    name: 'Sliding Window',
    description: 'Learn to optimize O(N^2) problems into O(N) by maintaining a dynamic window of elements.',
    count: 35,
    tags: ['Sliding Window']
  },
  'stack': {
    name: 'Stack',
    description: 'Understand LIFO operations and Monotonic Stacks to solve next-greater-element problems.',
    count: 58,
    tags: ['Stack', 'Monotonic Stack']
  },
  'binary-search': {
    name: 'Binary Search',
    description: 'Master O(log N) search on sorted arrays, matrixes, and answer-range problems.',
    count: 76,
    tags: ['Binary Search']
  },
  'linked-list': {
    name: 'Linked List',
    description: 'Understand node pointers, traversal, and advanced list manipulations like reversing and merging.',
    count: 61,
    tags: ['Linked List']
  },
  'trees': {
    name: 'Trees',
    description: 'Master DFS, BFS, and Binary Search Trees.',
    count: 145,
    tags: ['Tree', 'Binary Tree', 'Binary Search Tree']
  },
  'graphs': {
    name: 'Graphs',
    description: 'Learn Matrix DFS/BFS, Adjacency Lists, Topological Sort, and Dijkstra.',
    count: 98,
    tags: ['Graph', 'Depth-First Search', 'Breadth-First Search', 'Topological Sort']
  },
  'dynamic-programming': {
    name: 'Dynamic Programming',
    description: 'Break down complex problems using Memoization and Tabulation.',
    count: 210,
    tags: ['Dynamic Programming', 'Memoization']
  }
};

const TopicPage = () => {
  const { topicName } = useParams();
  const topic = topicData[topicName];

  if (!topic) {
    return (
      <div className="topic-page container empty-state">
        <Link to="/problems" className="back-link">← Back to Problems</Link>
        <h2>Topic Not Found</h2>
        <p>This topic might be under construction. Check back later!</p>
      </div>
    );
  }

  // Filter all problems by matching tags
  const filteredProblems = ALL_PROBLEMS.filter(p => {
    if (!p.tags) return false;
    return p.tags.some(tag => topic.tags.includes(tag));
  });

  // Keep the count requested by the user, ordered by ID
  const topicProblems = filteredProblems.slice(0, topic.count);

  return (
    <div className="topic-page container">
      <Link to="/problems" className="back-link">← Back to Problems</Link>
      
      <div className="topic-header">
        <h1 className="topic-title">{topic.name}</h1>
        <p className="topic-description">{topic.description}</p>
        <div className="topic-meta">
          <span className="topic-count-badge">{topic.count} Problems</span>
        </div>
      </div>

      <div className="problem-list-container">
        {topicProblems.map((prob) => (
          <Link key={prob.id} to={`/problems/${prob.slug}`} className="topic-problem-card glass">
            <span className="problem-id">{prob.id}</span>
            <h3 className="problem-name">{prob.title} {prob.paidOnly ? '🔒' : ''}</h3>
            <span className={`difficulty-badge ${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopicPage;
