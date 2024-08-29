import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/UserExam.css"

const sampleQuestions = [
  {
    id: 1,
    question: 'What is the time complexity of finding the maximum element in an unsorted array?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)']
  },
  {
    id: 2,
    question: 'Given an array of integers, how would you efficiently remove duplicates?',
    options: ['Sort the array first and then remove duplicates', 'Use a hash set to track duplicates', 'Use a nested loop to compare each element', 'Use a linked list']
  },
  {
    id: 3,
    question: 'Given an unsorted array, what is the most efficient way to find the k-th largest element?',
    options: ['Sort the array and select the k-th element', 'Use a min-heap of size k', 'Use a max-heap of size n', 'Use a binary search algorithm']
  },
  {
    id: 4,
    question: 'What is the primary advantage of using a hash map over an array for lookups?',
    options: ['Lower space complexity', 'Constant time lookups', 'Easier iteration', 'Sorting is more efficient']
  },
  {
    id: 5,
    question: 'Which of the following techniques is commonly used to resolve hash collisions?',
    options: ['Binary search', 'Linked list chaining', 'Sorting', 'Depth-first search']
  },
  {
    id: 6,
    question: 'How would you design a hash function to minimize collisions?',
    options: ['Use a simple modulus operation', 'Combine multiple hash functions and apply them sequentially', 'Choose a hash function that generates a wide range of values', 'Avoid using hash maps for large datasets']
  },
  {
    id: 7,
    question: 'What is the main advantage of a linked list over an array?',
    options: ['Constant time access by index', 'Dynamic size', 'Lower space complexity', 'Faster traversal']
  },
  {
    id: 8,
    question: 'How can you reverse a singly linked list most efficiently?',
    options: ['Iteratively using two pointers', 'Recursively', 'By copying elements to an array and reversing', 'By sorting the linked list']
  },
  {
    id: 9,
    question: 'How can you detect and remove a cycle in a linked list?',
    options: ['Using a hash map to store visited nodes', 'Using two pointers moving at different speeds', 'By marking visited nodes', 'By sorting the linked list and checking for duplicates']
  },
  {
    id: 10,
    question: 'What is the primary advantage of using the two-pointer technique?',
    options: ['Simplifies the code', 'Reduces space complexity', 'Improves time complexity by avoiding nested loops', 'Allows for constant time lookups']
  },
  {
    id: 11,
    question: 'Which of the following problems can be efficiently solved using the two-pointer technique?',
    options: ['Finding duplicates in an array', 'Merging two sorted arrays', 'Reversing an array', 'Finding the k-th largest element']
  },
  {
    id: 12,
    question: 'How would you use the two-pointer technique to find all pairs in a sorted array that sum up to a target value?',
    options: ['Iterate through the array and check each pair', 'Sort the array and use two pointers, one at the start and one at the end', 'Use two nested loops to compare each element', 'Use a hash map to store complements']
  },
  {
    id: 13,
    question: 'Which of the following operations is the most basic operation of a stack?',
    options: ['Insertion', 'Deletion', 'Traversal', 'Popping the top element']
  },
  {
    id: 14,
    question: 'Which data structure is typically used to evaluate postfix expressions?',
    options: ['Queue', 'Stack', 'Linked list', 'Binary tree']
  },
  {
    id: 15,
    question: 'How can you implement a stack that supports getting the minimum element in constant time?',
    options: ['Using an auxiliary stack', 'By sorting the stack', 'Using a priority queue', 'By using a hash map']
  },
  {
    id: 16,
    question: 'Which of the following operations is the most basic operation of a queue?',
    options: ['Insertion', 'Deletion', 'Traversal', 'Popping the front element']
  },
  {
    id: 17,
    question: 'Which data structure is typically used to implement a task scheduler?',
    options: ['Stack', 'Queue', 'Priority Queue', 'Binary Tree']
  },
  {
    id: 18,
    question: 'How can you implement a queue using two stacks?',
    options: ['By using one stack for enqueue operations and another for dequeue operations', 'By reversing the stack every time you enqueue', 'By using a circular array', 'By implementing a doubly linked list']
  },
  {
    id: 19,
    question: 'What is a min-heap?',
    options: ['A binary tree where the root is the smallest element', 'A binary tree where the root is the largest element', 'A stack-based structure', 'A queue-based structure']
  },
  {
    id: 20,
    question: 'Which of the following operations is not typically supported by a heap?',
    options: ['Insertion', 'Deletion', 'Finding the maximum element in a min-heap', 'Sorting']
  },
  {
    id: 21,
    question: 'How would you implement a median finder using two heaps?',
    options: ['Use one min-heap and one max-heap', 'Use two min-heaps', 'Use two max-heaps', 'Sort the data first and then use a single heap']
  },
  {
    id: 22,
    question: 'What is a binary search tree (BST)?',
    options: ['A tree where each node has up to two children', 'A tree where the left child is always smaller than the parent and the right child is always larger', 'A tree where each node has exactly two children', 'A tree where nodes are linked in a circular manner']
  },
  {
    id: 23,
    question: 'What is the time complexity of searching for an element in a balanced binary search tree?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)']
  },
  {
    id: 24,
    question: 'How would you balance an unbalanced binary search tree?',
    options: ['Using AVL rotations', 'By sorting the tree', 'Using a queue', 'Using a hash map']
  },
  {
    id: 25,
    question: 'What is a graph?',
    options: ['A data structure that consists of vertices connected by edges', 'A linear data structure like an array', 'A stack-based structure', 'A data structure used for sorting']
  },
  {
    id: 26,
    question: 'Which algorithm is used to find the shortest path in a weighted graph?',
    options: ['Breadth-First Search', 'Depth-First Search', 'Dijkstra\'s Algorithm', 'Prim\'s Algorithm']
  },
  {
    id: 27,
    question: 'How would you detect a cycle in a directed graph?',
    options: ['Using Depth-First Search with a recursion stack', 'Using Breadth-First Search', 'By checking all edges for backtracking', 'By using Dijkstra\'s Algorithm']
  },
  {
    id: 28,
    question: 'What is dynamic programming?',
    options: ['A method for solving complex problems by breaking them down into simpler subproblems', 'A sorting algorithm', 'A data structure used to manage memory', 'A type of graph algorithm']
  },
  {
    id: 29,
    question: 'Which of the following problems can be efficiently solved using dynamic programming?',
    options: ['Knapsack problem', 'Quick sort', 'Binary search', 'Graph traversal']
  },
  {
    id: 30,
    question: 'How would you implement a solution for the Longest Increasing Subsequence (LIS) problem?',
    options: ['Use dynamic programming with a memoization table', 'Use a greedy algorithm', 'Use a divide and conquer approach', 'Sort the sequence first']
  }
];


