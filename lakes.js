const express = require('express');
const fs = require('fs');

// const cors = require('cors')

const app = express()
// app.use(cors({origin: 'https://ludjan.com'}))

const PORT = process.env.PORT || 8080;

// read the file
// const content = fs.readFileSync("./Innsjo_Innsjo.geojson"); // med fjernet headerobjekt
// const content = fs.readFileSync("./Innsjo_Innsjo.geojson"); // med fjernet headerobjekt
// const content = fs.readFileSync("./Innsjodata.geojson"); // funker ikke per nå
// const content = fs.readFileSync("./Innsjo_Innsjo.geojson"); // filen er for stor (1.28 GB)

const lakeRootObj = "Hei";

// takes lat lon and rad, but filters on moh
function getLakesByMoh() {
    const moh = 400;
    console.log("getLakesByMoh(), moh > " + moh);

    return lakeRootObj.filter(
        function(lakeRootObj){ return lakeRootObj.properties.hoyde_moh > moh }
    );
}

// takes lat lon and rad. Returns list of lakes in a
// square region around lat, lon where square side is 2*rad
function getLakesByLatLonRad(lat, lon, rad) {
    // console.log("getLakes(), lat=" + lat + ", lon=" + lon + ", rad=" + rad);

    // parsing params
    const fLat = parseFloat(lat);
    const fLon = parseFloat(lon);
    const iRad = parseInt(rad);

                                // |----------|
    const maxLat = fLat + iRad; // |          |
    const minLat = fLat - iRad; // |    c     |
    const maxLon = fLon + iRad; // |          |
    const minLon = fLon - iRad; // |----------|

    return lakeRootObj.filter( // filter the return list like this
        function(lakeRootObj){
            const manyCoordinateLists = lakeRootObj.geometry.coordinates; // get the list

            for (const oneCoordinateList of manyCoordinateLists) {
                for (const coordinatePair of oneCoordinateList) {
                    if (coordinatePair[0] >= minLat &&
                        coordinatePair[0] <= maxLat &&
                        coordinatePair[1] >= minLon &&
                        coordinatePair[1] <= maxLon) {

                        const name = lakeRootObj.properties.navn;
                        console.log("(" + coordinatePair[0]+", " + coordinatePair[1] + ") gjoer at " + name + " returneres");
                        return true;
                    }
                }
            }
            return false;
        }
    );
}

app.use( express.json() ); // converts body of incoming requests to json

// NB! TULL-FUNKSJON
app.get("/tshirt", (req, res) => { // hvis bruker spør på /tshirt kjører denne funksjonen
    res.status(200).send({
        tshirt: 'bla',
        size: 'large'
    })
});

// NB! TULL-FUNKSJON
app.post("/tshirt/:id", (req, res) => {

    const { id } = req.params;
    const { logo } = req.body; // express does not parse JSON in body

    if (!logo) {
        res.status(418).send({ message: "We need a logo!" });
    }

    res.send({
        tshirt: "Tshirt with your " + logo + " and ID of " + id
    });
});

// funksjonen som faktisk brukes for å hente sjøer
app.get("/lakes/:lat/:lon/:rad", (req,res) => {
    const { lat } = req.params;
    const { lon } = req.params;
    const { rad } = req.params;

    // someLakes = getLakesByMoh(); // hent et utvalg av sjøer fra fil i minne
    const lakes = getLakesByLatLonRad(lat, lon, rad);

    res.send({
        lakes
    })
})

// app.listen(
//     PORT,
//     () => console.log("it's alive on http://localhost:" + PORT)
// )
