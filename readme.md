# Flight Finder

### API

Application exposes one endpoint: `/`

It requires query parameters for "from" and "to" airport iata and icao codes. Codes are **not** case sensitive:

* `from_iata` or `from_icao` for providing souce airport.
* `to_iata` or `to_icao` for providing destination airport.

#### Response

In pseudo-ts:

```
Response {
    from: Airport;
    to: Airport;
    route: {
        success: boolean;
        stops?: Airport[];
        message?: string;
    };
};

Airport {
    id: string;
    name: string;
    iata: string;
    icao: string;
    lat: float;
    lng: float;
};
```

If success is `true`, stops are defined. If success is `false`, message describing why the stops cannot be provided. Possible reasons for that:

* *Do not know the best route*: The API is not fully spec compliant. It's not able to find a route if the most efficient route in terms of distance is over 4 stops, but there exists a path that is 4 stops or under.
* *No path between provided airports*
* *Path between provided airports too long*: Gapped on 4 stops.

#### Successful path found

Example: `curl localhost:3000/?from_iata=tln&to_iata=HHN`
Response:

```
{
  "from": {
    "id": "1438",
    "name": "Toulon-Hyères Airport",
    "iata": "TLN",
    "icao": "LFTH",
    "lat": 43.0973014832,
    "lng": 6.14602994919
  },
  "to": {
    "id": "355",
    "name": "Frankfurt-Hahn Airport",
    "iata": "HHN",
    "icao": "EDFH",
    "lat": 49.9487,
    "lng": 7.26389
  },
  "route": {
    "success": true,
    "stops": [
      {
        "id": "1438",
        "name": "Toulon-Hyères Airport",
        "iata": "TLN",
        "icao": "LFTH",
        "lat": 43.0973014832,
        "lng": 6.14602994919
      },
      {
        "id": "548",
        "name": "London Stansted Airport",
        "iata": "STN",
        "icao": "EGSS",
        "lat": 51.8849983215,
        "lng": 0.234999999404
      },
      {
        "id": "355",
        "name": "Frankfurt-Hahn Airport",
        "iata": "HHN",
        "icao": "EDFH",
        "lat": 49.9487,
        "lng": 7.26389
      }
    ]
  }
}
```

#### Failure responses

Failure responses are also formatted as JSON. Example:

Example: `curl localhost:3000/`
Response:
```
{
  "error": "At least from_iata or from_icao required"
}
```

### Running

Easiest way to get the project running is to use the pre-built Docker image with the database built in:

```
docker run -p 3000:3000 -it rauno56/flight-finder:full
```

To use the image without database, you need to map that as a volume to the default location of `database.json`:

```
docker run -p 3333:3000 -v /path/to/database.json:/app/database.json -it rauno56/flight-finder:latest
```

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
