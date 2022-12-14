// connects to the database

// db.js
import mysql from 'serverless-mysql';
const options={
  config: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
}
//console.log('======================== dbconnection.js  options=',options)
const db = mysql(options);
export default async function con({ query, values }) {
  // try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  // } ca:tch (error) {
  //   console.log(`dbconnectio error=`, error)
  //   return { error };
  // }
}