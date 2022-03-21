
//MongoDB

async function main() {
  const MongoClient = require('mongodb').MongoClient;
  const uri =
    'mongodb+srv://auth0-custom-db-user:Passpass@cluster0.xbd8y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  const client = new MongoClient(uri, { useNewUrlParser: true });

  // Connect to the client and query
  await client.connect();
  findListings(client, 5);
  client.close();
}
async function findListings(client, resultsLimit) {
  const cursor = client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .find()
    .limit(resultsLimit);

  const results = await cursor.toArray();
  if (results.length > 0) {
    console.log(`Found ${results.length} listing(s):`);
    results.forEach((result, i) => {
      date = new Date(result.last_review).toDateString();

      console.log();
      console.log(`${i + 1}. name: ${result.name}`);
      console.log(`   _id: ${result._id}`);
      console.log(`   bedrooms: ${result.bedrooms}`);
      console.log(`   bathrooms: ${result.bathrooms}`);
      console.log(
        `   most recent review date: ${new Date(
          result.last_review
        ).toDateString()}`
      );
    });
  }
}
