import User from "../../../models/user";


export default async function handler(req, res) {
  const {id, email} = req.body;
  console.log('/api/confirmation', req.body, id, email)
  var user = await new User().getByEmailId(email, id);
  console.log('/api/user/confirmation', user)
  if (user.error != -1) {
      await new User().confirmEmail(id);
  }
  res.status(200).end(JSON.stringify({user: user}));
}
