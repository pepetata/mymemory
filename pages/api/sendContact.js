import { sendContactEmail } from "../../mail/sendContactEmail";

export default async function handler(req, res) {
    console.log('/api/sendContact ---------', req.body)
    sendContactEmail(req).then((result) => {

      res.status(200).end(JSON.stringify(''))
    });
    res.status(200).end(JSON.stringify(''))
}
