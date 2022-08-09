// MyMemory object

import con from "../lib/dbconnection";


module.exports = class MyMemory {
  constructor(id, name, link, href, privateMem, user) {
    this.id = id;
    this.name = name;
    this.link = link;
    this.href = href;
    this.private = privateMem;
    this.user = user;
  }

  async findName(name, user) {
    console.log("findName", name, user);
    try {
      const res = await con({
        query: "SELECT * FROM mymemories WHERE name = ? AND user = ?",
        values: [name, user],
      });
      console.log('findName res=',res)
      if (res.length > 0) return res[0];
      else return { error: -1 };
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
          "INSERT INTO mymemories (`name`,`link`,`href`,`private`,  `user`, `created`, `status`) VALUES (?,?,?,?,?,now(),'0')",
        values: [
          this.name,
          this.link,
          this.href,
          this.private,
          this.user,
        ],
      });
      // console.log("save MyMemory res=", res);
      console.log("MyMemory " + res.insertId + " added.", this.name);
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
          "UPDATE mymemories SET  `name` = ?, `link` = ?,  `href` = ?, `private` = ? WHERE id =?",
        values: [
          this.name,
          this.link,
          this.href,
          this.privateMem,
          this.id,
        ],
      });
      console.log("MyMemory " + this.id + " updated.", this.name);
      return this.id;
    } catch (error) {
      console.log("MyMemory update error =", this.id, this.name);
      return { error: -1 };
    }
  }

};
