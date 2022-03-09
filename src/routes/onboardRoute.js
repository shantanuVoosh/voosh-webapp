const router = require("express").Router();
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const {
  getAllSwiggyAndZomatoRestaurants,
} = require("../utils/getAllRestaurants");

const { getUserDetails } = require("../utils/getUserDetails");

const { checkAuthentication } = require("../controller/checkAuth");

const { getAllSwiggyData } = require("../DataProviders/getAllSwiggyData");
const { getAllZomatoData } = require("../DataProviders/getAllZomatoData");

const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const documentName = "operationsdb";
const secret = "secret";

// Todo: Notification collection sample
const BANNER_REQUEST = "Banner Request Sent";
const SIGNUP_SUCCESS = "Signup Successful";
const REGISTRATION_SUCCESS = "Registration Successful";
const NotificationModel = {
  "Banner Request Sent": `Banner Service "Review" requested. You'll receive a callback shortly!`,
  "Signup Successful": `Welcome to "Grow" by Voosh. We'll be there on your growth Journey!`,
  "Registration Successful": `You have now successfully entered all details! Sit tight and Relax and we'll analyze and provide you restaurant recommendations!`,
};


