const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');
const convertFactory = require('electron-html-to');

const colors = {
    green: {
      wrapperBackground: "#E6E1C3",
      headerBackground: "#C1C72C",
      headerColor: "black",
      photoBorderColor: "#black"
    },
    blue: {
      wrapperBackground: "#5F64D3",
      headerBackground: "#26175A",
      headerColor: "white",
      photoBorderColor: "#73448C"
    },
    pink: {
      wrapperBackground: "#879CDF",
      headerBackground: "#FF8374",
      headerColor: "white",
      photoBorderColor: "#FEE24C"
    },
    red: {
      wrapperBackground: "#DE9967",
      headerBackground: "#870603",
      headerColor: "white",
      photoBorderColor: "white"
    }
  };
  

const getInfo = async function() {
    try {
        const {username, color} = await inquirer.prompt([
            {
                message: 'Enter your github username',
                name: 'username'
            },
            {
                type: 'list',
                mmessage: 'Choose a color to style profile',
                name: 'color',
                choices: ['green', 'blue', 'pink', 'red']
            }
        ]);
        const url = `https://api.github.com/users/${username}`;
        const urlStarred = `https://api.github.com/users/${username}/starred`;
        const htmlStart = generateHTML(color);

        const response = await axios.get(url);
        const responseStarred = await axios.get(urlStarred);
        const starred = responseStarred.data.length;
        const { login, name, avatar_url, html_url, blog, location, bio, public_repos, followers, following } = response.data

        const userHtml = htmlStart + `<body>
                        <div class = 'wrapper'>
                            <div class = 'photo-header'>
                                <img src ='${avatar_url}'>
                                <h1>My name is ${name}</h1>
                                <nav class = links-nav>
                                    <a href ='${html_url}' class = 'nav-link'>Github</a>
                                    <a href ='${blog}' class = 'nav-link'>Blog</a>
                                    <a href ='https://google.com/maps/place/${location}' class = 'nav-link'>Location</a>
                                </nav>
                            </div>
                            <div class = 'container'>
                            <div class = 'row'>
                                <div class = 'col'>
                                    <h2>${bio}</h2>
                                </div>
                            </div>
                            <div class ='row'>
                                <div class = 'col'>
                                    <div class = 'card'>
                                        <h3>Number of repos</h3>
                                        <h4>${public_repos}</h4>
                                    </div>
                                </div>
                                <div class = 'col'>
                                    <div class = 'card'>
                                        <h3>Number of followers</h3>
                                        <h4>${followers}</h4>
                                    </div>
                                </div>
                            </div>
                            <div class ='row'>
                                <div class = 'col'>
                                  <div class = 'card'>
                                      <h3>Number following</h3>
                                      <h4>${following}</h4>
                                    </div>
                                </div>
                                <div class = 'col'>
                                  <div class = 'card'>
                                  <h3>Number of stars</h3>
                                  <h4>${starred}</h4>
                                  </div>
                                </div>
                            </div>
                            </div>                        
                        </div>
                            
                            
                    </body>
                    </html>
                    `


      var conversion = convertFactory({
        converterPath: convertFactory.converters.PDF
      });

      conversion({ html: `${userHtml}` }, function (err, result) {
        if (err) {
          return console.error(err);
        }

        console.log(result.numberOfPages);
        console.log(result.logs);
        result.stream.pipe(fs.createWriteStream(`./${login}.pdf`));
        conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
      });

    } catch (error) {
        console.log(error);
        console.log('Please enter a valid github username');
        getInfo();

    }
}

getInfo();

function generateHTML(data) {
    return `<!DOCTYPE html>
    <html lang="en">
     <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
        <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
        <title>Profile</title>
        <style>
            @page {
              margin: 0;
            }
           *,
           *::after,
           *::before {
           box-sizing: border-box;
           }
           html, body {
           padding: 0;
           margin: 0;
           }
           html, body, .wrapper {
           height: 100%;
           }
           .wrapper {
           background-color: ${colors[data].wrapperBackground};
           padding-top: 100px;
           }
           body {
           background-color: white;
           -webkit-print-color-adjust: exact !important;
           font-family: 'Cabin', sans-serif;
           }
           main {
           background-color: #E9EDEE;
           height: auto;
           padding-top: 30px;
           }
           h1, h2, h3, h4, h5, h6 {
           font-family: 'BioRhyme', serif;
           margin: 0;
           }
           h1 {
           font-size: 3em;
           }
           h2 {
           font-size: 2.5em;
           }
           h3 {
           font-size: 2em;
           }
           h4 {
           font-size: 1.5em;
           }
           h5 {
           font-size: 1.3em;
           }
           h6 {
           font-size: 1.2em;
           }
           .photo-header {
           position: relative;
           margin: 0 auto;
           margin-bottom: -50px;
           display: flex;
           justify-content: center;
           flex-wrap: wrap;
           background-color: ${colors[data].headerBackground};
           color: ${colors[data].headerColor};
           padding: 10px;
           width: 95%;
           border-radius: 6px;
           }
           .photo-header img {
           width: 250px;
           height: 250px;
           border-radius: 50%;
           object-fit: cover;
           margin-top: -75px;
           border: 6px solid ${colors[data].photoBorderColor};
           box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
           }
           .photo-header h1, .photo-header h2 {
           width: 100%;
           text-align: center;
           }
           .photo-header h1 {
           margin-top: 10px;
           }
           .links-nav {
           width: 100%;
           text-align: center;
           padding: 20px 0;
           font-size: 1.1em;
           }
           .nav-link {
           display: inline-block;
           margin: 5px 10px;
           }
           .workExp-date {
           font-style: italic;
           font-size: .7em;
           text-align: right;
           margin-top: 10px;
           }
           .container {
           padding: 50px;
           padding-left: 100px;
           padding-right: 100px;
           }
  
           .row {
             display: flex;
             flex-wrap: wrap;
             justify-content: space-between;
             margin-top: 20px;
             margin-bottom: 20px;
           }
  
           .card {
             padding: 20px;
             border-radius: 6px;
             background-color: ${colors[data].headerBackground};
             color: ${colors[data].headerColor};
             margin: 20px;
           }
           
           .col {
           flex: 1;
           text-align: center;
           }
  
           a, a:hover {
           text-decoration: none;
           color: inherit;
           font-weight: bold;
           }
  
           @media print { 
            body { 
              zoom: .75; 
            } 
           }
        </style>
        </head>`
          }
  