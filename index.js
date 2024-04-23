import express from 'express'
import connection from "./connection/connection.js";
import { serverPort, corsOrigin } from "./config/config.js"
import indexRoutes from "./routes/indexRoutes.js"
import cors from 'cors';

// Seeds
import seedUser from './seeds/userSeed.js';
import seedBoard from './seeds/boardSeed.js';
import seedCategory from './seeds/categorySeed.js';
import seedTask from './seeds/taskSeed.js';
import seedContributor from './seeds/contributorSeed.js';
import seedSubTask from './seeds/subTaskSeed.js';
import seedComment from './seeds/commentSeed.js';
import seedCalculatorHistory from './seeds/calculatorHistorySeed.js';

const app = express()

const corsOptions = { credentials: true, origin: corsOrigin };
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(indexRoutes);

app.get('/', (req, res) => {
  res.send('TaskMaster App by Juampi Turner 2024')
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

const forceSync = false; // TRUE to drop all existing tables and recreate them with new Model definitions

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
      await seedUser(6);
      await seedBoard(4);
      await seedContributor();
      await seedCategory(8);
      await seedTask(12);
      await seedSubTask(24);
      await seedComment(72);
      await seedCalculatorHistory(20);
    }
  });
