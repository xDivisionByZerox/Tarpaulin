const mongoose = require('mongoose');
const { Course } = require('./models/course'); // Assuming you have a Course model defined in './models/course'
const { Assignment } = require('./models/assignment');
const { Submission } = require('./models/submission');
const { User } = require('./models/user');

// Connect to MongoDB
//NEEDS UPDATE to proper mongoose connection
mongoose.connect('mongodb://localhost:27017/your_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the data to initialize

// Function to initialize data
async function initializeData() {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});
    await User.deleteMany({});
    
    // Insert new data
    await Course.insertMany(init_course_data);
    await Assignment.insertMany(init_assignment_data);
    await Submission.insertMany(init_submission_data);
    await User.insertMany(init_user_data);
    
    console.log('Data initialized successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
  } finally {
    // Close connection
    mongoose.disconnect();
  }
}

// Call the function to initialize data
initializeData();



const init_assignment_data = [
    {
      courseId: "609c73a3b2b97812e055ee4a",
      title: "Essay on World History",
      points: 100,
      due: "2024-06-10T23:59:59.000Z"
    },
    {
      courseId: "609c73a3b2b97812e055ee4b",
      title: "Math Quiz",
      points: 50,
      due: "2024-06-12T23:59:59.000Z"
    },
    {
      courseId: "609c73a3b2b97812e055ee4c",
      title: "Science Project",
      points: 150,
      due: "2024-06-15T23:59:59.000Z"
    },
    {
      courseId: "609c73a3b2b97812e055ee4d",
      title: "Literature Review",
      points: 80,
      due: "2024-06-08T23:59:59.000Z"
    },
    {
      courseId: "609c73a3b2b97812e055ee4e",
      title: "Programming Assignment",
      points: 120,
      due: "2024-06-14T23:59:59.000Z"
    }
  ]

  const init_course_data = [
    {
      subject: "Math",
      number: "MATH101",
      title: "Introduction to Calculus",
      term: "sp22",
      instructorId: "609c73a3b2b97812e055ee4f"
    },
    {
      subject: "Computer Science",
      number: "COMP200",
      title: "Data Structures and Algorithms",
      term: "sp22",
      instructorId: "609c73a3b2b97812e055ee50"
    },
    {
      subject: "History",
      number: "HIST150",
      title: "World History: Ancient Civilizations",
      term: "sp22",
      instructorId: "609c73a3b2b97812e055ee51"
    },
    {
      subject: "Biology",
      number: "BIOL220",
      title: "Cell Biology",
      term: "sp22",
      instructorId: "609c73a3b2b97812e055ee52"
    },
    {
      subject: "English",
      number: "ENGL300",
      title: "Shakespearean Literature",
      
    }
]  

const init_submission_data = [
    {
      assignmentId: "609c73a3b2b97812e055ee36",
      studentId: "609c73a3b2b97812e055ee37",
      timestamp: "2024-06-06T12:30:00.000Z",
      grade: 85,
      file: "https://example.com/files/submission1.pdf"
    },
    {
      assignmentId: "609c73a3b2b97812e055ee38",
      studentId: "609c73a3b2b97812e055ee39",
      timestamp: "2024-06-05T14:45:00.000Z",
      grade: 70,
      file: "https://example.com/files/submission2.docx"
    },
    {
      assignmentId: "609c73a3b2b97812e055ee3a",
      studentId: "609c73a3b2b97812e055ee3b",
      timestamp: "2024-06-04T10:15:00.000Z",
      grade: null,
      file: "https://example.com/files/submission3.pdf"
    },
    {
        assignmentId: "609c73a3b2b97812e055ee3c",
        studentId: "609c73a3b2b97812e055ee3d",
        timestamp: "2024-06-03T11:20:00.000Z",
        grade: 95,
        file: "https://example.com/files/submission4.pdf"
    },
    {
        assignmentId: "609c73a3b2b97812e055ee3e",
        studentId: "609c73a3b2b97812e055ee3f",
        timestamp: "2024-06-02T09:30:00.000Z",
        grade: 80,
        file: "https://example.com/files/submission5.docx"
    },
    {
        assignmentId: "609c73a3b2b97812e055ee40",
        studentId: "609c73a3b2b97812e055ee41",
        timestamp: "2024-06-01T15:00:00.000Z",
        grade: null,
        file: "https://example.com/files/submission6.pdf"
    },
    {
        assignmentId: "609c73a3b2b97812e055ee42",
        studentId: "609c73a3b2b97812e055ee43",
        timestamp: "2024-05-31T16:45:00.000Z",
        grade: 75,
        file: "https://example.com/files/submission7.docx"
    },
    {
        assignmentId: "609c73a3b2b97812e055ee44",
        studentId: "609c73a3b2b97812e055ee45",
        timestamp: "2024-05-30T13:10:00.000Z",
        grade: null,
        file: "https://example.com/files/submission8.pdf"
    },
    {
        assignmentId: "609c73a3b2b97812e055ee46",
        studentId: "609c73a3b2b97812e055ee47",
        timestamp: "2024-05-29T12:00:00.000Z",
        grade: 85,
        file: "https://example.com/files/submission9.docx"
    },
    {
        assignmentId: "609c73a3b2b97812e055ee48",
        studentId: "609c73a3b2b97812e055ee49",
        timestamp: "2024-05-28T14:20:00.000Z",
        grade: null,
        file: "https://example.com/files/submission10.pdf"
    }
    // Add more submissions as needed
  ]
  const init_user_data =[
    {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "admin"
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "secret789",
      role: "instructor"
    },
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "qwerty",
      role: "student"
    },
    {
      name: "Michael Scott",
      email: "michael@example.com",
      password: "office123",
      role: "admin"
    },
    {
      name: "Pam Beesly",
      email: "pam@example.com",
      password: "art123",
      role: "instructor"
    },
    {
      name: "Jim Halpert",
      email: "jim@example.com",
      password: "paper123",
      role: "student"
    }
  ]