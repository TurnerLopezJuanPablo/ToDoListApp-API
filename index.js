import express from 'express'
import connection from "./connection/connection.js";
import { serverPort } from "./config/config.js"
import indexRoutes from "./routes/indexRoutes.js"

// Seeds
import seedUser from './seeds/userSeed.js';
import seedTask from './seeds/taskSeed.js';
import seedGroup from './seeds/groupSeed.js';
import seedCategory from './seeds/categorySeed.js';
import seedComment from './seeds/commentSeed.js';
import seedUserTask from './seeds/seedUserTask.js';

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(indexRoutes);

app.get('/', (req, res) => {
  res.send('ToDoListApp by Juampi Turner 2024')
})

// Error Handler
app.use((error, req, res, next) => {
  const additionalData = error.additionalData || {};

  const responseData = {
    success: false,
    message: error.message,
    ...additionalData,
  };

  res
    .status(error.status || 500)
    .send(responseData);
});

const forceSync = true;
const port = parseInt(serverPort) || 8080;

connection.sync({ force: forceSync })
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on http://localhost:" + port);
    });
  })
  .catch((error) => {
    console.error('Error synchronizing the database:', error);
  })
  .then(async () => {
    if (forceSync) {
      await seedUser(5);
      await seedGroup(3);
      await seedCategory(4);
      await seedTask(10);
      await seedComment(8);
      await seedUserTask(3);
    }
  });
