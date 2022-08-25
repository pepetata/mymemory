// MyMemory object

import { titleCase } from "../lib/common";
import con from "../lib/dbconnection";

module.exports = class MyMemory {
  constructor(id, name, text, link, href, privateMem, user, picture) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.link = link;
    this.href = href;
    this.private = privateMem;
    this.user = user;
    this.picture = picture;
  }

  async hide(id, user) {
//    console.log("=========hide");
    try {
      const res = await con({
        query:
          "INSERT INTO hide (`user`,`memory`, `created`) VALUES (?,?,now())",
        values: [user, id],
      });
//      console.log("MyMemory " + id + " is hidden.");
      return this.id;
    } catch (error) {
      console.log("MyMemory hide error =", error);
      return { error: -1 };
    }
  }

  async findName(name, user) {
//    console.log("findName", name, user);
    try {
      const res = await con({
        query: "SELECT * FROM mymemories WHERE name = ? AND user = ?",
        values: [name, user],
      });
//      console.log("findName res=", res);
      if (res.length > 0) return res[0];
      else return { error: -1 };
    } catch (error) {
      console.log("MyMemory findName error =", error);
      return { error: -1 };
    }
  }

  async getTotalMemories(user, exceptArray) {
//    console.log("getTotalMemories", user, exceptArray);
    try {
      //SELECT count(*) AS total FROM mymemories WHERE ( private =0 OR (private IN (0,1) AND user=87)) AND id NOT IN (7)
      const sql =
        "SELECT count(*) AS total FROM mymemories WHERE status='0' AND " +
        (user === 0
          ? "private=0"
          : "( private =0 OR (private IN (0,1) AND user=" + user + " ))") +
        " AND id NOT IN (?) AND id NOT IN (SELECT memory FROM hide WHERE user=" +
        user +
        ")";
      const res = await con({
        query: sql,
        values: [exceptArray],
      });
//      console.log("getTotalMemories res=", res);
      return res[0].total;
    } catch (error) {
      console.log("MyMemory getTotalMemories error =", error);
      return { error: -1 };
    }
  }

  async findAny(except, user) {
    // find a random memory - but do send the one already seem (except)
    // get the total number of memories to generate a random number
    const exceptArray = except.split(",");
    const totalMemories = await this.getTotalMemories(user, exceptArray);
//    console.log(
//      "findAny except=",
//      exceptArray,
//      "user=",
//      user,
//      "totalMemories",
//      totalMemories
//    );
    // get a random memory
    let offset = Math.trunc(Math.random() * (totalMemories - 1));
//    console.log("findAny offset=", offset);

    try {
      const sql =
        "SELECT * FROM mymemories WHERE status='0' AND " +
        (user === 0
          ? "private=0"
          : "( private =0 OR (private IN (0,1) AND user=" + user + " ))") +
        " AND id NOT IN (?) AND id NOT IN (SELECT memory FROM hide WHERE user=" +
        user +
        ") ORDER BY id LIMIT 1 OFFSET ?";
      const res = await con({
        query: sql,
        values: [exceptArray, offset],
      });
//      console.log("findAny res=", res);
      if (res.length > 0) {
        const mm = res[0];
        mm.name=titleCase(mm.name)
        mm.totalMemories = totalMemories;
        return mm;
      }
      // not found
      return { error: -1 };
    } catch (error) {
      console.log("MyMemory findName error =", error);
      return { error: -1 };
    }
  }

  // response:
  //  - MyMemories id saved
  //  - {error: -1} if any error
  async save() {
    try {
      const res = await con({
        query:
          "INSERT INTO mymemories (`name`,`text`,`link`,`href`,`private`,  `user`, picture, `created`, `status`) VALUES (?,?,?,?,?,?,?,now(),'0')",
        values: [
          this.name,
          this.text,
          this.link,
          this.href,
          this.private,
          this.user,
          this.picture,
        ],
      });
      // console.log("save MyMemory res=", res);
//      console.log("MyMemory " + res.insertId + " added.", this.name);
      // console.log('========================== valido?', await this.validatePassword({pw:pw},'aaaa' ))
      return res.insertId;
    } catch (error) {
      console.log("MyMemory save error =", error);
      return { error: -1 };
    }
  }

  async update() {
    try {
      const res = await con({
        query:
          "UPDATE mymemories SET  `name` = ?, `text` = ?, `link` = ?,  `href` = ?, `private` = ?, `picture` = ? WHERE id =?",
        values: [
          this.name,
          this.text,
          this.link,
          this.href,
          this.private,
          this.picture,
          this.id,
        ],
      });
//      console.log("MyMemory " + this.id + " updated.", this.name);
      return this.id;
    } catch (error) {
      console.log("MyMemory update error =", this.id, this.name);
      return { error: -1 };
    }
  }

  async delete(id) {
    try {
      const res = await con({
        query: "DELETE FROM hide WHERE memory =?",
        values: [id],
      });
      console.log("MyMemory hide for memory id " + id + " deleted.");
      // return this.id;
    } catch (error) {
      console.log("MyMemory hide delete error =", id);
      return { error: -1 };
    }

    try {
      const res = await con({
        query: "DELETE FROM mymemories WHERE id =?",
        values: [id],
      });
//      console.log("MyMemory " + id + " deleted.");
      return this.id;
    } catch (error) {
      console.log("MyMemory delete error =", id);
      return { error: -1 };
    }
  }
};
