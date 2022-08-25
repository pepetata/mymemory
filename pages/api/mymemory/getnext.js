import MyMemory from "../../../models/mymemory";


export default async function handler(req, res) {
//  console.log("/api/mymemory/getnext  req.body=", req.body);

  var mymemoryFound = await new MyMemory().findAny(
    req.body.except,
    req.body.user
  );
//  console.log("mymemory.getnext", mymemoryFound);

  // was there any error saving?
  if (mymemoryFound === -1 || mymemoryFound?.error === -1) {
    mymemoryFound = {};
  } 
//   else
// {    mymemoryFound = new MyMemory(
//       mymemoryFound.id,
//       titleCase(mymemoryFound.name),
//       decodeURI(mymemoryFound.link),
//       decodeURI(mymemoryFound.href),
//       mymemoryFound.private===1,
//       mymemoryFound.user
//     );
//  }
//  console.log("mymemoryFound final", mymemoryFound);

  res.status(200).send(mymemoryFound);
}
