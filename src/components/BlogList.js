import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import styled from 'styled-components';

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0 16px;
`;

const CategoryName = styled.h2`
  margin: 0;
`;

const ViewMoreLink = styled(Link)`
  color: #0073e6;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const BlogList = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [categoryPosts, setCategoryPosts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the latest 5 posts
        const latestResponse = await axios.get(
          'https://itxperts.co.in/blog/wp-json/wp/v2/posts?per_page=5'
        );
        setLatestPosts(latestResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get(
          'https://itxperts.co.in/blog/wp-json/wp/v2/categories'
        );
        const categories = categoriesResponse.data;

        // Fetch 5 posts for each category
        const categoryPostsData = {};
        for (const category of categories) {
          const postsResponse = await axios.get(
            `https://itxperts.co.in/blog/wp-json/wp/v2/posts?categories=${category.id}&per_page=5`
          );
          categoryPostsData[category.slug] = { 
            name: category.name, 
            posts: postsResponse.data 
          };
        }
        setCategoryPosts(categoryPostsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* Latest Posts */}
      {latestPosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}

      {/* Posts by Category */}
      {Object.keys(categoryPosts).map((categorySlug) => {
        const category = categoryPosts[categorySlug];
        return (
          <div key={categorySlug}>
            <CategoryHeader>
              <CategoryName>{category.name}</CategoryName>
              <ViewMoreLink to={`/category/${categorySlug}`}>View More</ViewMoreLink>
            </CategoryHeader>
            {category.posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default BlogList;
