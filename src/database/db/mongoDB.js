const { MongoClient } = require("mongodb");
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const connectToMongoDB = async (url = VooshDB, dbName = "operationsdb") => {
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const mongo_Database = connectToMongoDB();

module.exports = { mongo_Database };
