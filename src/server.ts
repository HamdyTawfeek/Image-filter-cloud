import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
 
  app.get("/filteredimage/", async (req, res) => {
    let { image_url } = req.query;
    if (!image_url) {res.status(400).send(`a public image url is required.`);};

    let requestImgPath = await filterImageFromURL(image_url)

    await res.status(200).sendFile(requestImgPath, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send('Can\'t return processed image')
          };
          deleteLocalFiles([requestImgPath])
        });

  });
 
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();