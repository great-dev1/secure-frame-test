
import server from "server";
import config from "#config";

const startServer = async () => {
  const app = await server();

  app.listen(config.port, () => {
    console.log(`server is running on port:${config.port}`);
  });
};

startServer();
