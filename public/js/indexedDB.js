let db;

// Creating an indexedDB titled 'budget' v1
const request = indexedDB.open('budget', 1);

// If db hasn't been created or updated, create 'pending' obj store
request.onupgradeneeded = e => {
	db = e.target.result;
	db.createObjectStore('pending', { autoIncrement: true });
};

// Upon success of opening the budget db, check if user is online and if they are, check for stored 'pending' obj in indexedDB
request.onsuccess = e => {
	db = event.target.result;

	if (navigator.onLine) checkDatabase();
};

request.onerror = e => {
	console.log(`Error: ${e.target.errorCode}`);
};

// Helper Function for failed fetch when posting to our Mongo DB -- used in catch error handler
function saveRecord(record) {
	console.log('Saving record');
	const transaction = db.transaction(['pending'], 'readwrite');
	const store = transaction.objectStore('pending');

	store.add(record);
}

// Checking our indexed DB for any pending post's. If there is any pending, they are posted to our Mongo DB
function checkDatabase() {
	console.log('checking DB');
	const transaction = db.transaction(['pending'], 'readwrite');
	const store = transaction.objectStore('pending');
	const getAll = store.getAll();

	getAll.onsuccess = () => {
		if (getAll.result.length > 0) {
			fetch('/api/transaction/bulk', {
				method: 'POST',
				body: JSON.stringify(getAll.result),
				headers: {
					Accept:
						'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			})
				.then(res => res.json())
				.then(() => {
					const transaction = db.transaction(
						['pending'],
						'readwrite'
					);

					const store = transaction.objectStore(
						'pending'
					);

					store.clear();
				});
		}
	};
}

// Exporting the two functions we will use in our index.js
module.exports = {
	checkDatabase,
	saveRecord
};
