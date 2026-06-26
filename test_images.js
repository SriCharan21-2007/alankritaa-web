import { mehendiItems, sareeItems } from './src/utils/staticData.js';

async function testUrl(id, url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`URL for ${id}: Status ${response.status} (${response.ok ? 'OK' : 'FAIL'})`);
    return response.ok;
  } catch (err) {
    console.log(`URL for ${id}: ERROR - ${err.message}`);
    return false;
  }
}

async function run() {
  console.log('--- Testing Mehendi Items ---');
  for (const item of mehendiItems) {
    await testUrl(item.id, item.imageURL);
  }
  console.log('\n--- Testing Saree Items ---');
  for (const item of sareeItems) {
    await testUrl(item.id, item.imageURL);
  }
}

run();
