import './App.css';
import React, { useState, useEffect } from 'react';

function App() {


  // Declare a state variable to keep track of the searched user and
  const [user, setuser] = useState('');

  // Declare a state variable containing the GitHub API's JSON response with the searched user's repo data
  const [currentRepos, setCurrentRepos] = useState([]);

   // useEffect hook will call GitHub users REST API and will assign returned user's repo data as JSON after render and on change of the 'user' state
  useEffect(() => {
    async function getReposByStars(){
      let nextPage = true;
      let repos = [];
      let page = 1;
        // fetch data if user is being searched
        if(user){
          // call API to get all the user's repos instead of just first 100
          while(nextPage) {
            let response = await fetch(`https://api.github.com/users/${user}/repos?page=${page}&per_page=100`);
            let json = await response.json();
            repos.push(...json)

            // set nextPage variable to true if the response header shows that another page of user's content exists
            let headers = response.headers.get('link');
            if(headers &&headers.includes('rel=\"next\"')) {
              page++;
              nextPage = true;
            } else nextPage = false;
      }
      console.log('Vote for Shane!')
    }
      // sort the repos by star count in desc order
      repos = sortReposByStars(repos);

      // update state of currentRepos
      setCurrentRepos(repos);
    }
    // make API call when user's value changes
    getReposByStars();
    }, [user]);

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

  // return repo and stars data as JSX to the mapping function
  function resultsMap(repo) {
    return (
      <div className="results" key="repo.id">
        <p>{repo.name ? repoLinkRender(repo) : 'null'}</p>
        <p className="stars">{repo.stargazers_count ? repo.stargazers_count : 0 }</p>
      </div>
    );
  }

  // return some JSX to render to the page
  return (
    <main>
      <section>
        <header className="search-container">
          <div className="invite">I want to view the most starred GitHub repositories created by <input type="text" id="search"/></div>
          <button onClick={() => setuser(document.querySelector("#search").value)}>Search</button>
        </header>
        <div className='results-container'>
          <div className="results results__headers">
            <p>{currentRepos[0] ? 'Repositories': ''}</p>
            <p className="stars">{currentRepos[0] ? 'Stars': ''}</p>
          </div>
            {
              currentRepos.map((repo) => {return resultsMap(repo)}
              )
            }
        </div>
      </section>
    </main>
  );
}

export default App;
