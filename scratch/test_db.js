const urls = [
  'https://elentyapp-default-rtdb.firebaseio.com/.json',
  'https://elentyapp.firebaseio.com/.json',
  'https://elentyapp-default-rtdb.europe-west1.firebasedatabase.app/.json',
  'https://elentyapp-default-rtdb.asia-southeast1.firebasedatabase.app/.json'
];

async function test() {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.status}`);
      console.log(`Response: ${text.substring(0, 200)}`);
      console.log('-----------------------------------');
    } catch (e) {
      console.log(`URL: ${url}`);
      console.log(`Error: ${e.message}`);
      console.log('-----------------------------------');
    }
  }
}

test();
