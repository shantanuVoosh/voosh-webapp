const mongoose = require("mongoose");

const connectToDatabase = (url) => {
  mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
      
  });
  const db = mongoose.connection;

  db.on("error", (error) => {
    console.error("error connecting to database", error);
  });
  db.once("open", () => {
    console.log("Connected to database");
    
    // ?Print all the collections int MongoDB
    db.db.listCollections().toArray(function (err, names) {
      if (err) {
        console.log(err);
      } else {
        console.log(names);

        //* all data inside collection
        // names.forEach((n) => {
        //   const collection = db.db.collection(n.name);
        //   collection.find({}).toArray(function (err, docs) {
        //     if (err) {
        //       console.log(err);
        //     } else {
        //       console.log(docs);
        //     }
        //   });
        // });
      }
    });
  })
};

module.exports = { connectToDatabase };
