import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let data = await fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(json => json);

  if (!data)
    res.status(400);

  // limit it just to five.
  data = data.slice(0, 5);

  res.json(data);

}