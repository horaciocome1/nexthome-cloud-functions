import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const hoods: string[] = [
  'Belo Horizonte',
  'Machava Socimol',
  'Mozal',
  'Alto Maé',
  'Matendene',
  'Intaka'
]

const ownerNames: string[] =[
  'AK Mobiliária',
  'Lucas João Marcos',
  'Mateus Manuel',
  'Timóteo António Betuel',
  'Jacó Isaque',
  'Ana Maria Diná'
]

const ownerPhoneNumbers: number[] = [
  843845597,
  823025777,
  846430521,
  822020203,
  877724592,
  836060555
]

const adTypes: string[] = [
  'RENTING',
  'SELLING',
  'RENTING',
  'SELLING',
  'RENTING',
  'SELLING'
]

const adRooms: number[] = [1, 2, 3, 4, 5, 1]

const adSuites: number[] = [1, 2, 1, 2, 1, 2]

const adWcs: number[] = [1, 2, 3, 1, 2, 3]

export const helloWorld = functions.https.onRequest((_request, response) => {
  response.send('Hello from Firebase!');
});

export const hoodsGenerator = functions.https.onRequest(async (_request, response) => {
  try {
    const firestore = admin.firestore()
    const hoodsGroupCollection = firestore.collection('hoodsGroup')
    const hoodsGroupMaputo = hoodsGroupCollection.doc('maputo')
    const data = {
      id: 'maputo',
      hoods: hoods,
      createdAt: FirebaseFirestore.Timestamp.now()
    }
    await hoodsGroupMaputo.set(data)
    response.send('Successful')
  } catch (error) {
    const message = 'Error ocurred' + error
    console.error(message)
    response.send(message)
  }
})

export const adsGenerator = functions.https.onRequest(async (_request, response) => {
  try {
    const firestore = admin.firestore()
    const adsCollection = firestore.collection('ads')
    const batch = firestore.batch()
    for (let index = 0; index < 10; index++) { createSixADs(batch, adsCollection) }
    await batch.commit()
    response.send('Successful')
  } catch (error) {
    const message = 'Error ocurred' + error
    console.error(message)
    response.send(message)
  }
})

function createSixADs(batch: FirebaseFirestore.WriteBatch, adsCollection: FirebaseFirestore.CollectionReference) {
  for (let index = 0; index < 6; index++) {
    const adRef = adsCollection.doc()
    const ad = {
      id: adRef.id,
      rooms: adRooms[index],
      suites: adSuites[index],
      wcs: adWcs[index],
      hood: hoods[index],
      hasFurniture: index === 3,
      hasWater: index <= 3,
      hasLight: index >= 3,
      type: adTypes[index],
      owner: {
        name: ownerNames[index],
        phoneNumber: ownerPhoneNumbers[index]
      },
      createdAt: FirebaseFirestore.Timestamp.now()
    }
    batch.create(adRef, ad)    
  }
}