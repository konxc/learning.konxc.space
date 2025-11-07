export type Language = 'javascript' | 'python' | 'typescript' | 'go' | 'rust' | 'java';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface CodeSnippet {
  id: string;
  language: Language;
  difficulty: Difficulty;
  code: string;
  note?: string;
  tags: string[];
}

export const codeSnippets: CodeSnippet[] = [
  // JavaScript - Beginner
  {
    id: 'js-1',
    language: 'javascript',
    difficulty: 'beginner',
    tags: ['function', 'basic'],
    note: 'Basic function declaration with return',
    code: `function greet(name) {
  return "Hello, " + name + "!";
}`
  },
  {
    id: 'js-2',
    language: 'javascript',
    difficulty: 'beginner',
    tags: ['arrow', 'basic'],
    note: 'Arrow function with template literals',
    code: `const add = (a, b) => {
  return a + b;
};`
  },
  {
    id: 'js-3',
    language: 'javascript',
    difficulty: 'beginner',
    tags: ['array', 'method'],
    note: 'Array methods map and filter',
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = doubled.filter(n => n % 2 === 0);`
  },
  
  // JavaScript - Intermediate
  {
    id: 'js-4',
    language: 'javascript',
    difficulty: 'intermediate',
    tags: ['async', 'await', 'fetch'],
    note: 'Async function with fetch',
    code: `async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}`
  },
  {
    id: 'js-5',
    language: 'javascript',
    difficulty: 'intermediate',
    tags: ['destructuring', 'spread'],
    note: 'Destructuring and spread operator',
    code: `const user = { name: "John", age: 30 };
const { name, age } = user;
const updatedUser = { ...user, role: "developer" };`
  },
  {
    id: 'js-6',
    language: 'javascript',
    difficulty: 'intermediate',
    tags: ['class', 'constructor'],
    note: 'ES6 class syntax',
    code: `class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return \`Hi, I'm \${this.name}\`;
  }
}`
  },
  
  // JavaScript - Advanced
  {
    id: 'js-7',
    language: 'javascript',
    difficulty: 'advanced',
    tags: ['closure', 'currying'],
    note: 'Higher-order function with currying',
    code: `const multiply = (a) => (b) => (c) => a * b * c;
const partialMult = multiply(2)(3);
const result = partialMult(4);`
  },
  {
    id: 'js-8',
    language: 'javascript',
    difficulty: 'advanced',
    tags: ['promise', 'all'],
    note: 'Promise.all for parallel execution',
    code: `const promises = urls.map(url => fetch(url));
Promise.all(promises)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(data => console.log(data));`
  },
  
  // Python - Beginner
  {
    id: 'py-1',
    language: 'python',
    difficulty: 'beginner',
    tags: ['function', 'basic'],
    note: 'Basic function with parameters',
    code: `def greet(name):
  return f"Hello, {name}!"`
  },
  {
    id: 'py-2',
    language: 'python',
    difficulty: 'beginner',
    tags: ['list', 'comprehension'],
    note: 'List comprehension',
    code: `numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
evens = [x for x in numbers if x % 2 == 0]`
  },
  {
    id: 'py-3',
    language: 'python',
    difficulty: 'beginner',
    tags: ['dict', 'loop'],
    note: 'Dictionary iteration',
    code: `user = {"name": "John", "age": 30}
for key, value in user.items():
  print(f"{key}: {value}")`
  },
  
  // Python - Intermediate
  {
    id: 'py-4',
    language: 'python',
    difficulty: 'intermediate',
    tags: ['class', 'method'],
    note: 'Class with methods',
    code: `class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age
  
  def greet(self):
    return f"Hi, I'm {self.name}"`
  },
  {
    id: 'py-5',
    language: 'python',
    difficulty: 'intermediate',
    tags: ['decorator'],
    note: 'Function decorator',
    code: `def timer(func):
  def wrapper(*args):
    start = time.time()
    result = func(*args)
    print(f"Took {time.time() - start}s")
    return result
  return wrapper`
  },
  {
    id: 'py-6',
    language: 'python',
    difficulty: 'intermediate',
    tags: ['generator'],
    note: 'Generator function',
    code: `def fibonacci():
  a, b = 0, 1
  while True:
    yield a
    a, b = b, a + b`
  },
  
  // TypeScript
  {
    id: 'ts-1',
    language: 'typescript',
    difficulty: 'beginner',
    tags: ['interface', 'type'],
    note: 'Interface and type annotation',
    code: `interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com"
};`
  },
  {
    id: 'ts-2',
    language: 'typescript',
    difficulty: 'intermediate',
    tags: ['generics'],
    note: 'Generic function',
    code: `function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>("hello");`
  },
  {
    id: 'ts-3',
    language: 'typescript',
    difficulty: 'intermediate',
    tags: ['interface', 'generics'],
    note: 'Generic interface',
    code: `interface Repository<T> {
  findById(id: string): T | null;
  save(entity: T): T;
  delete(id: string): void;
}`
  },
  
  // Go
  {
    id: 'go-1',
    language: 'go',
    difficulty: 'beginner',
    tags: ['function', 'basic'],
    note: 'Basic function',
    code: `func greet(name string) string {
  return "Hello, " + name
}`
  },
  {
    id: 'go-2',
    language: 'go',
    difficulty: 'intermediate',
    tags: ['struct', 'method'],
    note: 'Struct with methods',
    code: `type Person struct {
  Name string
  Age  int
}

func (p Person) Greet() string {
  return fmt.Sprintf("Hi, I'm %s", p.Name)
}`
  },
  {
    id: 'go-3',
    language: 'go',
    difficulty: 'intermediate',
    tags: ['goroutine', 'channel'],
    note: 'Goroutine and channel',
    code: `func worker(id int, jobs <-chan int, results chan<- int) {
  for j := range jobs {
    results <- j * 2
  }
}`
  },
  
  // Rust
  {
    id: 'rust-1',
    language: 'rust',
    difficulty: 'beginner',
    tags: ['function', 'ownership'],
    note: 'Function with ownership',
    code: `fn greet(name: String) -> String {
  format!("Hello, {}", name)
}`
  },
  {
    id: 'rust-2',
    language: 'rust',
    difficulty: 'intermediate',
    tags: ['struct', 'impl'],
    note: 'Struct with implementation',
    code: `struct Person {
  name: String,
  age: u32,
}

impl Person {
  fn new(name: String, age: u32) -> Self {
    Person { name, age }
  }
}`
  },
  {
    id: 'rust-3',
    language: 'rust',
    difficulty: 'advanced',
    tags: ['iterator', 'closure'],
    note: 'Iterator with closures',
    code: `let numbers = vec![1, 2, 3, 4, 5];
let doubled: Vec<i32> = numbers
  .iter()
  .map(|x| x * 2)
  .collect();`
  },
  
  // Java
  {
    id: 'java-1',
    language: 'java',
    difficulty: 'beginner',
    tags: ['class', 'basic'],
    note: 'Basic class with main',
    code: `public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`
  },
  {
    id: 'java-2',
    language: 'java',
    difficulty: 'intermediate',
    tags: ['class', 'constructor'],
    note: 'Class with constructor',
    code: `public class Person {
  private String name;
  private int age;
  
  public Person(String name, int age) {
    this.name = name;
    this.age = age;
  }
}`
  }
];

export function getSnippetsByLanguage(language: Language): CodeSnippet[] {
  return codeSnippets.filter(s => s.language === language);
}

export function getSnippetById(id: string): CodeSnippet | undefined {
  return codeSnippets.find(s => s.id === id);
}

export function getRandomSnippet(language?: Language, difficulty?: Difficulty): CodeSnippet {
  let filtered = codeSnippets;
  
  if (language) {
    filtered = filtered.filter(s => s.language === language);
  }
  
  if (difficulty) {
    filtered = filtered.filter(s => s.difficulty === difficulty);
  }
  
  return filtered[Math.floor(Math.random() * filtered.length)];
}
