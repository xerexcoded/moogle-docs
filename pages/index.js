import Button from '@material-tailwind/react/Button'
import Icon from '@material-tailwind/react/Icon'
import Head from 'next/head'
import Header from '../components/Header'
import Image from 'next/image'
import {getSession,useSession} from 'next-auth/client'
import Login from '../components/login'
import ModalFooter from '@material-tailwind/react/ModalFooter'
import Modal from '@material-tailwind/react/Modal'
import ModalBody from '@material-tailwind/react/ModalBody'
import { useState } from 'react'
import { db } from '../firebase'
import firebase from 'firebase'
import {useCollectionOnce} from 'react-firebase-hooks/firestore' /*for real time listening to firestore db */
import Bocu from '../components/Bocu'
export default function Home() {
  
  const [session] = useSession();
  const [showModal, setshowModal] = useState(false)
  const [input, setinput] = useState("")
  
  if(!session) return <Login />

  const [snapshot] = useCollectionOnce(db.collection('userDocs').doc(session.user.email).collection('docs').orderBy('Timestamp','desc'));
  const createDocument = () => {
       if (!input) return;

        db.collection('userDocs').doc(session.user.email).collection('docs').add({
          fileName : input,
          Timestamp : firebase.firestore.FieldValue.serverTimestamp()

        });

        setinput('');/*after updating input set it to blank for future*/
        setshowModal(false);

  };
   
  const modal =(
    <Modal
    size="sm"
    active={showModal}
    toggler={() => setshowModal(false)}
    
    >
     <ModalBody>
      <input
      value={input}
      onChange={(e) => setinput(e.target.value)}
      type="text"
      className="outline-none w-full"
      placeholder="Enter name of the document... "
      onKeyDown={(e) => e.key === "Enter" && createDocument()}
      /> 
      </ModalBody> 
      <ModalFooter>
        <Button
        color="blue"
        buttonType="link"
        onClick={(e)=> setshowModal(false)}
        ripple="dark"
        >
          cancel
        </Button>
        <Button color="blue" onClick={createDocument} ripple="light" >Create</Button>
      </ModalFooter>
    </Modal>

  )




  return (
    <div >
      <Head>
        <title>Moogle Docs</title>
        <link rel="icon" href="https://i.pinimg.com/originals/f5/1d/08/f51d08be05919290355ac004cdd5c2d6.png" />
      </Head>



       <Header />
       {modal}



     <section className="bg-[#F8F9FA] pb-10 px-10"> 
       <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between py-6">
        <h2 className="text-gray-700 text-lg">Start a new document</h2>
        <Button
        
        color="gray"
        buttonType="outline"
        iconOnly={true}
        ripple="dark"
        className="border-0"
        >
          <Icon name="more_vert" size="3xl" />
        </Button>
        </div>
        <div>
          <div  onClick={()=>setshowModal(true) } className=" relative h-52 w-40 cursor-pointer border-2 hover:border-blue-700">//relative to the parent
          <Image src="https://links.papareact.com/pju" layout="fill" />
          </div>
          <p className="mt-2 ml-2 font-semibold text-sm text-gray-700">Blank</p>
        </div>
       </div>
     </section>
     

     <section className="bg-white px-11 md:px-0">
      <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
        <div className="flex items-center justify-between pb-5">
          <h2 className="font-medium flex-grow">My docs</h2>
          <p className="mr-10">Date created</p>
          <Icon name="folder" size="3xl" color="gray"/>
        </div> 

      
        

   
     {snapshot?.docs.map(doc => (
        <Bocu  
          key={doc.id}
          id={doc.id}
          fileName={doc.data().fileName}
          date={doc.data().Timestamp}        
        />
        
     ))}
     </div>
     </section>




    </div>
  )
}

export async function getServerSideProps(context){

  const session = await getSession(context);

  return {
     props: {
       session,
     }


  }

}