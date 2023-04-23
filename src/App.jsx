import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {Amplify,API, graphqlOperation} from 'aws-amplify';
import awsconfig from './aws-exports';



import { listSongs } from './graphql/queries';
import { updateSong } from './graphql/mutations';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';


Amplify.configure(awsconfig);

function App() {
    
    const[songs,setSongs] = useState([]);

    useEffect(() => {
        fetchSongs();
        // eslint-disable-next-line
    },[]);

    const incLike=async(ind)=>{
        try{
            const song=songs[ind];
            song.like=song.like+1;

            const songData=await API.graphql(graphqlOperation(updateSong,{input:song}));
            const songList=[...songs];
            songList[ind]=songData.data.updateSong;
            setSongs(songList);
        }
        catch(err){
            console.log("error : ",err);
        }
    }
    // Fetch Songs
    const fetchSongs = async ()=>{

        try{
            console.log("x");

            // const songData = await API.graphql(graphqlOperation(queries.listSongs,{id:'a'})); 

            console.log("y");

            // const songList = songData.data.listSongs.items;

            // console.log("song list",songList);
            // setSongs(songList);
 
            
            const songData = await API.graphql(graphqlOperation(listSongs));
            const songList = songData.data.listSongs.items;

            console.log('song list', songList);
            setSongs(songList);
        }catch(error){ 
            console.log("Error on Fetching Songs");
            console.log(error); 
        }  
    }; 
    return (
        <div class="container"> 
    <nav>
      <h1>My App Content</h1>
    </nav>
    <div class="allSongs">
      
      {
        songs.map((ele,ind)=>{
            return <div class="songItem" key={`song${ind}`}>
            <i class="fa-solid fa-play fa-2xl"></i>
            <div>
              <h1>{ele["title"]}</h1>
              <span>{ele["owner"]}</span>
            </div>
            <div>
              <button onClick={()=> incLike(ind)}><i class="fa-solid fa-heart fa-2xl" ></i></button>
              <span>{ele.like}</span>
            </div>
            <span>{ele["description"]}</span>
          </div>
        })
      }
    </div>
  </div>
    );
} 
  
export default App;