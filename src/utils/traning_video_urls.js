const video_urls = {
  RDC_video: "https://www.youtube.com/watch?v=w3RqWoQa19M",
  Ratings_video: "https://www.youtube.com/watch?v=QN1GGCNMOY4",
  MFR_video: "https://www.youtube.com/watch?v=RD6PiwwMRRg",
  Serviceability_video: "https://www.youtube.com/watch?v=MIsi4vdzjgk",
  Onbording_video: "https://www.youtube.com/watch?v=QN1GGCNMOY4",
};

module.exports = {video_urls};


// .updateOne(query, update, async (err, result) => {
//   if (err) {
//     res.json({
//       status: "error",
//       message: "Error while saving details, Server Error",
//       error: err,
//     });
//   } else {
//     await db
//       .collection(swiggyNvdpCollection)
//       .updateOne(query, update, async (err, result) => {
//         if (err) {
//           res.json({
//             status: "error",
//             message:
//               "Error while saving zomato details, Server Error",
//             error: err,
//           });
//         } else {
//           res.json({
//             status: "success",
//             message: "Password Updated!",
//             error: err,
//           });
//         }
//       });
//   }
// });
