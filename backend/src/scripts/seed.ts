import admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { User } from "../models/user";

const Timestamp = firestore.Timestamp;

admin.initializeApp({
  credential: admin.credential.cert(require("../../serviceAccount.json")),
});

const db = admin.firestore();

async function seed() {
  const instructor: User = {
    userId: "+84854320705",
    name: "Instructor",
    email: "instructor@test.com",
    phone: "+84854320705",
    role: "instructor",
    accountSetupCompleted: true,
    createdAt: Timestamp.now(),
  };
  const student: User = {
    userId: "+84854320709",
    name: "student",
    email: "student@test.com",
    phone: "+84854320705",
    role: "instructor",
    accountSetupCompleted: true,
    passwordHash: "hgjk",
    createdBy: "+84854320705",
    createdAt: Timestamp.now(),
  };
  const student1: User = {
    userId: "+84854320709",
    name: "student",
    email: "student@test.com",
    phone: "+84854320705",
    role: "instructor",
    accountSetupCompleted: true,
    passwordHash: "hgjk",
    createdBy: "+84854320705",
    createdAt: Timestamp.now(),
  };
  await db.collection("users").doc(instructor.userId).set(instructor);
  await db.collection("users").doc(student.userId).set(student);

  console.log("Seed done");
}

async function seedFrist() {
  const snapshot = await db.collection("users").limit(1).get();

  if (snapshot.empty) {
    await seed();
  } else {
    console.log("Users already exist — skip seed");
  }

  process.exit();
}

seedFrist();
