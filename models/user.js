// user object

import con from "../lib/dbconnection";
import bcrypt from "bcryptjs";

async function encriptPW(pw) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(pw, salt, function (err, hash) {
        resolve(hash);
      });
    });
  });
}

module.exports = class User {
  constructor(id, full_name, nickname, email, pw, accept) {
    this.id = id;
    this.full_name = full_name;
    this.nickname = nickname;
    this.email = email;
    this.pw = pw;
    this.accept_emails = accept;
  }

  getById(id) {
    // need to be a promise so the result can be put to a var
    return new Promise((resolve, reject) => {
      //            console.log('chegou getById',id)
      const sql = "SELECT * FROM users WHERE id = ?";
      con.query(sql, id, (error, res) => {
        if (error) {
          console.log("User query by id error =", error);
          reject({ error: -1 });
          return;
        }
        if (res.length > 0) resolve(res[0]);
        else resolve({ error: -1 });
      });
    });
  }

  async getByEmailId(email, id) {
    console.log("getByEmailId", email, id);
    // need to be a promise so the result can be put to a var
    console.log("chegou getByEmailId", email, id);

    try {
      const res = await con({
        query: "SELECT * FROM users WHERE id = ? AND email = ?",
        values: [id, email],
      });
      console.log('getByEmailId res=',res)
      if (res.length > 0) return res[0];
      else return { error: -1 };
    } catch (error) {
      console.log("User query by email-id error =", error);
      return { error: -1 };
    }
  }

  // response:
  //  - user if found
  //  - error = 0 if not found
  //  - error = -1 if any error
  async getByEmail(email) {
    console.log("user.getByEmail", email);
    try {
      const res = await con({
        query: "SELECT * FROM users WHERE email = ?",
        values: [email],
      });
      console.log("getByEmail res=", res);
      if (res.length > 0) return res[0];
      else return { error: 0 };
    } catch (error) {
      console.log("User query by email error =", error);
      return { error: -1 };
    }
  }

  // response:
  //  - user id saved
  //  - {error: -1} if any error
  async save() {
    const pw = await encriptPW(this.pw);
    console.log("=======this = ", this);

    try {
      const res = await con({
        query:
          "INSERT INTO users (`full_name`,`nickname`,`email`,`pw`,`accept_emails`, `created`, `status`) VALUES (?,?,?,?,?,now(),'0')",
        values: [
          this.full_name,
          this.nickname,
          this.email,
          pw,
          this.accept_emails,
        ],
      });
      // console.log("save user res=", res);
      console.log("user " + res.insertId + " added.", this.full_name, this.pw, pw);
      // console.log('========================== valido?', await this.validatePassword({pw:pw},'aaaa' ))
      return res.insertId;
    } catch (error) {
      console.log("User save error =", error);
      return { error: -1 };
    }
  }

  async update() {
    // const pw = await encriptPW(this.pw);
    try {
      const res = await con({
        query:
          "UPDATE users SET  `full_name` = ?, `nickname` = ?,  `email` = ?, `accept_emails` = ? WHERE id =?",
        values: [
          this.full_name,
          this.nickname,
          this.email,
          this.accept_emails,
          this.id,
        ],
      });
      console.log("user " + this.id + " updated.", this.full_name);
      return this.id;
    } catch (error) {
      console.log("User update error =", this.id, this.full_name);
      return { error: -1 };
    }
  }

  async updatePW() {
    const pw = await encriptPW(this.pw);
    try {
      const res = await con({
        query: "UPDATE users SET  `pw` = ?  WHERE id =?",
        values: [pw, this.id],
      });
      console.log("user " + this.id + " pw updated.", this.full_name);
      return res.insertId;
    } catch (error) {
      console.log("user " + this.id + " : pw updated.", this.full_name);
      return;
    }
  }

  async setLastLogin(id) {
    try {
      const res = await con({
        query: "UPDATE users SET  `last_login` = now()  WHERE id =?",
        values: [id],
      });
      console.log("setLastLogin res=", res);
      if (res.length > 0) return res[0];
      else return { error: -1 };
    } catch (error) {
      console.log("User setLastLogin error =", this.id, this.full_name);
      console.log(error);
      return { error: -1 };
    }

    // insert a log to the user_login table
    try {
      const res = await con({
        query: "INSERT INTO user_login (`user`,`loginDate`) VALUES (?,now())",
        values: [id],
      });
      console.log("setLastLogin res 2=", res);
      if (res.length > 0) return res[0];
      else return { error: -1 };
    } catch (error) {
      console.log("User log access error =", this.id, this.full_name);
      console.log(error);
      return { error: -1 };
    }
    return;
  }

  async confirmEmail(id) {
    try {
      const res = await con({
        query: "UPDATE users SET  `status` = '1' WHERE id =?",
        values: [id],
      });
      console.log("user " + id + " confirmed email.");
      return { error: -1 };
    } catch (error) {
      console.log("User confirm email error =", id);
      console.log(error);
      return { error: -1 };
    }
  }

  async validatePassword(user, inputPassword) {
    console.log('validatePassword', user.pw, inputPassword, await bcrypt.compareSync(inputPassword, user?.pw))
    return await bcrypt.compareSync(inputPassword, user?.pw);
  }
};
