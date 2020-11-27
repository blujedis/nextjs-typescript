import createHandler from 'middleware';

const handler = createHandler();

handler.get((req, res) => {

  return res.send('Hello Middleware using request id: ' + req.rid);

});


export default handler;
