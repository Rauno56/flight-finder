# Flight Finder

### Structure

Project is logically split into 4 parts:

1. Path finding: this part is free from any airport metadata and only deals with the routing part based on ID-identified nodes and distances between them. `./src/PathFinder.js`.
2. Airport metadata: Looking up any additional data for enriching the results from the PathFinder and converting the user input to IDs Path Finder understands. `./src/airportCacheGenerator.js`.
3. API: Pulls #1 and #2 together for an HTTP API. `./src/api.js`, `./src/index.js`.
4. DB Tools: For creating a clean and concise DB out of openflights data sets. `./src/database`.

Parts 1 and 2 could be cleanly separated into their own services if needed. DB tools is separated not to couple OF data into this application too much. The tools also provide a way to serialize and deserialize the data for conveniency - JSON is not the most optimal storing big datasets.

### Configuration

* `FF_PORT`: port to listen for http traffic. Defaults to 3000.
* `FF_DB_PATH`: location of the database file. Defaults to `database.json` in project root.

### To Do

If time permitted I'd work on following things:

1. **The solution**. Solving the case when the algortihm does not find the optimal solution. That is when the shortest path by distance is over 4 legs, but there exists a path that is 4 legs or under.
2. **Configuration management**. The address and port the application listens on and the location of database can only be configured in a primitive way. I'd enable setting those values via configuration file.
3. **Build pipeline**. I'd build an automated way of getting the project from code to a working application.
4. **Logging**. logging successful requests. Doing structured logging in JSON.
5. **Handling errors**. That is connected to logging. Errors should be coded, documented and worded consistently.
