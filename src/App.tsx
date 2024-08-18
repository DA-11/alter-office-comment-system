import Layout from "./components/Layout";
import { UserProvider } from "./UserContext";
import { config } from './config/config';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import { useEffect, useState } from "react";

const firebaseApp = initializeApp(config.firebaseConfig);
export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);

const App: React.FC = () => {

  return (
    
    <div>
        <UserProvider>
          <Layout></Layout>
        </UserProvider>
    </div>
  );
}


export default App;
