import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  // Declare a new state variable, which we'll call "user"
  // useState is a hook that lets you add state to function components
  const [user, setuser] = useState(''); // pass initial state and returns current state and function that updates it
  const [currentRepos, setCurrentRepos] = useState([]);

   // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    async function getStars(){
      let nextPage = true;
      let repos = [];
      let page = 1;
        if(user){
          while(nextPage) {
          let response = await fetch(`https://api.github.com/users/${user}/repos?page=${page}&per_page=100`);
          let json = await response.json();
          // console.log(json)
          // repos = Object.assign(repos, json);
          repos.push(...json)
          // console.log(repos)
          let headers = response.headers.get('link');
          if(headers &&headers.includes('rel=\"next\"')) {
            console.log(response.headers.get('link'))
            page++;
            nextPage = true;
          } else nextPage = false;
      }
    }
    // console.log(repos);
    repos = sortReposByStars(repos);
    setCurrentRepos(repos);
    // console.log(currentRepos)
    // console.log(repos);
    }

    getStars();
      },[user]);

  // sort user's repos by stars in repos
  function sortReposByStars(repos){
    return repos.sort((a,b) => {
      if (a.stargazers_count > b.stargazers_count) return - 1;
        else if (a.stargazers_count < b.stargazers_count) return 1;
        return 0
    });
  }

  // helper function to render the repo link
  function repoLinkRender(repo) {
      return <a href={`${repo.html_url}`} target="blank">{repo.name}</a>
    }
  return (
    <section>
      <header class="search-container">
        <div class="invite">I want to view the most starred GitHub repositories created by <input type="text" id="search"/></div>
        <button onClick={() => setuser(document.querySelector("#search").value)}>Search</button>
      </header>
      <div class='results-container'>
        {/* <header>{currentRepos[0] ? 'Results': ''}</header> */}
        <div class="results results__headers">
          <p>{currentRepos[0] ? 'Repositories': ''}</p>
          <p class="stars">{currentRepos[0] ? 'Stars': ''}</p>
        </div>
          {
            currentRepos.map((repo,i) => (
              <div class="results">
                <p>{repo.name ? repoLinkRender(repo) : 'null'}</p>
                <p class="stars">{repo.stargazers_count ? repo.stargazers_count : 0 }</p>
              </div>
            ))
          }
      </div>
    </section>

  );
}


export default App;
