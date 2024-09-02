require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
// const CLOUD_NAME = process.env.CLOUD_NAME;
// const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
// const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
const CLIENTID = process.env.CLIENTID;
const CLIENTSECRET = process.env.CLIENTSECRET;
const CLIENTPASSWORD = process.env.CLIENTPASSWORD;
const REDISHOSTNAME = process.env.REDISHOSTNAME;
const REDISPORT = process.env.REDISPORT;
const REDISPASSWORD = process.env.REDISPASSWORD;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  //   CLOUD_NAME,
  //   CLOUD_API_KEY,
  //   CLOUD_API_SECRET,
  //   CLIENTSECRET,
  //   CLIENTID,
  //   CLIENTPASSWORD,
  REDISHOSTNAME,
  REDISPORT,
  REDISPASSWORD,
};
