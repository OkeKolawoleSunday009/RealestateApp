import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { db } from '../firebase';
import Listingitem from '../Components/ListingItem';

export default function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setFetchedListings] = useState(null);

  useEffect(()=> {
    async function fetchedListings(){
      try{
        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("offer", "==", true), orderBy("timeStamp", "desc"), limit(8));
        const querySnapshot = await getDocs(q);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setFetchedListings(lastVisible)
        const listings = [];
        querySnapshot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          });
        });
        setListings(listings);
       
        setLoading(false);
      } catch(error){
        console.error('Error fetching data from Firestore:', error);
    
    }
   
  }
  fetchedListings();
}, []);
console.log(listings)
async function moreListing(){
  try{
    const listingRef = collection(db, "listings");
    const q = query(listingRef, where("offer", "==", true), orderBy("timeStamp", "desc"), startAfter(lastFetchedListing), limit(4));
    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    setFetchedListings(lastVisible)
    const listings = [];
    querySnapshot.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data()
      });
    });
    setListings((prev) => 
    [...prev, ...listings]);
    setLoading(false);
  } catch(error){
    console.error('Error fetching data from Firestore:', error);

}

}
  return (
    <div className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center pt-[100px] font-bold'>Offers</h1>
       {loading ? (
         <div className='lds-facebook spinner'><div></div><div></div><div></div></div>

       ): listings && listings != null ? (
        <>
        <main>
          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
            {listings.map((listing) => (
              <Listingitem key ={listing.id} id = {listing.id} listing = {listing.data}/>
            ))}
          </ul>
        </main>
        {lastFetchedListing  && (
          <div className='flex justify-center items-center'>
            <button
            onClick={moreListing}
             className='bg-white px-3 py-1.5 border-gray-300 mb-6 mt-6 hover:border-slate-600 font-semibold rounded-md transition duration-150 ease-in-out'>Load more</button>
            </div>
        )}
        </>
       ) : (<p>There are no current offers</p>)
       }

    </div>
  )
}
