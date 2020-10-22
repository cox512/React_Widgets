import React, { useState } from "react";

const Accordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onTitleClick = (index) => {
    setActiveIndex(index);
  };

  const renderedItems = items.map((item, index) => {
    const active = index === activeIndex ? "active" : "";
    return (
      // Because Semantic UI will add an unwanted border line at the top of our list due to the extra dive we're including to hold the key, we instead use a react fragment instead of a div. Because of the key being in the tag though, we need to actually use React.Fragment instead of the standard empty tags <>
      <React.Fragment key={item.title}>
        <div
          className={`title ${active}`}
          // NOTE: If we don't want the onTitleClick helper function to automatically run on pageload, we have to use an arrow function in the onClick call instead of a simple {onTitleClick(index)}
          onClick={() => onTitleClick(index)}
        >
          <i className="dropdown icon"></i>
          {item.title}
        </div>
        <div className={`content ${active}`}>
          <p>{item.content}</p>
        </div>
      </React.Fragment>
    );
  });

  return <div className="ui styled accordion">{renderedItems}</div>;
};

export default Accordion;
