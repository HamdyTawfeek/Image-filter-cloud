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
 
  app.get( "/filteredimage", async ( req, res ) => {
  try { let {image_url} = req.query;
    console.log(image_url)
    if (!image_url){res.status(400).send(`Image url is required`)};
    const fitered_image_path = await filterImageFromURL(image_url);
    console.log(">>>>", fitered_image_path)
    res.status(200).sendFile(fitered_image_path, async (error) => 
                {if (error) {console.log(error);}});
    await deleteLocalFiles([fitered_image_path]);} catch(err) {
      res.send("Error reading with jimp")
    }
  } );

 
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