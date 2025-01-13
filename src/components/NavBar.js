import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Nav = styled.nav`
  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Hide scrollbar in Firefox */
  -ms-overflow-style: none; /* Hide scrollbar in IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar in WebKit */
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Reduced gap between menu items */

  a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    font-size: 14px;
    padding: 8px 12px;
    position: relative;
    transition: color 0.3s, background-color 0.3s;

    &:hover {
      color: #0073e6;
    }

    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: #0073e6;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }

    &:hover:before {
      width: 100%;
    }
  }
`;

const Branding = styled.div`
  margin-right: 30px; /* Space between branding and navigation */
  a {
    text-decoration: none;
    color: #000;
    font-size: 24px;
    font-weight: bold;
    transition: color 0.3s;

    &:hover {
      color: #0073e6;
    }
  }
`;

const NavBar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://itxperts.co.in/blog/wp-json/wp/v2/categories?per_page=100');
        const filteredCategories = response.data.filter(
          (category) => category.name !== 'Uncategorized' && category.count > 0
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Nav>
      <Branding>
        <Link to="/">Itxperts</Link>
      </Branding>
      <NavLinksContainer>
        <NavLinks>
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </NavLinks>
      </NavLinksContainer>
    </Nav>
  );
};

export default NavBar;
