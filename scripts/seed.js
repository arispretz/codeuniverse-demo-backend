/**
 * @file Seed script to populate MongoDB Atlas with realistic programming demo data.
 * Run with: node backend/scripts/teamseed.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import admin from "firebase-admin";

import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { KanbanList } from "../models/KanbanList.js";
import { LocalList } from "../models/LocalList.js";
import { Task } from "../models/Task.js";

dotenv.config({ path: "./backend/.env.development" });

const MONGO_URI = process.env.MONGO_URI;
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function runSeed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // --- Users ---
    const usersData = [
      { email: "managerA@demo.com", displayName: "Alice Manager A", role: "manager" },
      { email: "devA1@demo.com", displayName: "Charlie Dev A1", role: "developer" },
      { email: "devA2@demo.com", displayName: "Dana Dev A2", role: "developer" },
      { email: "devA3@demo.com", displayName: "Eve Dev A3", role: "developer" },
      { email: "managerB@demo.com", displayName: "Robert Manager B", role: "manager" },
      { email: "devB1@demo.com", displayName: "Sophia Dev B1", role: "developer" },
      { email: "devB2@demo.com", displayName: "Michael Dev B2", role: "developer" },
    ];

    const users = {};
    for (const u of usersData) {
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(u.email);
      } catch {
        userRecord = await admin.auth().createUser({
          email: u.email,
          password: "123456",
          displayName: u.displayName,
        });
      }

      let userDoc = await User.findOne({ email: u.email });
      if (!userDoc) {
        userDoc = await User.create({
          firebaseUid: userRecord.uid,
          email: u.email,
          username: u.displayName,
          role: u.role,
        });
      }
      users[u.email] = userDoc;
    }

    // --- Helper function to create projects with realistic lists and tasks ---
    async function createProjectWithLists(name, description, ownerEmail, memberEmails, kanbanTasksData, localTasksData) {
      const project = await Project.create({
        name,
        description,
        ownerId: users[ownerEmail]._id,
        members: memberEmails.map((e) => users[e]._id),
      });

      // Kanban List
      const kanbanList = await KanbanList.create({
        name: `${name} - Kanban`,
        projectId: project._id,
        createdBy: users[ownerEmail]._id,
      });
      await Project.findByIdAndUpdate(project._id, { $push: { kanbanLists: kanbanList._id } });

      const kanbanTasks = kanbanTasksData.map((task, idx) => ({
        ...task,
        projectId: project._id,
        listId: kanbanList._id,
        listType: "KanbanList",
        createdBy: users[memberEmails[idx % memberEmails.length]]._id,
        assignees: [users[memberEmails[idx % memberEmails.length]]._id],
        assignedTo: users[memberEmails[idx % memberEmails.length]]._id,
      }));
      const insertedKanbanTasks = await Task.insertMany(kanbanTasks);

      // update list and project with tasks
      await KanbanList.findByIdAndUpdate(kanbanList._id, {
        $push: { tasks: { $each: insertedKanbanTasks.map((t) => t._id) } },
      });
      await Project.findByIdAndUpdate(project._id, {
        $push: { tasks: { $each: insertedKanbanTasks.map((t) => t._id) } },
      });

      // Local List
      const localList = await LocalList.create({
        name: `${name} - Local`,
        projectId: project._id,
        createdBy: users[ownerEmail]._id,
      });
      await Project.findByIdAndUpdate(project._id, { $push: { localLists: localList._id } });

      const localTasks = localTasksData.map((task, idx) => ({
        ...task,
        projectId: project._id,
        listId: localList._id,
        listType: "LocalList",
        createdBy: users[memberEmails[idx % memberEmails.length]]._id,
        assignees: [users[memberEmails[idx % memberEmails.length]]._id],
        assignedTo: users[memberEmails[idx % memberEmails.length]]._id,
      }));
      const insertedLocalTasks = await Task.insertMany(localTasks);

      // update list and project with tasks
      await LocalList.findByIdAndUpdate(localList._id, {
        $push: { tasks: { $each: insertedLocalTasks.map((t) => t._id) } },
      });
      await Project.findByIdAndUpdate(project._id, {
        $push: { tasks: { $each: insertedLocalTasks.map((t) => t._id) } },
      });

      return project;
    }

    // --- Team A Projects ---
    await createProjectWithLists(
      "Authentication System",
      "Project to implement secure login and registration.",
      "managerA@demo.com",
      ["devA1@demo.com", "devA2@demo.com", "devA3@demo.com"],
      [
        { title: "Configure JWT", description: "Implement authentication with JSON Web Tokens.", status: "to do", source: "kanban" },
        { title: "Implement refresh tokens", description: "Add support for refresh tokens.", status: "in progress", source: "kanban" },
        { title: "Integrate OAuth with Google", description: "Enable login with Google accounts.", status: "review", source: "kanban" },
      ],
      [
        { title: "Design login form", description: "Create responsive login form UI.", status: "to do", source: "local" },
        { title: "Validate inputs", description: "Add client-side validation.", status: "in progress", source: "local" },
        { title: "Connect to API", description: "Integrate frontend with backend auth API.", status: "review", source: "local" },
      ]
    );

    await createProjectWithLists(
      "Product API",
      "Project to build product management microservice.",
      "managerA@demo.com",
      ["devA1@demo.com", "devA2@demo.com", "devA3@demo.com"],
      [
        { title: "Define Mongoose schema", description: "Create product schema with validations.", status: "to do", source: "kanban" },
        { title: "Implement CRUD endpoints", description: "Develop REST API for products.", status: "in progress", source: "kanban" },
        { title: "Write Jest tests", description: "Add unit and integration tests.", status: "review", source: "kanban" },
      ],
      [
        { title: "Design product cards", description: "Create UI components for product display.", status: "to do", source: "local" },
        { title: "Implement filters", description: "Add category and price filters.", status: "in progress", source: "local" },
        { title: "Integrate cart", description: "Connect product list with shopping cart.", status: "review", source: "local" },
      ]
    );

    // --- Team B Projects ---
    await createProjectWithLists(
      "Analytics Dashboard",
      "Project to visualize metrics and KPIs.",
      "managerB@demo.com",
      ["devB1@demo.com", "devB2@demo.com"],
      [
        { title: "Configure ETL pipeline", description: "Extract, transform, load data for analytics.", status: "to do", source: "kanban" },
        { title: "Develop metrics endpoints", description: "Provide API for analytics data.", status: "in progress", source: "kanban" },
        { title: "Optimize queries", description: "Improve performance of DB queries.", status: "review", source: "kanban" },
      ],
      [
        { title: "Design charts with Chart.js", description: "Create bar and line charts.", status: "to do", source: "local" },
        { title: "Implement date filters", description: "Add date range selection.", status: "in progress", source: "local" },
        { title: "Integrate API", description: "Connect dashboard to backend.", status: "review", source: "local" },
      ]
    );

    await createProjectWithLists(
      "Notification System",
      "Project to deliver real-time notifications.",
      "managerB@demo.com",
      ["devB1@demo.com", "devB2@demo.com"],
      [
        { title: "Configure WebSockets", description: "Enable real-time communication.", status: "to do", source: "kanban" },
        { title: "Integrate Firebase Cloud Messaging", description: "Push notifications to devices.", status: "in progress", source: "kanban" },
        { title: "Load testing", description: "Test system under heavy load.", status: "review", source: "kanban" },
      ],
      [
        { title: "Design notification UI", description: "Create user interface for notifications.", status: "to do", source: "local" },
        { title: "Add badge in navbar", description: "Show unread notifications count.", status: "in progress", source: "local" },
        { title: "Configure permissions", description: "Handle browser notification permissions.", status: "review", source: "local" },
      ]
    );

    // --- Personal Tasks for all developers ---
    const personalTasks = [];
    for (const u of Object.values(users)) {
      if (u.role === "developer") {
        personalTasks.push({
          title: `Personal task for ${u.username}`,
          description: "Read documentation or prepare sprint demo.",
          source: "personal",
          createdBy: u._id,
          status: "to do",
          assignees: [u._id],
          assignedTo: u._id,
        });
        personalTasks.push({
          title: `Review pull requests`,
          description: "Check and approve PRs from teammates.",
          source: "personal",
          createdBy: u._id,
          status: "in progress",
          assignees: [u._id],
          assignedTo: u._id,
        });
      }
    }
    const insertedPersonalTasks = await Task.insertMany(personalTasks);

    for (const task of insertedPersonalTasks) {
      if (task.projectId) {
        await Project.findByIdAndUpdate(task.projectId, { $push: { tasks: task._id } });
      }
    }

    console.log("🎉 Seed completed successfully");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error in seed:", err);
    await mongoose.disconnect();
  }
}

runSeed();
