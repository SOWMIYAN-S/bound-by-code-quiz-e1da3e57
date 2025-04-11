
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'intermediate' | 'hard';
  category: 'syntax' | 'output' | 'debugging' | 'functions' | 'concepts';
}

export const quizQuestions: Question[] = [
  // Easy Questions
  {
    id: 1,
    text: "What is the correct way to create a variable in Python?",
    options: ["var x = 5", "x := 5", "x = 5", "int x = 5"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "syntax"
  },
  {
    id: 2,
    text: "What will be the output of the following code?\n```python\nprint(2 + 2 * 2)```",
    options: ["8", "6", "4", "Error"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "output"
  },
  {
    id: 3,
    text: "Which of these is a valid Python comment?",
    options: ["// This is a comment", "/* This is a comment */", "# This is a comment", "<!-- This is a comment -->"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "syntax"
  },
  {
    id: 4,
    text: "What is the output of this code?\n```python\nfruits = ['apple', 'banana', 'cherry']\nprint(fruits[1])```",
    options: ["apple", "banana", "cherry", "IndexError"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "output"
  },
  {
    id: 5,
    text: "How do you create a list in Python?",
    options: ["list = (1, 2, 3)", "list = [1, 2, 3]", "list = {1, 2, 3}", "array(1, 2, 3)"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "syntax"
  },
  {
    id: 6,
    text: "What is the output of this code?\n```python\nx = 5\ny = 3\nprint(x > y)```",
    options: ["5", "True", "False", "Error"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "output"
  },
  {
    id: 7,
    text: "Which function is used to get the length of a list in Python?",
    options: ["size()", "length()", "len()", "count()"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "functions"
  },
  {
    id: 8,
    text: "What's the correct way to define a function in Python?",
    options: ["function myFunc():", "def myFunc():", "func myFunc():", "define myFunc():"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "syntax"
  },
  {
    id: 9,
    text: "Identify the bug in this code:\n```python\nif x = 5:\n    print('x is 5')```",
    options: ["Indentation error", "Assignment operator instead of equality operator", "Missing parentheses", "No bug"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "debugging"
  },
  {
    id: 10,
    text: "What is the correct way to import a module in Python?",
    options: ["#include <module>", "import module", "using module", "require module"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "syntax"
  },
  {
    id: 11,
    text: "What will this code print?\n```python\nprint('Hello' + ' ' + 'World')```",
    options: ["Hello World", "'Hello World'", "Hello+World", "Error"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "output"
  },
  {
    id: 12,
    text: "How do you check the type of a variable in Python?",
    options: ["typeof()", "type()", "typeOf()", "vartype()"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "functions"
  },
  
  // Intermediate Questions
  {
    id: 13,
    text: "What is the output of this code?\n```python\nprint([i for i in range(5) if i % 2 == 0])```",
    options: ["[0, 1, 2, 3, 4]", "[0, 2, 4]", "[1, 3]", "[0, 2, 4, 6, 8]"],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "output"
  },
  {
    id: 14,
    text: "Which is the correct way to open a file in Python?",
    options: ["file = File('file.txt', 'r')", "file = open('file.txt', 'r')", "file = read('file.txt')", "file = load('file.txt')"],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "syntax"
  },
  {
    id: 15,
    text: "What's the output of the following code?\n```python\ndef add(a, b=2):\n    return a + b\nprint(add(3))```",
    options: ["5", "3", "2", "Error"],
    correctAnswer: 0,
    difficulty: "intermediate",
    category: "output"
  },
  {
    id: 16,
    text: "What does this list comprehension do?\n```python\n[x**2 for x in range(10) if x % 2 == 0]```",
    options: ["Squares of all numbers from 0-9", "Squares of even numbers from 0-9", "Even numbers from 0-9", "Squares of odd numbers from 0-9"],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "concepts"
  },
  {
    id: 17,
    text: "Identify the bug in this code:\n```python\ndef func(x):\n    return x + 1\n\ny = func```",
    options: ["Missing parentheses in function call", "Invalid function name", "Return statement error", "No bug"],
    correctAnswer: 3,
    difficulty: "intermediate",
    category: "debugging"
  },
  {
    id: 18,
    text: "What does this lambda function do?\n```python\nfunc = lambda x, y: x if x > y else y```",
    options: ["Returns the sum of x and y", "Returns the product of x and y", "Returns the larger of x and y", "Returns the smaller of x and y"],
    correctAnswer: 2,
    difficulty: "intermediate",
    category: "functions"
  },
  {
    id: 19,
    text: "What's the output?\n```python\nd = {'a': 1, 'b': 2}\nprint(d.get('c', 3))```",
    options: ["None", "3", "KeyError", "{'a': 1, 'b': 2, 'c': 3}"],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "output"
  },
  {
    id: 20,
    text: "Which of these is not a valid method for string manipulation in Python?",
    options: ["strip()", "lower()", "length()", "replace()"],
    correctAnswer: 2,
    difficulty: "intermediate",
    category: "functions"
  },
  {
    id: 21,
    text: "What will be the output?\n```python\nnumbers = [1, 2, 3, 4]\nresult = map(lambda x: x * 2, numbers)\nprint(list(result))```",
    options: ["[1, 2, 3, 4, 1, 2, 3, 4]", "[1, 2, 3, 4]", "[2, 4, 6, 8]", "[1, 4, 9, 16]"],
    correctAnswer: 2,
    difficulty: "intermediate",
    category: "output"
  },
  {
    id: 22,
    text: "What's the bug in this code?\n```python\ntry:\n    result = 10 / 0\nexcept:\n    print('Error')\nfinally:\n    print('Done')\nexcept ZeroDivisionError:\n    print('Division by zero')```",
    options: ["Missing except clause", "Multiple finally blocks", "except after finally", "Division by zero"],
    correctAnswer: 2,
    difficulty: "intermediate",
    category: "debugging"
  },
  {
    id: 23,
    text: "What does the 'is' operator check in Python?",
    options: ["Value equality", "Type equality", "Object identity", "Variable existence"],
    correctAnswer: 2,
    difficulty: "intermediate",
    category: "concepts"
  },
  {
    id: 24,
    text: "What's the output?\n```python\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)```",
    options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4, 1, 2, 3]", "Error"],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "output"
  },
  
  // Hard Questions
  {
    id: 25,
    text: "What's the output of this code?\n```python\nclass A:\n    x = 1\n    \na = A()\nb = A()\na.x = 2\nprint(b.x)```",
    options: ["1", "2", "None", "AttributeError"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "output"
  },
  {
    id: 26,
    text: "What is a decorator in Python?",
    options: ["A design pattern for UI components", "A function that takes a function and returns a new function", "A class that inherits from multiple parent classes", "A type of exception handling"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "concepts"
  },
  {
    id: 27,
    text: "Identify the bug in this code:\n```python\nclass MyClass:\n    def __init__(self, value):\n        self.value = value\n    \n    def __add__(self, other):\n        return self.value + other.value\n\nx = MyClass(5)\ny = 3\nprint(x + y)```",
    options: ["Missing parentheses", "Trying to add objects of different types", "Incorrect dunder method", "No bug"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "debugging"
  },
  {
    id: 28,
    text: "What's the output?\n```python\ndef func(a=[]):\n    a.append(len(a))\n    return a\n\nprint(func())\nprint(func())```",
    options: ["[0] [0]", "[0] [0, 1]", "[0, 1]", "[] [0]"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "output"
  },
  {
    id: 29,
    text: "What does the following code do?\n```python\nfrom functools import reduce\nresult = reduce(lambda x, y: x * y, range(1, 6))```",
    options: ["Computes 5!", "Computes 5^5", "Computes the sum of 1 to 5", "Raises an error"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "functions"
  },
  {
    id: 30,
    text: "What is a metaclass in Python?",
    options: ["A class that inherits from multiple parent classes", "A class used for data validation", "A class that defines how a class behaves", "A class that cannot be instantiated"],
    correctAnswer: 2,
    difficulty: "hard",
    category: "concepts"
  },
  {
    id: 31,
    text: "What's the output?\n```python\ngen = (i for i in range(3))\nnext(gen)\nprint(list(gen))```",
    options: ["[0, 1, 2]", "[1, 2]", "[0]", "StopIteration error"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "output"
  },
  {
    id: 32,
    text: "What is the time complexity of dictionary lookup in Python?",
    options: ["O(n)", "O(log n)", "O(1) on average", "O(n log n)"],
    correctAnswer: 2,
    difficulty: "hard",
    category: "concepts"
  },
  {
    id: 33,
    text: "Identify the bug in this multithreading code:\n```python\nimport threading\n\nshared_counter = 0\n\ndef increment():\n    global shared_counter\n    for _ in range(1000000):\n        shared_counter += 1\n\nthreads = [threading.Thread(target=increment) for _ in range(2)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(shared_counter)```",
    options: ["Incorrect thread initialization", "Missing import", "Race condition", "No bug"],
    correctAnswer: 2,
    difficulty: "hard",
    category: "debugging"
  },
  {
    id: 34,
    text: "What's the output?\n```python\nclass A:\n    def __init__(self):\n        self.x = 1\n    \n    def __del__(self):\n        print('Deleted')\n\na = A()\ndel a\nprint('Done')```",
    options: ["Deleted\\nDone", "Done", "Done\\nDeleted", "Error"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "output"
  },
  {
    id: 35,
    text: "What is the difference between __new__ and __init__ in Python classes?",
    options: ["No difference", "__new__ creates the instance, __init__ initializes it", "__new__ is called after __init__", "__new__ is only used in metaclasses"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "concepts"
  },
  {
    id: 36,
    text: "What does this code do?\n```python\nimport asyncio\n\nasync def main():\n    await asyncio.sleep(1)\n    return 'done'\n\nprint(asyncio.run(main()))```",
    options: ["Prints 'done' immediately", "Prints 'done' after 1 second", "Raises an error", "Prints a coroutine object"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "output"
  },
  
  // Additional Mixed Questions
  {
    id: 37,
    text: "What's the output?\n```python\nprint(bool([]), bool([0]), bool(''), bool(' '))```",
    options: ["False False False False", "False True False True", "True False True False", "False True False False"],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "output"
  },
  {
    id: 38,
    text: "What is the correct way to define a class method in Python?",
    options: [
      "def method(self): ...", 
      "@classmethod\ndef method(cls): ...", 
      "@staticmethod\ndef method(): ...", 
      "class.method = lambda self: ..."
    ],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "syntax"
  },
  {
    id: 39,
    text: "What will this code output?\n```python\nclass A:\n    def __init__(self):\n        print('A'),\n        super().__init__()\n\nclass B:\n    def __init__(self):\n        print('B'),\n\nclass C(A, B):\n    def __init__(self):\n        print('C'),\n        super().__init__()\n\nC()```",
    options: ["C A B", "C", "C A", "A B C"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "output"
  },
  {
    id: 40,
    text: "What does the following code do?\n```python\nwith open('file.txt', 'w') as f:\n    f.write('Hello')```",
    options: [
      "Reads from file.txt", 
      "Writes to file.txt and ensures the file is closed", 
      "Creates a file handler without writing", 
      "Deletes file.txt"
    ],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "concepts"
  },
  {
    id: 41,
    text: "What's the bug in this code?\n```python\nfor i in range(5):\n    if i == 3:\n        continue\n    print(i)\n    break```",
    options: [
      "Range should be range(1, 5)", 
      "break should be outside the loop", 
      "continue and break in the same loop", 
      "The loop will exit after the first iteration"
    ],
    correctAnswer: 3,
    difficulty: "intermediate",
    category: "debugging"
  },
  {
    id: 42,
    text: "What's the output?\n```python\nfrom collections import defaultdict\nd = defaultdict(int)\nprint(d['nonexistent'])```",
    options: ["KeyError", "None", "0", "''"],
    correctAnswer: 2,
    difficulty: "intermediate",
    category: "output"
  },
  {
    id: 43,
    text: "What is a generator in Python?",
    options: [
      "A function that returns multiple values", 
      "A function that yields values one at a time", 
      "A class that generates random numbers", 
      "A tool to create new classes"
    ],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "concepts"
  },
  {
    id: 44,
    text: "Which of these is not a built-in function in Python?",
    options: ["map()", "filter()", "reduce()", "len()"],
    correctAnswer: 2,
    difficulty: "intermediate",
    category: "functions"
  },
  {
    id: 45,
    text: "What is the output of this code?\n```python\ntuple1 = (1, 2, 3)\ntuple2 = (4, 5, 6)\nprint(tuple1 + tuple2)```",
    options: ["(1, 2, 3, 4, 5, 6)", "(5, 7, 9)", "TypeError", "(1, 2, 3) + (4, 5, 6)"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "output"
  },
  {
    id: 46,
    text: "What does this function do?\n```python\ndef mystery(lst):\n    return lst[::-1]```",
    options: ["Sorts the list", "Reverses the list", "Creates a copy of the list", "Returns a new empty list"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "functions"
  },
  {
    id: 47,
    text: "What is the output?\n```python\na = 1\ndef func():\n    a = 2\n    def inner():\n        nonlocal a\n        a = 3\n    inner()\n    return a\nprint(func())```",
    options: ["1", "2", "3", "Error"],
    correctAnswer: 2,
    difficulty: "hard",
    category: "output"
  },
  {
    id: 48,
    text: "Identify the bug in this code:\n```python\nresult = 0\nfor i in range(5):\n    result += i\n    return result```",
    options: ["range should start from 1", "return should be outside the loop", "result should be initialized to 1", "No bug"],
    correctAnswer: 1,
    difficulty: "intermediate",
    category: "debugging"
  },
  {
    id: 49,
    text: "What is the output?\n```python\nimport re\ntext = 'Python is fun'\nprint(re.sub(r'(\\w+)', r'\\1!', text))```",
    options: ["Python! is! fun!", "Python is fun!", "!Python !is !fun", "Syntax error"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "output"
  },
  {
    id: 50,
    text: "What is the purpose of the __slots__ attribute in a Python class?",
    options: [
      "To define abstract methods", 
      "To restrict attribute creation and reduce memory usage", 
      "To declare public methods", 
      "To override operator behavior"
    ],
    correctAnswer: 1,
    difficulty: "hard",
    category: "concepts"
  }
];
