/*
 * This file contains a simple script to populate the database with initial
 * data from the files in the data/ directory.  The following environment
 * variables must be set to run this script:
 *
 *   MONGO_DB_NAME - The name of the database into which to insert data.
 *   MONGO_USER - The user to use to connect to the MongoDB server.
 *   MONGO_PASSWORD - The password for the specified user.
 *   MONGO_AUTH_DB_NAME - The database where the credentials are stored for
 *     the specified user.
 *
 * In addition, you may set the following environment variables to create a
 * new user with permissions on the database specified in MONGO_DB_NAME:
 *
 *   MONGO_CREATE_USER - The name of the user to create.
 *   MONGO_CREATE_PASSWORD - The password for the user.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { User, Course, Assignment, Submission, Error } = require('./models');
const faker = require('faker');

const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDbName = process.env.MONGO_DB_NAME;
const mongoAuthDbName = process.env.MONGO_AUTH_DB_NAME;
const mongoCreateUser = process.env.MONGO_CREATE_USER;
const mongoCreatePassword = process.env.MONGO_CREATE_PASSWORD;

const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoAuthDbName}?authSource=${mongoDbName}`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongoUrl, options).then(async () => {
  console.log("Mongoose connection successful");

  try {
    const insertedUsers = await User.insertMany(require('./data/user.json'));
    console.log("== Inserted Users:", insertedUsers.map(b => b._id));

    // Create a new, lower-privileged database user if the correct environment variables were specified
    if (mongoCreateUser && mongoCreatePassword) {
      await createMongoUser(mongoCreateUser, mongoCreatePassword);
    }

  } catch (error) {
    console.error("Error during database operations:", error);
  } finally {
    mongoose.disconnect().then(() => {
      console.log("== DB connection closed");
    });
  }
});

async function createMongoUser(username, password) {
  const conn = mongoose.connection.getClient();
  const adminDb = conn.db(mongoAuthDbName).admin();
  const result = await adminDb.addUser(username, password, {
    roles: [{ role: "readWrite", db: mongoDbName }]
  });
  console.log("== New user created:", result);
}

async function generateFakeCourses(instructors, numCourses) {
  const fakeCourses = [];
  for (let i = 0; i < numCourses; i++) {
    const instructor = instructors[Math.floor(Math.random() * instructors.length)];
    fakeCourses.push({
      subject: faker.random.arrayElement(['CS', 'MATH', 'PHYS', 'ENG', 'HIST']),
      title: faker.lorem.words(3),
      number: faker.random.number({ min: 1000, max: 9999 }).toString(),
      instructorId: instructor._id,
      term: faker.random.arrayElement(['sp24', 'su24', 'fa24', 'wi24']),
    });
  }
  return fakeCourses;
}


async function generateCourses() {
  try {
    const instructors = await User.find({ role: 'instructor' });
    const fakeCourses = generateFakeCourses(instructors, 10);

    const insertedCourses = await Course.insertMany(fakeCourses);
  } catch (error) {
    console.error("Error during course generation:", error);
  }
}
