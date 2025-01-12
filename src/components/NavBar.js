import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Nav = styled.nav`
  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 8px 10px rgba(0, 0, 0, 0.2);
  }
`;

const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  margin-left: 30px; /* Added margin for spacing between branding and nav items */
  scrollbar-width: none; /* Hide scrollbar in Firefox */
  -ms-overflow-style: none; /* Hide scrollbar in IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar in WebKit */
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  a {
    margin-right: 20px; /* Increased the gap between each nav item */
    text-decoration: none;
    color: #333;
    font-weight: bold;
    font-size: 15px;
    padding: 8px 16px;
    transition: color 0.3s, background-color 0.3s;
  }

  a:hover {
    color: #fff;
    background-color: #0073e6;
    border-radius: 4px;
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
      <div>
        <Link to="/" style={{ textDecoration: 'none', color: '#000', fontSize: '24px', fontWeight: 'bold' }}>
          Itxperts
        </Link>
      </div>
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
