import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = () => {
  const [term, setTerm] = useState("programming");
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(term);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [term]);

  //Normally when doing an axios call we would use async/await. Unfortunately, we can't do that directly inside a useEffect call. But we can work around this.
  useEffect(() => {
    const search = async () => {
      const { data } = await axios("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: debouncedTerm,
        },
      });

      setResults(data.query.search);
    };
    search();
  }, [debouncedTerm]);

  //NOTES ON CODE NOW DELETED: The below if statement guards against a common error. Upon initial load of the page (when term is an empty string) the axios call delivers an error. So this way the call isn't made if 'term' has nothing in it. You could also just initialize 'term' with a search term already stored in it. Then, when the user arrives on the page, there will already be a search pulled up.
  //Note, you will get a warning message about using results.length in this conditional WITHOUT it being listed in your array. You can get rid of that by adding it in. => This introduces another bug though. Because now, we're making useEffect run whenever the length of results changes as well as term. => There is a work around for this that is currently being implemented in this code.

  const renderedResults = results.map((result) => {
    return (
      <div key={result.pageid} className="item">
        <div className="right floated content">
          <a
            href={`https://en.wikipedia.org?curid=${result.pageid}`}
            className="ui button"
          >
            Go
          </a>
        </div>
        <div className="content">
          <div className="header">{result.title}</div>
          {/* The below code deals with some html spans that are returned in the plain-text of the result.snippet. This may leave you vulnerable to an XSS attack. Allowing a hacker to run some JS inside your application. Only use this if you REALLY trust the url that you are making your API request to. */}
          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label> Enter Search Term</label>
          <input
            value={term}
            onChange={(evt) => setTerm(evt.target.value)}
            className="input"
          />
        </div>
      </div>
      <div className="ui celled list">{renderedResults}</div>
    </div>
  );
};

export default Search;