function Exam() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showIntro, setShowIntro] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    console.log(userAnswers);
  }, [userAnswers]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleStartExam = () => {
    setShowIntro(false);
  };

  const handleSubmit = () => {
    fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/grade_exam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: userAnswers }),
      credentials: 'include',  
    })
    .then(response => response.json())
    .then(data => {
      console.log('Exam Results:', data);
      sessionStorage.setItem("exam_taken", "1");
      navigate('/main'); 
    })
    .catch(error => console.error('Error grading exam:', error));
  };

  return (
    <div className="exam-container">
      {showIntro ? (
        <div className="intro-container">
          <h1>Welcome to the Technical Skills Assessment</h1>
          <p>
            This exam is mandatory and is designed to gauge your knowledge level
            so we can provide you with more accurate and personalized problems.
            Please answer the following questions to the best of your ability.
          </p>
          <button className="start-exam-button" onClick={handleStartExam}>
            Start Exam
          </button>
        </div>
      ) : (
        <>
          <h1>Technical Skills Assessment</h1>
          <div className="question-block">
            <h3>{sampleQuestions[currentQuestionIndex].question}</h3>
            {sampleQuestions[currentQuestionIndex].options.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name={`question-${sampleQuestions[currentQuestionIndex].id}`}
                  value={option}
                  checked={userAnswers[sampleQuestions[currentQuestionIndex].id] === option}
                  onChange={() => handleAnswerChange(sampleQuestions[currentQuestionIndex].id, option)}
                />
                {option}
              </label>
            ))}
          </div>

          <div className="navigation-buttons">
            <button
              type="button"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>

            {currentQuestionIndex < sampleQuestions.length - 1 ? (
              <button type="button" onClick={handleNextQuestion}>
                Next
              </button>
            ) : (
              <button type="button" onClick={handleSubmit}>
                Submit Exam
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Exam;