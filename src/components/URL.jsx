import React from 'react'
// Import the environment variables from the `.env` file using Vite's `import.meta.env`
const API_TOKEN = import.meta.env.VITE_API_TOKEN

export default function URL() {

    const [url, setURL] = React.useState({
        longURL: "",
        tiny_url: ""
    })
    console.log(url)

    const [allURLs, setAllURLs] = React.useState([])
    
    function fetchTinyURL(event) {
        event.preventDefault();
      
        console.log ("fetching")

        let body = {
          url: url.longURL
        };
      
        fetch('https://api.tinyurl.com/create', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
          .then(response => response.json())
          .then(data => {
            // save newURL so we can call setURL with UPDATED version
            const newURL = {
              ...url,
              tiny_url: data.data.tiny_url
            }
            console.log("made it here...")
            setURL(newURL)
            setAllURLs(prevURLs => [...prevURLs, newURL])
          })
          .catch(error => {
            console.error(error);
            // Handle any errors here
          })
    }
      

    function handleChange(event) {
        const {name, value} = event.target
        setURL(prevURL => ({
            ...prevURL,
            [name]: value
        }))
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            fetchTinyURL(event)
        }
    }
    
    /** NOTE -> will later change this into a sidebar component!!!! **/
    const urlElements = allURLs.map((prevURL, index) => (
        <div key={index}>
            <a href={prevURL.tiny_url} target="_blank" rel="noopener noreferrer">{prevURL.tiny_url}</a>
        </div>
    ))

    return (
        <main>
            <div className="form">
                <input 
                    type="text"
                    placeholder="Enter a long URL here"
                    className="form--input"
                    name="longURL"
                    value={url.longURL}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className='form--button'
                    onClick={fetchTinyURL}

                >
                    Shorten URL   
                </button>
            </div>
            <div>
                {urlElements}
            </div>
        </main>
    )
}