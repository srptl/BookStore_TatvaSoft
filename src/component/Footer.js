import React from "react";
import { footerStyle } from "./FooterStyle";
import { Link } from "react-router-dom";


export const Footer = () => {
  const classes = footerStyle();

  return (
    <div className={classes.footerWrapper}>
      <footer className="site-footer" id="footer">
        <div className="bottom-footer">
          <div className="container">
            <div className="text-center">
              <div className="footer-logo">
                <Link to="/" title="logo">
                <p className="logo-header">BookStore</p>
                </Link>
              </div>
              <p className="copyright-text">
                © 2015 BookStore.com. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
