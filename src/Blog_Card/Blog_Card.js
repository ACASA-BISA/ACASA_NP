import React from "react";
import "./Blog_Card.css";
import Typography from "@mui/material/Typography";

export const BlogCard = ({ imgSrc, imgAlt, keywords = [], title, author, link, date }) => {
  return (
    <div className="blog-card">
      <img src={imgSrc} alt={imgAlt} className="blog-card__image" loading="lazy"/>
      <div className="blog-card__content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // Pushes elements apart
            marginLeft: "4px",
            fontFamily:'Poppins',
          }}
        >
          <div
            className="blog-card__keywords"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "flex-start", // Ensures alignment to the left
              marginLeft: "0px",
              fontFamily:'Poppins',
            }}
          >
            {keywords.map((keyword, index) => (
              <Typography
                key={index}
                sx={(theme) => ({
                  color: theme.palette.mode === "dark" ? "#81c784" : "#52911f",
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginRight: "8px",
                  display: "inline-block",
                  fontFamily:'Poppins',
                })}
              >
                {keyword}
              </Typography>
            ))}
          </div>
          {/* Date */}
          {date && (
            <Typography
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                fontSize: "14px",
                fontWeight: "bold",
                marginLeft: "auto", 
                paddingRight: "4px",
                fontFamily:'Poppins',
              })}
            >
              {date}
            </Typography>
          )}
        </div>

        <p className="blog-card__author">
          {author && <Typography sx={(theme) => ({ fontFamily:'Poppins', color: theme.palette.mode == "dark" ? "#81c784" : "#52911f", fontSize: "24px", fontFamily: "Poppins" })}>{author}</Typography>}
        </p>
        <a href={link} className="blog-card__title">
          {title && <Typography textAlign="left" sx={(theme) => ({fontFamily:'Poppins',  color: theme.palette.mode === "dark" ? "#fff" : "#000", fontSize: "16px", fontWeight: "500", fontFamily: "Poppins" })}>{title} </Typography>}
        </a>
      </div>
    </div>
  );
};
